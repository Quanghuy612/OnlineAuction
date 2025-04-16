import { useState } from "react";
import { useApi } from "../../store/useApi";

function UserReport() {
    const { apiCall, data, loading, message } = useApi();
    const [userId, setUserId] = useState<number | null>(null);
    const [inputId, setInputId] = useState<string>("");

    const handleSearch = async () => {
        const id = parseInt(inputId);
        if (!id) return;
        setUserId(id);
        await apiCall("GET", "/api/v1/admin/report/user", { userId: id });
    };

    const handleLockUser = async () => {
        if (!userId) return;
        await apiCall("PUT", "/api/v1/admin/lock/user", { userId });
        alert("User has been locked");
    };

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">User Report</h2>
            <div className="flex gap-2 mb-4">
                <input
                    type="number"
                    className="border p-2 rounded"
                    placeholder="Enter User ID"
                    value={inputId}
                    onChange={(e) => setInputId(e.target.value)}
                />
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                    onClick={handleSearch}
                >
                    Search
                </button>
            </div>

            {loading && <p>Loading...</p>}
            {message && !loading && <p className="text-red-500">{message}</p>}

            {Array.isArray(data) && data.length > 0 && (
                <div className="border rounded p-4 shadow">
                    <h3 className="text-lg font-semibold mb-2">Activities</h3>
                    <ul className="list-disc pl-5">
                        {data.map((item: any, index: number) => (
                            <li key={index} className="mb-2">
                                <p><strong>Action:</strong> {item.action}</p>
                                <p><strong>Amount:</strong> {item.bidAmount}</p>
                                <p><strong>Time:</strong> {new Date(item.timestamp).toLocaleString()}</p>
                                <p><strong>Auction ID:</strong> {item.auctionId}</p>
                            </li>
                        ))}
                    </ul>
                    <button
                        className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
                        onClick={handleLockUser}
                    >
                        Lock User
                    </button>
                </div>
            )}
        </div>
    );
}

export default UserReport;
