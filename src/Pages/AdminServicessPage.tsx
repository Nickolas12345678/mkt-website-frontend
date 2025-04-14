// import { useEffect, useState } from "react";
// import axios from "axios";

// interface RepairService {
//     id?: number;
//     title: string;
//     description: string;
//     price: number;
// }

// const AdminServicesPage = () => {
//     const [services, setServices] = useState<RepairService[]>([]);
//     const [showModal, setShowModal] = useState(false);
//     const [serviceData, setServiceData] = useState<RepairService>({ title: "", description: "", price: 0 });

//     useEffect(() => {
//         fetchServices();
//     }, []);

//     const fetchServices = async () => {
//         try {
//             const response = await axios.get("http://localhost:8080/api/services");
//             setServices(response.data);
//         } catch (error) {
//             alert("Помилка завантаження сервісів");
//             console.error("Error fetching services", error);
//         }
//     };

//     const saveService = async () => {
//         const token = localStorage.getItem("jwt");
//         if (!token) return alert("Токен не знайдено");

//         try {
//             if (serviceData.id) {
//                 const response = await axios.put(
//                     `http://localhost:8080/api/services/${serviceData.id}`,
//                     serviceData,
//                     { headers: { Authorization: `Bearer ${token}` } }
//                 );
//                 setServices(services.map(s => s.id === serviceData.id ? response.data : s));
//                 alert("Послугу оновлено");
//             } else {
//                 const response = await axios.post(
//                     "http://localhost:8080/api/services",
//                     {
//                         title: serviceData.title,
//                         description: serviceData.description,
//                         price: serviceData.price,
//                     },
//                     { headers: { Authorization: `Bearer ${token}` } }
//                 );
//                 setServices([...services, response.data]);
//                 alert("Послугу створено");
//             }
//             setShowModal(false);
//         } catch (error) {
//             alert("Помилка збереження послуги");
//             console.error("Error saving service", error);
//         }
//     };

//     const deleteService = async (id: number, title: string) => {
//         const confirmed = window.confirm(`Ви дійсно хочете видалити послугу "${title}"?`);
//         if (!confirmed) return;

//         try {
//             const token = localStorage.getItem("jwt");
//             await axios.delete(`http://localhost:8080/api/services/${id}`, {
//                 headers: { Authorization: `Bearer ${token}` },
//             });
//             setServices(services.filter(s => s.id !== id));
//             alert("Послугу видалено");
//         } catch (error) {
//             alert("Помилка видалення послуги");
//             console.error("Error deleting service", error);
//         }
//     };

//     return (
//         <div className="flex justify-center items-center min-h-screen bg-gray-100">
//             <div className="mt-10 bg-white p-6 rounded-lg shadow-lg w-full max-w-7xl">
//                 <h2 className="text-2xl font-bold text-gray-800 mb-4">Список послуг сервісного центру</h2>
//                 <div className="overflow-x-auto rounded-lg">
//                     <table className="min-w-full bg-white border border-gray-300">
//                         <thead>
//                             <tr className="bg-gray-800 text-white">
//                                 <th className="px-4 py-3 text-left">ID</th>
//                                 <th className="px-4 py-3 text-left">Назва</th>
//                                 <th className="px-4 py-3 text-left">Опис</th>
//                                 <th className="px-4 py-3 text-left">Ціна</th>
//                                 <th className="px-4 py-3 text-center">Дії</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {services.map((service, index) => (
//                                 <tr
//                                     key={service.id}
//                                     className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
//                                 >
//                                     <td className="px-4 py-3 font-semibold text-gray-700">{service.id}</td>
//                                     <td className="px-4 py-3 text-gray-800">{service.title}</td>
//                                     <td className="px-4 py-3 text-gray-700">{service.description}</td>
//                                     <td className="px-4 py-3 text-gray-700">{service.price} грн</td>
//                                     <td className="px-4 py-3 text-center">
//                                         <div className="flex flex-col items-center gap-2">
//                                             <button
//                                                 onClick={() => {
//                                                     setServiceData(service);
//                                                     setShowModal(true);
//                                                 }}
//                                                 className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition w-32"
//                                             >
//                                                 Змінити
//                                             </button>
//                                             <button
//                                                 onClick={() => {
//                                                     if (service.id !== undefined) {
//                                                         deleteService(service.id, service.title);
//                                                     }
//                                                 }}
//                                                 className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition w-32"
//                                             >
//                                                 Видалити
//                                             </button>
//                                         </div>
//                                     </td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 </div>
//                 <button
//                     onClick={() => {
//                         setServiceData({ title: "", description: "", price: 0 });
//                         setShowModal(true);
//                     }}
//                     className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition mt-6 w-full text-lg font-semibold"
//                 >
//                     Додати послугу
//                 </button>
//             </div>

