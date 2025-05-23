import React, { useState } from "react";
import axios from "axios";

interface User {
    username: string;
    email: string;
}

const ProfilePage: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [error, setError] = useState("");

    const fetchUserProfile = async () => {
        const token = localStorage.getItem('jwt');
        if (token) {
            try {
                const response = await axios.get("https://mkt-uzhhorod-f075ee5ee8b4.herokuapp.com/api/users/profile", {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                    },
                });
                setUser(response.data);
            } catch {
                setError("Не вдалося отримати профіль");
            }
        } else {
            setError("Немає токена, авторизуйтесь");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-white text-black">
            <div className="bg-white p-8 rounded-lg shadow-lg w-96">
                {user ? (
                    <div>
                        <h2 className="text-2xl font-bold text-center mb-6">User Profile</h2>
                        <p>Name: {user.username}</p>
                        <p>Email: {user.email}</p>
                    </div>
                ) : (
                    <div>
                        <button onClick={fetchUserProfile} className="w-full mt-3 bg-blue-500 text-white p-2 rounded">
                            Показати профіль
                        </button>
                        {error && <p className="text-red-600 text-center mt-2">{error}</p>}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfilePage;
