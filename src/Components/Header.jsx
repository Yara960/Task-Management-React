function Header() {
  return (
    <header
      style={{
        backgroundColor: "#f8b4f8",
        textAlign: "center",
        padding: "18px 10px",
        color: "#880e4f",
        width: "80%",
        margin: "12px auto 25px auto",
       borderRadius: "15px",
      }}
    >
      <div style={{ fontSize: "20px" }}>
        🌷 🌸 🌷
      </div>

      <h1
        style={{
          margin: "5px 0",
          fontSize: "26px",
          fontWeight: "bold",
        }}
      >
        Task Management
      </h1>

      <p
        style={{
          margin: "5px 0",
          fontSize: "14px",
          color: "#ad1457",
        }}
      >
        Organize your tasks easily
      </p>

      <div style={{ fontSize: "20px" }}>
        🌸 🌷 🌸
      </div>
    </header>
  );
}

export default Header;
