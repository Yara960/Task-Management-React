import { AppBar, Toolbar, Typography } from "@mui/material";

function Navbar() {
  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: "#d9da93",
        boxShadow: "0 4px 10px rgba(233, 30, 99, 0.3)",
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Typography
          sx={{
            fontSize: "15px",
            fontWeight: "bold",
            color: "black",
          }}
        >
          🌸 Task Management
        </Typography>

        <Typography
          sx={{
            fontSize: "15px",
          }}
        >
          🌸
        </Typography>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
