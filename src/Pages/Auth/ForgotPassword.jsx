
// استيراد useState و useEffect من React
import { useEffect, useState } from "react";

// استيراد مكونات Material UI
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";

// استيراد الأيقونات
import LockResetIcon from "@mui/icons-material/LockReset";
import LanguageIcon from "@mui/icons-material/Language";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";

// استيراد Supabase
import { supabase } from "../../supabaseClient";

// استيراد React Router
import { Link } from "react-router-dom";

// استيراد الثيم
import { useAppTheme } from "../../ThemeContext";

function ForgotPassword() {

  // التحكم في الوضع الليلي
  const { darkMode, toggleDarkMode } = useAppTheme();

  // تخزين البريد الإلكتروني
  const [email, setEmail] = useState("");

  // رسالة الخطأ
  const [error, setError] = useState("");

  // رسالة النجاح
  const [message, setMessage] = useState("");

  // اللغة الحالية
  const [language, setLanguage] = useState(
    () => localStorage.getItem("language") || "en"
  );


  // ==========================================
  // النصوص باللغتين
  // ==========================================

  const text = {

    en: {
      title: "Forgot Password?",

      description:
        "Enter your email to reset your password",

      email: "Email",

      emailPlaceholder:
        "Enter your email",

      sendReset:
        "Send Reset Link",

      backToLogin:
        "Back to Login",

      language:
        "العربية",

      darkMode:
        "Dark Mode",

      lightMode:
        "Light Mode",

      required:
        "Please enter your email.",

      invalidEmail:
        "Please enter a valid email address.",

      success:
        "Password reset link has been sent to your email.",

      unexpected:
        "Something went wrong. Please try again.",
    },


    ar: {
      title: "نسيت كلمة المرور؟",

      description:
        "أدخل بريدك الإلكتروني لإعادة تعيين كلمة المرور",

      email:
        "البريد الإلكتروني",

      emailPlaceholder:
        "أدخل بريدك الإلكتروني",

      sendReset:
        "إرسال رابط إعادة التعيين",

      backToLogin:
        "العودة لتسجيل الدخول",

      language:
        "English",

      darkMode:
        "الوضع الليلي",

      lightMode:
        "الوضع النهاري",

      required:
        "يرجى إدخال بريدك الإلكتروني.",

      invalidEmail:
        "يرجى إدخال بريد إلكتروني صحيح.",

      success:
        "تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني.",

      unexpected:
        "حدث خطأ غير متوقع. حاول مرة أخرى.",
    },

  };


  // النصوص حسب اللغة
  const currentText =
    language === "ar"
      ? text.ar
      : text.en;


  // ==========================================
  // استقبال تغيير اللغة من Navbar
  // ==========================================

  useEffect(() => {

    const handleLanguageChange = (event) => {

      setLanguage(event.detail);

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


  // ==========================================
  // تغيير اتجاه الصفحة
  // ==========================================

  useEffect(() => {

    if (language === "ar") {

      document.documentElement.dir = "rtl";
      document.documentElement.lang = "ar";

    } else {

      document.documentElement.dir = "ltr";
      document.documentElement.lang = "en";

    }


    // حفظ اللغة
    localStorage.setItem(
      "language",
      language
    );

  }, [language]);


  // ==========================================
  // تغيير اللغة
  // ==========================================

  const toggleLanguage = () => {

    const newLanguage =
      language === "en"
        ? "ar"
        : "en";


    setLanguage(newLanguage);


    localStorage.setItem(
      "language",
      newLanguage
    );


    // إرسال اللغة لباقي الصفحات
    window.dispatchEvent(
      new CustomEvent(
        "languageChanged",
        {
          detail: newLanguage,
        }
      )
    );

  };


  // ==========================================
  // التحقق من البريد الإلكتروني
  // ==========================================

  function isValidEmail(value) {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
      value.trim()
    );

  }


  // ==========================================
  // إرسال رابط تغيير كلمة المرور
  // ==========================================

  async function handleReset(e) {

    // منع تحديث الصفحة
    e.preventDefault();


    // مسح الرسائل القديمة
    setError("");
    setMessage("");


    // ==========================================
    // التأكد من إدخال البريد
    // ==========================================

    if (!email.trim()) {

      setError(
        currentText.required
      );

      return;

    }


    // ==========================================
    // التأكد من صحة البريد
    // ==========================================

    if (!isValidEmail(email)) {

      setError(
        currentText.invalidEmail
      );

      return;

    }


    // ==========================================
    // إرسال رابط إعادة تعيين كلمة المرور
    // ==========================================

    const { error } =
      await supabase.auth.resetPasswordForEmail(
        email.trim(),
        {
          redirectTo:
            `${window.location.origin}/reset-password`,
        }
      );


    // ==========================================
    // إذا حدث خطأ
    // ==========================================

    if (error) {

      console.log(
        "Reset password error:",
        error
      );


      setError(
        currentText.unexpected
      );


      return;

    }


    // ==========================================
    // رسالة النجاح
    // ==========================================

    setMessage(
      currentText.success
    );

  }


  // ==========================================
  // واجهة الصفحة
  // ==========================================

  return (

    <Box
      sx={{
        minHeight: "100vh",

        backgroundColor:
          "background.default",

        color:
          "text.primary",

        display: "flex",

        justifyContent: "center",

        alignItems: "center",

        padding: {
          xs: "24px 16px",
          sm: "40px 20px",
        },

        transition:
          "background-color 0.3s, color 0.3s",
      }}
    >

      {/* ==========================================
          المربع الرئيسي
          ========================================== */}

      <Paper
        elevation={0}
        sx={{
          width: "100%",

          maxWidth: "430px",

          padding: {
            xs: "28px 22px",
            sm: "36px 34px",
          },

          borderRadius: "20px",

          position: "relative",

          overflow: "hidden",
        }}
      >

        {/* ==========================================
            الأزرار العلوية
            ========================================== */}

        <Box
          sx={{
            display: "flex",

            justifyContent: "flex-end",

            alignItems: "center",

            gap: "6px",

            marginBottom: "18px",
          }}
        >

          {/* زر اللغة */}

          <IconButton
            onClick={toggleLanguage}
            title={currentText.language}
            sx={{
              color:
                "text.secondary",

              borderRadius:
                "10px",

              "&:hover": {

                backgroundColor:
                  darkMode
                    ? "rgba(128,203,196,0.10)"
                    : "rgba(0,137,123,0.06)",

                color:
                  "primary.main",
              },
            }}
          >

            <LanguageIcon />

          </IconButton>


          {/* زر Dark / Light */}

          <IconButton
            onClick={toggleDarkMode}
            title={
              darkMode
                ? currentText.lightMode
                : currentText.darkMode
            }
            sx={{
              color:
                "text.secondary",

              borderRadius:
                "10px",

              "&:hover": {

                backgroundColor:
                  darkMode
                    ? "rgba(128,203,196,0.10)"
                    : "rgba(0,137,123,0.06)",

                color:
                  "primary.main",
              },
            }}
          >

            {darkMode ? (
              <LightModeIcon />
            ) : (
              <DarkModeIcon />
            )}

          </IconButton>

        </Box>


        {/* ==========================================
            الأيقونة
            ========================================== */}

        <Box
          sx={{
            width:
              "65px",

            height:
              "65px",

            borderRadius:
              "18px",

            backgroundColor:
              darkMode
                ? "rgba(128,203,196,0.12)"
                : "#E0F2F1",

            display:
              "flex",

            justifyContent:
              "center",

            alignItems:
              "center",

            margin:
              "0 auto 18px",
          }}
        >

          <LockResetIcon
            sx={{
              color:
                "primary.main",

              fontSize:
                "34px",
            }}
          />

        </Box>


        {/* ==========================================
            العنوان
            ========================================== */}

        <Typography
          sx={{
            textAlign:
              "center",

            fontSize:
              "26px",

            fontWeight:
              "800",

            color:
              "text.primary",
          }}
        >
          {currentText.title}
        </Typography>


        {/* الوصف */}

        <Typography
          sx={{
            textAlign:
              "center",

            color:
              "text.secondary",

            fontSize:
              "14px",

            lineHeight:
              "1.6",

            marginTop:
              "8px",

            marginBottom:
              "28px",
          }}
        >
          {currentText.description}
        </Typography>


        {/* ==========================================
            التنبيه الأحمر
            ========================================== */}

        {error && (

          <Box
            sx={{
              display:
                "flex",

              alignItems:
                "center",

              gap:
                "10px",

              backgroundColor:
                darkMode
                  ? "#3B1F1F"
                  : "#FFEBEE",

              border:
                darkMode
                  ? "1px solid #7F1D1D"
                  : "1px solid #FFCDD2",

              color:
                darkMode
                  ? "#FF8A80"
                  : "#D32F2F",

              borderRadius:
                "10px",

              padding:
                "12px 14px",

              marginBottom:
                "20px",

              fontSize:
                "13px",

              fontWeight:
                "500",

              lineHeight:
                "1.6",

              boxShadow:
                darkMode
                  ? "0 4px 12px rgba(239,83,80,0.18)"
                  : "0 4px 12px rgba(211,47,47,0.08)",
            }}
          >

            {/* علامة التنبيه */}

            <Box
              sx={{
                minWidth:
                  "28px",

                width:
                  "28px",

                height:
                  "28px",

                borderRadius:
                  "50%",

                display:
                  "flex",

                alignItems:
                  "center",

                justifyContent:
                  "center",

                backgroundColor:
                  darkMode
                    ? "#7F1D1D"
                    : "#FFCDD2",

                color:
                  darkMode
                    ? "#FF8A80"
                    : "#D32F2F",

                fontSize:
                  "16px",

                fontWeight:
                  "700",
              }}
            >
              !
            </Box>


            {/* نص الخطأ */}

            <Typography
              sx={{
                fontSize:
                  "13px",

                fontWeight:
                  "600",

                color:
                  "inherit",

                lineHeight:
                  "1.6",
              }}
            >
              {error}
            </Typography>

          </Box>

        )}


        {/* ==========================================
            رسالة النجاح
            ========================================== */}

        {message && (

          <Box
            sx={{
              display:
                "flex",

              alignItems:
                "center",

              gap:
                "10px",

              backgroundColor:
                darkMode
                  ? "#1B3A2A"
                  : "#E8F5E9",

              border:
                darkMode
                  ? "1px solid #2E7D32"
                  : "1px solid #C8E6C9",

              color:
                darkMode
                  ? "#81C784"
                  : "#2E7D32",

              borderRadius:
                "10px",

              padding:
                "12px 14px",

              marginBottom:
                "20px",

              fontSize:
                "13px",

              fontWeight:
                "600",

              lineHeight:
                "1.6",
            }}
          >

            <Box
              sx={{
                minWidth:
                  "28px",

                width:
                  "28px",

                height:
                  "28px",

                borderRadius:
                  "50%",

                display:
                  "flex",

                alignItems:
                  "center",

                justifyContent:
                  "center",

                backgroundColor:
                  darkMode
                    ? "#2E7D32"
                    : "#C8E6C9",

                color:
                  darkMode
                    ? "#E8F5E9"
                    : "#2E7D32",

                fontSize:
                  "15px",

                fontWeight:
                  "700",
              }}
            >
              ✓
            </Box>


            <Typography
              sx={{
                fontSize:
                  "13px",

                fontWeight:
                  "600",

                color:
                  "inherit",

                lineHeight:
                  "1.6",
              }}
            >
              {message}
            </Typography>

          </Box>

        )}


        {/* ==========================================
            Form
            ========================================== */}

        <Box
          component="form"
          onSubmit={handleReset}
          noValidate
        >

          {/* البريد الإلكتروني */}

          <TextField
            fullWidth

            label={
              currentText.email
            }

            placeholder={
              currentText.emailPlaceholder
            }

            type="email"

            value={email}

            onChange={(e) =>
              setEmail(
                e.target.value
              )
            }

            sx={{
              marginBottom:
                "20px",
            }}
          />


          {/* زر إرسال الرابط */}

          <Button
            type="submit"

            fullWidth

            variant="contained"

            startIcon={
              <LockResetIcon />
            }

            sx={{
              height:
                "48px",

              borderRadius:
                "10px",

              backgroundColor:
                "primary.main",

              color:
                darkMode
                  ? "#0F172A"
                  : "#FFFFFF",

              textTransform:
                "none",

              fontSize:
                "15px",

              fontWeight:
                "700",

              boxShadow:
                "none",

              "&:hover": {

                backgroundColor:
                  "primary.main",

                opacity:
                  0.9,

                boxShadow:
                  "none",
              },
            }}
          >

            {currentText.sendReset}

          </Button>

        </Box>


        {/* ==========================================
            العودة لتسجيل الدخول
            ========================================== */}

        <Typography
          sx={{
            textAlign:
              "center",

            color:
              "text.secondary",

            fontSize:
              "13px",

            marginTop:
              "24px",
          }}
        >

          <Box
            component={Link}
            to="/login"
            sx={{
              color:
                "primary.main",

              fontWeight:
                "700",

              textDecoration:
                "none",

              "&:hover": {

                textDecoration:
                  "underline",
              },
            }}
          >

            {currentText.backToLogin}

          </Box>

        </Typography>

      </Paper>

    </Box>
  );
}

export default ForgotPassword;
