import axios from 'axios';

export default async function handler(req, res) {
    const { accessToken, businessManagerId } = req.body; // Extract the businessManagerId from the request body

    try {
        const response = await axios.get(
            `https://graph.facebook.com/v17.0/${businessManagerId}/owned_product_catalogs?access_token=${accessToken}`
        );
        res.status(200).json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while fetching catalogs' });
    }
}