//             {showModal && (
//                 <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
//                     <div className="bg-white p-6 rounded-lg shadow-xl w-96">
//                         <h2 className="text-xl font-bold mb-4 text-center text-gray-800">
//                             {serviceData.id ? "Редагувати сервіс" : "Додати сервіс"}
//                         </h2>
//                         <input
//                             type="text"
//                             placeholder="Назва"
//                             value={serviceData.title}
//                             onChange={(e) => setServiceData({ ...serviceData, title: e.target.value })}
//                             className="w-full p-2 border border-gray-300 rounded mb-3 bg-gray-50 text-gray-900"
//                         />
//                         <input
//                             type="text"
//                             placeholder="Опис"
//                             value={serviceData.description}
//                             onChange={(e) => setServiceData({ ...serviceData, description: e.target.value })}
//                             className="w-full p-2 border border-gray-300 rounded mb-3 bg-gray-50 text-gray-900"
//                         />
//                         <input
//                             type="number"
//                             placeholder="Ціна"
//                             value={serviceData.price}
//                             onChange={(e) => setServiceData({ ...serviceData, price: parseFloat(e.target.value) })}
//                             className="w-full p-2 border border-gray-300 rounded mb-4 bg-gray-50 text-gray-900"
//                         />
//                         <button
//                             onClick={saveService}
//                             className="bg-blue-600 text-white px-4 py-2 rounded w-full mb-2 hover:bg-blue-700 transition"
//                         >
//                             {serviceData.id ? "Зберегти зміни" : "Зберегти"}
//                         </button>
//                         <button
//                             onClick={() => setShowModal(false)}
//                             className="bg-gray-500 text-white px-4 py-2 rounded w-full hover:bg-gray-600 transition"
//                         >
//                             Скасувати
//                         </button>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default AdminServicesPage;

import { useEffect, useState } from "react";
import axios from "axios";

interface RepairService {
    id?: number;
    title: string;
    description: string;
    price: number;
}

