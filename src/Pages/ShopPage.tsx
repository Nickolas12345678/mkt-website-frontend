import Header from "../components/Header";
// import { Link } from "react-router-dom";
// import { ShoppingCart } from "lucide-react";

const ShopPage = () => {
    return (
        <>
            <Header isShopPage={true} />
            <section className="bg-gray-50 py-16 px-6">
                <div className="w-full mx-auto text-center">
                    <h2 className="text-4xl font-bold text-orange-600 mb-6">Магазин</h2>
                </div>
            </section>
        </>
    );
};

export default ShopPage;
