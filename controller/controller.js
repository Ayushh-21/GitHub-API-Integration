const axios = require('axios');

require('dotenv').config()


const getUserData = async (req, res) => {
    try {
        const userResponse = await axios.get(`${process.env.GITHUB_API_URL}/users/${process.env.GITHUB_USERNAME}`)

        const repoResponse = await axios.get(`${process.env.GITHUB_API_URL}/users/${process.env.GITHUB_USERNAME}/repos`)

        res.json({
            followers: userResponse.data.followers,
            following: userResponse.data.following,
            repoCount: repoResponse.data.length,
            repositories: repoResponse.data.map(repo => ({
                repoName: repo.name,
                url: repo.html_url
            }))
        })

    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}

const getDataByRepo = async (req, res) => {
    const repoName = req.params.repo
    try {
        const repoResponse = await axios.get(`${process.env.GITHUB_API_URL}/repos/${process.env.GITHUB_USERNAME}/${repoName}`)
        res.json({
            repoName: repoResponse.data.name,
            repoUrl: repoResponse.data.html_url,
            description: repoResponse.data.description,
        })

    } catch (error) {
        if (error.response) {
            return res.status(error.response.status).json({
                message: error.response.data.message
            });
        }
        res.status(500).json({
            error: error.message
        })

    }
}

const createGithubIssue = async (req, res) => {
    const repo = req.params.repo;
    const { title, body } = req.body;

    if (!title || !body) {
        return res.status(400).json({ error: 'Title and body are required' });
    }
    try {
        const { data } = await axios.post(
            `${process.env.GITHUB_API_URL}/repos/${process.env.GITHUB_USERNAME}/${repo}/issues`,
            { title, body },
            {
                headers: {
                    Authorization: `token ${process.env.GITHUB_TOKEN}`,
                    Accept: "application/vnd.github.v3+json",
                    "User-Agent": "GitHub-Portfolio-API",
                }
            }
        );
        res.json({ message: 'Issue created successfully', url: data.url });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create issue' });
    }
}

module.exports = { getUserData, getDataByRepo, createGithubIssue }