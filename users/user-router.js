const express = require('express')
const Users = require('./user-model')
const restrict = require("../auth/authenticate-middleware")

const router = express.Router()

router.get('/users', restrict, async(req, res, next)=>{
    try {
        res.json(await Users.find())
    } catch (error) {
        next(error)
    }
})

module.exports = router