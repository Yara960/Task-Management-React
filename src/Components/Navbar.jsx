// استيراد useState و useEffect من React
import { useState, useEffect } from "react";

// استيراد مكونات Material UI
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";

// استيراد الأيقونات
import MenuIcon from "@mui/icons-material/Menu";
import TaskAltIcon from "@mui/icons-material/TaskAlt";

// استيراد التنقل بين الصفحات
import { useNavigate } from "react-router-dom";

// استيراد Supabase
import { supabase } from "../supabaseClient";

function Navbar() {

  // التحكم في فتح وإغلاق قائمة الثلاث خطوط
  const [anchorEl, setAnchorEl] = useState(null);

  // تخزين اسم المستخدم
  const [userName, setUserName] = useState("");

  // الانتقال بين الصفحات
  const navigate = useNavigate();

  // ==========================================
  // جلب اسم المستخدم من Supabase
  // ==========================================

  useEffect(() => {

    const getUser = async () => {

      // جلب المستخدم الحالي
      const { data, error } = await supabase.auth.getUser();

      // في حالة وجود خطأ
      if (error) {
        console.log(error);
        return;
      }

      // إذا كان هناك مستخدم
      if (data.user) {

        // جلب اسم المستخدم من بيانات الحساب
        setUserName(
          data.user.user_metadata?.name || "User"
        );

      }

    };

    getUser();

  }, []);

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

    // إغلاق القائمة
    handleMenuClose();

    // الانتقال إلى الصفحة الرئيسية
    navigate("/");

  };

  // ==========================================
  // الانتقال إلى الملف الشخصي
  // ==========================================

  const handleProfile = () => {

    // إغلاق القائمة
    handleMenuClose();

    // الانتقال إلى صفحة Profile
    navigate("/profile");

  };

  // ==========================================
  // الانتقال إلى صفحة الدردشة
  // ==========================================

  const handleChat = () => {

    // إغلاق القائمة
    handleMenuClose();

    // الانتقال إلى صفحة Chat
    navigate("/chat");

  };

  // ==========================================
  // تسجيل الخروج
  // ==========================================

  const handleLogout = async () => {

    // إغلاق القائمة
    handleMenuClose();

    // تسجيل الخروج من Supabase
    const { error } = await supabase.auth.signOut();

    // في حالة وجود خطأ
    if (error) {

      console.log(error);
      return;

    }

    // الانتقال إلى صفحة تسجيل الدخول
    navigate("/login");

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
            زر الثلاث خطوط
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
            شعار المشروع
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
            onClick={handleProfile}
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


          {/* Chat */}

          <Button
            onClick={handleChat}
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
            Chat
          </Button>


          {/* زر Logout */}

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
            القائمة التي تظهر عند الضغط على الثلاث خطوط
        ========================================== */}

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          PaperProps={{
            sx: {
              marginTop: "8px",
              minWidth: "210px",
              borderRadius: "12px",
              boxShadow: "0 8px 25px rgba(0,0,0,0.12)",
            },
          }}
        >

          {/* ==========================================
              اسم المستخدم - قابل للضغط
          ========================================== */}

          <Box
            onClick={handleProfile}
            sx={{
              padding: "14px 16px",
              cursor: "pointer",
              borderRadius: "10px",
              margin: "4px 6px",

              "&:hover": {
                backgroundColor: "#F5F7FA",
              },
            }}
          >

            <Typography
              sx={{
                color: "#263238",
                fontSize: "15px",
                fontWeight: "700",
              }}
            >
              {userName || "User"}
            </Typography>

            <Typography
              sx={{
                color: "#78909C",
                fontSize: "12px",
                marginTop: "3px",
              }}
            >
              View Profile
            </Typography>

          </Box>


          {/* خط فاصل */}

          <Divider />


          {/* ==========================================
              Tasks
          ========================================== */}

          <MenuItem
            onClick={handleTasks}
            sx={{
              margin: "4px 6px",
              borderRadius: "8px",
            }}
          >
            Tasks
          </MenuItem>


          {/* ==========================================
              Chat
          ========================================== */}

          <MenuItem
            onClick={handleChat}
            sx={{
              margin: "4px 6px",
              borderRadius: "8px",
            }}
          >
            Chat
          </MenuItem>


          {/* ==========================================
              Logout
          ========================================== */}

          <MenuItem
            onClick={handleLogout}
            sx={{
              margin: "4px 6px",
              borderRadius: "8px",
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