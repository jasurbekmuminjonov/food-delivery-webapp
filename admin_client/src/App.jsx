import Layout from "./layout/layout";
import Login from "./pages/Login";

const App = () => {
  const token = localStorage.getItem("token");
  return token ? <Layout /> : <Login />;
};

export default App;
