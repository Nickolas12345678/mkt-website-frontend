import { useAuth } from "../context/AuthContext";
import { Link, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import UsersPage from "./UsersPage";
import CategoryPage from "./CategoryPage";
import ProductsPage from "./ProductsPage";

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
            {/* Бічне меню */}
            <aside className="w-64 bg-gray-900 text-white h-screen fixed top-0 left-0 p-6">
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
                    </ul>
                </nav>
            </aside>

            <main className="flex-1 p-6 pl-64 min-h-screen bg-gray-100 flex flex-col w-full items-center">
                <div className="max-w-5xl mx-auto w-fit">
                    <h1 className="text-3xl font-bold text-gray-800">Адмін-панель</h1>
                    <p className="text-gray-700">Вітаємо, {user?.username}!</p>

                    <Routes>
                        <Route path="/" element={<UsersPage />} />
                        <Route path="categories" element={<CategoryPage />} />
                        <Route path="products" element={<ProductsPage />} />
                    </Routes>
                </div>
            </main>
        </div>
    );
};

export default AdminPage;
