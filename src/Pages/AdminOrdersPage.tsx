import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

interface Product {
    id: number;
    name: string;
    price: number;
    quantity: number;
}

interface Order {
    id: number;
    description: string;
    status: string;
    totalAmount: number;
    totalItemsAmount: number;
    deliveryMethod: "PICKUP" | "DELIVERY";
    deliveryAddress?: string;
    user: {
        id: number;
        name: string;
        email: string;
    };
    items: {
        product: Product;
        quantity: number;
        price: number;
    }[];
}

const statusOptions: Record<string, { value: string; label: string }[]> = {
    PICKUP: [
        { value: "PENDING", label: "Прийняте в обробку" },
        { value: "PICKUP_READY", label: "Готове до самовивозу" },
        { value: "DELIVERED", label: "Отримано" },
        { value: "CANCELED", label: "Скасовано користувачем" },
    ],
    DELIVERY: [
        { value: "PENDING", label: "Прийняте в обробку" },
        { value: "SHIPPED", label: "Відправлено" },
        { value: "DELIVERED", label: "Доставлено" },
        { value: "CANCELED", label: "Скасовано користувачем" },
    ],
};

const Orders = () => {
    const { isAdmin } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem("jwt");

    const fetchOrders = useCallback(async () => {
        try {
            const res = await axios.get("https://mkt-uzhhorod-f075ee5ee8b4.herokuapp.com/api/orders", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setOrders(res.data || []);
        } catch (err) {
            console.error("Failed to fetch orders", err);
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        if (isAdmin) {
            fetchOrders();
        } else {
            setLoading(false);
        }
    }, [isAdmin, fetchOrders]);

    const updateStatus = async (orderId: number, newStatus: string) => {
        try {
            await axios.put(
                `https://mkt-uzhhorod-f075ee5ee8b4.herokuapp.com/api/orders/update-status/${orderId}`,
                { status: newStatus },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            fetchOrders();
        } catch (err) {
            console.error("Error updating status", err);
        }
    };

    const getUkrainianStatus = (status: string): string => {
        const allStatuses = [...statusOptions.PICKUP, ...statusOptions.DELIVERY];
        return allStatuses.find((s) => s.value === status)?.label || status;
    };

    const getFullStatusList = (method: "PICKUP" | "DELIVERY") => {
        return statusOptions[method];
    };

    const isStatusDisabled = (currentStatus: string, targetStatus: string, method: "PICKUP" | "DELIVERY") => {
        const statusFlow: Record<"PICKUP" | "DELIVERY", string[]> = {
            PICKUP: ["PENDING", "PICKUP_READY", "DELIVERED"],
            DELIVERY: ["PENDING", "SHIPPED", "DELIVERED"],
        };

        const flow = statusFlow[method];
        const currentIndex = flow.indexOf(currentStatus);
        const targetIndex = flow.indexOf(targetStatus);


        if (targetStatus === "CANCELED") return false;

        return targetIndex <= currentIndex;
    };

    if (!isAdmin) return <div className="text-center mt-10">Доступ лише для адміністратора</div>;

    if (loading) return <div className="text-center mt-10">Завантаження...</div>;

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 w-full text-black overflow-x-hidden">
            <div className="mt-6 bg-white p-6 rounded-lg shadow-md w-full">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Список замовлень</h2>

                <div className="overflow-x-auto">
                    <table className="w-full border border-gray-300 rounded-lg overflow-hidden">
                        <thead>
                            <tr className="bg-gray-700 text-white">
                                <th className="p-3 text-left">ID</th>
                                <th className="p-3 text-left">Користувач</th>
                                <th className="p-3 text-left">Товари</th>
                                <th className="p-3 text-left">Вартість замовлення</th>
                                <th className="p-3 text-left">Метод отримання</th>
                                <th className="p-3 text-left">Статус</th>
                                <th className="p-3 text-center">Оновити статус</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order, i) => (
                                <tr
                                    key={order.id}
                                    className={`border-b ${i % 2 === 0 ? "bg-gray-50" : "bg-white"}`}
                                >
                                    <td className="p-3 font-semibold align-top">{order.id}</td>
                                    <td className="p-3 align-top">
                                        <div>ID: {order.user.id}</div>
                                        <div>{order.user.name}</div>
                                        <div>{order.user.email}</div>
                                    </td>
                                    <td className="p-3 align-top">
                                        <ul>
                                            {order.items.map((item, idx) => (
                                                <li key={idx}>
                                                    {item.product.name} (x{item.quantity}) - {item.product.price} грн
                                                </li>
                                            ))}
                                        </ul>
                                    </td>
                                    <td className="p-3 align-top">
                                        {order.items.reduce((sum, item) => sum + item.price * item.quantity, 0)} грн
                                    </td>
                                    <td className="p-3 align-top">
                                        {order.deliveryMethod === "PICKUP" ? (
                                            <>
                                                <div>Метод отримання: Самовивіз</div>
                                                <div>Пункт самовивозу: {order.deliveryAddress || "Невідомо"}</div>
                                            </>
                                        ) : (
                                            <>
                                                <div>Метод отримання: Доставка</div>
                                                <div>Адреса доставки: {order.deliveryAddress || "Невідомо"}</div>
                                            </>
                                        )}
                                    </td>
                                    <td className="p-3 align-top">{getUkrainianStatus(order.status)}</td>


                                    <td className="p-3 text-center align-top">
                                        {order.status !== "CANCELED" && (
                                            <select
                                                onChange={(e) => updateStatus(order.id, e.target.value)}
                                                value={order.status}
                                                disabled={order.status === "DELIVERED"}
                                                className="min-w-[180px] w-max border border-gray-300 p-2 rounded-md bg-white"
                                            >
                                                {getFullStatusList(order.deliveryMethod)
                                                    .filter((statusOption) => statusOption.value !== "CANCELED")
                                                    .map((statusOption) => (
                                                        <option
                                                            key={statusOption.value}
                                                            value={statusOption.value}
                                                            disabled={isStatusDisabled(order.status, statusOption.value, order.deliveryMethod)}
                                                        >
                                                            {statusOption.label}
                                                        </option>
                                                    ))}
                                            </select>
                                        )}
                                    </td>

                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Orders;
