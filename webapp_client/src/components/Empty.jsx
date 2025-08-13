import emptyImg from "../assets/empty.png";
const Empty = ({ text }) => {
  return (
    <div className="empty-box">
      <img src={emptyImg} alt="" />
      <p>{text}</p>
    </div>
  );
};

export default Empty;
