import img from "../../assets/uz.png";

const Phone = () => {
  return (
    <div className="auth-phone">
      <div className="phone-body">
        <img src={img} alt="" />
        <b>Telefon raqamni kiriting</b>
        <input type="tel" placeholder="+998 (00) 000-00-00" />
        <button>Davom etish</button>
        <p>
          Davom etish orqali <a href="#">Ommaviy oferta</a> shartlarini qabul
          qilaman va shaxsiy ma'lumotlarim{" "}
          <a href="#">Shaxsiy ma'lumotlarni qayta ishlash siyosatiga</a> muvofiq
          qayta ishlanishiga rozilik bildiraman
        </p>
      </div>
    </div>
  );
};

export default Phone;
