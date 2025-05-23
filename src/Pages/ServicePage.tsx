import { useEffect, useState } from 'react'
import axios from 'axios'
import Header from '../components/Header'
import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

interface RepairService {
    id: number
    title: string
    description: string
    price: number
}

const ServicePage = () => {
    const [services, setServices] = useState<RepairService[]>([])
    const [loading, setLoading] = useState<boolean>(false)

    useEffect(() => {
        fetchServices()
    }, [])

    const fetchServices = () => {
        setLoading(true)
        axios
            .get('https://mkt-uzhhorod-f075ee5ee8b4.herokuapp.com/api/services')
            .then((res) => {
                setServices(res.data)
                setLoading(false)
            })
            .catch((err) => {
                console.error('Помилка при завантаженні послуг:', err)
                setLoading(false)
            })
    }

    const [requestDescriptions, setRequestDescriptions] = useState<{ [id: number]: string }>({});
    const [submitStatus, setSubmitStatus] = useState<{ [id: number]: string }>({});

    const handleSubmitRequest = async (serviceId: number) => {
        const jwt = localStorage.getItem('jwt');
        const description = (requestDescriptions[serviceId] || '').trim();

        if (!jwt) {
            setSubmitStatus(prev => ({ ...prev, [serviceId]: 'Ви повинні увійти в систему.' }));
            return;
        }

        if (!description) {
            setSubmitStatus(prev => ({ ...prev, [serviceId]: 'Будь ласка, введіть опис проблеми.' }));
            return;
        }

        try {
            await axios.post(
                'https://mkt-uzhhorod-f075ee5ee8b4.herokuapp.com/api/service-requests',
                {
                    repairService: { id: serviceId },
                    description: description,
                },
                {
                    headers: {
                        Authorization: `Bearer ${jwt}`,
                    },
                }
            );
            setSubmitStatus(prev => ({ ...prev, [serviceId]: 'Заявку успішно надіслано!' }));
            setRequestDescriptions(prev => ({ ...prev, [serviceId]: '' }));
        } catch (err) {
            console.error(err);
            setSubmitStatus(prev => ({ ...prev, [serviceId]: 'Помилка при надсиланні заявки.' }));
        }
    };

    return (
        <>
            <Header />
            <section className="py-16 px-6 flex flex-col items-center bg-white text-black min-h-screen">
                <h2 className="text-3xl font-bold mb-10">Наші послуги</h2>

                {loading ? (
                    <p>Завантаження...</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-6xl auto-rows-fr">
                        {services.map(service => (
                            <div
                                key={service.id}
                                className="border p-4 rounded-lg shadow-md bg-white text-black flex flex-col justify-between h-[460px]"
                            >
                                <div>
                                    <h3 className="text-lg font-semibold mb-2">{service.title}</h3>
                                    <p className="text-sm text-gray-700 mb-4">{service.description}</p>
                                </div>

                                <div className="mt-auto">
                                    <span className="font-bold block mb-2">від {service.price} грн</span>

                                    <textarea
                                        placeholder="Опис проблеми"
                                        className="w-full p-2 border rounded mb-2 bg-white text-black resize-none"
                                        value={requestDescriptions[service.id] || ''}
                                        onChange={(e) =>
                                            setRequestDescriptions(prev => ({ ...prev, [service.id]: e.target.value }))
                                        }
                                    />

                                    <button
                                        onClick={() => handleSubmitRequest(service.id)}
                                        className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                                    >
                                        Залишити заявку
                                    </button>

                                    {submitStatus[service.id] && (
                                        <p className={`mt-2 text-sm ${submitStatus[service.id].includes('успішно') ? 'text-green-600' : 'text-red-600'}`}>
                                            {submitStatus[service.id]}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <Link
                    to="/"
                    className="mt-12 flex items-center bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition"
                >
                    <ArrowLeft className="mr-2" /> На головну
                </Link>
            </section>
        </>
    )
}

export default ServicePage
