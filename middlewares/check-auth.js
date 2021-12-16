let jwt = require("jsonwebtoken");
// const { success, error, validation } = require("../configs/responseApi");

module.exports = (req, res, next) => {
    try {
        var token = req.headers.authorization.split(' ')[1]
        var decode = jwt.verify(token, "TKcli521mudqAoq090DqHMLC1jzR7JUxmg75YGK94kjiSnYPTEEga");
        req.userData = decode;
        next();
    } catch (e) {
        return  res.status(401).json("Unauthorised Access", res.statusCode);
    }
   
};