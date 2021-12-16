'use strict';

const firebase = require('../db');
const firestore = firebase.firestore();
const auth = firebase.auth();
const jwt = require('jsonwebtoken');

const addCompany = async (req, res, next) => {
    try {
        const data = (req.body);
        await firestore.collection('company').doc().set(data);
        res.json(data)
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const getAllCompanies = async (req, res, next) => {
    try {
        const company = await firestore.collection('company');
        const data = await company.get();
        const companyList = [];
        if (data.empty) {
            res.status(404).send('No comapny record found');
        } else {
            data.forEach(doc => {
                const company = {
                    companyId: doc.id,
                    companyName: doc.data().companyName,
                    companyCEO: doc.data().companyCEO,
                    companyAddress: doc.data().companyAddress,
                    inceptionDate: doc.data().inceptionDate
                }
                companyList.push(company)
            });
            res.send(companyList);
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const getCompany = async (req, res, next) => {
    try {
        const id = req.params.id;
        const company = await firestore.collection('company').doc(id);
        const data = await company.get();
        if (!data.exists) {
            res.status(404).send('Company with the given ID not found');
        } else {
            res.send({ companyId: id, ...data.data() });
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const getCompanyByName = async (req, res, next) => {
    try {
        const name = req.params.name;
        const companyData = await firestore.collection('company').where('companyName', '==', name);
        const data = await companyData.get();
        let companyList = []
        data.forEach(doc => {
            const company = {
                companyId: doc.id,
                companyName: doc.data().companyName,
                companyCEO: doc.data().companyCEO,
                companyAddress: doc.data().companyAddress,
                inceptionDate: doc.data().inceptionDate
            }
            companyList.push(company)
        })
        if (companyList.length === 0) {
            res.status(404).send('Company with the given name not found');
        } else {
            res.send(companyList);
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
}


const createTeam = async (req, res) => {
    try {
        const companyId = req.params.id
        const body = { ...req.body, companyId }
        const addTeam = await firestore.collection('company').doc(companyId).collection('teams').doc().set(body)
        res.send(body)
    }
    catch (error) {
        res.status(400).send(error.message);
    }

}

const getTeams = async (req, res) => {
    try {
        const companyId = req.params.companyId
        const teamCollsRef = await firestore.collection('company').doc(companyId);
        const teamColls = await teamCollsRef.listCollections();
        // console.log(teamColls.length)

        if (teamColls.length > 0) {
            let teams = []
            const order = teamColls.map(async team => {
                console.log(team.id)
                const teamCollNew = team.id
                const newDoc = await teamCollsRef.collection(teamCollNew).get()
                // const newDoc = await newColl.get()
                // console.log(newColl)
                newDoc.forEach(doc => {
                    // console.log(doc.data())
                    const team = {
                        teamId: doc.id,
                        companyId: doc.data().companyId,
                        leadName: doc.data().leadName,
                    }

                    teams.push(team)
                })
                console.log("1", teams)
            })
            Promise.all(order).then(() => {

                console.log("2", teams)
                res.send(teams)
            })
        }
    }
    catch (error) {
        res.status(400).send(error.message);
    }


}

const register = async (req, res) => {
    try{
        const userRegistrationData = req.body
        // const email = userRegistrationData.email
        // const password = userRegistrationData.password
        //   userName = userRegistrationData.name
        // console.log(password)
        auth.createUser({
            email: userRegistrationData.email, 
            password: userRegistrationData.password
        })
        .then((UserRecord) => {
            const data = {
                // userName: userRegistrationData.name,
                email: userRegistrationData.email,
                uid: UserRecord.uid,
                createdAt: new Date(),
            }
            

            const privateKey = 'TKcli521mudqAoq090DqHMLC1jzR7JUxmg75YGK94kjiSnYPTEEga'

            const userData = {
                email: userRegistrationData.email,
                sub: UserRecord.uid,
                // name: userRegistrationData.name,
            }

            const jwtToken = jwt.sign(userData, privateKey, {
                algorithm: 'HS256'
            })
            // console.log(userRecord.uid)

            firestore.collection('users').doc(data.uid).set(data).then(() => {
                const resData = {
                    uid: data.uid,
                    status: "success",
                    jwt: jwtToken,
                }
                res.status(200).json(resData)
            })
        })
    }
    catch (error) {
        res.status(400).json(error.message)
    }
}




module.exports = {
    addCompany,
    getAllCompanies,
    getCompany,
    getCompanyByName,
    createTeam,
    getTeams,
    register,
}