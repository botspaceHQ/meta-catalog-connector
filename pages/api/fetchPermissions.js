import axios from 'axios';

export default async function handler(req, res) {
    const userAccessToken = req.body.accessToken; // The user's access token you got from the front end

    try {
        const response = await axios.get(`https://graph.facebook.com/me/permissions?access_token=${userAccessToken}`);
        res.status(200).json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while fetching permissions' });
    }
}
