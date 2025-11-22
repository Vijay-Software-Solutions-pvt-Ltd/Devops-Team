// worker/gradeworker.js
require("dotenv").config();
const { Pool } = require("pg");
const db = require('./src/db');
const fetch = require('node-fetch');

const JUDGE_URL = process.env.JUDGE0_URL;
const JUDGE_KEY = process.env.JUDGE0_KEY;

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function run() {
  console.log("✅ Grade Worker Started");

  while (true) {
    try {
      const jobQ = await db.query(`
        SELECT * FROM exam.grader_jobs
        WHERE status IS NULL OR status = 'pending'
        ORDER BY created_at ASC
        LIMIT 1
      `);

      if (jobQ.rows.length === 0) {
        await sleep(2000);
        continue;
      }

      const job = jobQ.rows[0];

      // Mark as processing
      await db.query(
        `UPDATE exam.grader_jobs SET status = 'processing' WHERE id = $1`,
        [job.id]
      );

      console.log("⚡ Sending solution to Judge0...");

      // Submit to Judge0
      const submitRes = await fetch(`${JUDGE_URL}/submissions?base64_encoded=false&wait=false`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-RapidAPI-Key': JUDGE_KEY,
          'X-RapidAPI-Host': 'judge0.p.rapidapi.com'
        },
        body: JSON.stringify({
          language_id: job.language_id,
          source_code: job.code,
          stdin: ''
        })
      });

      const submitData = await submitRes.json();
      const token = submitData.token;

      // ✅ Poll for result
      let result = null;
      let attempts = 0;

      while (attempts < 15) {
        await sleep(1500);

        const res = await fetch(`${JUDGE_URL}/submissions/${token}?base64_encoded=false`, {
          headers: {
            'X-RapidAPI-Key': JUDGE_KEY,
            'X-RapidAPI-Host': 'judge0.p.rapidapi.com'
          }
        });

        const data = await res.json();

        if (data.status?.id >= 3) {
          result = data;
          break;
        }

        attempts++;
      }

      if (!result) {
        await db.query(
          `UPDATE exam.grader_jobs SET status='timeout' WHERE id=$1`,
          [job.id]
        );
        continue;
      }

      // ✅ Save result
      await db.query(
        `UPDATE exam.grader_jobs
         SET status = 'done',
             judge_token = $1,
             judge_result = $2,
             updated_at = now()
         WHERE id = $3`,
        [token, JSON.stringify(result), job.id]
      );

      console.log("✅ Code evaluated");

    } catch (err) {
      console.error("🔥 Worker error:", err);
      await sleep(5000);
    }
  }
}

run();
