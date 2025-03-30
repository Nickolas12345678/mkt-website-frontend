import { Link } from "react-router-dom";

const NotFound = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen text-center">
            <h1 className="text-6xl font-bold text-red-500">404</h1>
            <p className="text-xl text-gray-700 mt-4">Сторінку не знайдено</p>
            <Link to="/" className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Повернутися на головну
            </Link>
        </div>
    );
};

export default NotFound;
