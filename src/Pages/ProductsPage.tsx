import { useEffect, useState } from "react";

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    quantity: number;
    imageURL: string;
    category: {
        id: number;
        name: string;
    };
}

interface Category {
    id: number;
    name: string;
}

const ProductsPage = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [form, setForm] = useState({
        name: "",
        description: "",
        price: 0,
        quantity: 0,
        imageURL: "",
        categoryId: 1,
    });
    const [editId, setEditId] = useState<number | null>(null);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);

    const loadProducts = async () => {
        const res = await fetch(`http://localhost:8080/products?page=${page}&size=13&sortBy=id`);
        const data = await res.json();
        setProducts(data.content);
        setTotalPages(data.totalPages);
    };

    const loadCategories = async () => {
        const res = await fetch("http://localhost:8080/categories");
        const data = await res.json();
        setCategories(data);
    };

    useEffect(() => {
        loadProducts();
        loadCategories();
    }, [page]);

    const handleSubmit = async () => {
        try {
            const url = editId
                ? `http://localhost:8080/products/${editId}`
                : `http://localhost:8080/products`;

            const method = editId ? "PUT" : "POST";

            await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            setModalOpen(false);
            setEditId(null);
            resetForm();
            loadProducts();
            alert(editId ? "Товар успішно оновлено!" : "Товар успішно додано!");
        }
        catch {
            alert("Помилка при збереженні товару");
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm("Ви дійсно хочете видалити цей товар?")) {
            try {
                await fetch(`http://localhost:8080/products/${id}`, { method: "DELETE" });
                loadProducts();
                alert("Товар успішно видалено!");
            }
            catch {
                alert("Помилка при видаленні товару");
            }
        }
    };

    const openEditModal = (product: Product) => {
        setEditId(product.id);
        setForm({
            name: product.name,
            description: product.description,
            price: product.price,
            quantity: product.quantity,
            imageURL: product.imageURL,
            categoryId: product.category.id,
        });
        setModalOpen(true);
    };

    const resetForm = () => {
        setForm({
            name: "",
            description: "",
            price: 0,
            quantity: 0,
            imageURL: "",
            categoryId: 1,
        });
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 w-full text-black">
            <div className="mt-6 bg-white p-6 rounded-lg shadow-md w-full">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Список товарів</h2>

                <div className="overflow-x-hidden">
                    <table className="w-full border border-gray-300 rounded-lg overflow-hidden">
                        <thead>
                            <tr className="bg-gray-700 text-white">
                                <th className="p-3 text-left">ID</th>
                                <th className="p-3 text-left">Фото</th>
                                <th className="p-3 text-left">Назва</th>
                                <th className="p-3 text-left">Опис</th>
                                <th className="p-3 text-left">Ціна</th>
                                <th className="p-3 text-left">Кількість</th>
                                <th className="p-3 text-left">Категорія</th>
                                <th className="p-3 text-center">Дії</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product, i) => (
                                <tr key={product.id} className={`border-b ${i % 2 === 0 ? "bg-gray-50" : "bg-white"}`}>
                                    <td className="p-3 font-semibold">{product.id}</td>
                                    <td className="p-3">
                                        <img
                                            src={product.imageURL}
                                            alt={product.name}
                                            className="w-24 h-24 object-contain border rounded"
                                        />
                                    </td>
                                    <td className="p-3">{product.name}</td>
                                    <td className="p-3">{product.description}</td>
                                    <td className="p-3">{product.price}</td>
                                    <td className="p-3">{product.quantity}</td>
                                    <td className="p-3">{product.category.name}</td>
                                    <td className="p-3 text-center">
                                        <button
                                            onClick={() => openEditModal(product)}
                                            className="bg-yellow-500 text-white px-4 py-2 rounded w-full mb-2"
                                        >
                                            Редагувати
                                        </button>
                                        <button
                                            onClick={() => handleDelete(product.id)}
                                            className="bg-red-500 text-white px-4 py-2 rounded w-full"
                                        >
                                            Видалити
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="flex justify-center mt-6 gap-2">
                    {[...Array(totalPages)].map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setPage(i)}
                            className={`px-3 py-1 rounded ${page === i ? "bg-blue-600 text-white" : "bg-gray-200"}`}
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>

                <button
                    onClick={() => {
                        setEditId(null);
                        resetForm();
                        setModalOpen(true);
                    }}
                    className="bg-green-600 text-white px-4 py-3 rounded hover:bg-green-700 mt-6 w-full text-lg"
                >
                    Додати товар
                </button>
            </div>

            {modalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-xl font-bold mb-4 text-center">{
                            editId ? "Редагувати товар" : "Додати товар"
                        }</h2>
                        <input
                            className="w-full p-2 border rounded mb-2 bg-white text-black"
                            placeholder="Назва"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                        />
                        <textarea
                            className="w-full p-2 border rounded mb-2 bg-white text-black"
                            placeholder="Опис"
                            value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                        />
                        <input
                            type="number"
                            className="w-full p-2 border rounded mb-2 bg-white text-black"
                            placeholder="Ціна"
                            value={form.price}
                            onChange={(e) => setForm({ ...form, price: e.target.value ? +e.target.value : 0 })} // Перевірка на порожнє значення
                        />

                        <input
                            type="number"
                            className="w-full p-2 border rounded mb-2 bg-white text-black"
                            placeholder="Кількість"
                            value={form.quantity}
                            onChange={(e) => setForm({ ...form, quantity: e.target.value ? +e.target.value : 0 })} // Перевірка на порожнє значення
                        />
                        <input
                            className="w-full p-2 border rounded mb-2 bg-white text-black"
                            placeholder="URL зображення"
                            value={form.imageURL}
                            onChange={(e) => setForm({ ...form, imageURL: e.target.value })}
                        />
                        <select
                            className="w-full p-2 border rounded mb-4 bg-white text-black"
                            value={form.categoryId}
                            onChange={(e) => setForm({ ...form, categoryId: +e.target.value })}
                        >
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                        <div className="flex justify-end gap-2">
                            <button onClick={() => setModalOpen(false)} className="px-4 py-2 bg-gray-300 rounded">
                                Скасувати
                            </button>
                            <button onClick={handleSubmit} className="px-4 py-2 bg-green-600 text-white rounded">
                                {editId ? "Зберегти" : "Додати"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductsPage;
