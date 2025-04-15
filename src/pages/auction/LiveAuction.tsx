import React, { useEffect, useState, useRef } from "react";
import { Box, Grid, Typography, Paper, Button, TextField, Divider } from "@mui/material";
import { useParams } from "react-router-dom";
import { HubConnectionState } from "@microsoft/signalr";
import { useApi } from "../../store/useApi";
import { connection } from "../../utils/signal";

interface Bid {
    user: string;
    bidAmount: number;
    timestamp: string;
}

interface BidHistory {
    Action: string;
    Timestamp: string;
}

interface AuctionDetail {
    Name?: string;
    Username?: string;
    ProductName?: string;
    StartingPrice?: string;
    CurrentHighestBid?: number;
    BidPerTurn?: number;
    Endtime?: string;
}

const LiveAuction: React.FC = () => {
    const [newBidAmount, setNewBidAmount] = useState("");
    const [bids, setBids] = useState<Bid[]>([]);
    const [auction, setAuctionDetail] = useState<AuctionDetail | null>(null);
    const [bidHistory, setBidHistory] = useState<BidHistory[]>([]);
    const [auctionStatus, setAuctionStatus] = useState("Connecting...");
    const { id } = useParams<{ id: string }>();
    const auctionId = parseInt(id ?? "", 10);
    const bidLogRef = useRef<HTMLDivElement>(null);
    const [reconnectAttempt, setReconnectAttempt] = useState(0);
    const { apiCall } = useApi();

    const formatStatus = (status: string) => {
        switch (status) {
            case HubConnectionState.Connected:
                return "Live 🔴";
            case HubConnectionState.Disconnected:
                return "Disconnected ❌";
            case HubConnectionState.Connecting:
                return "Connecting...";
            case HubConnectionState.Reconnecting:
                return "Reconnecting...";
            case "Ended":
                return "Auction Ended 🏁";
            case "Error":
                return "Error ❌";
            default:
                return status;
        }
    };

    const showBidHistory = async () => {
        const bidHistory = await apiCall("GET", "user/bid-history", { auctionId: id }, undefined);
        if (bidHistory.success && Array.isArray(bidHistory.data)) {
            setBidHistory(bidHistory.data);
        }
    };

    const getAuctionDetail = async () => {
        const auction = await apiCall<AuctionDetail>("GET", `auctions/${id}`, { auctionId: id }, undefined);
        if (auction.success) {
            setAuctionDetail(auction.data);
        }
    };

    useEffect(() => {
        const startConnection = async () => {
            try {
                if (connection.state === HubConnectionState.Disconnected) {
                    console.log("⏳ Attempting to connect to SignalR...");
                    await connection.start();
                    console.log("✅ SignalR connected");
                    setAuctionStatus(HubConnectionState.Connected);
                } else {
                    console.log("🔁 SignalR already connected or connecting:", connection.state);
                    setAuctionStatus(connection.state);
                }

                // Join the auction after a successful connection
                const joinAuction = async () => {
                    if (connection.state === HubConnectionState.Connected) {
                        if (!isNaN(auctionId)) {
                            try {
                                await connection.invoke("JoinAuction", auctionId);
                                console.log("📡 Joined auction:", auctionId);
                            } catch (err) {
                                console.error("❌ Error invoking JoinAuction:", err);
                            }
                        } else {
                            console.error("🚨 Invalid auction ID:", auctionId);
                        }
                    } else {
                        console.warn("⏳ Waiting to retry join...");
                        setTimeout(joinAuction, 500);
                    }
                };

                joinAuction();

                connection.on("ReceiveBid", (bid) => {
                    console.log("📥 New bid received:", bid);
                    setBids((prev) => [...prev, bid]);
                });

                connection.on("AuctionEnded", () => {
                    console.log("🏁 Auction ended");
                    setAuctionStatus("Ended");
                });

                connection.onclose(async () => {
                    console.log("❌ SignalR connection closed. Attempting reconnection...");
                    setAuctionStatus("Disconnected");
                    setReconnectAttempt((prev) => prev + 1);

                    // Retry connection with exponential backoff
                    const retryTimeout = Math.min(5000, 1000 * Math.pow(2, reconnectAttempt)); // Max 5 seconds retry timeout
                    setTimeout(() => {
                        startConnection();
                    }, retryTimeout);
                });
            } catch (error) {
                console.error("❌ SignalR error:", error);
                setAuctionStatus("Error");
            }
        };

        // Start connection on mount
        startConnection();
        showBidHistory();
        getAuctionDetail();

        return () => {
            if (connection) {
                connection.off("ReceiveBid");
                connection.off("AuctionEnded");
                if (connection.state === HubConnectionState.Connected) {
                    connection.stop();
                    console.log("🛑 SignalR disconnected");
                }
            }
        };
    }, [auctionId, reconnectAttempt]);

    useEffect(() => {
        if (bidLogRef.current) {
            bidLogRef.current.scrollTop = bidLogRef.current.scrollHeight;
        }
    }, [bids]);

    const addBid = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!newBidAmount || isNaN(Number(newBidAmount))) return;
        const result = await apiCall("POST", "user/bid", undefined, {
            auctionId,
            bidAmount: parseFloat(newBidAmount),
        });
        if (result.success) {
            setNewBidAmount("");
            getAuctionDetail();
        }
    };

    return (
        <Box sx={{ padding: 2 }}>
            <Typography variant="h4" sx={{ marginBottom: 2 }}>
                Auction Status: {formatStatus(auctionStatus)}
            </Typography>
            <Grid container spacing={1}>
                <Grid size={{ xs: 12, md: 6 }} sx={{ alignItems: "stretch" }}>
                    <Paper sx={{ padding: 2, height: "100%" }}>
                        {auction ? (
                            <>
                                <Typography variant="h5">Auction: {auction.Name}</Typography>
                                <Typography variant="body1">Product Name: {auction.ProductName}</Typography>
                                <Typography variant="body1">Seller: {auction.Username}</Typography>
                                <Typography variant="body1">Starting Price: ${auction.StartingPrice}</Typography>
                                <Typography variant="body1">Bid Increment: ${auction.BidPerTurn}</Typography>
                                <Divider sx={{ marginTop: 2, marginBottom: 2 }} />
                                <Typography variant="body1">Current Highest Bid: ${auction.CurrentHighestBid}</Typography>
                            </>
                        ) : (
                            <Typography variant="body2" color="text.secondary">
                                Loading auction details...
                            </Typography>
                        )}
                    </Paper>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }} sx={{ alignItems: "stretch" }}>
                    <Paper sx={{ padding: 2, height: "100%" }}>
                        <Box component="form" onSubmit={addBid} sx={{ display: "flex", gap: 1, marginBottom: 2 }}>
                            <TextField
                                label="Your Bid"
                                variant="outlined"
                                size="small"
                                type="number"
                                value={newBidAmount}
                                onChange={(e) => setNewBidAmount(e.target.value)}
                                required
                                fullWidth
                                disabled={auctionStatus !== HubConnectionState.Connected}
                            />
                            <Button
                                type="submit"
                                variant="contained"
                                className="btn-primary"
                                disabled={auctionStatus !== HubConnectionState.Connected}
                            >
                                Submit
                            </Button>
                        </Box>
                        <Typography variant="h5" gutterBottom>
                            History:
                        </Typography>
                        <Box ref={bidLogRef} sx={{ maxHeight: 400, overflowY: "auto" }}>
                            {bidHistory.map((history, index) => (
                                <Box key={index} sx={{ marginBottom: 1 }}>
                                    <Grid container spacing={2}>
                                        <Grid size={6}>
                                            <Typography variant="body2">
                                                <strong>{new Date(history.Timestamp).toLocaleString()}</strong>
                                            </Typography>
                                        </Grid>
                                        <Grid size={6}>
                                            <Typography variant="body2">
                                                <strong>{history.Action}</strong>
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Box>
                            ))}
                            <Divider sx={{ margin: 2 }} />
                            <Typography variant="h5" gutterBottom>
                                Live auction:
                            </Typography>
                            {bids.map((bid, index) => (
                                <Box key={index} sx={{ marginBottom: 1 }}>
                                    <Typography variant="body2">
                                        <strong>{bid.user}</strong> placed a bid of ${bid.bidAmount} at {new Date(bid.timestamp).toLocaleString()}.
                                    </Typography>
                                </Box>
                            ))}
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default LiveAuction;
