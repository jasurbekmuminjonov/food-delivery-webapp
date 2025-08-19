import { Route, Routes } from "react-router-dom";
import Home from "../pages/main/Home";
import LocationSearch from "../pages/main/Places";
import Map from "../pages/main/Map";
import Search from "../pages/main/Search";
import Product from "../pages/main/Product";
import Discount from "../pages/main/Discount";
import Wishes from "../pages/main/Wishes";
import Basket from "../pages/main/Basket";
import Result from "../pages/main/Result";
import Order from "../pages/main/Order";
import Category from "../components/Category";
import User from "../pages/main/User";
import OrderHistory from "../pages/main/OrderHistory";

const Layout = () => {
  return (
    <div className="layout">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/places" element={<LocationSearch />} />
        <Route path="/map" element={<Map />} />
        <Route path="/search" element={<Search />} />
        <Route path="/product/:id" element={<Product />} />
        <Route path="/discount" element={<Discount />} />
        <Route path="/wishes" element={<Wishes />} />
        <Route path="/basket" element={<Basket />} />
        <Route path="/success" element={<Result />} />
        <Route path="/order" element={<Order />} />
        <Route path="/user" element={<User />} />
        <Route path="/order/history" element={<OrderHistory />} />
        <Route path="/category/:category" element={<Category />} />
      </Routes>
    </div>
  );
};

export default Layout;
