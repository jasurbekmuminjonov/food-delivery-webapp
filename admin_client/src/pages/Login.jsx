import { LuLogIn } from "react-icons/lu";
import { useLoginAdminMutation } from "../context/services/admin.service";
import { notification } from "antd";
const Login = () => {
  const [loginAdmin] = useLoginAdminMutation();
  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const login = e.target[0].value;
      const password = e.target[1].value;
      const res = await loginAdmin({
        admin_login: login,
        admin_password: password,
      }).unwrap();
      console.log(res);
      if (res) {
        localStorage.setItem("token", res);
        window.location.reload();
      }
    } catch (err) {
      console.log(err);
      notification.error({ message: err.data.message, description: "" });
    }
  }
  return (
    <div className="login">
      <form
        autoComplete="off"
        onSubmit={(e) => handleSubmit(e)}
        className="login-form"
      >
        <p>Hisobingizga kiring</p>
        <input type="text" name="admin_login" placeholder="Login" />
        <input type="password" name="admin_password" placeholder="Parol" />
        <button type="submit">
          <LuLogIn /> Kirish
        </button>
      </form>
    </div>
  );
};

export default Login;
