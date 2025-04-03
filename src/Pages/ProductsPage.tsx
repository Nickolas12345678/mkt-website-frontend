import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Category {
    id: number;
    name: string;
}

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    quantity: number;
    imageURL: string;
    category: Category;
}

const ProductsPage: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [newProduct, setNewProduct] = useState<Product>({
        id: 0,
        name: '',
        description: '',
        price: 0,
        quantity: 0,
        imageURL: '',
        category: { id: 0, name: '' },
    });
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const token = localStorage.getItem("jwt");
                const response = await axios.get('http://localhost:8080/products', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setProducts(response.data.content);
            } catch {
                setError('Failed to load products');
            } finally {
                setLoading(false);
            }
        };

        const fetchCategories = async () => {
            try {
                const token = localStorage.getItem("jwt");
                const response = await axios.get('http://localhost:8080/categories', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setCategories(response.data);
            } catch {
                setError('Failed to load categories');
            }
        };

        fetchProducts();
        fetchCategories();
    }, []);

    const handleCreateProduct = async () => {
        try {
            const token = localStorage.getItem("jwt");
            const response = await axios.post('http://localhost:8080/products', newProduct, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setProducts([...products, response.data]);
            setNewProduct({
                id: 0,
                name: '',
                description: '',
                price: 0,
                quantity: 0,
                imageURL: '',
                category: { id: 0, name: '' },
            });
        } catch {
            setError('Failed to create product');
        }
    };

    const handleUpdateProduct = async (id: number) => {
        if (!editingProduct || !id) {
            alert("Невірний ID продукту");
            return;
        }

        const updatedProduct = {
            ...editingProduct,
            categoryId: editingProduct.category.id,
        };

        try {
            const token = localStorage.getItem("jwt");
            const response = await axios.put(
                `http://localhost:8080/products/${id}`,
                updatedProduct,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            setProducts(
                products.map((product) =>
                    product.id === id ? { ...product, ...response.data } : product
                )
            );
            setEditingProduct(null);
        } catch {
            setError('Не вдалося оновити продукт');
        }
    };






    const handleDeleteProduct = async (id: number) => {
        try {
            const token = localStorage.getItem("jwt");
            await axios.delete(`http://localhost:8080/products/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setProducts(products.filter((product) => product.id !== id));
        } catch {
            setError('Failed to delete product');
        }
    };

    const handleEditProduct = (product: Product) => {
        setEditingProduct(product);
    };


    const handleCancelEdit = () => {
        setEditingProduct(null);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="mt-6 bg-white p-6 rounded-lg shadow-md w-full">
                <h2 className="text-xl font-semibold text-gray-800">Список товарів</h2>
                <table className="w-full mt-4 border border-gray-300 rounded-lg overflow-hidden">
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
                        {products.map((product, index) => (
                            <tr
                                key={product.id}
                                className={`border-b ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
                            >
                                <td className="p-3 text-gray-900 font-bold">{product.id}</td>
                                <td className="p-3">
                                    <img
                                        src={product.imageURL}
                                        alt={product.name}
                                        className="w-20 h-20 object-contain"
                                    />
                                </td>
                                <td className="p-3 text-gray-800">{product.name}</td>
                                <td className="p-3 text-gray-700">{product.description}</td>
                                <td className="p-3 text-gray-600">{product.price}</td>
                                <td className="p-3 text-gray-600">{product.quantity}</td>
                                <td className="p-3 text-gray-600">{product.category.name}</td>
                                <td className="p-3 text-center">
                                    <button
                                        onClick={() => handleEditProduct(product)}
                                        className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition w-full mb-2"
                                    >
                                        Редагувати
                                    </button>
                                    <button
                                        onClick={() => handleDeleteProduct(product.id)}
                                        className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition w-full"
                                    >
                                        Видалити
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="mt-4">
                    <button
                        onClick={() => setEditingProduct({ id: 0, name: '', description: '', price: 0, quantity: 0, imageURL: '', category: { id: 0, name: '' } })}
                        className="bg-green-500 text-white px-4 py-3 rounded-lg hover:bg-green-600 transition w-full text-lg"
                    >
                        Додати товар
                    </button>
                </div>

                {editingProduct && (
                    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                            <h2 className="text-xl font-bold mb-4 text-center text-black">
                                {editingProduct.id === 0 ? 'Додати товар' : 'Редагувати товар'}
                            </h2>
                            <input
                                type="text"
                                placeholder="Назва"
                                className="w-full p-2 border rounded mb-2 bg-white text-black"
                                value={editingProduct.name}
                                onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                            />
                            <textarea
                                placeholder="Опис"
                                className="w-full p-2 border rounded mb-2 bg-white text-black"
                                value={editingProduct.description}
                                onChange={(e) =>
                                    setEditingProduct({ ...editingProduct, description: e.target.value })
                                }
                            />
                            <input
                                type="number"
                                placeholder="Ціна"
                                className="w-full p-2 border rounded mb-2 bg-white text-black"
                                value={editingProduct.price}
                                onChange={(e) =>
                                    setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) })
                                }
                            />
                            <input
                                type="number"
                                placeholder="Кількість"
                                className="w-full p-2 border rounded mb-2 bg-white text-black"
                                value={editingProduct.quantity}
                                onChange={(e) =>
                                    setEditingProduct({ ...editingProduct, quantity: parseInt(e.target.value) })
                                }
                            />
                            <input
                                type="text"
                                placeholder="URL зображення"
                                className="w-full p-2 border rounded mb-2 bg-white text-black"
                                value={editingProduct.imageURL}
                                onChange={(e) =>
                                    setEditingProduct({ ...editingProduct, imageURL: e.target.value })
                                }
                            />
                            <select
                                value={editingProduct.category.id}
                                onChange={(e) =>
                                    setEditingProduct({
                                        ...editingProduct,
                                        category: categories.find(
                                            (cat) => cat.id === Number(e.target.value)
                                        ) || { id: 0, name: '' },
                                    })
                                }
                                className="w-full p-2 border rounded mb-2 bg-white text-black"
                            >
                                <option value="">Оберіть категорію</option>
                                {categories.map((category) => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>

                            <button
                                onClick={() => (editingProduct.id === 0 ? handleCreateProduct() : handleUpdateProduct(editingProduct.id))}
                                className="bg-blue-500 text-white px-4 py-2 rounded w-full mb-2"
                            >
                                Зберегти
                            </button>
                            <button
                                onClick={handleCancelEdit}
                                className="bg-gray-400 text-white px-4 py-2 rounded w-full"
                            >
                                Скасувати
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductsPage;
