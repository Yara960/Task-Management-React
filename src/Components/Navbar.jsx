
import { useState } from "react";

import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

import MenuIcon from "@mui/icons-material/Menu";
import TaskAltIcon from "@mui/icons-material/TaskAlt";

import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

function Navbar() {

  // التحكم في فتح وإغلاق القائمة
  const [anchorEl, setAnchorEl] = useState(null);

  // الانتقال بين الصفحات
  const navigate = useNavigate();


  // ==========================================
  // فتح القائمة
  // ==========================================

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };


  // ==========================================
  // إغلاق القائمة
  // ==========================================

  const handleMenuClose = () => {
    setAnchorEl(null);
  };


  // ==========================================
  // الانتقال إلى صفحة المهام
  // ==========================================

  const handleTasks = () => {

    handleMenuClose();

    navigate("/");
  };


  // ==========================================
  // تسجيل الخروج
  // ==========================================

  const handleLogout = async () => {

    handleMenuClose();

    const { error } = await supabase.auth.signOut();

    if (error) {
      console.log(error);
    }
  };


  return (

    <AppBar
      position="static"
      elevation={0}
      sx={{
        backgroundColor: "#263238",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
      }}
    >

      <Toolbar
        sx={{
          minHeight: "70px",
          padding: {
            xs: "0 16px",
            sm: "0 28px",
          },
        }}
      >

        {/* ==========================================
            زر القائمة
        ========================================== */}

        <IconButton
          size="large"
          color="inherit"
          aria-label="menu"
          onClick={handleMenuOpen}
          sx={{
            marginRight: "10px",
            borderRadius: "12px",

            "&:hover": {
              backgroundColor: "rgba(255,255,255,0.08)",
            },
          }}
        >
          <MenuIcon />
        </IconButton>


        {/* ==========================================
            شعار / أيقونة المشروع
        ========================================== */}

        <Box
          sx={{
            width: "40px",
            height: "40px",
            borderRadius: "12px",
            backgroundColor: "#00897B",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginRight: "12px",
          }}
        >

          <TaskAltIcon
            sx={{
              color: "#FFFFFF",
              fontSize: "23px",
            }}
          />

        </Box>


        {/* ==========================================
            اسم المشروع
        ========================================== */}

        <Typography
          variant="h6"
          component="div"
          sx={{
            flexGrow: 1,
            fontWeight: "800",
            letterSpacing: "0.3px",
            color: "#FFFFFF",
            fontSize: {
              xs: "17px",
              sm: "20px",
            },
          }}
        >
          Task Management
        </Typography>


        {/* ==========================================
            أزرار الكمبيوتر
        ========================================== */}

        <Box
          sx={{
            display: {
              xs: "none",
              sm: "flex",
            },
            alignItems: "center",
            gap: "5px",
          }}
        >

          {/* My Tasks */}

          <Button
            onClick={handleTasks}
            sx={{
              color: "#FFFFFF",
              textTransform: "none",
              fontSize: "15px",
              fontWeight: "600",
              borderRadius: "10px",
              padding: "8px 14px",

              "&:hover": {
                backgroundColor: "rgba(255,255,255,0.08)",
              },
            }}
          >
            My Tasks
          </Button>


          {/* Logout */}

          <Button
            onClick={handleLogout}
            sx={{
              color: "#FFFFFF",
              textTransform: "none",
              fontSize: "15px",
              fontWeight: "600",
              borderRadius: "10px",
              padding: "8px 14px",

              "&:hover": {
                backgroundColor: "rgba(255,255,255,0.08)",
              },
            }}
          >
            Logout
          </Button>

        </Box>


        {/* ==========================================
            القائمة
        ========================================== */}

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          PaperProps={{
            sx: {
              marginTop: "8px",
              minWidth: "170px",
              borderRadius: "12px",
              boxShadow: "0 8px 25px rgba(0,0,0,0.12)",
            },
          }}
        >

          {/* My Tasks */}

          <MenuItem
            onClick={handleTasks}
            sx={{
              borderRadius: "8px",
              margin: "4px 6px",
            }}
          >
            My Tasks
          </MenuItem>


          {/* Logout */}

          <MenuItem
            onClick={handleLogout}
            sx={{
              borderRadius: "8px",
              margin: "4px 6px",
            }}
          >
            Logout
          </MenuItem>

        </Menu>

      </Toolbar>

    </AppBar>
  );
}

export default Navbar;

