require('dotenv').config()
const port = process.env.PORT || 5000
const initMongoDB = require('./mongodb')
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const app = express()

// Middleware
app.use(express.json())
app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(bodyParser.json())

// Routes/Controllers
app.use('/api/products', require('./controllers/productController'))

//initialize
initMongoDB()
app.listen(port, () => console.log(`WebApi is running on http://localhost:${port}`))