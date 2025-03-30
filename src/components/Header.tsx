

// import { Link } from "react-router-dom";
// import { ShoppingCart } from "lucide-react";
// import { Button } from "./ui/button";
// import { useState, useEffect } from "react";
// import axios from "axios";

// interface User {
//     id: number;
//     username: string;
//     email: string;
// }



// const Header = () => {
//     const [user, setUser] = useState<User | null>(null);
//     const [isDropdownOpen, setIsDropdownOpen] = useState(false);

//     useEffect(() => {
//         const jwt = localStorage.getItem("jwt");
//         if (jwt) {
//             fetchUserProfile(jwt);
//         }
//     }, []);



//     const fetchUserProfile = async (jwt: string) => {
//         try {
//             const response = await axios.get("http://localhost:8080/api/users/profile", {
//                 headers: {
//                     Authorization: `Bearer ${jwt}`,
//                 },
//             });

//             if (response.status === 200) {
//                 setUser(response.data);
//             }
//         } catch (error) {
//             console.error("Error fetching user profile:", error);
//         }
//     };

//     const handleLogout = () => {
//         localStorage.removeItem("jwt");
//         setUser(null);
//         setIsDropdownOpen(false);
//         window.location.reload();
//     };

//     const toggleDropdown = () => {
//         setIsDropdownOpen((prev) => !prev);
//     };


//     const handleScrollToShopSection = () => {
//         const shopSection = document.getElementById("shop-section");
//         if (shopSection) {
//             shopSection.scrollIntoView({ behavior: "smooth" });
//         }
//     };

//     return (
//         <header className="fixed top-0 left-0 w-full z-10 flex justify-between items-center p-4 shadow-md bg-black">
//             <div className="text-2xl font-bold text-white">
//                 <span className="text-orange-600">МКТ</span>
//             </div>

//             <div className="flex items-center gap-6">
//                 <span
//                     onClick={handleScrollToShopSection}
//                     className="text-white cursor-pointer hover:text-gray-600"
//                 >
//                     Магазин
//                 </span>
//                 <Link to="/catalog" className="text-white hover:text-gray-600">
//                     Сервісний центр
//                 </Link>
//                 <Link to="/contact" className="text-white hover:text-gray-600">
//                     Контакти
//                 </Link>


//                 <ShoppingCart className="w-6 h-6 text-white cursor-pointer" />

//                 {!user ? (
//                     <>
//                         <Link to="/signin">
//                             <Button variant="outline" className="text-white border-white">
//                                 Увійти
//                             </Button>
//                         </Link>
//                         <Link to="/signup">
//                             <Button className="bg-blue-600 text-white">Зареєструватися</Button>
//                         </Link>
//                     </>
//                 ) : (
//                     <div className="relative">
//                         <div
//                             className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white text-lg cursor-pointer"
//                             onClick={toggleDropdown}
//                         >
//                             {user.username[0]}
//                         </div>
//                         {isDropdownOpen && (
//                             <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg z-20">
//                                 <div className="p-4">
//                                     <div className="flex items-center gap-2">
//                                         <div className="text-2xl font-semibold text-gray-700">
//                                             {user.username}
//                                         </div>
//                                     </div>
//                                     <div className="mt-2">
//                                         <p className="text-gray-600">
//                                             <strong>Email:</strong> {user.email}
//                                         </p>
//                                     </div>
//                                     <div className="mt-4">
//                                         <button
//                                             className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-md"
//                                             onClick={handleLogout}
//                                         >
//                                             Вийти
//                                         </button>
//                                     </div>
//                                 </div>
//                             </div>
//                         )}
//                     </div>
//                 )}
//             </div>
//         </header>
//     );
// };

// export default Header;


// Header.tsx
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
    isShopPage?: boolean;  // Пропс для визначення сторінки
}

const Header = ({ isShopPage }: HeaderProps) => {
    const [user, setUser] = useState<User | null>(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    useEffect(() => {
        const jwt = localStorage.getItem("jwt");
        if (jwt) {
            fetchUserProfile(jwt);
        }
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

    return (
        <header className="fixed top-0 left-0 w-full z-10 flex justify-between items-center p-4 shadow-md bg-black">
            <div className="text-2xl font-bold text-white">
                <span className="text-orange-600">МКТ</span>
            </div>

            <div className="flex items-center gap-6">
                {isShopPage ? (
                    <Link
                        to="/"
                        className="text-white hover:text-gray-600"
                    >
                        Головна
                    </Link>
                ) : (
                    <>
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
                    </>
                )}

                <ShoppingCart className="w-6 h-6 text-white cursor-pointer" />

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
        </header>
    );
};

export default Header;
