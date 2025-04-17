import { Box, Grid, Card, CardContent, Typography, Button, CardMedia } from "@mui/material";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useSort } from "../../hooks/useSort";
import { useApi } from "../../store/useApi";
import { useNavigate } from "react-router-dom";
import { formatImage } from "../../utils/formatImage";
import { AuctionResponse } from "../../types/AuctionResponse";
import { formatToLocalTime } from "../../utils/formatDateTime";

function Home() {
    const [filteredItems, setFilteredItems] = useState<AuctionResponse[]>([]);
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
                    <Grid size={12}>
                        <Typography variant="h6" color="text.secondary" textAlign="center">
                            No items found.
                        </Typography>
                    </Grid>
                ) : (
                    filteredItems.map((item) => (
                        <Grid key={item.Id} size={{ xs: 12, sm: isGridView ? 6 : 12, md: isGridView ? 4 : 12 }}>
                            <motion.div layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }}>
                                <Card sx={{ boxShadow: 3 }}>
                                    {isGridView ? (
                                        <>
                                            <CardMedia
                                                component="img"
                                                height="300"
                                                image={formatImage(item.ImageFile)}
                                                alt={item.ProductName}
                                                sx={{ objectFit: "cover", width: "100%" }}
                                            />
                                            <CardContent>
                                                <Typography variant="h6">{item.Name}</Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    {item.ProductName}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    Starting Price: ${item.StartingPrice.toFixed(2)}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    Starting Time: {formatToLocalTime(item.StartTime)}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    End Time: {formatToLocalTime(item.EndTime)}
                                                </Typography>
                                                <Typography variant="h6">
                                                    Status:{" "}
                                                    <Typography component="span" fontWeight="bold" color="primary">
                                                        {item.Status}
                                                    </Typography>
                                                </Typography>
                                                <Button
                                                    variant="contained"
                                                    className="btn-primary"
                                                    sx={{ mt: 2 }}
                                                    onClick={() => bidAuction(item.Id)}
                                                >
                                                    Bid Now
                                                </Button>
                                            </CardContent>
                                        </>
                                    ) : (
                                        <Box display="flex" sx={{ height: 220 }}>
                                            <CardMedia
                                                component="img"
                                                image={formatImage(item.ImageFile)}
                                                alt={item.ProductName}
                                                sx={{
                                                    width: 150,
                                                    height: "100%",
                                                    objectFit: "cover",
                                                }}
                                            />
                                            <CardContent sx={{ flex: 1 }}>
                                                <Typography variant="h6">{item.Name}</Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    {item.ProductName}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    Starting Price: ${item.StartingPrice.toFixed(2)}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    Starting Time: {formatToLocalTime(item.StartTime)}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    End Time: {formatToLocalTime(item.EndTime)}
                                                </Typography>
                                                <Typography variant="h6">
                                                    Status:{" "}
                                                    <Typography component="span" fontWeight="bold" color="primary">
                                                        {item.Status}
                                                    </Typography>
                                                </Typography>
                                                <Button
                                                    variant="contained"
                                                    className="btn-primary"
                                                    sx={{ mt: 1 }}
                                                    onClick={() => bidAuction(item.Id)}
                                                >
                                                    Bid Now
                                                </Button>
                                            </CardContent>
                                        </Box>
                                    )}
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
