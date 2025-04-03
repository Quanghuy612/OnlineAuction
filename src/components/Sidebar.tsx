import { Drawer, List, ListItem, ListItemButton, FormControlLabel, Checkbox } from "@mui/material";
import { Link } from "react-router-dom";

interface SidebarProps {
    open: boolean;
    isStatic: boolean;
    onClose: () => void;
    onToggleStatic: (value: boolean) => void;
}

const drawerWidth = 240;

const Sidebar: React.FC<SidebarProps> = ({ open, isStatic, onClose, onToggleStatic }) => {
    return (
        <>
            {isStatic && (
                <Drawer
                    variant={isStatic ? "permanent" : "temporary"}
                    sx={{
                        width: drawerWidth,
                        zIndex: 10,
                        position: "fixed",
                        flexShrink: 0,
                        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: "border-box" },
                    }}
                >
                    <SidebarContent onToggleStatic={onToggleStatic} isStatic={isStatic} />
                </Drawer>
            )}

            <Drawer anchor="left" open={open} onClose={onClose} sx={{ display: isStatic ? "none" : "block" }}>
                <SidebarContent onToggleStatic={onToggleStatic} isStatic={isStatic} />
            </Drawer>
        </>
    );
};

const SidebarContent: React.FC<{ onToggleStatic: (value: boolean) => void; isStatic: boolean }> = ({ onToggleStatic, isStatic }) => (
    <List sx={{ width: drawerWidth }}>
        <ListItem disablePadding>
            <ListItemButton component={Link} to="/">
                <img src="images/logo.png" alt="Logo" style={{ width: 50, height: 50 }} />
            </ListItemButton>
            <FormControlLabel
                control={<Checkbox checked={isStatic} onChange={(e) => onToggleStatic(e.target.checked)} />}
                label={null}
                sx={{ paddingLeft: 2 }}
            />
        </ListItem>
    </List>
);

export default Sidebar;
