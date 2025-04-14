

import { useState, useEffect } from "react";
import axios from "axios";

interface CartItem {
    productId: number;
    productName: string;
    quantity: number;
    productImageUrl: string;
}

interface Cart {
    items: CartItem[];
}

const CartPage = () => {
    const [cart, setCart] = useState<Cart | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [newProduct, setNewProduct] = useState({ productId: 0, quantity: 1 });

    useEffect(() => {
        const fetchCart = async () => {
            try {
                const token = localStorage.getItem("jwt");
                if (!token) {
                    alert("Будь ласка, увійдіть до системи!");
                    return;
                }
                const response = await axios.get<Cart>("http://localhost:8080/api/cart", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setCart(response.data);
            } catch (error) {
                console.error("Error fetching cart", error);
                alert("Не вдалося завантажити кошик");
            }
        };

        fetchCart();
    }, []);

    const removeFromCart = async (productId: number) => {
        try {
            const token = localStorage.getItem("jwt");
            if (!token) return;
            await axios.delete(`http://localhost:8080/api/cart/${productId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setCart(prevCart => ({
                items: prevCart?.items.filter(item => item.productId !== productId) || [],
            }));
            alert("Товар успішно видалено з кошика");
        } catch (error) {
            alert("Помилка при видаленні товару з кошика");
            console.error("Error deleting product from cart", error);
        }
    };

    const modifyQuantity = async (productId: number, action: "increase" | "decrease") => {
        try {
            const token = localStorage.getItem("jwt");
            if (!token) return;

            await axios.post(
                `http://localhost:8080/api/cart/${action}/${productId}`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );


            const response = await axios.get<Cart>("http://localhost:8080/api/cart", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setCart(response.data);
            alert("Кількість товару оновлено");
        } catch (error) {
            alert("Помилка при оновленні кількості товару");
            console.error("Error updating product quantity", error);
        }
    };


    const addToCart = async () => {
        try {
            const token = localStorage.getItem("jwt");
            if (!token) return;

            await axios.post(
                "http://localhost:8080/api/cart/add",
                { productId: newProduct.productId, quantity: newProduct.quantity },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const response = await axios.get<Cart>("http://localhost:8080/api/cart", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setCart(response.data);
            setShowModal(false);
            alert("Товар успішно додано до кошика");
        } catch (error) {
            alert("Помилка при додаванні товару до кошика");
            console.error("Error adding product to cart", error);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="mt-6 bg-white p-6 rounded-lg shadow-md w-full md:w-4/5 lg:w-2/3 xl:w-1/2">
                <h2 className="text-xl font-semibold text-black mb-4">Кошик</h2>


                <table className="w-full mt-4 border border-gray-300 rounded-lg overflow-hidden">
                    <thead>
                        <tr className="bg-gray-700 text-white">
                            <th className="p-3 text-left">ID товару</th>
                            <th className="p-3 text-left">Назва товару</th>
                            <th className="p-3 text-left">Кількість</th>
                            <th className="p-3 text-left">Зображення</th>
                            <th className="p-3 text-center">Дії</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cart?.items.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="text-center p-4 text-gray-600">Кошик порожній</td>
                            </tr>
                        ) : (
                            cart?.items.map((item, index) => (
                                <tr key={item.productId} className={`border-b ${index % 2 === 0 ? "bg-gray-50" : "bg-white"}`}>
                                    <td className="p-3 text-black font-bold">{item.productId}</td>
                                    <td className="p-3 text-black">{item.productName}</td>
                                    <td className="p-3 text-black">{item.quantity}</td>
                                    <td className="p-3 text-black">
                                        <img src={item.productImageUrl} alt={item.productName} className="w-16 h-16 object-cover" />
                                    </td>
                                    <td className="p-3 text-center">
                                        <button
                                            onClick={() => modifyQuantity(item.productId, "increase")}
                                            className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition w-full mb-2"
                                        >
                                            Збільшити
                                        </button>
                                        <button
                                            onClick={() => modifyQuantity(item.productId, "decrease")}
                                            className="bg-yellow-500 text-white px-6 py-2 rounded-lg hover:bg-yellow-600 transition w-full mb-2"
                                        >
                                            Зменшити
                                        </button>
                                        <button
                                            onClick={() => removeFromCart(item.productId)}
                                            className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition w-full"
                                        >
                                            Видалити
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>


                <button
                    onClick={() => setShowModal(true)}
                    className="bg-green-500 text-white px-4 py-3 rounded-lg hover:bg-green-600 transition w-full mt-4 text-lg"
                >
                    Додати товар
                </button>
            </div>


            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-xl font-bold mb-4 text-center text-black">Додати товар до кошика</h2>
                        <input
                            type="number"
                            placeholder="ID товару"
                            className="w-full p-2 border rounded mb-2 bg-white text-black"
                            onChange={(e) => setNewProduct({ ...newProduct, productId: +e.target.value })}
                        />
                        <input
                            type="number"
                            placeholder="Кількість"
                            className="w-full p-2 border rounded mb-2 bg-white text-black"
                            onChange={(e) => setNewProduct({ ...newProduct, quantity: +e.target.value })}
                        />
                        <button
                            onClick={addToCart}
                            className="bg-blue-500 text-white px-4 py-2 rounded w-full mb-2"
                        >
                            Зберегти
                        </button>
                        <button
                            onClick={() => setShowModal(false)}
                            className="bg-gray-400 text-white px-4 py-2 rounded w-full"
                        >
                            Скасувати
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CartPage;
