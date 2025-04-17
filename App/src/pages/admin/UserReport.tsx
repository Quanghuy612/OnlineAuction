import { useMemo, useState } from "react";
import {
    Grid,
    TextField,
    Paper,
    MenuItem,
    Box,
    InputAdornment,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
} from "@mui/material";
import { useApi } from "../../store/useApi";
import { debounce } from "lodash";
import SearchIcon from "@mui/icons-material/Search";
import { formatToLocalTime } from "../../utils/formatDateTime";
import { Lock } from "@mui/icons-material";

interface UserResponse {
    Id: number;
    Username: string;
    FullName: string;
}

interface UserData {
    Id: number;
    BidAmount: number;
    Timestamp: string;
    Action: string;
    UserId: number;
    AuctionId: number;
}

function UserReport() {
    const { apiCall } = useApi();
    const [query, setQuery] = useState("");
    const [userId, setUserId] = useState<number>(0);
    const [users, setUsers] = useState<UserResponse[]>([]);
    const [data, setData] = useState<UserData[]>([]);

    const fetchUsers = useMemo(
        () =>
            debounce(async (name: string) => {
                const result = await apiCall("GET", "admin/search/users", { name: name });
                if (result.success && Array.isArray(result.data)) {
                    setUsers(result.data);
                }
            }, 500),
        []
    );

    const findUsers = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setQuery(value);
        fetchUsers(value);
    };

    const handleSelectUser = async (user: UserResponse) => {
        setQuery(user.Username);
        await loadDataUser(user.Id);
        setUsers([]);
    };

    const loadDataUser = async (Id: number) => {
        const result = await apiCall("GET", "admin/report/user", { userId: Id });
        if (result.success && Array.isArray(result.data)) {
            setUserId(Id);
            setData(result.data);
        }
    };

    const lockUser = async () => {
        await apiCall("PUT", `admin/lock/user/${userId}`);
    };

    return (
        <Paper sx={{ p: 3 }}>
            <Box sx={{ position: "relative", display: "flex" }}>
                <TextField
                    fullWidth
                    label="Search User"
                    value={query}
                    onChange={findUsers}
                    autoComplete="off"
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            loadDataUser(userId);
                        }
                    }}
                    slotProps={{
                        input: {
                            endAdornment: (
                                <InputAdornment position="end">
                                    <SearchIcon sx={{ cursor: "pointer" }} />
                                </InputAdornment>
                            ),
                        },
                    }}
                />
                <Box sx={{ ml: 1 }}>
                    <Button
                        onClick={lockUser}
                        className="btn_secondary-hover"
                        title="LOCK USER!"
                        sx={{ background: "red", height: "100%", color: "white" }}
                    >
                        <Lock></Lock>
                    </Button>
                </Box>
                {users.length > 0 && (
                    <Paper
                        sx={{
                            position: "absolute",
                            top: "100%",
                            left: 0,
                            right: 0,
                            zIndex: 1000,
                            maxHeight: 200,
                            overflowY: "auto",
                            backgroundColor: "white",
                            boxShadow: 2,
                        }}
                    >
                        {users.map((user) => (
                            <MenuItem key={user.Id} onClick={() => handleSelectUser(user)}>
                                <Grid container spacing={1}>
                                    <Grid size={3}>
                                        <b>{user.Username}</b>
                                    </Grid>
                                </Grid>
                            </MenuItem>
                        ))}
                    </Paper>
                )}
            </Box>
            <Box sx={{ marginTop: 2 }}>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Bid Amount</TableCell>
                                <TableCell>Timestamp</TableCell>
                                <TableCell>Action</TableCell>
                                <TableCell>Auction ID</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data &&
                                data.map((item) => (
                                    <TableRow key={item.Id}>
                                        <TableCell>{item.Id}</TableCell>
                                        <TableCell>{item.BidAmount}</TableCell>
                                        <TableCell>{formatToLocalTime(item.Timestamp)}</TableCell>
                                        <TableCell>{item.Action}</TableCell>
                                        <TableCell>{item.AuctionId}</TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </Paper>
    );
}

export default UserReport;
