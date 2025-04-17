import { useEffect, useState } from "react";
import { useApi } from "../../store/useApi";
import { useParams, useNavigate } from "react-router-dom";

function UserReport() {
    const { apiCall, data, loading, message } = useApi();
    const [userId, setUserId] = useState<number | null>(null);
    const [inputId, setInputId] = useState<string>("");
    const { id } = useParams(); // lấy userId từ URL nếu có
    const navigate = useNavigate();

    // Gọi API khi có userId từ URL
    useEffect(() => {
        if (id) {
            const parsedId = parseInt(id);
            if (!isNaN(parsedId)) {
                setUserId(parsedId);
                fetchUserLogs(parsedId);
            }
        }
    }, [id]);

    // Hàm fetch danh sách hoạt động user
    const fetchUserLogs = async (uid: number) => {
        await apiCall("GET", `/api/v1/admin/report/user?userId=${uid}`);
    };

    // Xử lý tìm kiếm user
    const handleSearch = () => {
        const parsedId = parseInt(inputId);
        if (!isNaN(parsedId)) {
            setUserId(parsedId);
            fetchUserLogs(parsedId);
            navigate(`/admin/user/${parsedId}`);
        }
    };

    // Gọi API để khóa tài khoản user
    const handleLockUser = async () => {
        if (!userId) return;
        const result = await apiCall("PUT", "/api/v1/admin/lock/user", { userId });
        if (result.success) {
            alert("User locked successfully");
            navigate("/admin/auctions");
        } else {
            alert("Failed to lock user");
        }
    };

    return (
        <div className="container mt-4">
            <h2 className="mb-3">User Activity Report</h2>

            <div className="d-flex mb-4">
                <input
                    type="number"
                    className="form-control me-2"
                    placeholder="Enter User ID"
                    value={inputId}
                    onChange={(e) => setInputId(e.target.value)}
                />
                <button className="btn btn-primary" onClick={handleSearch}>
                    Search
                </button>
            </div>

            {loading && <p>Loading...</p>}
            {message && !loading && <p className="text-danger">{message}</p>}

            {Array.isArray(data) && data.length > 0 ? (
                <div className="card shadow p-3">
                    <h5 className="mb-3">User ID: {userId}</h5>
                    <ul className="list-group">
                        {data.map((log: any, index: number) => (
                            <li key={index} className="list-group-item">
                                <p><strong>Action:</strong> {log.action}</p>
                                <p><strong>Bid Amount:</strong> ${log.bidAmount}</p>
                                <p><strong>Time:</strong> {new Date(log.timestamp).toLocaleString()}</p>
                                <p><strong>Auction ID:</strong> {log.auctionId}</p>
                            </li>
                        ))}
                    </ul>
                    <button className="btn btn-danger mt-3" onClick={handleLockUser}>
                        Lock User
                    </button>
                </div>
            ) : (
                !loading && userId && <p className="text-muted">No activity found for this user.</p>
            )}
        </div>
    );
}

export default UserReport;
