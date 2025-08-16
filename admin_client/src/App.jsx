import { useGetOrderQuery } from "./context/services/order.service";
import { useGetProductsQuery } from "./context/services/product.service";
import Layout from "./layout/layout";
import Login from "./pages/Login";

const App = () => {
  const { data: orders = [] } = useGetOrderQuery();
  const { data: products = [] } = useGetProductsQuery();

  const token = localStorage.getItem("token");
  return token ? <Layout /> : <Login />;
};

export default App;
