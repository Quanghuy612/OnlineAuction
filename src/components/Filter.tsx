import { Box, Typography, Slider, Divider, List, ListItem, ListItemText, Checkbox, FormControlLabel } from "@mui/material";
import { useState } from "react";

const Filter = () => {
    const [priceRange, setPriceRange] = useState([30, 3400]);
    const [categories, setCategories] = useState({
        presale: false,
        newArrivals: false,
        auctions: false,
        // Add more categories as needed
    });

    const handlePriceChange = (event, newValue) => {
        setPriceRange(newValue);
    };

    const handleCategoryChange = (event) => {
        setCategories({
            ...categories,
            [event.target.name]: event.target.checked,
        });
    };

    return (
        <Box sx={{ width: 250, p: 2, pr: 4 }}>
            {/* Price Filter Section */}
            <Typography variant="h6" gutterBottom>
                Filter by price
            </Typography>
            <Slider value={priceRange} onChange={handlePriceChange} valueLabelDisplay="auto" min={0} max={5000} step={10} sx={{ mb: 2 }} />
            <Typography variant="body2" sx={{ mb: 3 }}>
                Price: ${priceRange[0]} — ${priceRange[1]}
            </Typography>

            <Divider sx={{ my: 2 }} />

            {/* Product Categories Section */}
            <Typography variant="h6" gutterBottom>
                Product categories
            </Typography>
            <List dense>
                <ListItem>
                    <FormControlLabel
                        control={<Checkbox size="small" checked={categories.presale} onChange={handleCategoryChange} name="presale" />}
                        label="Presale"
                    />
                </ListItem>
                <ListItem>
                    <FormControlLabel
                        control={<Checkbox size="small" checked={categories.newArrivals} onChange={handleCategoryChange} name="newArrivals" />}
                        label="New Arrivals"
                    />
                </ListItem>
                <ListItem>
                    <FormControlLabel
                        control={<Checkbox size="small" checked={categories.auctions} onChange={handleCategoryChange} name="auctions" />}
                        label="Auctions"
                    />
                </ListItem>
                {/* Add more categories as needed */}
            </List>

            <Divider sx={{ my: 2 }} />

            {/* Additional filters can be added here */}
            <Typography variant="h6" gutterBottom>
                Auction Status
            </Typography>
            <List dense>
                <ListItem>
                    <FormControlLabel control={<Checkbox size="small" />} label="Active Auctions" />
                </ListItem>
                <ListItem>
                    <FormControlLabel control={<Checkbox size="small" />} label="Finished Auctions" />
                </ListItem>
            </List>
        </Box>
    );
};

export default Filter;
