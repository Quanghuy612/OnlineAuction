import { Box, Typography, Slider, Divider, List, ListItem, Checkbox, FormControlLabel, IconButton, Button } from "@mui/material";
import { useState } from "react";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { FilterList } from "@mui/icons-material";
import { motion } from "framer-motion";

const Filter: React.FC<{ mdBreak: boolean }> = ({ mdBreak }) => {
    const [priceRange, setPriceRange] = useState([30, 3400]);
    const [categories, setCategories] = useState<Record<string, boolean>>({
        presale: false,
        newArrivals: false,
        auctions: false,
    });
    const [isOpen, setIsOpen] = useState(false);

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
        <motion.div initial={{ x: -100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.3, ease: "easeOut" }}>
            <Box
                sx={{
                    position: mdBreak ? "fixed" : "",
                    top: 55,
                    left: mdBreak ? (isOpen ? 0 : "-270px") : 0,
                    width: 250,
                    bgcolor: "white",
                    boxShadow: 3,
                    p: 2,
                    mr: 3,
                    zIndex: 10,
                    borderRight: "1px solid #ddd",
                    transition: "left 0.3s ease-in-out",
                }}
            >
                {mdBreak && (
                    <IconButton
                        onClick={() => setIsOpen(!isOpen)}
                        sx={{
                            position: "absolute",
                            top: "30%",
                            right: isOpen ? -15 : -40,
                            backgroundColor: "white",
                            border: "1px solid #ccc",
                            boxShadow: 1,
                            zIndex: 10,
                            width: 32,
                            height: 32,
                            ":hover": { backgroundColor: "#f5f5f5" },
                        }}
                    >
                        {isOpen ? <ArrowBackIosNewIcon fontSize="small" /> : <ArrowForwardIosIcon fontSize="small" />}
                    </IconButton>
                )}
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography variant="h5" gutterBottom>
                        Filter
                    </Typography>
                    <Button
                        className="btn-primary"
                        sx={{
                            minWidth: "0px",
                            padding: "8px",
                            color: "white",
                        }}
                        size="small"
                    >
                        <FilterList />
                    </Button>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Typography variant="h6" gutterBottom>
                    Price
                </Typography>
                <Slider
                    value={priceRange}
                    onChange={handlePriceChange}
                    valueLabelDisplay="auto"
                    min={0}
                    max={5000}
                    step={10}
                    sx={{ mb: 2 }}
                    className="custom-slider"
                />
                <Typography variant="body2" sx={{ mb: 3 }}>
                    Price: ${priceRange[0]} — ${priceRange[1]}
                </Typography>

                <Divider sx={{ my: 2 }} />

                <Typography variant="h6" gutterBottom>
                    Product categories
                </Typography>
                <List dense>
                    {["presale", "newArrivals", "auctions"].map((name) => (
                        <ListItem key={name} disableGutters>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        size="small"
                                        checked={categories[name]}
                                        onChange={handleCategoryChange}
                                        name={name}
                                        className="custom-checkbox"
                                    />
                                }
                                label={name.charAt(0).toUpperCase() + name.slice(1)}
                            />
                        </ListItem>
                    ))}
                </List>

                <Divider sx={{ my: 2 }} />

                <Typography variant="h6" gutterBottom>
                    Auction Status
                </Typography>
                <List dense>
                    <ListItem disableGutters>
                        <FormControlLabel control={<Checkbox size="small" className="custom-checkbox" />} label="Active Auctions" />
                    </ListItem>
                    <ListItem disableGutters>
                        <FormControlLabel control={<Checkbox size="small" className="custom-checkbox" />} label="Finished Auctions" />
                    </ListItem>
                </List>
            </Box>
        </motion.div>
    );
};

export default Filter;
