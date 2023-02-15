const jwt = require('jsonwebtoken')
require('dotenv').config

const { User } = require('../model/index.model')
 
module.exports = {
    userVerify: (req, res, next) => {
         const token = String(req.headers.authorization).split(' ')[1]

         if (token) {
             jwt.verify(token, process.env.JWT, (err, tokendata) => {
                 if (err) {
                     return res.status(401).send({ msg: "Please sign in." })
                 } else {
                     User.findOne({
                        where: {
                            user_id: tokendata.user_id
                        }
                     }).then((user) => {
                        if (user) {
                            res.locals.user_id = user.user_id
                            next();
                        } else {
                            return res.status(401).send({ msg: "No user exists." })
                        }
                     })     
                 }
             })  
         } else {
             return res.status(401).send({ message: 'Please sign in.' })
         }
    }
}