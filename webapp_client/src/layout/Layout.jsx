const Layout = () => {
  return (
    <div className="layout">
      <p>{localStorage.getItem("telegram_id")}</p>
    </div>
  );
};

export default Layout;
