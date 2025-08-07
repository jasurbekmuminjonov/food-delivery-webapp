import { useState } from "react";
import img from "../../assets/uz.png";
import { BsArrowLeft } from "react-icons/bs";
import { FaAsterisk } from "react-icons/fa6";

const UserForm = () => {
  const [selectedGender, setSelectedGender] = useState("male");
  return (
    <div className="userform-auth">
      <div>
        <button>
          <BsArrowLeft />
        </button>
        <img src={img} alt="" />
      </div>
      <p>Ma'lumotlaringizni kiriting</p>
      <form>
        <input type="text" placeholder="Ismi" />
        <input type="text" placeholder="Familiyasi" />
        <div>
          <div
            onClick={() => setSelectedGender("male")}
            style={
              selectedGender === "male" ? { border: "2px solid #519872" } : {}
            }
          >
            Erkak
          </div>
          <div
            onClick={() => setSelectedGender("female")}
            style={
              selectedGender === "female" ? { border: "2px solid #519872" } : {}
            }
          >
            Ayol
          </div>
        </div>
        <span>
          <FaAsterisk size={10} /> Noqulayliklarni oldini olish uchun o'zingiz
          bilan bir xil jinsdagi kuryerni yuboramiz
        </span>
        <button type="submit">Davom etish</button>
      </form>
    </div>
  );
};

export default UserForm;
