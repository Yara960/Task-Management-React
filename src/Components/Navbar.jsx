// استيراد React
import { useEffect, useState } from "react";

// استيراد Material UI
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Avatar from "@mui/material/Avatar";

// استيراد الأيقونات
import MenuIcon from "@mui/icons-material/Menu";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import LanguageIcon from "@mui/icons-material/Language";
import ChatIcon from "@mui/icons-material/Chat";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";

// React Router
import { useNavigate } from "react-router-dom";

// Supabase
import { supabase } from "../supabaseClient";

// Theme
import { useAppTheme } from "../ThemeContext";


// =====================================================
// Navbar
// =====================================================

export default function Navbar() {

  // التنقل بين الصفحات
  const navigate = useNavigate();


  // Dark Mode من ThemeContext
  const {
    darkMode,
    toggleDarkMode,
  } = useAppTheme();


  // حالة القائمة في الجوال
  const [anchorEl, setAnchorEl] = useState(null);


  // اسم المستخدم
  const [userName, setUserName] = useState("User");


  // Role المستخدم
  const [userRole, setUserRole] = useState("USER");


  // اللغة
  const [language, setLanguage] = useState(() => {

    return localStorage.getItem("language") || "en";

  });


  // =====================================================
  // الحصول على بيانات المستخدم
  // =====================================================

  useEffect(() => {

    getUserProfile();

  }, []);


  const getUserProfile = async () => {

    try {

      // الحصول على المستخدم الحالي
      const {
        data: {
          user,
        },
      } = await supabase.auth.getUser();


      // إذا لم يوجد مستخدم
      if (!user) {

        return;

      }


      // الحصول على بيانات المستخدم من profiles
      const {
        data: profile,
        error,
      } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();


      if (error) {

        console.log("Profile error:", error);

        return;

      }


      // الاسم
      setUserName(
        profile?.name ||
        user?.user_metadata?.name ||
        user?.email?.split("@")[0] ||
        "User"
      );


      // الدور
      setUserRole(
        profile?.role || "USER"
      );

    } catch (error) {

      console.log(error);

    }
  };


  // =====================================================
  // تغيير اللغة
  // =====================================================

  useEffect(() => {

    // حفظ اللغة
    localStorage.setItem("language", language);


    // تغيير اتجاه الصفحة
    if (language === "ar") {

      document.documentElement.dir = "rtl";
      document.documentElement.lang = "ar";

    } else {

      document.documentElement.dir = "ltr";
      document.documentElement.lang = "en";

    }

  }, [language]);


  // تغيير اللغة
  const toggleLanguage = () => {

    setLanguage((previousLanguage) => {

      return previousLanguage === "en"
        ? "ar"
        : "en";

    });

  };


  // =====================================================
  // فتح قائمة الجوال
  // =====================================================

  const handleMenuOpen = (event) => {

    setAnchorEl(event.currentTarget);

  };


  // =====================================================
  // إغلاق قائمة الجوال
  // =====================================================

  const handleMenuClose = () => {

    setAnchorEl(null);

  };


  // =====================================================
  // التنقل
  // =====================================================

  const goToTasks = () => {

    handleMenuClose();

    navigate("/");

  };


  const goToProfile = () => {

    handleMenuClose();

    navigate("/profile");

  };


  const goToChat = () => {

    handleMenuClose();

    navigate("/chat");

  };


  const goToAdmin = () => {

    handleMenuClose();

    navigate("/admin");

  };


  // =====================================================
  // تسجيل الخروج
  // =====================================================

  const handleLogout = async () => {

    try {

      await supabase.auth.signOut();

      handleMenuClose();

      navigate("/login");

    } catch (error) {

      console.log("Logout error:", error);

    }

  };


  // =====================================================
  // النصوص
  // =====================================================

  const text = {

    en: {

      appName: "Task Management",

      myTasks: "My Tasks",

      chat: "Chat",

      admin: "Admin",

      logout: "Logout",

      profile: "Profile",

      language: "العربية",

      darkMode: "Dark Mode",

      lightMode: "Light Mode",

      tasks: "Tasks",

      welcome: "Welcome",

    },


    ar: {

      appName: "إدارة المهام",

      myTasks: "مهامي",

      chat: "المحادثة",

      admin: "الإدارة",

      logout: "تسجيل الخروج",

      profile: "الملف الشخصي",

      language: "English",

      darkMode: "الوضع الليلي",

      lightMode: "الوضع النهاري",

      tasks: "المهام",

      welcome: "مرحباً",

    },

  };


  const currentText =
    language === "ar"
      ? text.ar
      : text.en;


  // =====================================================
  // الحروف الأولى للاسم
  // =====================================================

  const avatarLetter =
    userName?.charAt(0)?.toUpperCase() || "U";


  return (

    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        zIndex: 1100,
      }}
    >

      <Toolbar
        sx={{
          minHeight: "70px !important",

          px: {
            xs: 2,
            md: 4,
          },

          gap: 1,
        }}
      >


        {/* =================================================
            Logo
        ================================================= */}

        <Box
          onClick={goToTasks}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,

            cursor: "pointer",

            mr: {
              xs: 0,
              md: 3,
            },

            flexGrow: {
              xs: 1,
              md: 0,
            },
          }}
        >

          <TaskAltIcon
            sx={{
              fontSize: 32,
              color: "primary.main",
            }}
          />

          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,

              display: {
                xs: "none",
                sm: "block",
              },
            }}
          >

            {currentText.appName}

          </Typography>

        </Box>


        {/* =================================================
            Desktop Navigation
        ================================================= */}

        <Box
          sx={{
            display: {
              xs: "none",
              md: "flex",
            },

            alignItems: "center",

            gap: 1,

            flexGrow: 1,
          }}
        >

          {/* My Tasks */}

          <Button
            color="inherit"
            startIcon={<TaskAltIcon />}
            onClick={goToTasks}
            sx={{
              borderRadius: 2,
              px: 2,
            }}
          >

            {currentText.myTasks}

          </Button>


          {/* Chat */}

          <Button
            color="inherit"
            startIcon={<ChatIcon />}
            onClick={goToChat}
            sx={{
              borderRadius: 2,
              px: 2,
            }}
          >

            {currentText.chat}

          </Button>


          {/* Admin - SUPERADMIN فقط */}

          {userRole === "SUPERADMIN" && (

            <Button
              color="inherit"
              startIcon={
                <AdminPanelSettingsIcon />
              }
              onClick={goToAdmin}
              sx={{
                borderRadius: 2,
                px: 2,
              }}
            >

              {currentText.admin}

            </Button>

          )}

        </Box>


        {/* =================================================
            Desktop Actions
        ================================================= */}

        <Box
          sx={{
            display: {
              xs: "none",
              md: "flex",
            },

            alignItems: "center",

            gap: 1,
          }}
        >


          {/* المستخدم */}

          <Box
            onClick={goToProfile}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,

              cursor: "pointer",

              px: 1.5,
              py: 0.5,

              borderRadius: 2,

              "&:hover": {
                backgroundColor:
                  "rgba(255,255,255,0.08)",
              },
            }}
          >

            <Avatar
              sx={{
                width: 34,
                height: 34,

                bgcolor: "secondary.main",

                fontSize: 15,
              }}
            >

              {avatarLetter}

            </Avatar>


            <Typography
              variant="body2"
              sx={{
                fontWeight: 600,
                maxWidth: 120,

                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >

              {userName}

            </Typography>

          </Box>


          {/* Dark Mode */}

          <IconButton
            color="inherit"
            onClick={toggleDarkMode}
            title={
              darkMode
                ? currentText.lightMode
                : currentText.darkMode
            }
          >

            {darkMode ? (

              <LightModeIcon />

            ) : (

              <DarkModeIcon />

            )}

          </IconButton>


          {/* Language */}

          <IconButton
            color="inherit"
            onClick={toggleLanguage}
            title={currentText.language}
          >

            <LanguageIcon />

          </IconButton>


          {/* Logout */}

          <Button
            color="inherit"
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
            sx={{
              borderRadius: 2,
              px: 2,
            }}
          >

            {currentText.logout}

          </Button>

        </Box>


        {/* =================================================
            Mobile Menu Button
        ================================================= */}

        <Box
          sx={{
            display: {
              xs: "block",
              md: "none",
            },
          }}
        >

          <IconButton
            color="inherit"
            onClick={handleMenuOpen}
          >

            <MenuIcon />

          </IconButton>


          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            PaperProps={{
              sx: {
                mt: 1,

                minWidth: 220,

                backgroundColor:
                  "background.paper",

                color: "text.primary",
              },
            }}
          >


            {/* المستخدم */}

            <MenuItem
              onClick={goToProfile}
              sx={{
                gap: 1,
              }}
            >

              <PersonIcon fontSize="small" />

              <Box>

                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                  }}
                >

                  {userName}

                </Typography>

                <Typography
                  variant="caption"
                  color="text.secondary"
                >

                  {currentText.profile}

                </Typography>

              </Box>

            </MenuItem>


            <Divider />


            {/* My Tasks */}

            <MenuItem onClick={goToTasks}>

              <TaskAltIcon
                fontSize="small"
                sx={{
                  mr: 1,
                }}
              />

              {currentText.myTasks}

            </MenuItem>


            {/* Chat */}

            <MenuItem onClick={goToChat}>

              <ChatIcon
                fontSize="small"
                sx={{
                  mr: 1,
                }}
              />

              {currentText.chat}

            </MenuItem>


            {/* Admin */}

            {userRole === "SUPERADMIN" && (

              <MenuItem onClick={goToAdmin}>

                <AdminPanelSettingsIcon
                  fontSize="small"
                  sx={{
                    mr: 1,
                  }}
                />

                {currentText.admin}

              </MenuItem>

            )}


            <Divider />


            {/* Dark Mode */}

            <MenuItem
              onClick={() => {

                toggleDarkMode();

                handleMenuClose();

              }}
            >

              {darkMode ? (

                <LightModeIcon
                  fontSize="small"
                  sx={{
                    mr: 1,
                  }}
                />

              ) : (

                <DarkModeIcon
                  fontSize="small"
                  sx={{
                    mr: 1,
                  }}
                />

              )}

              {darkMode
                ? currentText.lightMode
                : currentText.darkMode}

            </MenuItem>


            {/* Language */}

            <MenuItem
              onClick={() => {

                toggleLanguage();

                handleMenuClose();

              }}
            >

              <LanguageIcon
                fontSize="small"
                sx={{
                  mr: 1,
                }}
              />

              {currentText.language}

            </MenuItem>


            <Divider />


            {/* Logout */}

            <MenuItem onClick={handleLogout}>

              <LogoutIcon
                fontSize="small"
                sx={{
                  mr: 1,
                }}
              />

              {currentText.logout}

            </MenuItem>

          </Menu>

        </Box>

      </Toolbar>

    </AppBar>
  );
}