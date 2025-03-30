import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface SignupRequest {
    email: string;
    username: string;
    password: string;
}

const SignupPage = () => {
    const [formData, setFormData] = useState<SignupRequest>({
        email: "",
        username: "",
        password: "",
    });

    const [errors, setErrors] = useState<{ [key: string]: string }>({});
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
        setErrors({}); // Очистити старі помилки

        try {
            const response = await axios.post(
                "http://localhost:8080/auth/signup",
                formData
            );

            if (response.status === 201) {
                localStorage.setItem("jwt", response.data.jwt);
                navigate("/");
            }
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                console.log("Server error response:", error.response.data);

                if (typeof error.response.data === "string") {
                    setErrors({ general: error.response.data });
                } else if (error.response.data.error) {
                    setErrors({ general: error.response.data.error });
                } else {
                    setErrors(error.response.data);
                }
            } else {
                setErrors({ general: "Помилка реєстрації" });
            }
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">
                    Реєстрація
                </h2>

                {errors.general && (
                    <p className="text-red-500 text-center mb-4">{errors.general}</p>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700">Електронна пошта:</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
                        />
                        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                    </div>

                    <div>
                        <label className="block text-gray-700">Ім'я користувача:</label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
                        />
                        {errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}
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
                        {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
                    >
                        Зареєструватися
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SignupPage;
