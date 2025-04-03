import { BrowserRouter as Router } from "react-router-dom";
import { NotifyProvider } from "./providers/NotifyProvider";
import LoadingSpinner from "./components/LoadingSpinner";
import AppRoutes from "./routes/AppRoutes";
import { CookiesProvider } from "react-cookie";

function App() {
    return (
        <CookiesProvider>
            <LoadingSpinner />
            <NotifyProvider>
                <Router>
                    <AppRoutes />
                </Router>
            </NotifyProvider>
        </CookiesProvider>
    );
}

export default App;
