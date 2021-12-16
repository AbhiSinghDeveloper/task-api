const firebase = require('firebase-admin');
const config = require('./config');

var serviceAccount = require("./serviceAccount.json");

const db = firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount),
    databaseURL: "https://task-b6594-default-rtdb.firebaseio.com"
  });
module.exports = db;