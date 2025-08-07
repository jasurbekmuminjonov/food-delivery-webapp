import img from "../../assets/background.png";
const Introduction = () => {
  return (
    <div className="introduction-auth">
      <img src={img} alt="" />
      <div className="int-body">
        <p>
          <b>Test1234</b> supermarketidan mahsulotlarni yetkazib berish
        </p>
        <span>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Alias impedit
          reiciendis voluptatum aliquid! Quod ullam vitae, ut non provident
          perferendis, explicabo assumenda blanditiis perspiciatis id cum
          quibusdam nam! Asperiores, nam!
        </span>
        <button>Boshlash</button>
      </div>
    </div>
  );
};

export default Introduction;
