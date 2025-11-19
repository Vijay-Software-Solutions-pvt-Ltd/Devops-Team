router.post('/bulk-create', auth, requireRole('admin'), async (req,res)=>{
  const { users, org_id } = req.body; 
  // users = [{name,email,mobile}, {...}, ...]
  
  let created = [];
  for (const u of users) {
    const password = randomPassword();
    const hashed = await hashPassword(password);
    const id = uuidv4();

    await db.query(`
      INSERT INTO exam.users (id,name,email,password_hash,role,org_id)
      VALUES ($1,$2,$3,$4,'user',$5)
    `, [id, u.name, u.email, hashed, org_id]);

    // TODO email sending logic (MailJet / SendGrid / nodemailer)
    created.push({ id, email: u.email, password });
  }

  res.json({ created });
});
