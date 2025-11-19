// server/src/index.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const authRoutes = require('./routes/auth');
const examsRoutes = require('./routes/exams');
const attemptsRoutes = require('./routes/attempts');
const adminRoutes = require('./routes/admin');
const orgRoutes = require('./routes/orgs');
const adminUsersRoutes = require('./routes/adminUsers');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/auth', authRoutes);
app.use('/exams', examsRoutes);
app.use('/attempts', attemptsRoutes);
app.use('/admin', adminRoutes);
app.use('/orgs', orgRoutes);
app.use('/admin/users', adminUsersRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
