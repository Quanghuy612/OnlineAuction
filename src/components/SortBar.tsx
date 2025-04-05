import { Box, FormControl, InputLabel, Select, MenuItem, Grid, TextField, InputAdornment, SelectChangeEvent, Button } from "@mui/material";
import { useState } from "react";
import { Search, ViewModule, ViewList } from "@mui/icons-material";
import { useSort } from "../hooks/useSort";

const SortBar: React.FC<{ mdBreak: boolean }> = ({ mdBreak }) => {
    const [sortOption, setSortOption] = useState<string>("");
    const [sortOrder, setSortOrder] = useState<string>("");
    const [searchQuery, setSearchQuery] = useState("");
    const { isGridView, toggleView } = useSort();

    const handleSortOptionChange = (event: SelectChangeEvent<string>) => {
        setSortOption(event.target.value);
    };

    const handleSortOrderChange = (event: SelectChangeEvent<string>) => {
        setSortOrder(event.target.value);
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
    };

    return (
        <Box sx={{ mb: 2, bgcolor: "white", padding: 2, boxShadow: 1 }}>
            <Grid container spacing={2} alignItems="center">
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
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

                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <FormControl fullWidth size="small">
                        <InputLabel>Sort By</InputLabel>
                        <Select value={sortOption} onChange={handleSortOptionChange} label="Sort By" sx={{ minWidth: 200 }}>
                            <MenuItem value="name">Name</MenuItem>
                            <MenuItem value="price">Price</MenuItem>
                            <MenuItem value="date">Recent Date</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <FormControl fullWidth size="small">
                        <InputLabel>Order</InputLabel>
                        <Select value={sortOrder} onChange={handleSortOrderChange} label="Order" sx={{ minWidth: 200 }}>
                            <MenuItem value="asc">Low to High</MenuItem>
                            <MenuItem value="desc">High to Low</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>

                {!mdBreak && (
                    <Grid size={{ xs: 12, sm: 6, md: 2 }} sx={{ textAlign: "end" }}>
                        <Button
                            onClick={toggleView}
                            sx={{
                                minWidth: "0px",
                                padding: "8px",
                                color: "white",
                            }}
                            className="btn-primary"
                        >
                            {isGridView ? <ViewModule fontSize="small" /> : <ViewList fontSize="small" />}
                        </Button>
                    </Grid>
                )}
            </Grid>
        </Box>
    );
};

export default SortBar;
