/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo, useState } from "react";
import { Button, Typography, Grid, Paper, Box, TextField, Modal, InputLabel, MenuItem, CardContent, CardMedia, Card } from "@mui/material";
import { AuctionResponse } from "../../types/AuctionResponse";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import React from "react";
import { useApi } from "../../store/useApi";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Dayjs } from "dayjs";
import { debounce } from "lodash";
import { useNavigate } from "react-router-dom";
import { formatToLocalTime } from "../../utils/formatDateTime";
import { formatImage } from "../../utils/formatImage";
import { motion } from "framer-motion";

interface AddAuctionModalProps {
    open: boolean;
    onClose: () => void;
    reLoad: () => void;
}

interface Product {
    Id: number;
    Name: string;
    Price: number;
}
interface FormState {
    name: string;
    startingPrice: string;
    bidPerTurn: string;
    startTime: Dayjs | null;
    endTime: Dayjs | null;
    productId: number;
    productName: string;
}

const CustomBackdrop = () => (
    <div
        style={{
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 9,
        }}
    />
);

const AddAuctionModal: React.FC<AddAuctionModalProps> = ({ open, onClose, reLoad }) => {
    const [form, setForm] = useState<FormState>({
        name: "",
        startingPrice: "",
        bidPerTurn: "",
        startTime: null,
        endTime: null,
        productId: 0,
        productName: "",
    });
    const [products, setProducts] = useState<Product[]>([]);
    const { apiCall } = useApi();

    const fetchProducts = useMemo(
        () =>
            debounce(async (name: string) => {
                const res = await apiCall("GET", "/user/products", { name });
                setProducts(res.success && Array.isArray(res.data) ? res.data : []);
            }, 500),
        []
    );

    const findProducts = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm((f) => ({ ...f, [name]: value }));
        fetchProducts(value);
    };

    const selectproduct = (product: Product) => {
        setForm((prev) => ({
            ...prev,
            productName: product.Name,
            productId: product.Id,
        }));
        setProducts([]);
    };

    const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleDateChange = (name: string, newDate: unknown) => {
        setForm((prev) => ({
            ...prev,
            [name]: newDate,
        }));
    };

    const addAuction = async () => {
        const payload = {
            ...form,
            startTime: form.startTime?.format(),
            endTime: form.endTime?.format(),
        };
        const result = await apiCall<AuctionResponse[]>("POST", "/user/add-auction", undefined, payload);
        if (result.success) {
            setForm({
                name: "",
                startingPrice: "",
                bidPerTurn: "",
                startTime: null,
                endTime: null,
                productId: 0,
                productName: "",
            });
            reLoad();
        }
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Modal
                open={open}
                onClose={onClose}
                closeAfterTransition
                slots={{
                    backdrop: CustomBackdrop,
                }}
            >
                <Box
                    sx={{
                        position: "absolute" as const,
                        top: "40%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: 500,
                        bgcolor: "background.paper",
                        border: "2px solid #000",
                        boxShadow: 24,
                        p: 4,
                        borderRadius: 2,
                        zIndex: 10,
                    }}
                >
                    <Typography variant="h6" gutterBottom>
                        Add New Auction
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid size={12} sx={{ position: "relative" }}>
                            <TextField
                                fullWidth
                                label="Add Product"
                                name="productName"
                                value={form.productName}
                                onChange={findProducts}
                                autoComplete="off"
                            />
                            {products.length > 0 && (
                                <Paper
                                    style={{
                                        position: "absolute",
                                        top: "100%",
                                        left: 0,
                                        right: 0,
                                        zIndex: 1000,
                                        maxHeight: "200px",
                                        overflowY: "auto",
                                    }}
                                >
                                    {products.map((product) => (
                                        <MenuItem key={product.Id} onClick={() => selectproduct(product)}>
                                            <Grid container spacing={1}>
                                                <Grid size={8}>
                                                    <b>{product.Name}</b>
                                                </Grid>
                                                <Grid size={4}>
                                                    Price: <b>{product.Price}</b>
                                                </Grid>
                                            </Grid>
                                        </MenuItem>
                                    ))}
                                </Paper>
                            )}
                        </Grid>
                        <Grid size={12}>
                            <TextField fullWidth label="Auction Name" name="name" value={form.name} onChange={handleChange} />
                        </Grid>
                        <Grid size={12}>
                            <TextField
                                fullWidth
                                label="Starting Price"
                                name="startingPrice"
                                type="number"
                                value={form.startingPrice}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid size={12}>
                            <TextField
                                fullWidth
                                label="Bid Per Turn"
                                name="bidPerTurn"
                                type="number"
                                value={form.bidPerTurn}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid size={12}>
                            <InputLabel htmlFor="startTime">Start Time</InputLabel>
                            <DateTimePicker
                                value={form.startTime}
                                onChange={(newValue) => handleDateChange("startTime", newValue)}
                                format="DD/MM/YYYY HH:mm"
                                slotProps={{
                                    textField: {
                                        fullWidth: true,
                                        variant: "outlined",
                                    },
                                }}
                            />
                        </Grid>
                        <Grid size={12}>
                            <InputLabel htmlFor="endTime">End Time</InputLabel>
                            <DateTimePicker
                                value={form.endTime}
                                onChange={(newValue) => handleDateChange("endTime", newValue)}
                                format="DD/MM/YYYY HH:mm"
                                slotProps={{
                                    textField: {
                                        fullWidth: true,
                                        variant: "outlined",
                                    },
                                }}
                            />
                        </Grid>
                    </Grid>
                    <Box mt={3} display="flex" justifyContent="flex-end">
                        <Button onClick={onClose} sx={{ mr: 1 }}>
                            Cancel
                        </Button>
                        <Button className="btn-primary" sx={{ color: "white" }} onClick={addAuction}>
                            Submit
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </LocalizationProvider>
    );
};

