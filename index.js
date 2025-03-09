const express = require('express')
const cors = require('cors')
const { getUserData, getDataByRepo, createGithubIssue } = require('./controller/controller')
const { default: axios } = require('axios')
require('dotenv').config()

const app = express()

app.use(express.json())
app.use(cors())

app.get('/github', getUserData)
app.get('/github/:repo', getDataByRepo)
app.post('/github/:repo/issues', createGithubIssue)

const PORT = 3000


app.listen(PORT, () => {
    console.log(`server listenning, http://localhost:${PORT}`)
})