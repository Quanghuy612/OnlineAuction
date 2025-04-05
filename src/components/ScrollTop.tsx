import { useScrollTrigger } from "@mui/material";
import { Fab } from "@mui/material";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { motion } from "framer-motion";

const ScrollToTopButton = () => {
    const trigger = useScrollTrigger({
        threshold: 100,
        disableHysteresis: true,
    });

    const handleClick = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{
                opacity: trigger ? 1 : 0,
            }}
            transition={{
                duration: 0.3,
                ease: "easeInOut",
            }}
            style={{
                position: "fixed",
                bottom: 32,
                right: 32,
            }}
        >
            <Fab sx={{ color: "white" }} className="btn-primary" size="small" onClick={handleClick} aria-label="scroll back to top">
                <KeyboardArrowUpIcon />
            </Fab>
        </motion.div>
    );
};

export default ScrollToTopButton;
