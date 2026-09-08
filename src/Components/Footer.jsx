
// استيراد React
import { useEffect, useState } from "react";

// استيراد مكونات Material UI
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";

// استيراد useTheme
import { useTheme } from "@mui/material/styles";

// استيراد أيقونة المهام
import TaskAltIcon from "@mui/icons-material/TaskAlt";

// ==========================================
// Footer
// ==========================================

function Footer() {
  // الحصول على الثيم الحالي
  const theme = useTheme();

  // معرفة الوضع الحالي
  const isDark = theme.palette.mode === "dark";

  // ==========================================
  // اللغة الحالية
  // ==========================================

  const [language, setLanguage] = useState(() => {
    return localStorage.getItem("language") || "en";
  });

  // ==========================================
  // الاستماع لتغيير اللغة من أي صفحة
  // ==========================================

  useEffect(() => {
    const handleLanguageChange = (event) => {
      setLanguage(event.detail);
    };

    window.addEventListener(
      "languageChanged",
      handleLanguageChange
    );

    // تنظيف الحدث عند إغلاق الصفحة
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
      sideText: "Stay organized. Stay productive.",
      rights: "© 2026 Task Management. All rights reserved.",
    },

    ar: {
      appName: "إدارة المهام",
      description: "إدارة مهامك بسهولة",
      sideText: "كن منظمًا. كن أكثر إنتاجية.",
      rights: "© 2026 إدارة المهام. جميع الحقوق محفوظة.",
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
      component="footer"
      sx={{
        width: "100%",

        // نفس اللون الداكن في الوضعين
        backgroundColor: "#1E293B",

        // لون النص الرئيسي
        color: "#F8FAFC",

        marginTop: "auto",

        // انتقال ناعم عند تغيير الوضع
        transition:
          "background-color 0.3s ease, color 0.3s ease",

        // نفس حدود الـ Navbar
        borderTop: "1px solid #334155",
      }}
    >
      {/* محتوى الفوتر */}

      <Box
        sx={{
          maxWidth: "1200px",
          margin: "0 auto",

          padding: {
            xs: "25px 20px",
            sm: "30px",
          },
        }}
      >
        {/* القسم الرئيسي */}

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "20px",
          }}
        >
          {/* اسم المشروع */}

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            {/* أيقونة */}

            <Box
              sx={{
                width: "42px",
                height: "42px",
                borderRadius: "12px",

                // خلفية الأيقونة
                backgroundColor: isDark
                  ? "#273449"
                  : "#334155",

                display: "flex",
                alignItems: "center",
                justifyContent: "center",

                transition:
                  "background-color 0.3s ease",
              }}
            >
              <TaskAltIcon
                sx={{
                  // نفس لون الـ Primary
                  color: isDark
                    ? "#80CBC4"
                    : "#5EEAD4",

                  fontSize: "23px",
                }}
              />
            </Box>

            {/* النص */}

            <Box>
              <Typography
                sx={{
                  fontSize: "17px",
                  fontWeight: "bold",
                  color: "#F8FAFC",
                }}
              >
                {currentText.appName}
              </Typography>

              <Typography
                sx={{
                  fontSize: "12px",
                  color: "#CBD5E1",
                  marginTop: "3px",
                }}
              >
                {currentText.description}
              </Typography>
            </Box>
          </Box>

          {/* النص الجانبي */}

          <Typography
            sx={{
              color: "#CBD5E1",
              fontSize: "13px",
            }}
          >
            {currentText.sideText}
          </Typography>
        </Box>

        {/* خط فاصل */}

        <Divider
          sx={{
            margin: "22px 0 15px",
            borderColor: "#334155",
          }}
        />

        {/* حقوق المشروع */}

        <Typography
          sx={{
            textAlign: "center",
            color: "#94A3B8",
            fontSize: "12px",
          }}
        >
          {currentText.rights}
        </Typography>
      </Box>
    </Box>
  );
}

// تصدير Footer
export default Footer;
