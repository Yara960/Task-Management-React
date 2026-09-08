
// استيراد React
import { useEffect, useState } from "react";

// استيراد مكونات Material UI
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

// استيراد أيقونة المهام
import TaskAltIcon from "@mui/icons-material/TaskAlt";

// ==========================================
// Header
// ==========================================

function Header() {

  // ==========================================
  // اللغة الحالية
  // ==========================================

  const [language, setLanguage] = useState(() => {
    return localStorage.getItem("language") || "en";
  });

  // ==========================================
  // الاستماع لتغيير اللغة من باقي الصفحات
  // ==========================================

  useEffect(() => {

    const handleLanguageChange = (event) => {

      // تحديث اللغة
      setLanguage(event.detail);

    };

    // الاستماع إلى تغيير اللغة
    window.addEventListener(
      "languageChanged",
      handleLanguageChange
    );

    // إزالة الحدث عند مغادرة الصفحة
    return () => {

      window.removeEventListener(
        "languageChanged",
        handleLanguageChange
      );

    };

  }, []);

  // ==========================================
  // النصوص
  // ==========================================

  const text = {

    en: {
      appName: "Task Management",
      description: "Manage your tasks easily",
    },

    ar: {
      appName: "إدارة المهام",
      description: "إدارة مهامك بسهولة",
    },

  };

  // ==========================================
  // النص الحالي
  // ==========================================

  const currentText =
    language === "ar"
      ? text.ar
      : text.en;

  // ==========================================
  // الواجهة
  // ==========================================

  return (

    <Box
      component="header"
      sx={{
        width: "100%",
        backgroundColor: "#1E293B",
        borderBottom: "1px solid #334155",
        boxShadow:
          "0 2px 10px rgba(15, 23, 42, 0.15)",
      }}
    >

      {/* محتوى الهيدر */}

      <Box
        sx={{
          maxWidth: "1200px",
          margin: "0 auto",
          minHeight: "80px",

          display: "flex",
          alignItems: "center",

          padding: {
            xs: "0 20px",
            sm: "0 30px",
          },
        }}
      >

        {/* أيقونة المشروع */}

        <Box
          sx={{
            width: {
              xs: "45px",
              sm: "50px",
            },

            height: {
              xs: "45px",
              sm: "50px",
            },

            borderRadius: "14px",
            backgroundColor: "#334155",

            display: "flex",
            alignItems: "center",
            justifyContent: "center",

            marginRight:
              language === "ar"
                ? "0"
                : "14px",

            marginLeft:
              language === "ar"
                ? "14px"
                : "0",

            border: "1px solid #475569",
          }}
        >

          <TaskAltIcon
            sx={{
              color: "#5EEAD4",

              fontSize: {
                xs: "25px",
                sm: "29px",
              },
            }}
          />

        </Box>

        {/* اسم المشروع */}

        <Box>

          <Typography
            sx={{
              color: "#F8FAFC",

              fontSize: {
                xs: "21px",
                sm: "25px",
              },

              fontWeight: "800",
              letterSpacing: "-0.5px",
              lineHeight: 1.2,

              textAlign:
                language === "ar"
                  ? "right"
                  : "left",
            }}
          >
            {currentText.appName}
          </Typography>

          {/* الوصف الصغير */}

          <Typography
            sx={{
              color: "#CBD5E1",

              fontSize: {
                xs: "12px",
                sm: "13px",
              },

              marginTop: "4px",

              textAlign:
                language === "ar"
                  ? "right"
                  : "left",
            }}
          >
            {currentText.description}
          </Typography>

        </Box>

      </Box>

    </Box>

  );

}

// تصدير Header
export default Header;
