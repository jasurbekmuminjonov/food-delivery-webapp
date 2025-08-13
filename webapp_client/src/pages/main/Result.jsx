import { IoMdHome, IoMdReorder } from "react-icons/io";
import check from "../../assets/check.png";
import { useNavigate } from "react-router-dom";
const Result = () => {
  const navigate = useNavigate();
  return (
    <div className="success-result">
      <img width={"100"} src={check} alt="" />
      <p>Xaridingiz uchun rahmat</p>
      <span>Buyurtmangiz tez orada yetkaziladi</span>
      <div>
        <button onClick={() => navigate("/order")}>
          <IoMdReorder size={20} /> Buyurtma
        </button>
        <button onClick={() => navigate("/")}>
          <IoMdHome size={16} /> Bosh sahifa
        </button>
      </div>
    </div>
  );
};

export default Result;
