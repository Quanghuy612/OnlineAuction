import { Box, FormControl, InputLabel, Select, MenuItem, Grid, TextField, InputAdornment, SelectChangeEvent, Button } from "@mui/material";
import { useState } from "react";
import { Search, ViewModule, ViewList } from "@mui/icons-material"; // Icons for grid & list view

const SortBar = () => {
    const [sortOption, setSortOption] = useState<string>("");
    const [sortOrder, setSortOrder] = useState<string>("");
    const [searchQuery, setSearchQuery] = useState("");
    const [isGridView, setIsGridView] = useState<boolean>(true); // Toggle state

    const handleSortOptionChange = (event: SelectChangeEvent<string>) => {
        setSortOption(event.target.value);
    };

    const handleSortOrderChange = (event: SelectChangeEvent<string>) => {
        setSortOrder(event.target.value);
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
    };

    const toggleView = () => {
        setIsGridView((prev) => !prev); // Toggle state
    };

    return (
        <Box sx={{ mt: 2, mb: 2, bgcolor: "white", padding: 2, boxShadow: 1 }}>
            <Grid container spacing={2} alignItems="center">
                <Grid item container spacing={2} alignItems="center" xs>
                    {/* Search Box */}
                    <Grid item xs>
                        <TextField
                            value={searchQuery}
                            onChange={handleSearchChange}
                            label="Search"
                            variant="outlined"
                            size="small"
                            fullWidth
                            slotProps={{
                                input: {
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Search />
                                        </InputAdornment>
                                    ),
                                },
                            }}
                        />
                    </Grid>
                </Grid>
                {/* Sort By Dropdown */}
                <Grid item>
                    <FormControl fullWidth size="small">
                        <InputLabel>Sort By</InputLabel>
                        <Select value={sortOption} onChange={handleSortOptionChange} label="Sort By" sx={{ minWidth: 200 }}>
                            <MenuItem value="name">Name</MenuItem>
                            <MenuItem value="price">Price</MenuItem>
                            <MenuItem value="date">Recent Date</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>

                {/* Order Dropdown */}
                <Grid item>
                    <FormControl fullWidth size="small">
                        <InputLabel>Order</InputLabel>
                        <Select value={sortOrder} onChange={handleSortOrderChange} label="Order" sx={{ minWidth: 200 }}>
                            <MenuItem value="asc">Low to High</MenuItem>
                            <MenuItem value="desc">High to Low</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>

                {/* Toggle Grid/List View Button (Right-aligned) */}
                <Grid item sx={{ marginLeft: "auto" }}>
                    <Button
                        onClick={toggleView}
                        sx={{
                            minWidth: "0px",
                            padding: "8px",
                            color: "white",
                        }}
                        className="btn-secondary"
                    >
                        {isGridView ? <ViewModule fontSize="small" /> : <ViewList fontSize="small" />}
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
};

export default SortBar;
