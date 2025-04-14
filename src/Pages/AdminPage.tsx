import { useAuth } from "../context/AuthContext";
import { Link, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import UsersPage from "./UsersPage";
import CategoryPage from "./CategoryPage";
import ProductsPage from "./ProductsPage";
import AdminOrdersPage from "./AdminOrdersPage";
import AdminServiceRequestsPage from "./AdminServiceRequestsPage";
import AdminServicesPage from "./AdminServicessPage";

const AdminPage = () => {
    const { user } = useAuth();

    useEffect(() => {
        document.body.style.overflowX = "hidden";
        return () => {
            document.body.style.overflowX = "auto";
        };
    }, []);

    return (
        <div className="admin-panel">
            <aside className="w-64 bg-gray-900 text-white h-screen fixed top-0 left-0 p-6 flex flex-col justify-between">
                <div>
                    <h1 className="text-3xl text-orange-600 font-bold mb-6">МКТ</h1>
                    <nav>
                        <ul className="space-y-3">
                            <li className="w-full">
                                <Link
                                    to="/admin"
                                    className="block w-full p-3 rounded-lg bg-gray-800 hover:bg-gray-700 transition text-gray-300 text-center"
                                >
                                    Користувачі
                                </Link>
                            </li>
                            <li className="w-full">
                                <Link
                                    to="/admin/categories"
                                    className="block w-full p-3 rounded-lg bg-gray-800 hover:bg-gray-700 transition text-gray-300 text-center"
                                >
                                    Категорії
                                </Link>
                            </li>
                            <li className="w-full">
                                <Link
                                    to="/admin/products"
                                    className="block w-full p-3 rounded-lg bg-gray-800 hover:bg-gray-700 transition text-gray-300 text-center"
                                >
                                    Товари
                                </Link>
                            </li>
                            <li className="w-full">
                                <Link
                                    to="/admin/services"
                                    className="block w-full p-3 rounded-lg bg-gray-800 hover:bg-gray-700 transition text-gray-300 text-center"
                                >
                                    Послуги
                                </Link>
                            </li>
                            <li className="w-full">
                                <Link
                                    to="/admin/orders"
                                    className="block w-full p-3 rounded-lg bg-gray-800 hover:bg-gray-700 transition text-gray-300 text-center"
                                >
                                    Замовлення магазин
                                </Link>
                            </li>
                            <li className="w-full">
                                <Link
                                    to="/admin/serviceorders"
                                    className="block w-full p-3 rounded-lg bg-gray-800 hover:bg-gray-700 transition text-gray-300 text-center"
                                >
                                    Замовлення сервіс
                                </Link>
                            </li>
                        </ul>
                    </nav>
                </div>
                <Link
                    to="/"
                    className="mt-6 flex items-center justify-center bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 transition"
                >
                    <ArrowLeft className="mr-2" />
                    На головну
                </Link>
            </aside>

            <main className="flex-1 p-6 pl-64 min-h-screen bg-gray-100 flex flex-col w-full items-center">
                <div className="max-w-5xl mx-auto w-fit">
                    <h1 className="text-3xl font-bold text-gray-800">Адмін-панель</h1>
                    <p className="text-gray-700">Вітаємо, {user?.username}!</p>

                    <Routes>
                        <Route path="/" element={<UsersPage />} />
                        <Route path="categories" element={<CategoryPage />} />
                        <Route path="products" element={<ProductsPage />} />
                        <Route path="orders" element={<AdminOrdersPage />} />
                        <Route path="serviceorders" element={<AdminServiceRequestsPage />} />
                        <Route path="services" element={<AdminServicesPage />} />
                    </Routes>
                </div>
            </main>
        </div>
    );
};

export default AdminPage;
