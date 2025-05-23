import { useEffect, useState } from "react";
import axios from "axios";
import Header from "../components/Header";

interface ServiceRequest {
    id: number;
    requestDate: string;
    description: string;
    status: string;
    repairService: {
        title: string;
        price: number;
    };
}

const MyRepairRequestsPage = () => {
    const [requests, setRequests] = useState<ServiceRequest[]>([]);

    const fetchRequests = async () => {
        const jwt = localStorage.getItem("jwt");
        if (!jwt) return;

        try {
            const response = await axios.get("https://mkt-uzhhorod-f075ee5ee8b4.herokuapp.com/api/service-requests/me", {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
            });
            setRequests(response.data);
        } catch (error) {
            console.error("Не вдалося отримати заявки:", error);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const getUkrStatus = (status: string) => {
        switch (status) {
            case "PENDING":
                return "Прийнято в обробку";
            case "ACCEPTED":
                return "Прийнято на ремонт";
            case "REPAIRED":
                return "Відремонтовано";
            case "COMPLETED":
                return "Замовлення отримано";
            case "CANCELED":
                return "Скасовано";
            default:
                return "Невідомий статус";
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "CANCELED":
                return "text-red-600";
            case "COMPLETED":
            case "REPAIRED":
                return "text-green-700";
            case "PENDING":
            case "ACCEPTED":
                return "text-yellow-600";
            default:
                return "text-gray-700";
        }
    };

    const cancelRequest = async (id: number) => {
        const confirmCancel = window.confirm("Ви дійсно хочете скасувати цю заявку?");
        if (!confirmCancel) return;

        const jwt = localStorage.getItem("jwt");
        if (!jwt) return;

        try {
            await axios.delete(`https://mkt-uzhhorod-f075ee5ee8b4.herokuapp.com/api/service-requests/${id}/cancel`, {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
            });
            await fetchRequests();
        } catch (error) {
            console.error("Не вдалося скасувати заявку:", error);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString() || "Невідома дата";
    };

    return (
        <>
            <Header isOrdersPage={true} />
            <div className="p-8">
                <h2 className="text-2xl font-bold mb-6 text-black">Мої заявки на ремонт</h2>
                {requests.length === 0 ? (
                    <p className="text-black">Заявок ще немає</p>
                ) : (
                    <ul className="space-y-6">
                        {requests.map((req) => (
                            <li key={req.id} className="border p-4 rounded-md shadow-sm bg-white">
                                <div className="flex justify-between text-black mb-2">
                                    <div className="font-medium">Заявка #{req.id}</div>
                                    <div className={`font-semibold ${getStatusColor(req.status)}`}>
                                        {getUkrStatus(req.status)}
                                    </div>
                                </div>
                                <div className="text-sm text-black mb-2">
                                    Дата: {formatDate(req.requestDate)}
                                </div>
                                <div className="text-sm text-black mb-2">
                                    Послуга: {req.repairService.title} — {req.repairService.price} грн
                                </div>
                                <div className="text-sm text-black mb-4">
                                    Опис проблеми: {req.description}
                                </div>

                                {req.status === "PENDING" && (
                                    <button
                                        onClick={() => cancelRequest(req.id)}
                                        className="w-full bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition"
                                    >
                                        Скасувати заявку
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

export default MyRepairRequestsPage;
