import { useLocation, useNavigate, Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { Button } from "./ui/button";
import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react"
import axios from "axios";

interface User {
    id: number;
    username: string;
    email: string;
}

interface HeaderProps {
    isShopPage?: boolean;
    isOrdersPage?: boolean;
    isServicePage?: boolean;
}

interface Product {
    id: number;
    name: string;
    price: number;
    imageURL: string;
}


interface CartItem {
    id: number;
    name: string;
    quantity: number;
    imageUrl: string;
    product: Product;
}

const Header = ({ isShopPage }: HeaderProps) => {
    const [user, setUser] = useState<User | null>(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [isAddressFormOpen, setIsAddressFormOpen] = useState(false);
    const [deliveryMethod, setDeliveryMethod] = useState<"DELIVERY" | "PICKUP">("DELIVERY");
    const [address, setAddress] = useState({
        street: "",
        houseNumber: "",
        apartment: "",
        pickupPoint: '',
        city: "Ужгород"
    });


    const calculateTotalPrice = (item: CartItem): string => {
        const price = item.product.price ?? 0;
        const quantity = item.quantity ?? 0;
        return (price * quantity).toFixed(2);
    };

    const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setAddress((prev) => ({
            ...prev,
            [name]: value
        }));
    };


    const handleDeliveryMethodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setDeliveryMethod(e.target.value as "DELIVERY" | "PICKUP");
        if (e.target.value === "PICKUP") {
            setAddress({
                street: "",
                houseNumber: "",
                apartment: "",
                pickupPoint: '',
                city: "Ужгород"
            });
        }
    };

    const location = useLocation();
    const navigate = useNavigate();

    const isOrdersPage = location.pathname === "/orders";
    const isServicePage = location.pathname === "/service";
    const isUserServicePage = location.pathname === "/ordersservice";

    useEffect(() => {
        const jwt = localStorage.getItem("jwt");
        if (jwt) {
            fetchUserProfile(jwt);
        }
        fetchCart();
    }, []);

    const fetchUserProfile = async (jwt: string) => {
        try {
            const response = await axios.get("http://localhost:8080/api/users/profile", {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
            });

            if (response.status === 200) {
                setUser(response.data);
            }
        } catch (error) {
            console.error("Error fetching user profile:", error);
        }
    };


    const fetchCart = async () => {
        const jwt = localStorage.getItem("jwt");
        if (jwt) {
            try {
                const response = await axios.get("http://localhost:8080/cart", {
                    headers: {
                        Authorization: `Bearer ${jwt}`,
                    },
                });
                if (response.status === 200) {
                    setCart(response.data.items || []);
                }
            } catch (error) {
                console.error("Error fetching cart:", error);
            }
        }
    };





    const handleCheckout = async () => {
        if (deliveryMethod === "DELIVERY" && (!address.street || !address.houseNumber)) {
            alert("Будь ласка, заповніть всі поля адреси!");
            return;
        }

        const jwt = localStorage.getItem("jwt");
        if (jwt) {
            try {
                const deliveryAddress = deliveryMethod === "DELIVERY"
                    ? `${address.city}, ${address.street}, ${address.houseNumber}, ${address.apartment || ""}`
                    : address.pickupPoint;

                if (deliveryMethod === "PICKUP" && !address.pickupPoint) {
                    alert("Будь ласка, оберіть пункт самовивозу!");
                    return;
                }



                const response = await axios.post(
                    "http://localhost:8080/api/orders/create",
                    { deliveryAddress, deliveryMethod },
                    { headers: { Authorization: `Bearer ${jwt}` } }
                );

                if (response.status === 200) {
                    alert("Замовлення успішно створене!");
                    setIsAddressFormOpen(false);
                }
            } catch (error) {
                console.error("Помилка при створенні замовлення:", error);
                alert("Не вдалося створити замовлення. Спробуйте ще раз.");
            }
        }
    };




    const handleLogout = () => {
        localStorage.removeItem("jwt");
        setUser(null);
        setIsDropdownOpen(false);
        window.location.reload();
    };

    const toggleDropdown = () => {
        setIsDropdownOpen((prev) => !prev);
    };

    const handleScrollToShopSection = () => {
        const shopSection = document.getElementById("shop-section");
        if (shopSection) {
            shopSection.scrollIntoView({ behavior: "smooth" });
        }
    };

    const handleScrollToAboutMKTSection = () => {
        const shopSection = document.getElementById("about-mkt-section");
        if (shopSection) {
            shopSection.scrollIntoView({ behavior: "smooth" });
        }
    };

    const handleScrollToServiceSection = () => {
        const serviceSection = document.getElementById("service-center-section");
        if (serviceSection) {
            serviceSection.scrollIntoView({ behavior: "smooth" });
        }
    };

    const handleScrollToContactSection = () => {
        const serviceSection = document.getElementById("contacts-section");
        if (serviceSection) {
            serviceSection.scrollIntoView({ behavior: "smooth" });
        }
    };

    const toggleCart = () => {
        setIsCartOpen((prev) => !prev);
        if (!isCartOpen) {
            fetchCart();
        }
    };

    const handleIncreaseQuantity = async (productId: number) => {
        const jwt = localStorage.getItem("jwt");
        if (jwt) {
            try {
                await axios.post(`http://localhost:8080/cart/increase/${productId}`, {}, {
                    headers: { Authorization: `Bearer ${jwt}` },
                });
                fetchCart();
            } catch (error) {
                console.error("Error increasing quantity:", error);
            }
        }
    };

    const handleDecreaseQuantity = async (productId: number) => {
        const jwt = localStorage.getItem("jwt");
        if (jwt) {
            try {
                await axios.post(`http://localhost:8080/cart/decrease/${productId}`, {}, {
                    headers: { Authorization: `Bearer ${jwt}` },
                });
                fetchCart();
            } catch (error) {
                console.error("Error decreasing quantity:", error);
            }
        }
    };

    const handleRemoveItem = async (productId: number) => {
        const jwt = localStorage.getItem("jwt");
        if (jwt) {
            try {
                await axios.delete(`http://localhost:8080/cart/remove/${productId}`, {
                    headers: { Authorization: `Bearer ${jwt}` },
                });
                fetchCart();
            } catch (error) {
                console.error("Error removing item:", error);
            }
        }
    };

    const handleClearCart = async () => {
        const jwt = localStorage.getItem("jwt");
        if (jwt) {
            try {
                await axios.delete("http://localhost:8080/cart/clear", {
                    headers: { Authorization: `Bearer ${jwt}` },
                });
                fetchCart();
            } catch (error) {
                console.error("Error clearing cart:", error);
            }
        }
    };

    return (
        <header className="fixed top-0 left-0 w-full z-10 flex justify-between items-center p-4 shadow-md bg-black">
            {isOrdersPage && (
                <div className="absolute left-1/2 transform -translate-x-1/2 text-orange-600 text-xl font-semibold">
                    Мої замовлення
                </div>
            )}
            {isServicePage && (
                <div className="absolute left-1/2 transform -translate-x-1/2 text-orange-600 text-xl font-semibold">
                    Сервісний центр
                </div>
            )}
            {isUserServicePage && (
                <div className="absolute left-1/2 transform -translate-x-1/2 text-orange-600 text-xl font-semibold">
                    Мої заявки
                </div>
            )}
            <div className="flex items-center gap-4">
                {isOrdersPage && (
                    <button
                        className="text-white font-semibold text-sm bg-orange-600 hover:bg-orange-700 px-5 py-2 rounded flex items-center gap-2"
                        onClick={() => navigate("/")}
                    >
                        <ArrowLeft className="w-4 h-4" />
                        На головну
                    </button>
                )}
                {isUserServicePage && (
                    <button
                        className="text-white font-semibold text-sm bg-orange-600 hover:bg-orange-700 px-5 py-2 rounded flex items-center gap-2"
                        onClick={() => navigate("/")}
                    >
                        <ArrowLeft className="w-4 h-4" />
                        На головну
                    </button>
                )}
                <div className="text-2xl font-bold text-white">
                    <span className="text-orange-600">МКТ</span>
                </div>
            </div>



            {isShopPage && (
                <div className="flex-grow flex justify-center">
                    <span className="text-orange-600 text-xl font-bold">МАГАЗИН</span>
                </div>
            )}

            <div className="flex items-center gap-6">
                {!isShopPage && !isOrdersPage && !isServicePage && !isUserServicePage && (
                    <>
                        <div className="flex space-x-6">
                            <span
                                onClick={handleScrollToAboutMKTSection}
                                className="text-white cursor-pointer hover:text-gray-600"
                            >
                                Про нас
                            </span>
                            <span
                                onClick={handleScrollToShopSection}
                                className="text-white cursor-pointer hover:text-gray-600"
                            >
                                Магазин
                            </span>
                            <span
                                onClick={handleScrollToServiceSection}
                                className="text-white cursor-pointer hover:text-gray-600"
                            >
                                Сервісний центр
                            </span>
                            <span
                                onClick={handleScrollToContactSection}
                                className="text-white cursor-pointer hover:text-gray-600"
                            >
                                Контакти
                            </span>
                        </div>
                    </>
                )}
            </div>

            <div className="flex items-center gap-6">
                {user && (
                    <ShoppingCart
                        className="w-6 h-6 text-white cursor-pointer"
                        onClick={toggleCart}
                    />
                )}
                {!user ? (
                    <>
                        <Link to="/signin">
                            <Button variant="outline" className="text-white border-white">
                                Увійти
                            </Button>
                        </Link>
                        <Link to="/signup">
                            <Button className="bg-blue-600 text-white">Зареєструватися</Button>
                        </Link>
                    </>
                ) : (
                    <div className="relative">
                        <div
                            className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white text-lg cursor-pointer"
                            onClick={toggleDropdown}
                        >
                            {user.username[0]}
                        </div>
                        {isDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg z-20">
                                <div className="p-4">
                                    <div className="flex items-center gap-2">
                                        <div className="text-2xl font-semibold text-gray-700">
                                            {user.username}
                                        </div>
                                    </div>
                                    <div className="mt-2">
                                        <p className="text-gray-600">
                                            <strong>Email:</strong> {user.email}
                                        </p>
                                    </div>
                                    <div className="mt-4">
                                        <Link to="/orders" className="w-full text-blue-600 hover:text-blue-700 py-2 rounded-md block">
                                            Замовлення з магазину
                                        </Link>
                                        <Link to="/ordersservice" className="w-full text-blue-600 hover:text-blue-700 py-2 rounded-md block">
                                            Заявки до сервісного центру
                                        </Link>
                                    </div>
                                    <div className="mt-4">
                                        <button
                                            className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-md"
                                            onClick={handleLogout}
                                        >
                                            Вийти
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>




            {isCartOpen && (
                <div className="absolute top-20 right-0 w-1/3 bg-white text-black rounded-lg shadow-lg z-20 p-6 max-h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
                    <h3 className="text-xl font-semibold">Кошик</h3>
                    <div className="mt-4">
                        {cart.length > 0 ? (
                            <ul>
                                {cart.map((item) => (
                                    <li key={item.id} className="flex justify-between mb-4 items-center border-b py-4">
                                        <div className="flex items-center gap-4">
                                            <img
                                                src={item.product.imageURL.replace('http://localhost:8080/images/', '')}
                                                alt={item.product.name}
                                                className="w-16 h-16 object-contain rounded"
                                            />
                                            <span className="text-sm font-semibold break-words w-20">{item.product.name}</span>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <button
                                                className="text-white bg-green-500 p-2 rounded-full hover:bg-green-600"
                                                onClick={() => handleIncreaseQuantity(item.product.id)}
                                            >
                                                +
                                            </button>
                                            <span className="text-lg font-semibold">{item.quantity}</span>
                                            <button
                                                className="text-white bg-yellow-500 p-2 rounded-full hover:bg-yellow-600"
                                                onClick={() => handleDecreaseQuantity(item.product.id)}
                                            >
                                                -
                                            </button>
                                            <button
                                                className="text-white bg-red-500 p-2 rounded-full hover:bg-red-600"
                                                onClick={() => handleRemoveItem(item.product.id)}
                                            >
                                                Видалити
                                            </button>
                                        </div>
                                        <span className="text-lg font-semibold">
                                            {calculateTotalPrice(item)} грн
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-500">Ваш кошик порожній</p>
                        )}
                    </div>

                    {cart.length > 0 && (
                        <>
                            <div className="mt-4 flex justify-between items-center">
                                <span className="font-semibold">До оплати:</span>
                                <span className="text-xl font-bold">
                                    {cart.reduce((total, item) => total + parseFloat(calculateTotalPrice(item)), 0).toFixed(2)} грн
                                </span>
                            </div>
                            <div className="mt-6 flex gap-4 w-full">


                                {!isAddressFormOpen && (
                                    <div className="flex flex-col gap-2 mt-4 w-full">
                                        <Button
                                            className="w-full bg-blue-600 text-white"
                                            onClick={() => setIsAddressFormOpen(true)}
                                        >
                                            Оформити замовлення
                                        </Button>
                                        <Button
                                            className="w-full bg-red-500 text-white"
                                            onClick={handleClearCart}
                                        >
                                            Очистити кошик
                                        </Button>
                                    </div>
                                )}

                                {isAddressFormOpen && (
                                    <div className="address-form bg-white p-6 rounded-lg shadow-lg w-full max-w-md mx-auto">
                                        <h3 className="text-xl font-semibold mb-4">Оберіть спосіб доставки</h3>

                                        <div className="mb-4">
                                            <select
                                                className="w-full p-3 border border-gray-300 bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                value={deliveryMethod}
                                                onChange={handleDeliveryMethodChange}
                                            >
                                                <option value="DELIVERY">Доставка</option>
                                                <option value="PICKUP">Самовивіз</option>
                                            </select>
                                        </div>

                                        {deliveryMethod === "DELIVERY" && (
                                            <>
                                                <input
                                                    type="text"
                                                    name="city"
                                                    value="Ужгород"
                                                    readOnly
                                                    className="w-full p-3 mb-4 border border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    placeholder="Місто"
                                                />
                                                <input
                                                    type="text"
                                                    name="street"
                                                    value={address.street}
                                                    onChange={handleAddressChange}
                                                    className="w-full p-3 mb-4 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    placeholder="Вулиця"
                                                />
                                                <input
                                                    type="text"
                                                    name="houseNumber"
                                                    value={address.houseNumber}
                                                    onChange={handleAddressChange}
                                                    className="w-full p-3 mb-4 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    placeholder="Номер будинку"
                                                />
                                                <input
                                                    type="text"
                                                    name="apartment"
                                                    value={address.apartment}
                                                    onChange={handleAddressChange}
                                                    className="w-full p-3 mb-4 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    placeholder="Номер квартири (необов'язково)"
                                                />
                                            </>
                                        )}

                                        {deliveryMethod === "PICKUP" && (
                                            <div className="mb-4">
                                                <label className="block text-gray-700 font-medium mb-2">
                                                    Пункт самовивозу:
                                                </label>
                                                <select
                                                    name="pickupPoint"
                                                    value={address.pickupPoint}
                                                    onChange={handleAddressChange}
                                                    className="w-full p-3 border border-gray-300 bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                >
                                                    <option value="">Оберіть адресу</option>
                                                    <option value="Ужгород, вул. Собранецька, 14">Ужгород, вул. Собранецька, 14</option>
                                                    <option value="Ужгород, вул. Героїв 101-ї бригади, 9">Ужгород, вул.Героїв 101-ї бригади, 9</option>
                                                </select>
                                            </div>
                                        )}

                                        <div className="mt-6 flex gap-4">
                                            <button
                                                className="w-full p-3 border border-gray-300 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                onClick={handleCheckout}
                                            >
                                                Підтвердити замовлення
                                            </button>
                                            <button
                                                className="w-full p-3 border border-gray-300 rounded-md bg-gray-200 hover:bg-gray-300 transition focus:outline-none focus:ring-2 focus:ring-gray-500"
                                                onClick={() => setIsAddressFormOpen(false)}
                                            >
                                                Скасувати
                                            </button>
                                        </div>
                                    </div>
                                )}



                            </div>
                        </>
                    )}
                </div>
            )}
        </header>
    );
};

export default Header;

