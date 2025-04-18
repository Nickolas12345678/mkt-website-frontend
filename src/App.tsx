import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import Signin from "./Pages/SigninPage";
import Signup from "./Pages/SignupPage";
import ShopPage from "./Pages/ShopPage";
import ServicesPage from "./Pages/ServicePage";
import OrdersPage from "./Pages/OrdersPage";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminPage from "./Pages/AdminPage";
import { AuthProvider } from "./context/AuthContext";
import NotFound from "./Pages/NotFound";
import MyServiceRequestsPage from "./Pages/MyServiceRequestsPage";

const App = () => {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/signin" element={<Signin />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/shop" element={<ShopPage />} />
                    <Route path="/shop/:categoryName" element={<ShopPage />} />
                    <Route path="/orders" element={<OrdersPage />} />
                    <Route path="/service" element={<ServicesPage />} />
                    <Route path="/ordersservice" element={<MyServiceRequestsPage />} />
                    <Route path="/admin/*" element={
                        <ProtectedRoute>
                            <AdminPage />
                        </ProtectedRoute>
                    } />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
};

export default App;

