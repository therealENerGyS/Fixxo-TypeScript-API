const express = require('express')
const controller = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const { generateAccessToken } = require('../data/authorization')
const userSchema = require('../schemas/userSchema')

controller.route('/signup').post(async (req, res) => {
    const { firstName, lastName, email, password } = req.body

    if (!firstName ||!lastName || !email || !password)
        res.status(400).json({text: 'First name, Last name, email and password is required'})

    const exists = await userSchema.findOne({email})
    if (exists)
        res.status(409).json({text: 'A User with the same e-mail address already exists.'})
    else {
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const user = await userSchema.create({
            firstName,
            lastName,
            email,
            password: hashedPassword
        })

        if (user)
            res.status(201).json({text: `User was successfully created`})
        else
            res.status(400).json({text: `Something went wrong creating your account`})
    }
})

controller.route('/signin').post(async (req, res) => {
    const { email, password } = req.body

    if (!email || !password)
        res.status(400).json({text: 'Email and password is required'})

    const user_exists = await userSchema.findOne({email})
    if (user_exists && await bcrypt.compare(password, user.password)) {
        res.status(200).json({
            accessToken: generateAccessToken(user._id)
        })
    } else {
        res.status(400).json({text: `Incorrect email or password.`})
    }
})

module.exports = controller