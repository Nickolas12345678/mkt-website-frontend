import { useEffect, useState } from "react";
import axios from "axios";
import Header from '../components/Header';

interface Product {
    name: string;
    imageURL: string;
}

interface OrderItem {
    product: Product;
    quantity: number;
    price: number;
}

interface Order {
    id: number;
    status: string;
    orderDate: string;
    items: OrderItem[];
    totalPrice: number;
    deliveryAddress: string;
    deliveryMethod: string;
}

const OrdersPage = () => {
    const [orders, setOrders] = useState<Order[]>([]);

    const fetchOrders = async () => {
        const jwt = localStorage.getItem("jwt");
        if (!jwt) return;

        try {
            const response = await axios.get("https://mkt-uzhhorod-f075ee5ee8b4.herokuapp.com/api/orders/my", {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
            });
            setOrders(response.data);
        } catch (error) {
            console.error("Не вдалося отримати замовлення:", error);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const getUkrStatus = (status: string, deliveryMethod: string) => {
        switch (status) {
            case "PENDING":
                return "Прийнято в обробку";
            case "SHIPPED":
                return "Відправлено";
            case "DELIVERED":
                return deliveryMethod === "PICKUP" ? "Отримано" : "Доставлено";
            case "CANCELED":
                return "Скасовано";
            case "PICKUP_READY":
                return "Готове до самовивозу";
            default:
                return "Невідомий статус";
        }
    };


    const cancelOrder = async (orderId: number) => {
        const confirmCancel = window.confirm("Ви дійсно хочете скасувати це замовлення?");
        if (!confirmCancel) return;

        const jwt = localStorage.getItem("jwt");
        if (!jwt) return;

        try {
            await axios.delete(`https://mkt-uzhhorod-f075ee5ee8b4.herokuapp.com/api/orders/cancel/${orderId}`, {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
            });
            await fetchOrders();
        } catch (error) {
            console.error("Не вдалося скасувати замовлення:", error);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString() || "Невідома дата";
    };

    const calculateTotalPrice = (items: OrderItem[]) => {
        return items.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    const getStatusColor = (status: string) => {
        return status === "CANCELED" ? "text-red-600" : "text-green-700";
    };

    const getPickupPoint = (address: string) => {
        if (address.includes("Собранецька")) {
            return "Пункт самовивозу: Ужгород, вул.Собранецька, 14";
        } else if (address.includes("Героїв 101-ї бригади")) {
            return "Пункт самовивозу: Ужгород, вул.Героїв 101-ї бригади, 9";
        } else {
            return "";
        }
    };

    return (
        <>
            <Header isOrdersPage={true} />
            <div className="p-8">
                <h2 className="text-2xl font-bold mb-6 text-black">Мої замовлення</h2>
                {orders.length === 0 ? (
                    <p className="text-black">Замовлень ще немає</p>
                ) : (
                    <ul className="space-y-6">
                        {orders.map(order => (
                            <li key={order.id} className="border p-4 rounded-md shadow-sm bg-white">
                                <div className="flex justify-between text-black mb-2">
                                    <div className="font-medium">Замовлення #{order.id}</div>
                                    <div className={`font-semibold ${getStatusColor(order.status)}`}>
                                        {getUkrStatus(order.status, order.deliveryMethod)}
                                    </div>
                                </div>
                                <div className="text-sm text-black mb-2">
                                    Дата: {formatDate(order.orderDate)}
                                </div>
                                <div className="text-sm text-black mb-2">
                                    Метод отримання: {order.deliveryMethod === "PICKUP" ? "Самовивіз" : "Доставка"}
                                </div>
                                <div className="text-sm text-black mb-2">
                                    {order.deliveryMethod === "PICKUP"
                                        ? getPickupPoint(order.deliveryAddress)
                                        : `Адреса доставки: ${order.deliveryAddress}`}
                                </div>
                                <ul className="space-y-2 mb-2">
                                    {order.items.map((item, index) => (
                                        <li key={index} className="flex items-center text-sm text-black">
                                            <img
                                                src={item.product.imageURL || "/default-image.png"}
                                                alt={item.product.name}
                                                className="w-12 h-12 object-contain mr-4"
                                            />
                                            <span className="font-semibold">{item.product.name}</span>
                                            <span className="ml-2">
                                                — {item.quantity} x {item.price} грн
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                                <div className="text-right font-bold text-black mb-2">
                                    Сума: {calculateTotalPrice(order.items).toFixed(2)} грн
                                </div>

                                {order.status !== "CANCELED" && order.status !== "DELIVERED" && (
                                    <button
                                        onClick={() => cancelOrder(order.id)}
                                        className="w-full bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition"
                                    >
                                        Скасувати замовлення
                                    </button>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </>
    );
};

export default OrdersPage;
