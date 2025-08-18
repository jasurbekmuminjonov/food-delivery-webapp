import emptyShelf from "../assets/empty_shelf.avif";

const EmptyCard = () => {
  return (
    <div className="card">
      <div className="card-image">
        <img src={emptyShelf} alt="" />
      </div>
      <div className="card-title">
        <h5 style={{ textAlign: "center" }}>Bu turkumda mahsulotlar yo'q</h5>
      </div>
    </div>
  );
};

export default EmptyCard;
