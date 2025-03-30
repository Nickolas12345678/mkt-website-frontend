import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import axios from "axios";

interface User {
    id: number;
    username: string;
    email: string;
    role: string;
}

const AdminPage = () => {
    const { user } = useAuth();
    const [users, setUsers] = useState<User[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [newUser, setNewUser] = useState({ username: "", email: "", password: "", role: "" });

    useEffect(() => {
        document.body.style.overflowX = "hidden";
        return () => {
            document.body.style.overflowX = "auto";
        };
    }, []);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem("jwt");
                const response = await axios.get<User[]>("http://localhost:8080/api/users/all", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUsers(response.data);
            } catch (error) {
                console.error("Error fetching users", error);
            }
        };

        fetchUsers();
    }, []);



    const deleteUser = async (userId: number, username: string) => {
        const isConfirmed = window.confirm(`Ви впевнені, що хочете видалити користувача ${username}?`);
        if (!isConfirmed) return;
        try {
            const token = localStorage.getItem("jwt");
            await axios.delete(`http://localhost:8080/api/users/${userId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUsers(users.filter(user => user.id !== userId));
            alert(`Користувач ${username} успішно видалений!`);
        } catch (error) {
            console.error("Error deleting user", error);
            alert("Не вдалося видалити користувача!");
        }
    };

    const changeUserRole = async (userId: number) => {
        let newRole = prompt("Введіть нову роль для користувача (ADMIN, USER, etc.):");
        if (!newRole) return;

        newRole = newRole.toUpperCase().startsWith("ROLE_") ? newRole.toUpperCase() : `ROLE_${newRole.toUpperCase()}`;

        try {
            const token = localStorage.getItem("jwt");
            const response = await axios.put(
                `http://localhost:8080/api/users/role/${userId}`,
                { role: newRole },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setUsers(users.map(user =>
                user.id === userId ? { ...user, role: response.data.role } : user
            ));

            alert("Роль успішно змінена!");
        } catch (error) {
            console.error("Помилка при зміні ролі", error);
            alert("Не вдалося змінити роль!");
        }
    };

    const createUser = async () => {
        try {
            const token = localStorage.getItem("jwt");
            const response = await axios.post("http://localhost:8080/auth/signup", newUser, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUsers([...users, { ...newUser, id: response.data.id, role: response.data.role }]);
            alert("Користувач успішно створений!");
            setShowModal(false);
        } catch (error) {
            console.error("Помилка при створенні користувача", error);
            alert("Не вдалося створити користувача!");
        }
    };


    return (
        <div className="admin-panel">

            <aside className="w-64 bg-gray-900 text-white h-screen fixed top-0 left-0 p-6">
                <h1 className="text-3xl text-orange-600 font-bold mb-6">МКТ</h1>
                <nav>
                    <ul className="space-y-3">
                        <li className="w-full">
                            <a
                                href="#"
                                className="block w-full p-3 rounded-lg bg-gray-800 hover:bg-gray-700 hover:text-gray-200 transition text-gray-300 text-center focus:outline-none"
                            >
                                Користувачі
                            </a>
                        </li>
                        <li className="w-full">
                            <a
                                href="#"
                                className="block w-full p-3 rounded-lg bg-gray-800 hover:bg-gray-700 hover:text-gray-200 transition text-gray-300 text-center focus:outline-none"
                            >
                                Замовлення
                            </a>
                        </li>
                        <li className="w-full">
                            <a
                                href="#"
                                className="block w-full p-3 rounded-lg bg-gray-800 hover:bg-gray-700 hover:text-gray-200 transition text-gray-300 text-center focus:outline-none"
                            >
                                Товари
                            </a>
                        </li>
                    </ul>
                </nav>
            </aside>





            <main className="flex-1 p-6 pl-64 min-h-screen bg-gray-100 flex flex-col w-full items-center">
                <div className="max-w-5xl mx-auto w-fit">
                    <h1 className="text-3xl font-bold text-gray-800 shadow-sm pb-2">Адмін-панель</h1>
                    <p className="text-gray-700">Вітаємо, {user?.username}!</p>
                    {showModal && (
                        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
                            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                                <h2 className="text-xl font-bold mb-4 text-center text-black">Додати користувача</h2>
                                <input
                                    type="text"
                                    placeholder="Ім'я"
                                    className="w-full p-2 border rounded mb-2 bg-white text-black cursor-text"
                                    onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                                />
                                <input
                                    type="email"
                                    placeholder="Email"
                                    className="w-full p-2 border rounded mb-2 bg-white text-black cursor-text"
                                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                                />
                                <input
                                    type="password"
                                    placeholder="Пароль"
                                    className="w-full p-2 border rounded mb-2 bg-white text-black cursor-text"
                                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                                />
                                <button
                                    onClick={createUser}
                                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full mb-2"
                                >
                                    Зберегти
                                </button>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 w-full"
                                >
                                    Скасувати
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="mt-6 bg-white p-6 rounded-lg shadow-md w-full">
                        <h2 className="text-xl font-semibold text-gray-800">Список користувачів</h2>
                        <table className="w-full mt-4 border border-gray-300 rounded-lg overflow-hidden">
                            <thead>
                                <tr className="bg-gray-700 text-white">
                                    <th className="p-3 text-left">ID</th>
                                    <th className="p-3 text-left">Ім'я</th>
                                    <th className="p-3 text-left">Email</th>
                                    <th className="p-3 text-left">Роль</th>
                                    <th className="p-3 text-center">Дії</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user, index) => (
                                    <tr key={user.id} className={`border-b ${index % 2 === 0 ? "bg-gray-50" : "bg-white"}`}>
                                        <td className="p-3 text-gray-900 font-bold">{user.id}</td>
                                        <td className="p-3 text-gray-800">{user.username}</td>
                                        <td className="p-3 text-gray-700">{user.email}</td>
                                        <td className="p-3 text-gray-600">{user.role}</td>
                                        <td className="p-3 text-center">
                                            <button
                                                onClick={() => changeUserRole(user.id)}
                                                className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition w-full mb-2"
                                            >
                                                Змінити роль
                                            </button>
                                            <button
                                                onClick={() => deleteUser(user.id, user.username)}
                                                className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition w-full"
                                            >
                                                Видалити
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <button
                            onClick={() => setShowModal(true)}
                            className="bg-green-500 text-white px-4 py-3 rounded-lg hover:bg-green-600 transition w-full mt-4 text-lg"
                        >
                            Додати користувача
                        </button>
                    </div>
                </div>
            </main>
        </div>



    );
};

export default AdminPage;
