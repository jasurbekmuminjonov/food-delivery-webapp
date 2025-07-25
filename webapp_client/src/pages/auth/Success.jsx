import check from "../../assets/check.png";

const Success = () => {
  return (
    <div className="success-auth">
      <div className="success-body">
        <img src={check} alt="" />
        <h2>Muvaffaqiyatli ro'yhatdan o'tdingiz</h2>
      </div>
      <button>Bosh sahifa</button>
    </div>
  );
};

export default Success;
