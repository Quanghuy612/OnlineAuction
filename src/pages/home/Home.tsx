import { Box, Grid, Card, CardContent, CardMedia, Typography, Button } from "@mui/material";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useSort } from "../../hooks/useSort";
import { useApi } from "../../store/useApi";
import { useNavigate } from "react-router-dom";

interface Auctions {
    Id: number;
    Name: string;
    Status: string;
}
function Home() {
    const [filteredItems, setFilteredItems] = useState<Auctions[]>([]);
    const { isGridView } = useSort();
    const { apiCall } = useApi();
    const navigate = useNavigate();

    const loadAuction = async () => {
        const result = await apiCall("GET", `/auctions`, undefined, undefined);
        if (result.success && Array.isArray(result.data)) {
            setFilteredItems(result.data);
        }
    };

    useEffect(() => {
        loadAuction();
    }, []);

    const bidAuction = async (Id: number) => {
        const result = await apiCall("GET", `/auctions/check-auction`, { auctionId: Id }, undefined);
        if (result.success) {
            navigate(`/live-auction/${Id}`);
        }
    };

    return (
        <Box>
            <Grid container spacing={3}>
                {filteredItems.length === 0 ? (
                    <Grid size="auto">
                        <Typography variant="h6" color="text.secondary" textAlign="center">
                            No items found.
                        </Typography>
                    </Grid>
                ) : (
                    filteredItems.map((item) => (
                        <Grid key={item.Id} size={{ xs: 12, sm: isGridView ? 6 : 12, md: isGridView ? 4 : 12 }}>
                            <motion.div layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }}>
                                <Card sx={{ boxShadow: 3 }}>
                                    {/* <CardMedia component="img" height="180" image={item.image} alt={item.title} /> */}
                                    <CardContent>
                                        <Typography variant="h6">{item.Name}</Typography>
                                        {/* <Typography variant="body2" color="text.secondary">
                                            {item.description}
                                        </Typography>
                                        <Typography variant="body1" sx={{ mt: 1 }}>
                                            ${item.price}
                                        </Typography> */}
                                        <Button variant="contained" className="btn-primary" sx={{ mt: 2 }} onClick={() => bidAuction(item.Id)}>
                                            Bid Now
                                        </Button>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </Grid>
                    ))
                )}
            </Grid>
        </Box>
    );
}

export default Home;
