const express = require('express')
const PORT = 5001
const app = express()
const cors = require('cors')
const connecToMongoose = require('./db')

app.use(cors())
connecToMongoose()

app.get('/', (req, res) => {
    res.status(200).json("Connected with THC server")
})

// Route 1 -> Authentication operation is here
app.use('/api/auth', require('./routes/auth'))

// Route 2 -> Blog CRUD operation is here
app.use('/api/blog', require('./routes/blog'))

app.listen(PORT, () => {
    console.log(`server is running at ${PORT}`);
})