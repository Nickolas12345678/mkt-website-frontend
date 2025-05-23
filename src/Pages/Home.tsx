import { useEffect, useState, useRef } from "react";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import { FaMicrochip, FaTools, FaDesktop, FaFan, FaLaptop, FaTint } from "react-icons/fa";

interface Category {
    id: number;
    name: string;
    description: string;
    imageUrl: string;
}

const Home = () => {




    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const shopSectionRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        axios
            .get("https://mkt-uzhhorod-f075ee5ee8b4.herokuapp.com/categories")
            .then((response) => {
                setCategories(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching categories:", error);
                setLoading(false);
            });
    }, []);





    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <Header />
            <section className="relative w-full">
                <img
                    src="src/assets/images/mktimage.png"
                    alt="MKT"
                    className="w-full h-[500px] object-cover"
                />
            </section>

            <section className="bg-gray-50 py-16 px-6 w-full mb-16 " id="about-mkt-section">
                <div className="w-full mx-auto text-center">
                    <h2 className="text-4xl font-bold text-orange-600 mb-6">Про МКТ</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
                        <div className="bg-white p-8 rounded-xl shadow-xl hover:shadow-2xl transition duration-300 hover:border-2 hover:border-orange-600">
                            <h3 className="text-2xl font-semibold text-orange-600 mb-4">Наша команда</h3>
                            <p className="text-gray-600">
                                Професійні інженери з досвідом понад 25 років, які забезпечують
                                якісне обслуговування та ремонт техніки.
                            </p>
                        </div>
                        <div className="bg-white p-8 rounded-xl shadow-xl hover:shadow-2xl transition duration-300 hover:border-2 hover:border-orange-600">
                            <h3 className="text-2xl font-semibold text-orange-600 mb-4">Магазин та Сервіс</h3>
                            <p className="text-gray-600">
                                Продаж комп'ютерної техніки, ремонт ПК, ноутбуків, принтерів,
                                планшетів, смартфонів, заправка картриджів.
                            </p>
                        </div>
                        <div className="bg-white p-8 rounded-xl shadow-xl hover:shadow-2xl transition duration-300 hover:border-2 hover:border-orange-600">
                            <h3 className="text-2xl font-semibold text-orange-600 mb-4">Кур'єрська доставка</h3>
                            <p className="text-gray-600">
                                Швидка доставка нової та відремонтованої техніки та документів
                                по Ужгороду.
                            </p>
                        </div>
                    </div>
                </div>
            </section>


            <section
                className="bg-white py-16 px-6 w-full mb-16"
                id="shop-section"
                ref={shopSectionRef}
            >
                <div className="w-full mx-auto text-center">
                    <h2 className="text-4xl font-bold text-orange-600 mb-6">Магазин</h2>
                    <div className="flex flex-wrap justify-center gap-6">
                        {categories.slice(0, 5).map((category) => (
                            <div
                                key={category.id}
                                className="bg-white p-6 rounded-xl shadow-xl hover:shadow-2xl transition duration-300 hover:border-2 hover:border-orange-600 w-full sm:w-48 lg:w-64"
                            >
                                <img
                                    src={category.imageUrl}
                                    alt={category.name}
                                    className="w-full h-32 object-cover mb-4 rounded"
                                />
                                <h3 className="text-2xl font-semibold text-orange-600 mb-4">
                                    {category.name}
                                </h3>
                                <p className="text-gray-600 mb-4">{category.description}</p>
                            </div>
                        ))}
                    </div>
                    <Link
                        to="/shop"
                        className="mt-8 inline-block bg-orange-600 text-white px-8 py-4 rounded-md text-xl hover:bg-orange-700 transition duration-300"
                    >
                        В магазин
                    </Link>
                </div>
            </section>

            <section className="bg-gray-50 py-16 px-6 w-full mb-0" id="service-center-section" >
                <div className="w-full mx-auto text-center">
                    <h2 className="text-4xl font-bold text-orange-600 mb-6">Сервісний центр</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
                        <div className="bg-white p-8 rounded-xl shadow-xl hover:shadow-2xl transition duration-300 hover:border-2 hover:border-orange-600">
                            <FaMicrochip className="text-4xl text-orange-600 mb-4 mx-auto" />
                            <h3 className="text-2xl font-semibold text-orange-600 mb-4">Ремонт материнських плат і блоків живлення</h3>
                            <p className="text-gray-600">
                                Відновлення працездатності материнських плат та блоків живлення для ПК.
                            </p>
                        </div>
                        <div className="bg-white p-8 rounded-xl shadow-xl hover:shadow-2xl transition duration-300 hover:border-2 hover:border-orange-600">
                            <FaTools className="text-4xl text-orange-600 mb-4 mx-auto" />
                            <h3 className="text-2xl font-semibold text-orange-600 mb-4">Заміна мікросхем</h3>
                            <p className="text-gray-600">
                                Професійна заміна мікросхем для забезпечення стабільної роботи пристроїв.
                            </p>
                        </div>
                        <div className="bg-white p-8 rounded-xl shadow-xl hover:shadow-2xl transition duration-300 hover:border-2 hover:border-orange-600">
                            <FaDesktop className="text-4xl text-orange-600 mb-4 mx-auto" />
                            <h3 className="text-2xl font-semibold text-orange-600 mb-4">Оновлення комплектуючих</h3>
                            <p className="text-gray-600">
                                Заміна комплектуючих для покращення продуктивності вашого ПК.
                            </p>
                        </div>
                        <div className="bg-white p-8 rounded-xl shadow-xl hover:shadow-2xl transition duration-300 hover:border-2 hover:border-orange-600">
                            <FaFan className="text-4xl text-orange-600 mb-4 mx-auto" />
                            <h3 className="text-2xl font-semibold text-orange-600 mb-4">Чистка від пилу</h3>
                            <p className="text-gray-600">
                                Чистка комп'ютерів, ноутбуків та іншої техніки від пилу для кращої охолоджуваності.
                            </p>
                        </div>
                        <div className="bg-white p-8 rounded-xl shadow-xl hover:shadow-2xl transition duration-300 hover:border-2 hover:border-orange-600">
                            <FaLaptop className="text-4xl text-orange-600 mb-4 mx-auto" />
                            <h3 className="text-2xl font-semibold text-orange-600 mb-4">Збірка ПК</h3>
                            <p className="text-gray-600">
                                Індивідуальна збірка ПК за вашими вимогами для ігор, роботи або відеомонтажу.
                            </p>
                        </div>
                        <div className="bg-white p-8 rounded-xl shadow-xl hover:shadow-2xl transition duration-300 hover:border-2 hover:border-orange-600">
                            <FaTint className="text-4xl text-orange-600 mb-4 mx-auto" />
                            <h3 className="text-2xl font-semibold text-orange-600 mb-4">Заправка картриджів</h3>
                            <p className="text-gray-600">
                                Якісна та швидка заправка картриджів для принтерів і копіювальної техніки.
                            </p>
                        </div>
                    </div>
                    <div className="mt-12 flex justify-center">
                        <Link
                            to="/service"
                            className="bg-orange-600 text-white px-8 py-4 rounded-md text-xl hover:bg-orange-700 transition duration-300"
                        >
                            В сервісний центр
                        </Link>
                    </div>
                </div>
            </section>
            <section className="bg-blue-50 py-16 px-6 w-full " id="contacts-section">
                <div className="w-full mx-auto text-center">
                    <h2 className="text-4xl font-bold text-orange-600 mb-6">Контакти</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-12">
                        <div className="bg-white p-8 rounded-xl shadow-xl hover:shadow-2xl transition duration-300 hover:border-2 hover:border-orange-600">
                            <h3 className="text-2xl font-semibold text-orange-600 mb-4">Магазин/Сервісний центр</h3>
                            <p className="text-gray-600 mb-4">
                                Адреса: м. Ужгород, вул. Собранецька, 14
                                <br />
                                Години роботи:
                                <br />
                                Пн-Пт: 09:00-18:00
                                <br />
                                Сб: 10:00-14:00
                                <br />
                                Нд: Вихідний
                                <br />
                                Телефон: (099) 55 33 501
                            </p>
                        </div>
                        <div className="bg-white p-8 rounded-xl shadow-xl hover:shadow-2xl transition duration-300 hover:border-2 hover:border-orange-600">
                            <h3 className="text-2xl font-semibold text-orange-600 mb-4">Магазин</h3>
                            <p className="text-gray-600 mb-4">
                                Адреса: м. Ужгород, вул. Героїв 101-ї бригади, 9(ТЦ "Новий")
                                <br />
                                Години роботи:
                                <br />
                                Пн-Нд: 10:00-20:00
                                <br />
                                Телефон: (050) 377 54 00
                            </p>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />

        </>
    );
};

export default Home;
