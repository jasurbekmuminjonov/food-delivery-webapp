import img from "../../assets/uz.png";
import { BsArrowLeft } from "react-icons/bs";

const Otp = () => {
  return (
    <div className="otp-auth">
      <div className="otp-body">
        <div>
          <button>
            <BsArrowLeft />
          </button>
          <img src={img} alt="" />
        </div>
        <b>+998947052818</b>
        <p>raqamiga yuborilgan SMS kodni kiriting</p>
        <input type="number" placeholder="_ _ _   _ _ _" />
        <p>
          Kodni olmadingizmi? <span>00:59</span>
        </p>
        <button>Takrorlash</button>
      </div>
    </div>
  );
};

export default Otp;
