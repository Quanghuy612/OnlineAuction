import { useEffect, useState } from "react";
import { useApi } from "../../store/useApi";

function AuctionList() {
    const { apiCall, data, loading, message } = useApi();
    const [status, setStatus] = useState("Waitting");

    // Fetch các đơn hàng của admin để duyệt
    const fetchAuctions = async () => {
        await apiCall("GET", "admin/auction", { status });
        console.log("API result:", data); 
    };


    useEffect(() => {
        fetchAuctions();
    }, [status]);

    // Cập nhật trạng thái của đơn hàng khi admin duyệt
const handleApprove = async (id: number) => {
    await apiCall("PUT", "auctions/check-auction", undefined, {
        auctionId: id,
        status: "Ready",
    });
    fetchAuctions();
    console.log("Approved successfully!");
};

// Cập nhật trạng thái của đơn hàng khi admin từ chối
const handleReject = async (id: number) => {
    await apiCall("PUT", "auctions/check-auction", undefined, {
        auctionId: id,
        status: "Rejected",
    });
    fetchAuctions();
    console.log("Rejected successfully!");
};

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4">{status === "Waitting" ? "Đấu giá đang chờ phê duyệt" : `Auctions: ${status}`}</h2>

            <div className="d-flex justify-content-between mb-4">
                <select
                    className="form-select w-25"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                >
                    <option value="Waitting">Waiting</option>
                    <option value="Ready">Ready</option>
                    <option value="Rejected">Rejected</option>
                </select>
                {loading && <p className="text-info">Loading...</p>}
            </div>

            {message && !loading && <p className="text-danger text-center">{message}</p>}

            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                {Array.isArray(data) && data.map((auction: any) => (
                    <div key={auction.Id} className="col">
                        <div className="card shadow-sm">
                            <div className="card-body">
                                <div className="mb-3">
                                    <h5 className="card-title">{auction.Name}</h5>
                                    <p><strong>Status:</strong> {auction.Status}</p>
                                    <p><strong>Product ID:</strong> {auction.ProductId}</p>
                                    <p><strong>Owner ID:</strong> {auction.OwnerId}</p>
                                </div>
                                <div className="mb-3">
                                    <p><strong>Start Time:</strong> {new Date(auction.StartTime).toLocaleString()}</p>
                                    <p><strong>End Time:</strong> {new Date(auction.EndTime).toLocaleString()}</p>
                                    <p><strong>Bid per Turn:</strong> ${auction.BidPerTurn}</p>
                                    <p><strong>Starting Price:</strong> ${auction.StartingPrice}</p>
                                </div>

                                {status === "Waitting" && (
                                    <div className="d-flex justify-content-between">
                                        <button
                                            className="btn btn-success"
                                            onClick={() => handleApprove(auction.Id)}
                                        >
                                            Ready
                                        </button>
                                        <button
                                            className="btn btn-danger"
                                            onClick={() => handleReject(auction.Id)}
                                        >
                                            Rejected
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default AuctionList;
