import { Link, Route, Routes, useLocation } from "react-router-dom";
import product from "../assets/product.png";
import order from "../assets/order.png";
import courier from "../assets/courier.png";
import male from "../assets/male.png";
import addProduct from "../assets/add_product.png";
import addCourier from "../assets/add_courier.png";
import addCategory from "../assets/add_category.png";
import ProductAdd from "../pages/ProductAdd";
import Products from "../pages/Products";
import CategoryAdd from "../pages/CategoryAdd";
import CourierAdd from "../pages/CourierAdd";
import Couriers from "../pages/Couriers";
import Orders from "../pages/Orders";
import Users from "../pages/Users";

const Layout = () => {
  const location = useLocation();

  return (
    <div className="layout">
      <nav>
        <Link to="/" className={location.pathname === "/" ? "active-link" : ""}>
          <img src={order} alt="order" />
          Buyurtmalar
        </Link>
        <Link
          to="/product"
          className={location.pathname === "/product" ? "active-link" : ""}
        >
          <img src={product} alt="product" />
          Tovarlar
        </Link>
        <Link
          to="/product/add"
          className={location.pathname === "/product/add" ? "active-link" : ""}
        >
          <img src={addProduct} alt="add_product" />
          Tovar qo'shish
        </Link>
        <Link
          to="/courier"
          className={location.pathname === "/courier" ? "active-link" : ""}
        >
          <img src={courier} alt="courier" />
          Kuryerlar
        </Link>
        <Link
          to="/courier/add"
          className={location.pathname === "/courier/add" ? "active-link" : ""}
        >
          <img src={addCourier} alt="add_courier" />
          Kuryer qo'shish
        </Link>
        <Link
          to="/user"
          className={location.pathname === "/user" ? "active-link" : ""}
        >
          <img src={male} alt="male" />
          Foydalanuvchilar
        </Link>
        <Link
          to="/category/add"
          className={location.pathname === "/category/add" ? "active-link" : ""}
        >
          <img src={addCategory} alt="add_category" />
          Kategoriya qo'shish
        </Link>
      </nav>
      <main>
        <Routes>
          <Route path="/" element={<Orders />} />
          <Route path="/product" element={<Products />} />
          <Route path="/courier" element={<Couriers />} />
          <Route path="/product/add" element={<ProductAdd />} />
          <Route path="/product/add/:id" element={<ProductAdd />} />
          <Route path="/courier/add" element={<CourierAdd />} />
          <Route path="/courier/add/:id" element={<CourierAdd />} />
          <Route path="/category/add" element={<CategoryAdd />} />
          <Route path="/user" element={<Users />} />
        </Routes>
      </main>
    </div>
  );
};

export default Layout;
