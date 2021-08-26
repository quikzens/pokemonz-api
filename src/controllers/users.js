const { User } = require('../../db/models')
const bcrypt = require('bcrypt')
const joi = require('joi')
const jwt = require('jsonwebtoken')
const send = require('../utils/response')

const secretKey = process.env.SECRET_KEY
const hashStrenght = 10

exports.register = async (req, res) => {
  try {
    const userData = req.body
    const { username, password } = req.body

    const schema = joi.object({
      username: joi.string().required(),
      password: joi.string().min(8).required(),
    })

    const { error } = schema.validate(req.body)
    if (error) {
      return res.send({
        status: 'failed',
        message: error.details[0].message,
      })
    }

    // check whether email user is exist in database,
    // if yes, return the user data from db, along with message 'email already registered'
    // if not, next
    const isUsernameExist = await User.findOne({
      where: {
        username,
      },
    })
    if (isUsernameExist) {
      return res.send({
        status: 'failed',
        message: 'Username already registered',
      })
    }

    const hashedPassword = await bcrypt.hash(password, hashStrenght)

    const user = await User.create({
      ...userData,
      password: hashedPassword,
    })

    const token = jwt.sign(
      {
        id: user.id,
      },
      secretKey
    )

    send.data(res, {
      username: userData.username,
      token,
    })
  } catch (err) {
    console.log(err)
    send.serverError(res)
  }
}

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body

    const schema = joi.object({
      username: joi.string().required(),
      password: joi.string().min(8).required(),
    })

    const { error } = schema.validate(req.body)
    if (error) {
      return res.send({
        status: 'failed',
        message: error.details[0].message,
      })
    }

    // check whether username user is exist in database,
    // if yes, return the user data from db
    // if not, user data will empty/null
    let userData
    userData = await User.findOne({
      where: {
        username,
      },
    })

    if (!userData) {
      return res.send({
        status: 'failed',
        message: "Username or Password don't match",
      })
    }

    const isPasswordPassed = await bcrypt.compare(password, userData.password)

    if (!isPasswordPassed) {
      return res.send({
        status: 'failed',
        message: "Username or Password don't match",
      })
    }

    const token = jwt.sign(
      {
        id: userData.id,
      },
      secretKey
    )

    send.data(res, {
      username: userData.username,
      token,
    })
  } catch (err) {
    console.log(err)
    send.serverError(res)
  }
}
