import { Box, Grid, Card, CardContent, CardMedia, Typography, Button, TextField } from "@mui/material";
import { motion } from "framer-motion";
import { useState } from "react";

const auctionItems = [
    { id: 1, title: "Vintage Painting", description: "A beautiful vintage painting.", image: "/images/painting.jpg", price: 100 },
    { id: 2, title: "Antique Vase", description: "A rare antique vase.", image: "/images/vase.jpg", price: 200 },
    { id: 3, title: "Gold Watch", description: "A luxury gold watch.", image: "/images/watch.jpg", price: 300 },
    { id: 4, title: "Sword", description: "A good sword.", image: "/images/watch.jpg", price: 300 },
    { id: 5, title: "Shield", description: "A good shield.", image: "/images/watch.jpg", price: 300 },
];

function Home() {
    const [filterText, setFilterText] = useState("");

    const filteredItems = auctionItems.filter((item) => item.title.toLowerCase().includes(filterText.toLowerCase()));

    return (
        <div>
            <Box sx={{ padding: 2, textAlign: "center" }}>
                <TextField
                    label="Search Auction Items"
                    variant="outlined"
                    size="small"
                    value={filterText}
                    onChange={(e) => setFilterText(e.target.value)}
                    sx={{ maxWidth: 400, width: "100%", marginBottom: 2 }}
                />
            </Box>

            <Box>
                <Grid container spacing={2}>
                    {filteredItems.length === 0 ? (
                        <Grid size="auto">
                            <Typography variant="h6" color="text.secondary" textAlign="center">
                                No items found.
                            </Typography>
                        </Grid>
                    ) : (
                        filteredItems.map((item) => (
                            <Grid size={{ xs: 12, sm: 6, md: 12 / 5 }}>
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
                                    <Card sx={{ boxShadow: 3 }}>
                                        <CardMedia component="img" height="200" image={item.image} alt={item.title} />
                                        <CardContent>
                                            <Typography variant="h6">{item.title}</Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {item.description}
                                            </Typography>
                                            <Typography variant="body1" sx={{ mt: 1 }}>
                                                ${item.price}
                                            </Typography>
                                            <Button variant="contained" className="btn-primary" sx={{ mt: 2 }}>
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
        </div>
    );
}

export default Home;
