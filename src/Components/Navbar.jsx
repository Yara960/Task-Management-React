// استيراد React
import { useEffect, useState } from "react";

// استيراد التنقل
import { useNavigate } from "react-router-dom";

// استيراد Material UI
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
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
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";

// استيراد Supabase
import { supabase } from "../supabaseClient";

// استيراد Theme
import { useAppTheme } from "../ThemeContext";


function Navbar() {

  const navigate = useNavigate();


  // =====================================================
  // Theme
  // =====================================================

  const {
    darkMode,
    toggleDarkMode,
  } = useAppTheme();


  // =====================================================
  // بيانات المستخدم
  // =====================================================

  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");


  // =====================================================
  // اللغة
  // =====================================================

  const [language, setLanguage] = useState(
    () => localStorage.getItem("language") || "en"
  );


  // =====================================================
  // القوائم
  // =====================================================

  const [mobileMenuAnchor, setMobileMenuAnchor] =
    useState(null);

  const [userMenuAnchor, setUserMenuAnchor] =
    useState(null);


  // =====================================================
  // النصوص
  // =====================================================

  const texts = {

    en: {

      appName: "Task Management",

      tasks: "Tasks",

      chat: "Chat",

      admin: "Admin",

      profile: "Profile",

      logout: "Logout",

      changePhoto: "Change photo",

      language: "العربية",

      login: "Login",

      lightMode: "Light Mode",

      darkMode: "Dark Mode",

    },


    ar: {

      appName: "إدارة المهام",

      tasks: "المهام",

      chat: "المحادثة",

      admin: "الإدارة",

      profile: "الملف الشخصي",

      logout: "تسجيل الخروج",

      changePhoto: "تغيير الصورة",

      language: "English",

      login: "تسجيل الدخول",

      lightMode: "الوضع الفاتح",

      darkMode: "الوضع الداكن",

    },

  };


  // النصوص الحالية
  const currentText =
    language === "ar"
      ? texts.ar
      : texts.en;


  // =====================================================
  // جلب بيانات المستخدم
  // =====================================================

  async function getUserProfile() {

    const {
      data: { user },
    } = await supabase.auth.getUser();


    // إذا لم يوجد مستخدم
    if (!user) {

      setUserName("");
      setUserRole("");
      setAvatarUrl("");

      return;
    }


    // جلب بيانات المستخدم من profiles
    const {
      data: profile,
      error,
    } = await supabase
      .from("profiles")
      .select("name, role, avatar_url")
      .eq("id", user.id)
      .single();


    if (error) {

      console.log(
        "Get profile error:",
        error
      );

      setUserName(
        user.email || "User"
      );

      return;
    }


    // اسم المستخدم
    setUserName(
      profile?.name ||
      user.email ||
      "User"
    );


    // الدور
    const role =
      profile?.role
        ?.toString()
        ?.trim()
        ?.toUpperCase() ||
      "USER";


    setUserRole(role);


    // صورة المستخدم
    setAvatarUrl(
      profile?.avatar_url || ""
    );


    console.log(
      "User role:",
      role
    );

  }


  // =====================================================
  // تشغيل جلب بيانات المستخدم
  // =====================================================

  useEffect(() => {

    getUserProfile();

  }, []);


  // =====================================================
  // الاستماع لتحديث الصورة
  // =====================================================

  useEffect(() => {

    const handleAvatarUpdate = (event) => {

      setAvatarUrl(
        event.detail || ""
      );

    };


    window.addEventListener(
      "avatarUpdated",
      handleAvatarUpdate
    );


    return () => {

      window.removeEventListener(
        "avatarUpdated",
        handleAvatarUpdate
      );

    };

  }, []);


  // =====================================================
  // الاستماع لتغيير اللغة
  // =====================================================

  useEffect(() => {

    const handleLanguageChange = (event) => {

      setLanguage(
        event.detail
      );

    };


    window.addEventListener(
      "languageChanged",
      handleLanguageChange
    );


    return () => {

      window.removeEventListener(
        "languageChanged",
        handleLanguageChange
      );

    };

  }, []);


  // =====================================================
  // تغيير اللغة
  // =====================================================

  const handleLanguageChange = () => {

    const newLanguage =
      language === "en"
        ? "ar"
        : "en";


    // تحديث اللغة في Navbar
    setLanguage(
      newLanguage
    );


    // حفظ اللغة
    localStorage.setItem(
      "language",
      newLanguage
    );


    // إرسال التغيير لجميع الصفحات
    window.dispatchEvent(
      new CustomEvent(
        "languageChanged",
        {
          detail: newLanguage,
        }
      )
    );

  };


  // =====================================================
  // فتح قائمة المستخدم
  // =====================================================

  const openUserMenu = (event) => {

    setUserMenuAnchor(
      event.currentTarget
    );

  };


  // =====================================================
  // إغلاق قائمة المستخدم
  // =====================================================

  const closeUserMenu = () => {

    setUserMenuAnchor(null);

  };


  // =====================================================
  // فتح قائمة الموبايل
  // =====================================================

  const openMobileMenu = (event) => {

    setMobileMenuAnchor(
      event.currentTarget
    );

  };


  // =====================================================
  // إغلاق قائمة الموبايل
  // =====================================================

  const closeMobileMenu = () => {

    setMobileMenuAnchor(null);

  };


  // =====================================================
  // تسجيل الخروج
  // =====================================================

  const handleLogout = async () => {

    await supabase.auth.signOut();

    closeUserMenu();
    closeMobileMenu();

    navigate("/login");

  };


  // =====================================================
  // تغيير صورة البروفايل
  // =====================================================

  const handleAvatarChange = async (event) => {

    const file =
      event.target.files?.[0];


    if (!file) {
      return;
    }


    // التأكد أن الملف صورة
    if (!file.type.startsWith("image/")) {

      alert(
        "Please select an image file."
      );

      return;
    }


    try {

      // الحصول على المستخدم
      const {
        data: { user },
      } = await supabase.auth.getUser();


      if (!user) {

        alert(
          "User not found."
        );

        return;
      }


      // الحصول على امتداد الصورة
      const fileExtension =
        file.name
          .split(".")
          .pop();


      // إنشاء اسم فريد للصورة
      const fileName =
        `${user.id}-${Date.now()}.${fileExtension}`;


      // رفع الصورة إلى Storage
      const {
        error: uploadError,
      } = await supabase.storage
        .from("avatars")
        .upload(
          fileName,
          file,
          {
            cacheControl: "3600",
            upsert: true,
          }
        );


      if (uploadError) {

        console.log(
          "Upload error:",
          uploadError
        );

        alert(
          "Failed to upload image."
        );

        return;
      }


      // الحصول على الرابط العام للصورة
      const {
        data: publicUrlData,
      } = supabase.storage
        .from("avatars")
        .getPublicUrl(
          fileName
        );


      const publicUrl =
        publicUrlData.publicUrl;


      // حفظ رابط الصورة في profiles
      const {
        error: updateError,
      } = await supabase
        .from("profiles")
        .update({
          avatar_url: publicUrl,
        })
        .eq("id", user.id);


      if (updateError) {

        console.log(
          "Update profile error:",
          updateError
        );

        alert(
          "Failed to update profile picture."
        );

        return;
      }


      // تحديث الصورة في Navbar مباشرة
      setAvatarUrl(
        publicUrl
      );


      // إرسال التحديث لباقي الصفحات
      window.dispatchEvent(
        new CustomEvent(
          "avatarUpdated",
          {
            detail: publicUrl,
          }
        )
      );


      alert(
        "Profile picture updated successfully"
      );

    } catch (error) {

      console.log(
        "Avatar error:",
        error
      );

      alert(
        "Something went wrong."
      );

    }


    // تفريغ input
    event.target.value = "";

  };


  // =====================================================
  // الواجهة
  // =====================================================

  return (

    <AppBar
      position="sticky"
      elevation={0}
    >

      <Toolbar
        sx={{
          minHeight: "70px !important",

          px: {
            xs: 2,
            md: 4,
          },

          display: "flex",

          justifyContent:
            "space-between",
        }}
      >


        {/* =================================================
            Logo
        ================================================= */}

        <Box
          sx={{
            display: "flex",

            alignItems:
              "center",

            gap: 1,

            cursor: "pointer",
          }}

          onClick={() =>
            navigate("/tasks")
          }
        >

          <TaskAltIcon
            sx={{
              color:
                "primary.main",

              fontSize: 32,
            }}
          />


          <Typography
            variant="h6"
            sx={{
              fontWeight:
                "bold",

              color:
                "text.primary",
            }}
          >

            {currentText.appName}

          </Typography>

        </Box>


        {/* =================================================
            Desktop Menu
        ================================================= */}

        <Box
          sx={{
            display: {
              xs: "none",
              md: "flex",
            },

            alignItems:
              "center",

            gap: 1,
          }}
        >


          {/* Tasks */}

          <Button
            onClick={() =>
              navigate("/tasks")
            }

            sx={{
              color:
                "text.primary",

              textTransform:
                "none",

              fontWeight:
                600,
            }}
          >

            {currentText.tasks}

          </Button>


          {/* Chat */}

          <Button
            startIcon={
              <ChatIcon />
            }

            onClick={() =>
              navigate("/chat")
            }

            sx={{
              color:
                "text.primary",

              textTransform:
                "none",

              fontWeight:
                600,
            }}
          >

            {currentText.chat}

          </Button>


          {/* Admin */}

          {(userRole === "ADMIN" ||
            userRole === "SUPERADMIN") && (

            <Button
              startIcon={
                <AdminPanelSettingsIcon />
              }

              onClick={() =>
                navigate("/admin")
              }

              sx={{
                color:
                  "text.primary",

                textTransform:
                  "none",

                fontWeight:
                  600,
              }}
            >

              {currentText.admin}

            </Button>

          )}


          {/* Language */}

          <IconButton
            color="inherit"

            onClick={
              handleLanguageChange
            }

            title={
              currentText.language
            }
          >

            <LanguageIcon />

          </IconButton>


          {/* Dark / Light Mode */}

          <IconButton
            color="inherit"

            onClick={
              toggleDarkMode
            }

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


          {/* User Avatar */}

          <IconButton
            onClick={
              openUserMenu
            }

            sx={{
              ml: 1,
            }}
          >

            <Avatar
              src={
                avatarUrl ||
                undefined
              }

              alt={
                userName
              }

              sx={{
                width: 40,
                height: 40,
              }}
            >

              {!avatarUrl && (
                <PersonIcon />
              )}

            </Avatar>

          </IconButton>

        </Box>


        {/* =================================================
            Mobile Menu Icons
        ================================================= */}

        <Box
          sx={{
            display: {
              xs: "flex",
              md: "none",
            },

            alignItems:
              "center",

            gap: 0.5,
          }}
        >


          {/* Language */}

          <IconButton
            color="inherit"

            onClick={
              handleLanguageChange
            }
          >

            <LanguageIcon />

          </IconButton>


          {/* Dark / Light */}

          <IconButton
            color="inherit"

            onClick={
              toggleDarkMode
            }
          >

            {darkMode ? (

              <LightModeIcon />

            ) : (

              <DarkModeIcon />

            )}

          </IconButton>


          {/* Mobile Menu */}

          <IconButton
            color="inherit"

            onClick={
              openMobileMenu
            }
          >

            <MenuIcon />

          </IconButton>

        </Box>

      </Toolbar>


      {/* =====================================================
          User Menu
      ===================================================== */}

      <Menu
        anchorEl={
          userMenuAnchor
        }

        open={
          Boolean(userMenuAnchor)
        }

        onClose={
          closeUserMenu
        }

        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}

        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >


        {/* معلومات المستخدم */}

        <Box
          sx={{
            px: 2,
            py: 1,
            minWidth: 200,
          }}
        >

          <Typography
            sx={{
              fontWeight:
                "bold",

              color:
                "text.primary",
            }}
          >

            {userName}

          </Typography>


          <Typography
            sx={{
              fontSize: 12,

              color:
                "text.secondary",

              textTransform:
                "uppercase",
            }}
          >

            {userRole}

          </Typography>

        </Box>


        <Divider />


        {/* Profile */}

        <MenuItem
          onClick={() => {

            closeUserMenu();

            navigate(
              "/profile"
            );

          }}
        >

          <PersonIcon
            sx={{
              mr: 1,
            }}
          />

          {currentText.profile}

        </MenuItem>


        {/* Change Photo */}

        <MenuItem
          component="label"
        >

          <PhotoCameraIcon
            sx={{
              mr: 1,
            }}
          />

          {currentText.changePhoto}


          <input
            type="file"

            hidden

            accept="image/*"

            onChange={
              handleAvatarChange
            }
          />

        </MenuItem>


        <Divider />


        {/* Logout */}

        <MenuItem
          onClick={
            handleLogout
          }
        >

          <LogoutIcon
            sx={{
              mr: 1,
            }}
          />

          {currentText.logout}

        </MenuItem>

      </Menu>


      {/* =====================================================
          Mobile Menu
      ===================================================== */}

      <Menu
        anchorEl={
          mobileMenuAnchor
        }

        open={
          Boolean(mobileMenuAnchor)
        }

        onClose={
          closeMobileMenu
        }

        PaperProps={{
          sx: {
            minWidth: 220,
            mt: 1,
          },
        }}
      >


        {/* Tasks */}

        <MenuItem
          onClick={() => {

            closeMobileMenu();

            navigate(
              "/tasks"
            );

          }}
        >

          <TaskAltIcon
            sx={{
              mr: 1,
            }}
          />

          {currentText.tasks}

        </MenuItem>


        {/* Chat */}

        <MenuItem
          onClick={() => {

            closeMobileMenu();

            navigate(
              "/chat"
            );

          }}
        >

          <ChatIcon
            sx={{
              mr: 1,
            }}
          />

          {currentText.chat}

        </MenuItem>


        {/* Admin */}

        {(userRole === "ADMIN" ||
          userRole === "SUPERADMIN") && (

          <MenuItem
            onClick={() => {

              closeMobileMenu();

              navigate(
                "/admin"
              );

            }}
          >

            <AdminPanelSettingsIcon
              sx={{
                mr: 1,
              }}
            />

            {currentText.admin}

          </MenuItem>

        )}


        <Divider />


        {/* Profile */}

        <MenuItem
          onClick={() => {

            closeMobileMenu();

            navigate(
              "/profile"
            );

          }}
        >

          <PersonIcon
            sx={{
              mr: 1,
            }}
          />

          {currentText.profile}

        </MenuItem>


        {/* Change Photo */}

        <MenuItem
          component="label"

          onClick={
            closeMobileMenu
          }
        >

          <PhotoCameraIcon
            sx={{
              mr: 1,
            }}
          />

          {currentText.changePhoto}


          <input
            type="file"

            hidden

            accept="image/*"

            onChange={
              handleAvatarChange
            }
          />

        </MenuItem>


        <Divider />


        {/* Logout */}

        <MenuItem
          onClick={
            handleLogout
          }
        >

          <LogoutIcon
            sx={{
              mr: 1,
            }}
          />

          {currentText.logout}

        </MenuItem>

      </Menu>

    </AppBar>
  );
}


export default Navbar;