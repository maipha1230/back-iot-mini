const express = require('express')
const app = express();
const cors = require('cors')
const path = require('path')
require('dotenv').config()
app.use(cors())
app.use(express.json({ limit: '500mb'}))
app.use(express.urlencoded({ extended: true,  limit: '500mb' }))

//use express static folder
app.use('/api', express.static(path.join(__dirname, '/public')))
const distPath = path.join(__dirname, '/dist');
app.use(express.static(distPath));

const db = require('./model/index.model')

app.use('/api', require('./routes/index.route'))

app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });

app.listen(process.env.PORT || 3001, () => {
    console.log("server is running on port: "+ process.env.PORT);
})
