import { useEffect } from "react";
import { useApi } from "../../store/useApi";
import { Box, Button, Card, CardActions, CardContent, Divider, Typography } from "@mui/material";
import { formatToLocalTime } from "../../utils/formatDateTime";

function AuctionList() {
    const { apiCall, data } = useApi();

    // Fetch các đơn hàng của admin để duyệt
    const fetchAuctions = async () => {
        await apiCall("GET", "admin/auction", { status: "Waitting" });
    };

    useEffect(() => {
        fetchAuctions();
    }, []);

    // Cập nhật trạng thái của đơn hàng khi admin duyệt
    const handleApprove = async (id: number) => {
        const result = await apiCall("PUT", `admin/auction/${id}`, undefined, "Ready");
        if (result.success) fetchAuctions();
    };

    // Cập nhật trạng thái của đơn hàng khi admin từ chối
    const handleReject = async (id: number) => {
        const result = await apiCall("PUT", `user/auction/${id}`, undefined, "Canceled");
        if (result.success) fetchAuctions();
    };

    return (
        <div className="container mt-5">
            <div className="row">
                {Array.isArray(data) &&
                    data.map((auction: any) => (
                        <Box key={auction.Id}>
                            <Card elevation={3}>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        {auction.Name}
                                    </Typography>

                                    <Box mb={2}>
                                        <Typography variant="body2">
                                            <strong>Status:</strong> {auction.Status}
                                        </Typography>
                                        <Typography variant="body2">
                                            <strong>Product ID:</strong> {auction.ProductId}
                                        </Typography>
                                        <Typography variant="body2">
                                            <strong>Owner ID:</strong> {auction.OwnerId}
                                        </Typography>
                                    </Box>

                                    <Divider sx={{ mb: 2 }} />

                                    <Box mb={2}>
                                        <Typography variant="body2">
                                            <strong>Start Time:</strong> {formatToLocalTime(auction.StartTime)}
                                        </Typography>
                                        <Typography variant="body2">
                                            <strong>End Time:</strong> {formatToLocalTime(auction.EndTime)}
                                        </Typography>
                                        <Typography variant="body2">
                                            <strong>Bid per Turn:</strong> ${auction.BidPerTurn}
                                        </Typography>
                                        <Typography variant="body2">
                                            <strong>Starting Price:</strong> ${auction.StartingPrice}
                                        </Typography>
                                    </Box>
                                </CardContent>
                                <CardActions>
                                    <Button variant="contained" color="success" onClick={() => handleApprove(auction.Id)}>
                                        Approved
                                    </Button>
                                    <Button variant="contained" color="error" onClick={() => handleReject(auction.Id)}>
                                        Rejected
                                    </Button>
                                </CardActions>
                            </Card>
                        </Box>
                    ))}
            </div>
        </div>
    );
}

export default AuctionList;
