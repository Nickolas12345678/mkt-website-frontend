import { useEffect, useState, useRef } from "react";
import axios from "axios";
import Header from "../components/Header";
import { Link } from "react-router-dom";

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
            .get("http://localhost:8080/categories")
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
                                className="bg-white p-6 rounded-xl shadow-xl hover:shadow-2xl transition duration-300 hover:border-2 hover:border-orange-600 w-full sm:w-48 lg:w-64 cursor-pointer"
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
        </>
    );
};

export default Home;
