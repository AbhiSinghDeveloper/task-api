const express = require('express');
const checkAuth = require('../middlewares/check-auth.js')
const {addCompany, 
       getAllCompanies, 
       getCompany,
       getCompanyByName,
       createTeam,
       getTeams,
       register,
      } = require('../controllers/companyController.js');

const router = express.Router();

router.post('/company', checkAuth, addCompany);
router.get('/company', checkAuth, getAllCompanies);
router.get('/company/:id', checkAuth, getCompany);
router.get('/companyByName/:name', checkAuth, getCompanyByName);
router.post('/team/:id', checkAuth, createTeam);
router.get('/team/:companyId', checkAuth, getTeams);
router.post('/auth/register', register);

module.exports = {
    router: router
}