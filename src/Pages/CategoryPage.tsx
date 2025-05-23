import { useEffect, useState } from "react";
import axios from "axios";
import React from "react";

interface Category {
    id: number;
    name: string;
    description: string;
    imageUrl: string;
}

const CategoriesPage = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [categoryData, setCategoryData] = useState<Category>({ id: 0, name: "", description: "", imageUrl: "" });

    useEffect(() => {
        document.body.style.overflowX = "hidden";
        return () => {
            document.body.style.overflowX = "auto";
        };
    }, []);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get<Category[]>("https://mkt-uzhhorod-f075ee5ee8b4.herokuapp.com/categories");
                setCategories(response.data);
            } catch (error) {
                alert("Помилка завантаження категорій");
                console.error("Error fetching categories", error);
            }
        };

        fetchCategories();
    }, []);

    const deleteCategory = async (categoryId: number, name: string) => {
        if (!window.confirm(`Ви впевнені, що хочете видалити категорію "${name}"?`)) return;
        try {
            const token = localStorage.getItem("jwt");
            await axios.delete(`https://mkt-uzhhorod-f075ee5ee8b4.herokuapp.com/categories/${categoryId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setCategories(categories.filter(category => category.id !== categoryId));
            alert("Категорію успішно видалено");
        } catch (error) {
            alert("Помилка при видаленні категорії");
            console.error("Error deleting category", error);
        }
    };

    const saveCategory = async () => {
        try {
            const token = localStorage.getItem("jwt");
            if (!token) {
                alert("Відсутній токен авторизації");
                return;
            }

            if (categoryData.id) {
                const response = await axios.put(`https://mkt-uzhhorod-f075ee5ee8b4.herokuapp.com/categories/${categoryData.id}`, categoryData, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setCategories(categories.map(category => category.id === categoryData.id ? response.data : category));
                alert("Категорію успішно оновлено");
            } else {
                const response = await axios.post("https://mkt-uzhhorod-f075ee5ee8b4.herokuapp.com/categories", {
                    name: categoryData.name,
                    description: categoryData.description,
                    imageUrl: categoryData.imageUrl
                }, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setCategories([...categories, response.data]);
                alert("Категорію успішно створено");
            }

            setShowModal(false);
        } catch (error) {
            alert("Помилка при збереженні категорії");
            console.error("Error saving category", error);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="mt-6 bg-white p-6 rounded-lg shadow-md max-w-6xl w-full mx-auto">
                <h2 className="text-xl font-semibold text-gray-800">Список категорій</h2>
                <div className="overflow-hidden">
                    <table className="w-full border border-gray-300 rounded-lg overflow-hidden shadow-md">
                        <thead>
                            <tr className="bg-gray-700 text-white">
                                <th className="p-2 text-left">ID</th>
                                <th className="p-2 text-left">Назва</th>
                                <th className="p-2 text-left">Опис</th>
                                <th className="p-2 text-left">URL зображення</th>
                                <th className="p-2 text-center">Дії</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories.map(category => (
                                <tr key={category.id} className="border-b bg-gray-100">
                                    <td className="p-3 text-gray-900 font-bold">{category.id}</td>
                                    <td className="p-3 text-gray-800">{category.name}</td>
                                    <td className="p-3 text-gray-700">{category.description}</td>
                                    <td className="p-3 text-gray-700 truncate max-w-[200px] overflow-hidden">{category.imageUrl}</td>
                                    <td className="p-3 text-center">
                                        <div className="flex flex-col items-center gap-2">
                                            <button
                                                onClick={() => {
                                                    setCategoryData(category);
                                                    setShowModal(true);
                                                }}
                                                className="bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition w-full"
                                            >
                                                Змінити
                                            </button>
                                            <button
                                                onClick={() => deleteCategory(category.id, category.name)}
                                                className="bg-red-600 text-white font-semibold py-2 rounded-lg hover:bg-red-700 transition w-full"
                                            >
                                                Видалити
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <button
                    onClick={() => {
                        setCategoryData({ id: 0, name: "", description: "", imageUrl: "" });
                        setShowModal(true);
                    }}
                    className="bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition w-full mt-4 text-lg"
                >
                    Додати категорію
                </button>
            </div>

            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-xl font-bold mb-4 text-center text-black">
                            {categoryData.id ? "Змінити категорію" : "Додати категорію"}
                        </h2>
                        <input
                            type="text"
                            placeholder="Назва категорії"
                            value={categoryData.name}
                            onChange={(e) => setCategoryData({ ...categoryData, name: e.target.value })}
                            className="w-full p-2 border rounded mb-2 bg-gray-100 text-black"
                        />
                        <input
                            type="text"
                            placeholder="Опис категорії"
                            value={categoryData.description}
                            onChange={(e) => setCategoryData({ ...categoryData, description: e.target.value })}
                            className="w-full p-2 border rounded mb-2 bg-gray-100 text-black"
                        />
                        <input
                            type="text"
                            placeholder="URL зображення"
                            value={categoryData.imageUrl}
                            onChange={(e) => setCategoryData({ ...categoryData, imageUrl: e.target.value })}
                            className="w-full p-2 border rounded mb-2 bg-gray-100 text-black"
                        />
                        <button
                            onClick={saveCategory}
                            className="bg-blue-600 text-white px-4 py-2 rounded w-full mb-2 hover:bg-blue-700 transition"
                        >
                            {categoryData.id ? "Зберегти зміни" : "Зберегти"}
                        </button>
                        <button
                            onClick={() => setShowModal(false)}
                            className="bg-gray-500 text-white px-4 py-2 rounded w-full hover:bg-gray-600 transition"
                        >
                            Скасувати
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CategoriesPage;
