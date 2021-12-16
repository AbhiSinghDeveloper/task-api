'use strict';
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const config = require('./config');
const companyRoutes = require('./routes/company-routes');
// const authRoutes = require('./routes/auth')
const checkAuth = require('./middlewares/check-auth.js')

const app = express();

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

app.use('/api', companyRoutes.router);
// app.use('/api/auth', checkAuth, authRoutes.routes)



app.listen(config.port, () => console.log('App is listening on url http://localhost:' + config.port));
