import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface SigninRequest {
    email: string;
    password: string;
}

interface ErrorResponse {
    response?: {
        data?: {
            message?: string;
        };
    };
}

const SigninPage = () => {
    const [formData, setFormData] = useState<SigninRequest>({
        email: "",
        password: "",
    });

    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await axios.post(
                "http://localhost:8080/auth/signin",
                formData
            );

            if (response.status === 200) {
                localStorage.setItem("jwt", response.data.jwt);
                navigate("/");  // Перехід на головну сторінку
            }
        } catch (error) {
            const err = error as ErrorResponse;
            setErrorMessage(err.response?.data?.message || "Помилка входу");
        }
    };

    return (
        <div className="signin-container">
            <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">Вхід</h2>
                {errorMessage && (
                    <p className="text-red-500 text-center mb-4">{errorMessage}</p>
                )}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700">Email:</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700">Пароль:</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
                    >
                        Увійти
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SigninPage;
