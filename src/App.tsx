import { BrowserRouter as Router } from "react-router-dom";
import { NotifyProvider } from "./providers/NotifyProvider";
import LoadingSpinner from "./components/LoadingSpinner";
import AppRoutes from "./routes/AppRoutes";
import { CookiesProvider } from "react-cookie";
import { AuthProvider } from "./providers/AuthProvider";

function App() {
    return (
        <CookiesProvider>
            <LoadingSpinner />
            <NotifyProvider>
                <Router>
                    <AuthProvider>
                        <AppRoutes />
                    </AuthProvider>
                </Router>
            </NotifyProvider>
        </CookiesProvider>
    );
}

export default App;
