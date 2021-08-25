require('dotenv').config()

const express = require('express')
const router = require('./src/routes/router')
const cors = require('cors')

const PORT = process.env.PORT || 3000

const app = express()

app.use(express.json())
app.use(cors())
app.use('/api/v1', router)

app.listen(PORT, () => {
  console.log(`Server is running...`)
})
