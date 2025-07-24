import Introduction from "../../pages/auth/Introduction";
import Otp from "../../pages/auth/Otp";
import Phone from "../../pages/auth/Phone";
import UserForm from "../../pages/auth/UserForm";

const AuthLayout = () => {
  return (
    <div className="auth-layout">
      {/* <Phone  /> */}
      {/* <Otp /> */}
      <Introduction />
      {/* <UserForm /> */}
    </div>
  );
};

export default AuthLayout;