const UserAuctions = () => {
    const [auctions, setAuctions] = useState<AuctionResponse[]>([]);
    const { apiCall } = useApi();
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const navigate = useNavigate();

    const loadData = async () => {
        const result = await apiCall<AuctionResponse[]>("GET", "/user/auctions", undefined, undefined);
        setAuctions(result.data ?? []);
    };
    useEffect(() => {
        loadData();
    }, []);

    const startAuction = async (Id: number) => {
        const result = await apiCall("PUT", `/user/toggle-auction/${Id}`, undefined, "Started");
        if (result.success) {
            navigate(`/live-auction/${Id}`);
        }
    };

    return (
        <>
            <Box sx={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
                <Typography className="text-main" variant="h4" sx={{ flexGrow: 1, fontWeight: 600 }}>
                    Auctions
                </Typography>
                <Button className="btn-primary" sx={{ color: "white" }} onClick={handleOpen} endIcon={<AddCircleIcon />}>
                    Add New Auction
                </Button>
            </Box>
            <Grid container spacing={2}>
                {auctions.map((auction) => (
                    <Grid key={auction.Id} size={4}>
                        <motion.div layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }}>
                            <Card sx={{ boxShadow: 3, position: "relative", overflow: "hidden" }}>
                                <CardMedia
                                    component="img"
                                    height="300"
                                    src={formatImage(auction.ImageFile)}
                                    alt={auction.ProductName}
                                    sx={{ objectFit: "cover", width: "100%" }}
                                />
                                <CardContent>
                                    <Typography variant="h6">{auction.ProductName}</Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        Starting Price: ${auction.StartingPrice.toFixed(2)}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        Starting Time: {formatToLocalTime(auction.StartTime)}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        End Time: {formatToLocalTime(auction.EndTime)}
                                    </Typography>

                                    <Typography variant="h6" color="textSecondary">
                                        Status: <b>{auction.Status}</b>
                                    </Typography>
                                </CardContent>

                                {/* Box containing buttons to show on hover */}
                                <Box
                                    sx={{
                                        position: "absolute",
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        bottom: 0,
                                        backgroundColor: "rgba(0, 0, 0, 0.44)", // Grey backdrop
                                        opacity: 0,
                                        transition: "opacity 0.3s", // Smooth transition for opacity
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        zIndex: 1, // Ensure buttons are above content
                                        "&:hover": {
                                            opacity: 1, // Show buttons and backdrop on hover
                                        },
                                    }}
                                >
                                    <Box sx={{ zIndex: 2, display: "flex", flexDirection: "column", gap: 1 }}>
                                        {auction.Status === "Started" && (
                                            <Button
                                                variant="contained"
                                                sx={{ marginTop: 1 }}
                                                className="btn-fifth"
                                                endIcon={<ArrowForwardIcon />}
                                                onClick={() => navigate(`/live-auction/${auction.Id}`)}
                                            >
                                                Live auction
                                            </Button>
                                        )}
                                        {auction.Status === "Ready" && (
                                            <Button
                                                variant="contained"
                                                sx={{ marginTop: 1 }}
                                                color="primary"
                                                onClick={() => startAuction(auction.Id)}
                                            >
                                                Start Auction
                                            </Button>
                                        )}
                                        {auction.Status !== "Ready" && auction.Status !== "Started" && (
                                            <Typography variant="h4" className="text-primary">
                                                <b>{auction.Status}</b>
                                            </Typography>
                                        )}
                                    </Box>
                                </Box>
                            </Card>
                        </motion.div>
                    </Grid>
                ))}
            </Grid>
            <AddAuctionModal open={open} onClose={handleClose} reLoad={loadData} />
        </>
    );
};

export default UserAuctions;
