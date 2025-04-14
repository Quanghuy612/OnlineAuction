import { Box, Grid, Card, CardContent, CardMedia, Typography, Button } from "@mui/material";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useSort } from "../../hooks/useSort";
import axios from "axios";
// const auctionItems = [
//     { id: 1, title: "Vintage Painting", description: "A beautiful vintage painting.", image: "/images/painting.jpg", price: 100 },
//     { id: 2, title: "Antique Vase", description: "A rare antique vase.", image: "/images/vase.jpg", price: 200 },
//     { id: 3, title: "Gold Watch", description: "A luxury gold watch.", image: "/images/watch.jpg", price: 300 },
//     { id: 4, title: "Sword", description: "A good sword.", image: "/images/watch.jpg", price: 300 },
//     { id: 5, title: "Shield", description: "A good shield.", image: "/images/watch.jpg", price: 300 },
// ];
interface AuctionItem {
    id: number;
    name: string;
    category: string;
    description: string;
    image: string;
    price: number;
  }

function Home() {
    const [filteredItems, setFilteredItems] = useState<AuctionItem[]>([]);
    const { isGridView } = useSort();

    useEffect(() => {
        const fetchItems = async () => {
          try {
            const response = await axios.get<AuctionItem[]>('http://localhost:5000/api/v1/products');
            setFilteredItems(response.data);
          } catch (error) {
            console.error('Error fetching products:', error);
          } 
        };
    
        fetchItems();
      }, []);

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
                        <Grid key={item.id} size={{ xs: 12, sm: isGridView ? 6 : 12, md: isGridView ? 4 : 12 }}>
                            <motion.div layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }}>
                                <Card sx={{ boxShadow: 3 }}>
                                    <CardMedia component="img" height="180" image={item.image} alt={item.name} />
                                    <CardContent>
                                        <Typography variant="h6">{item.name}</Typography>
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
    );
}

export default Home;
