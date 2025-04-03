import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { Button } from "./ui/button";
import { useState, useEffect } from "react";
import axios from "axios";

interface User {
    id: number;
    username: string;
    email: string;
}

interface HeaderProps {
    isShopPage?: boolean;
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


    const calculateTotalPrice = (item: CartItem): string => {
        const price = item.product.price ?? 0; // Отримуємо ціну з product
        const quantity = item.quantity ?? 0;
        return (price * quantity).toFixed(2);
    };



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
            <div className="text-2xl font-bold text-white">
                <span className="text-orange-600">МКТ</span>
            </div>

            {isShopPage && (
                <div className="flex-grow flex justify-center">
                    <span className="text-orange-600 text-xl font-bold">МАГАЗИН</span>
                </div>
            )}

            <div className="flex items-center gap-6">
                {!isShopPage && (
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
                            <Link to="/catalog" className="text-white hover:text-gray-600">
                                Сервісний центр
                            </Link>
                            <Link to="/contact" className="text-white hover:text-gray-600">
                                Контакти
                            </Link>
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


            {/* {isCartOpen && (
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
                    <div className="mt-4 flex justify-between items-center">
                        <span className="font-semibold">До оплати:</span>
                        <span className="text-xl font-bold">
                            {cart.reduce((total, item) => total + parseFloat(calculateTotalPrice(item)), 0).toFixed(2)} грн

                        </span>
                    </div>
                    <div className="mt-6 flex gap-4">
                        <button
                            className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700"
                            onClick={handleClearCart}
                        >
                            Очистити кошик
                        </button>
                        <Link to="/cart">
                            <Button className="w-full bg-blue-600 text-white mt-2 hover:bg-blue-700">Перейти до кошика</Button>
                        </Link>
                    </div>
                </div>
            )} */}

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
                            <div className="mt-6 flex gap-4">
                                <button
                                    className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700"
                                    onClick={handleClearCart}
                                >
                                    Очистити кошик
                                </button>
                                <Link to="/checkout">
                                    <Button className="w-full bg-blue-600 text-white mt-2 hover:bg-blue-700">
                                        Оформити замовлення
                                    </Button>
                                </Link>
                            </div>
                        </>
                    )}
                </div>
            )}
        </header>
    );
};

export default Header;
