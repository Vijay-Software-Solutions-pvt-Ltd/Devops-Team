// server/graderWorker.js
require('dotenv').config();
const db = require('./src/db');
const fetch = require('node-fetch');

async function sleep(ms){ return new Promise(r=>setTimeout(r,ms)); }

async function runWorker() {
  console.log("Grader worker started...");

  while (true) {
    try {
      const jobQ = await db.query(`
        SELECT * FROM exam.grader_jobs 
        WHERE status='pending'
        ORDER BY created_at ASC 
        LIMIT 1
      `);

      if (!jobQ.rows[0]) {
        await sleep(2000);
        continue;
      }

      const job = jobQ.rows[0];
      console.log("Processing job:", job.id);

      await db.query(`UPDATE exam.grader_jobs SET status='running' WHERE id=$1`, [job.id]);

      // Step 1: Send to Judge0
      const r = await fetch(`${process.env.JUDGE0_URL}/submissions?wait=true`, {
        method: 'POST',
        headers: { 'Content-Type':'application/json' },
        body: JSON.stringify({
          source_code: job.code,
          language_id: job.language_id,
          stdin: "",   // we test each case manually
        })
      });

      const result = await r.json();

      // Step 2: Evaluate testcases manually
      let totalScore = 0;
      for (const t of job.testcases) {
        const judgeResponse = await fetch(`${process.env.JUDGE0_URL}/submissions?wait=true`, {
          method: 'POST',
          headers: { 'Content-Type':'application/json' },
          body: JSON.stringify({
            source_code: job.code,
            language_id: job.language_id,
            stdin: t.input
          })
        });

        const output = await judgeResponse.json();

        const actual = output.stdout ? output.stdout.trim() : "";
        const expected = t.expected.trim();

        if (actual === expected) totalScore++;
      }

      // Step 3: update job result
      await db.query(`
        UPDATE exam.grader_jobs 
        SET status='done',
            judge_result=$1,
            score=$2,
            updated_at=now()
        WHERE id=$3
      `, [
        JSON.stringify(result), 
        totalScore,
        job.id
      ]);

      // Step 4: update main answers table with score
      await db.query(`
        UPDATE exam.answers 
        SET is_correct = NULL,
            score = $1
        WHERE attempt_id=$2 AND question_id=$3
      `, [
        totalScore,
        job.attempt_id,
        job.question_id
      ]);

      // Step 5: update total attempt score
      await db.query(`
        UPDATE exam.attempts
        SET total_score = (
          SELECT SUM(score) FROM exam.answers WHERE attempt_id=$1
        )
        WHERE id=$1
      `, [job.attempt_id]);

    } catch (err) {
      console.error("Worker error:", err);
    }

    await sleep(2000);
  }
}

runWorker();
