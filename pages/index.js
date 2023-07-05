import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import { Inter } from 'next/font/google';
import { useState } from 'react';
import FacebookLogin from 'react-facebook-login';
const inter = Inter({ subsets: ['latin'] });

export default function Home() {
    const [catalogs, setCatalogs] = useState([]);
    const [isCatalogFetched, setIsCatalogFetched] = useState(false);
    const [selectedCatalog, setSelectedCatalog] = useState(null);
    const [isSelectedCatalogConnected, setIsSelectedCatalogConnected] = useState(false);
    const [accessToken, setAccessToken] = useState(null);

    const [businessManagers, setBusinessManagers] = useState([]);
    const [selectedBusinessManager, setSelectedBusinessManager] = useState(null);
    const [isSelectedBusinessManager, setIsSelectedBusinessManager] = useState(false);

    const selectBusinessManager = async (managerId) => {
        setSelectedBusinessManager(managerId);
        // Fetch catalogs for selected business manager
        const catalogsResponse = await axios.post('/api/fetchCatalogs', {
            accessToken: accessToken,
            businessManagerId: managerId,
        });
        setIsCatalogFetched(true);
        console.log(catalogsResponse.data);
        setCatalogs(catalogsResponse.data.data);
    };

    async function fetchPermissions(accessTokenResponse) {
        setAccessToken(accessTokenResponse);
        try {
            const permissionsResponse = await axios.post('/api/fetchPermissions', { accessToken: accessTokenResponse });

            let isCatalogPermitted = false;

            permissionsResponse.data.data.forEach((permission) => {
                if (permission.permission === 'catalog_management' && permission.status === 'granted') {
                    isCatalogPermitted = true;
                }
            });

            if (isCatalogPermitted) {
                const businessManagersResponse = await axios.post('/api/fetchBusinessManager', {
                    accessToken: accessTokenResponse,
                });
                setBusinessManagers(businessManagersResponse.data.data);
                // Update your state here with the fetched catalogs
            } else {
                console.log('User does not have necessary permissions');
            }
        } catch (error) {
            console.error(error);
        }
    }
    const responseFacebook = (response) => {
        console.log(response);
        // Here you would send the response, which includes the user's access token, to your server
        // using a function called `fetchPermissions` (to be defined)
        fetchPermissions(response.accessToken);
    };

    const connectCatalog = async (catalogId) => {
        // Your function to connect a catalog could go here
        console.log(`Connecting catalog with id: ${catalogId}`);
        setSelectedCatalog(catalogId);
        setIsSelectedCatalogConnected(true);

        const products = await axios.post('/api/fetchCatalogsProducts', {
            accessToken: accessToken,
            catalogId: catalogId,
        });

        console.log(products.data.data);
    };

    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            style={{ minHeight: '100vh' }}
        >
            {businessManagers.length === 0 && !isCatalogFetched && !isSelectedCatalogConnected && (
                <Card
                    sx={{
                        width: '420px',
                    }}
                >
                    <CardContent
                        sx={{
                            textAlign: 'center',
                        }}
                    >
                        <Typography
                            sx={{
                                padding: '5px',
                            }}
                            variant="h5"
                        >
                            Connect your Meta Catalog to BotSpace
                        </Typography>
                        <Typography
                            sx={{
                                padding: '10px',
                            }}
                            variant="body2"
                        >
                            This will allow you to send products from your Meta Catalogs with{' '}
                            <a href="bot.space">BotSpace</a>.
                        </Typography>
                        <FacebookLogin
                            appId="610392923864718"
                            autoLoad={true}
                            fields="name,email,picture"
                            scope="business_management,catalog_management"
                            callback={responseFacebook}
                        />
                    </CardContent>
                </Card>
            )}

            {businessManagers.length > 0 && !selectedBusinessManager && (
                <Card
                    sx={{
                        width: '420px',
                    }}
                >
                    <CardContent>
                        <Typography variant="body1" component="div">
                            Select a Business Manager
                        </Typography>
                    </CardContent>
                    <Divider />
                    <CardContent>
                        <List>
                            {businessManagers.map((manager) => (
                                <ListItem
                                    button
                                    key={manager.id}
                                    onClick={() => {
                                        selectBusinessManager(manager.id);
                                        setIsSelectedBusinessManager(true);
                                    }}
                                >
                                    <ListItemText primary={manager.name} secondary={manager.id} />
                                </ListItem>
                            ))}
                        </List>
                    </CardContent>
                </Card>
            )}

            {isCatalogFetched && selectedBusinessManager && !isSelectedCatalogConnected && (
                <Card
                    sx={{
                        width: '420px',
                    }}
                >
                    <CardContent>
                        <Typography variant="body1" component="div">
                            Select a catalog to connect to BotSpace
                        </Typography>
                    </CardContent>
                    <Divider />
                    <CardContent>
                        <List>
                            {catalogs.map((catalog) => (
                                <ListItem key={catalog.id}>
                                    <ListItemText primary={catalog.name} secondary={catalog.id} />
                                    <ListItemSecondaryAction>
                                        <Button variant="contained" onClick={() => connectCatalog(catalog.id)}>
                                            Connect
                                        </Button>
                                    </ListItemSecondaryAction>
                                </ListItem>
                            ))}
                        </List>
                    </CardContent>
                </Card>
            )}

            {isSelectedCatalogConnected && (
                <Card
                    sx={{
                        width: '420px',
                        textAlign: 'center',
                    }}
                >
                    <CardContent>
                        <Typography variant="body1" component="div">
                            Your catalog with id {selectedCatalog} is connected to <a href="bot.space">BotSpace</a>!
                            Please contact support to proceed with further steps to send products from your catalog to
                            WhatsApp.
                        </Typography>
                    </CardContent>
                </Card>
            )}
        </Box>
    );
}
