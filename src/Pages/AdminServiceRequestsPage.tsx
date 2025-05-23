import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

interface ServiceRequest {
    id: number;
    description: string;
    status: string;
    requestDate: string;
    user: {
        id: number;
        name: string;
        email: string;
    };
    repairService: {
        id: number;
        title: string;
    };
}

const statusOrder = ["PENDING", "ACCEPTED", "REPAIRED", "COMPLETED"];



const statusOptions = [
    { value: "PENDING", label: "Прийнято в обробку" },
    { value: "ACCEPTED", label: "Прийнято на ремонт" },
    { value: "REPAIRED", label: "Відремонтовано" },
    { value: "COMPLETED", label: "Замовлення отримано" },
    { value: "CANCELED", label: "Скасовано" },
];

const AdminServiceRequestsPage = () => {
    const { isAdmin } = useAuth();
    const [requests, setRequests] = useState<ServiceRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem("jwt");

    const fetchRequests = useCallback(async () => {
        try {
            const res = await axios.get("https://mkt-uzhhorod-f075ee5ee8b4.herokuapp.com/api/service-requests", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setRequests(res.data);
        } catch (err) {
            console.error("Failed to fetch service requests", err);
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        if (isAdmin) {
            fetchRequests();
        } else {
            setLoading(false);
        }
    }, [isAdmin, fetchRequests]);

    const updateStatus = async (id: number, newStatus: string) => {
        try {
            await axios.put(
                `https://mkt-uzhhorod-f075ee5ee8b4.herokuapp.com/api/service-requests/${id}/status?status=${newStatus}`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchRequests();
        } catch (err) {
            console.error("Error updating status", err);
        }
    };

    if (!isAdmin) return <div className="text-center mt-10">Доступ лише для адміністратора</div>;
    if (loading) return <div className="text-center mt-10">Завантаження...</div>;

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 w-full text-black overflow-x-hidden">
            <div className="mt-6 bg-white p-6 rounded-lg shadow-md w-full">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Заявки на ремонт</h2>
                <div className="overflow-x-auto">
                    <table className="w-full border border-gray-300 rounded-lg overflow-hidden">
                        <thead>
                            <tr className="bg-gray-700 text-white">
                                <th className="p-3 text-left">ID</th>
                                <th className="p-3 text-left">Користувач</th>
                                <th className="p-3 text-left">Послуга</th>
                                <th className="p-3 text-left">Опис проблеми</th>
                                <th className="p-3 text-left">Дата</th>
                                <th className="p-3 text-left">Статус</th>
                                <th className="p-3 text-center">Оновити</th>
                            </tr>
                        </thead>
                        <tbody>
                            {requests.map((req, i) => {
                                const isCanceled = req.status === "CANCELED";
                                const currentStatusIndex = statusOrder.indexOf(req.status);

                                return (
                                    <tr
                                        key={req.id}
                                        className={`border-b ${i % 2 === 0 ? "bg-gray-50" : "bg-white"}`}
                                    >
                                        <td className="p-3 font-semibold">{req.id}</td>
                                        <td className="p-3">
                                            <div>ID: {req.user.id}</div>
                                            <div>{req.user.name}</div>
                                            <div>{req.user.email}</div>
                                        </td>
                                        <td className="p-3">{req.repairService?.title || "-"}</td>
                                        <td className="p-3">{req.description}</td>
                                        <td className="p-3">{new Date(req.requestDate).toLocaleString()}</td>
                                        <td className="p-3">
                                            {statusOptions.find(s => s.value === req.status)?.label || req.status}
                                        </td>
                                        <td className="p-3 text-center">
                                            {!isCanceled ? (
                                                <select
                                                    onChange={(e) => updateStatus(req.id, e.target.value)}
                                                    value={req.status}
                                                    className="min-w-[200px] max-w-[240px] border border-gray-300 p-2 rounded-md bg-white text-sm truncate"
                                                >
                                                    {statusOptions
                                                        .filter((status) => status.value !== "CANCELED")
                                                        .map((status) => {
                                                            const statusIndex = statusOrder.indexOf(status.value);
                                                            const isDisabled = statusIndex < currentStatusIndex;

                                                            return (
                                                                <option
                                                                    key={status.value}
                                                                    value={status.value}
                                                                    disabled={isDisabled}
                                                                    className={isDisabled ? "text-gray-400" : ""}
                                                                >
                                                                    {status.label}
                                                                </option>
                                                            );
                                                        })}
                                                </select>
                                            ) : (
                                                <span className="text-gray-500 italic">Скасовано</span>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminServiceRequestsPage;
