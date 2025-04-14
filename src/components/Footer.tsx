import { Link } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaMapMarkerAlt, FaPhoneAlt } from "react-icons/fa";

const Footer = () => {
    return (
        <footer className="w-full bg-gray-900 text-white py-10 mt-0">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                    <h4 className="text-xl font-bold mb-4">Контакти</h4>
                    <p className="flex items-center mb-2">
                        <FaMapMarkerAlt className="mr-2 text-orange-500" />
                        вул. Собранецька, 14, Ужгород
                    </p>
                    <p className="flex items-center mb-2">
                        <FaMapMarkerAlt className="mr-2 text-orange-500" />
                        вул. Героїв 101-ї бригади, 9 (ТЦ "Новий"), Ужгород
                    </p>
                    <p className="flex items-center mb-2">
                        <FaPhoneAlt className="mr-2 text-orange-500" />
                        <a href="tel:+380995533501" className="hover:underline">099 553 35 01</a>
                    </p>
                    <p className="flex items-center">
                        <FaPhoneAlt className="mr-2 text-orange-500" />
                        <a href="tel:+380503775400" className="hover:underline">050 377 54 00</a>
                    </p>
                </div>


                <div>
                    <h4 className="text-xl font-bold mb-4">Навігація</h4>
                    <ul className="space-y-2">
                        <li><Link to="/" className="hover:text-orange-500">Головна</Link></li>
                        <li><Link to="/shop" className="hover:text-orange-500">Магазин</Link></li>
                        <li><Link to="/service" className="hover:text-orange-500">Сервіс</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="text-xl font-bold mb-4">Ми в соцмережах</h4>
                    <div className="flex space-x-4">
                        <a href="https://www.facebook.com/mktuzua" target="_blank" rel="noopener noreferrer" className="hover:text-orange-500">
                            <FaFacebookF size={24} />
                        </a>
                        <a href="https://www.instagram.com/mktuzh" target="_blank" rel="noopener noreferrer" className="hover:text-orange-500">
                            <FaInstagram size={24} />
                        </a>
                    </div>
                </div>
            </div>

            <div className="mt-10 text-center text-sm text-gray-400">
                © {new Date().getFullYear()} МКТ. Усі права захищено.
            </div>
        </footer>
    );
};

export default Footer;
