import { Route, Routes } from "react-router-dom";
import { useGetCategoriesQuery } from "../context/services/category.service";
import { useGetProductsQuery } from "../context/services/product.service";
import Home from "../pages/main/Home";
import LocationSearch from "../pages/main/Places";
import Map from "../pages/main/Map";

const Layout = () => {
  const { data: products = [], isLoading: productLoading } =
    useGetProductsQuery();
  const { data: categories = [], isLoading: categoryLoading } =
    useGetCategoriesQuery();
  return (
    <div className="layout">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/places" element={<LocationSearch />} />
        <Route path="/map" element={<Map />} />
      </Routes>
    </div>
  );
};

export default Layout;
