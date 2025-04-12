import { useState } from "react";
import { Button, Typography, Grid, Paper, Box, TextField, Modal } from "@mui/material";
import { AuctionResponse } from "../../types/AuctionResponse";
import { DateTime } from "luxon";
import { formatImage } from "../../utils/formatImage";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import React from "react";
interface AddAuctionModalProps {
    open: boolean;
    onClose: () => void;
}
const AddAuctionModal: React.FC<AddAuctionModalProps> = ({ open, onClose }) => {
    const [form, setForm] = React.useState({
        name: "",
        price: "",
        description: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box
                sx={{
                    position: "absolute" as const,
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: 400,
                    bgcolor: "background.paper",
                    border: "2px solid #000",
                    boxShadow: 24,
                    p: 4,
                    borderRadius: 2,
                }}
            >
                <Typography variant="h6" gutterBottom>
                    Add New Auction
                </Typography>
                <Grid container spacing={2}>
                    <Grid size={12}>
                        <TextField fullWidth label="Auction Name" name="name" value={form.name} onChange={handleChange} />
                    </Grid>
                    <Grid size={12}>
                        <TextField fullWidth label="Starting Price" name="price" type="number" value={form.price} onChange={handleChange} />
                    </Grid>
                    <Grid size={12}>
                        <TextField
                            fullWidth
                            label="Description"
                            name="description"
                            multiline
                            rows={3}
                            value={form.description}
                            onChange={handleChange}
                        />
                    </Grid>
                </Grid>
                <Box mt={3} display="flex" justifyContent="flex-end">
                    <Button onClick={onClose} sx={{ mr: 1 }}>
                        Cancel
                    </Button>
                    <Button variant="contained">Submit</Button>
                </Box>
            </Box>
        </Modal>
    );
};
const UserAuctions = () => {
    const [auctions, setAuctions] = useState<AuctionResponse[]>([
        {
            Id: "1",
            Name: "Vintage Lamp",
            StartTime: DateTime.now().minus({ days: 2 }),
            EndTime: DateTime.now().plus({ days: 5 }),
            StartingPrice: 120,
            Status: "Ready",
            ProductImage: new File([""], "vintage-lamp.jpg", { type: "image/jpeg" }),
            ProductName: "Vintage Lamp",
        },
        {
            Id: "2",
            Name: "Antique Vase",
            StartTime: DateTime.now().plus({ days: 1 }),
            EndTime: DateTime.now().plus({ days: 10 }),
            StartingPrice: 450,
            Status: "Started",
            ProductImage: new File([""], "antique-vase.jpg", { type: "image/jpeg" }),
            ProductName: "Antique Vase",
        },
    ]);

    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography className="text-main" variant="h4" sx={{ flexGrow: 1, fontWeight: 600 }}>
                    Auctions
                </Typography>
                <Button className="btn-primary" sx={{ color: "white" }} onClick={handleOpen} endIcon={<AddCircleIcon />}>
                    Add New Auction
                </Button>
            </Box>
            {auctions.map((auction) => (
                <Paper key={auction.Id} sx={{ padding: 2, marginBottom: 2, marginTop: 2 }}>
                    <Grid container spacing={2}>
                        <Grid size={3}>
                            <Box
                                component="img"
                                src={formatImage(auction.ProductImage)}
                                alt={auction.ProductName}
                                sx={{ width: "100%", height: "300px" }}
                            />
                        </Grid>
                        <Grid size={7}>
                            <Typography variant="h6">{auction.ProductName}</Typography>
                            <Typography variant="body2" color="textSecondary">
                                Starting Price: ${auction.StartingPrice.toFixed(2)}
                            </Typography>
                        </Grid>
                        <Grid size={2}>
                            <Typography variant="body2" color="textSecondary">
                                Status: {auction.Status}
                            </Typography>
                            {auction.Status === "Started" && (
                                <Button variant="contained" sx={{ marginTop: 1 }} className="btn-fifth" size="small" endIcon={<ArrowForwardIcon />}>
                                    Live auction
                                </Button>
                            )}
                            {auction.Status === "Ready" && (
                                <Button variant="contained" sx={{ marginTop: 1 }} color="primary" size="small">
                                    Start Auction
                                </Button>
                            )}
                        </Grid>
                    </Grid>
                </Paper>
            ))}
            <AddAuctionModal open={open} onClose={handleClose} />
        </>
    );
};

export default UserAuctions;