const AdminServicesPage = () => {
    const [services, setServices] = useState<RepairService[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [serviceData, setServiceData] = useState<RepairService>({ title: "", description: "", price: 0 });

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        try {
            const response = await axios.get("http://localhost:8080/api/services");
            setServices(response.data);
        } catch (error) {
            alert("Помилка завантаження сервісів");
            console.error("Error fetching services", error);
        }
    };

    const saveService = async () => {
        const token = localStorage.getItem("jwt");
        if (!token) return alert("Токен не знайдено");

        try {
            if (serviceData.id) {
                const response = await axios.put(
                    `http://localhost:8080/api/services/${serviceData.id}`,
                    serviceData,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setServices(services.map(s => s.id === serviceData.id ? response.data : s));
                alert("Послугу оновлено");
            } else {
                const response = await axios.post(
                    "http://localhost:8080/api/services",
                    {
                        title: serviceData.title,
                        description: serviceData.description,
                        price: serviceData.price,
                    },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setServices([...services, response.data]);
                alert("Послугу створено");
            }
            setShowModal(false);
        } catch (error) {
            alert("Помилка збереження послуги");
            console.error("Error saving service", error);
        }
    };

    const deleteService = async (id: number, title: string) => {
        const confirmed = window.confirm(`Ви дійсно хочете видалити послугу "${title}"?`);
        if (!confirmed) return;

        try {
            const token = localStorage.getItem("jwt");
            await axios.delete(`http://localhost:8080/api/services/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setServices(services.filter(s => s.id !== id));
            alert("Послугу видалено");
        } catch (error) {
            alert("Помилка видалення послуги");
            console.error("Error deleting service", error);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="mt-6 bg-white p-6 rounded-lg shadow-md w-full max-w-7xl overflow-x-hidden">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Список послуг сервісного центру</h2>
                <table className="w-full border border-gray-300 rounded-lg overflow-hidden">
                    <thead>
                        <tr className="bg-gray-700 text-white">
                            <th className="p-3 text-left">ID</th>
                            <th className="p-3 text-left">Назва</th>
                            <th className="p-3 text-left">Опис</th>
                            <th className="p-3 text-left">Ціна</th>
                            <th className="p-3 text-center">Дії</th>
                        </tr>
                    </thead>
                    <tbody>
                        {services.map((service, index) => (
                            <tr key={service.id} className={`border-b ${index % 2 === 0 ? "bg-gray-50" : "bg-white"}`}>
                                <td className="p-3 text-gray-900 font-bold">{service.id}</td>
                                <td className="p-3 text-gray-800">{service.title}</td>
                                <td className="p-3 text-gray-700">{service.description}</td>
                                <td className="p-3 text-gray-700">{service.price} грн</td>
                                <td className="p-3 text-center">
                                    <button
                                        onClick={() => {
                                            setServiceData(service);
                                            setShowModal(true);
                                        }}
                                        className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition w-full mb-2"
                                    >
                                        Змінити
                                    </button>
                                    <button
                                        onClick={() => {
                                            if (service.id !== undefined) {
                                                deleteService(service.id, service.title);
                                            }
                                        }}
                                        className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition w-full"
                                    >
                                        Видалити
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <button
                    onClick={() => {
                        setServiceData({ title: "", description: "", price: 0 });
                        setShowModal(true);
                    }}
                    className="bg-green-500 text-white px-4 py-3 rounded-lg hover:bg-green-600 transition w-full mt-4 text-lg"
                >
                    Додати послугу
                </button>
            </div>

            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl w-96">
                        <h2 className="text-xl font-bold mb-4 text-center text-gray-800">
                            {serviceData.id ? "Редагувати сервіс" : "Додати сервіс"}
                        </h2>
                        <input
                            type="text"
                            placeholder="Назва"
                            value={serviceData.title}
                            onChange={(e) => setServiceData({ ...serviceData, title: e.target.value })}
                            className="w-full p-2 border border-gray-300 rounded mb-3 bg-gray-50 text-gray-900"
                        />
                        <input
                            type="text"
                            placeholder="Опис"
                            value={serviceData.description}
                            onChange={(e) => setServiceData({ ...serviceData, description: e.target.value })}
                            className="w-full p-2 border border-gray-300 rounded mb-3 bg-gray-50 text-gray-900"
                        />
                        <input
                            type="number"
                            placeholder="Ціна"
                            value={serviceData.price}
                            onChange={(e) => setServiceData({ ...serviceData, price: parseFloat(e.target.value) })}
                            className="w-full p-2 border border-gray-300 rounded mb-4 bg-gray-50 text-gray-900"
                        />
                        <button
                            onClick={saveService}
                            className="bg-blue-600 text-white px-4 py-2 rounded w-full mb-2 hover:bg-blue-700 transition"
                        >
                            {serviceData.id ? "Зберегти зміни" : "Зберегти"}
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

export default AdminServicesPage;
