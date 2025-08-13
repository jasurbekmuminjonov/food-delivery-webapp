import Layout from "./layout/Layout";
import { useLocation } from "react-router-dom";
import Loading from "./pages/main/Loading";
import { useGetProductsQuery } from "./context/services/product.service";
import { useGetCategoriesQuery } from "./context/services/category.service";
const App = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const { data: products = [], isLoading: productLoading } =
    useGetProductsQuery();
  const { data: categories = [], isLoading: categoryLoading } =
    useGetCategoriesQuery();
  const start = queryParams.get("start");
  if (!localStorage.getItem("telegram_id") && start) {
    localStorage.setItem("telegram_id", start);
  }
  return productLoading || categoryLoading ? <Loading /> : <Layout />;
};

export default App;
