// pages/api/fetchBusinessManagers.js

import axios from 'axios';

export default async function handler(req, res) {
    const { accessToken } = req.body;

    try {
        const response = await axios.get('https://graph.facebook.com/v17.0/me/businesses', {
            params: {
                access_token: accessToken,
            },
        });

        res.status(200).json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
