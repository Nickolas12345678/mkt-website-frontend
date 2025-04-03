import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Header from '../components/Header';

interface Category {
    id: number;
    name: string;
}

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    quantity: number;
    imageURL: string;
    category: Category;
}



const ShopPage = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [sortOrder, setSortOrder] = useState<string>('');
    const [name, setName] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [message, setMessage] = useState<string | null>(null);


    const { categoryName } = useParams<{ categoryName: string }>();

    useEffect(() => {
        axios.get('http://localhost:8080/categories')
            .then(response => setCategories(response.data))
            .catch(error => console.error(error));

        fetchProducts();
        fetchCart();
    }, [categoryName, selectedCategory, sortOrder, name, currentPage]);

    const fetchProducts = () => {
        setLoading(true);

        const params: { [key: string]: string | number } = {
            page: currentPage - 1,
            size: 12,
            name: name,
            sortOrder: sortOrder,
        };

        if (categoryName) {
            params['categoryName'] = categoryName;
        } else if (selectedCategory) {
            params['categoryId'] = Number(selectedCategory);
        }

        axios.get('http://localhost:8080/products', { params })
            .then(response => {
                setProducts(response.data.content);
                setTotalPages(response.data.totalPages);
                setLoading(false);
            })
            .catch(error => {
                console.error(error);
                setLoading(false);
            });
    };

    const fetchCart = () => {
        const jwt = localStorage.getItem('jwt');
        if (!jwt) return;


        axios.get('http://localhost:8080/cart', {
            headers: {
                Authorization: `Bearer ${jwt}`,
            },
        })

            .catch(error => console.error('Помилка при отриманні кошика:', error));
    };

    const handleAddToCart = (productId: number) => {
        const jwt = localStorage.getItem("jwt");

        if (!jwt) {
            setMessage("Ви повинні увійти в систему, щоб додавати товари в кошик.");
            setTimeout(() => {
                setMessage(null);
            }, 3000);
            return;
        }


        axios.post("http://localhost:8080/cart/add", { productId }, {
            headers: {
                Authorization: `Bearer ${jwt}`,
            },
        })
            .then(() => {
                setMessage("Товар успішно додано до кошика!");
                fetchCart();
                setTimeout(() => {
                    setMessage(null);
                }, 3000);
            })
            .catch(() => {
                setMessage("Помилка додавання товару до кошика.");
                setTimeout(() => {
                    setMessage(null);
                }, 3000);
            });
    };

    const categoryTitle = categoryName ? categoryName : selectedCategory ? categories.find(category => category.id.toString() === selectedCategory)?.name : "Всі категорії";

    return (
        <>
            <Header isShopPage={true} />

            <section className="py-16 px-6 flex">
                <div className="w-1/4 min-h-screen p-6 bg-gray-900 text-white flex flex-col fixed left-0 top-16 bottom-0 shadow-xl">
                    <h2 className="text-xl font-semibold mb-6">Фільтри</h2>

                    <div className="mb-6">
                        <label className="block mb-2 font-semibold">Категорія</label>
                        <select
                            className="w-full p-2 border rounded bg-gray-700 text-white"
                            value={selectedCategory || ''}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                        >
                            <option value="">Всі категорії</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-6">
                        <label className="block mb-2 font-semibold">Сортувати за ціною</label>
                        <select
                            className="w-full p-2 border rounded bg-gray-700 text-white"
                            value={sortOrder}
                            onChange={(e) => setSortOrder(e.target.value)}
                        >
                            <option value="">Без сортування</option>
                            <option value="asc">Від найдешевшого до найдорожчого</option>
                            <option value="desc">Від найдорожчого до найдешевшого</option>
                        </select>
                    </div>

                    <div className="mb-6">
                        <label className="block mb-2 font-semibold">Пошук за назвою</label>
                        <input
                            className="w-full p-2 border rounded bg-gray-700 text-white"
                            type="text"
                            placeholder="Назва товару"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <Link to="/" className="mt-auto mb-16 flex items-center justify-center bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600">
                        <ArrowLeft className="mr-2" /> На головну
                    </Link>
                </div>

                <div className="w-3/4 ml-[25%] p-8">
                    <h2 className="text-2xl font-bold mb-4 text-black">{categoryTitle}</h2>

                    {message && <div className="mb-4 text-green-600">{message}</div>}

                    {loading ? (
                        <p>Завантаження...</p>
                    ) : (
                        <>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {products.map((product) => (
                                    <div key={product.id} className="border p-4 rounded-lg shadow-md bg-white text-gray-900 flex flex-col">
                                        <img
                                            src={product.imageURL}
                                            alt={product.name}
                                            className="w-full h-48 object-contain rounded-md mb-4"
                                        />
                                        <h3 className="text-lg font-semibold">{product.name}</h3>
                                        <p className="text-sm text-gray-600 mb-2 flex-grow">{product.description}</p>
                                        <div className="flex justify-between items-center mt-auto">
                                            <span className="text-xl font-bold">{product.price} грн</span>
                                            <button
                                                onClick={() => handleAddToCart(product.id)}
                                                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                                            >
                                                Купити
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="flex justify-center mt-8">
                                {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
                                    <button
                                        key={pageNumber}
                                        onClick={() => setCurrentPage(pageNumber)}
                                        className={`mx-1 px-4 py-2 rounded ${pageNumber === currentPage ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'
                                            }`}
                                    >
                                        {pageNumber}
                                    </button>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </section>
        </>
    );
};

export default ShopPage;
