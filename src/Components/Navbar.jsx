import { AppBar, Toolbar, Typography } from "@mui/material";

function Navbar() {
  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: "black",
      }}
    >
      <Toolbar>
        <Typography
          variant="h6"
          sx={{
            color: "white",
            textAlign: "left",
            width: "100%",
          }}
        >
          Task Management
        </Typography>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;