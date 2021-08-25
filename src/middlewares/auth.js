const jwt = require('jsonwebtoken')
const secretKey = process.env.SECRET_KEY
const send = require('../utils/response')

exports.auth = (req, res, next) => {
  try {
    let header = req.header('Authorization')

    if (!header) {
      return res.send({
        status: 'failed',
        message: 'Access denied',
      })
    }

    let token = header.replace('Bearer ', '')

    const verifiedUser = jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
        return res.send({
          status: 'failed',
          message: 'User not verified',
        })
      } else {
        return decoded
      }
    })

    req.userId = verifiedUser.id

    next()
  } catch (err) {
    console.log(err)
    send.serverError(res)
  }
}
