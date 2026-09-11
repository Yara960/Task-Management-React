
// استيراد useState و useEffect من React
import { useEffect, useState } from "react";

// استيراد مكونات Material UI
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";

// استيراد الأيقونات
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import LanguageIcon from "@mui/icons-material/Language";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";

// استيراد Supabase
import { supabase } from "../../supabaseClient";

// استيراد React Router
import { Link, useNavigate } from "react-router-dom";

// استيراد الثيم
import { useAppTheme } from "../../ThemeContext";

// ==========================================
// Register
// ==========================================

function Register() {

  // التحكم في الوضع الليلي
  const { darkMode, toggleDarkMode } = useAppTheme();

  // الانتقال بين الصفحات
  const navigate = useNavigate();

  // تخزين الاسم
  const [name, setName] = useState("");

  // تخزين البريد الإلكتروني
  const [email, setEmail] = useState("");

  // تخزين كلمة المرور
  const [password, setPassword] = useState("");

  // إظهار وإخفاء كلمة المرور
  const [showPassword, setShowPassword] = useState(false);

  // رسالة الخطأ
  const [error, setError] = useState("");

  // اللغة الحالية
  const [language, setLanguage] = useState(
    () => localStorage.getItem("language") || "en"
  );

  // ==========================================
  // النصوص
  // ==========================================

  const text = {

    en: {
      title: "Create Account",
      description: "Create your account to start managing tasks",
      name: "Name",
      namePlaceholder: "Enter your name",
      email: "Email",
      emailPlaceholder: "Enter your email",
      password: "Password",
      passwordPlaceholder: "Enter your password",
      register: "Register",
      alreadyAccount: "Already have an account?",
      login: "Login",
      language: "العربية",
      darkMode: "Dark Mode",
      lightMode: "Light Mode",
      requiredFields: "Please fill in all fields.",
      invalidEmail: "Please enter a valid email address.",
      passwordShort: "Password must be at least 6 characters.",
      emailExists: "This email is already registered.",
      unableCreate: "Unable to create account.",
      unexpectedError: "Something went wrong. Please try again.",
    },

    ar: {
      title: "إنشاء حساب",
      description: "أنشئ حسابك لبدء إدارة مهامك",
      name: "الاسم",
      namePlaceholder: "أدخل اسمك",
      email: "البريد الإلكتروني",
      emailPlaceholder: "أدخل بريدك الإلكتروني",
      password: "كلمة المرور",
      passwordPlaceholder: "أدخل كلمة المرور",
      register: "إنشاء حساب",
      alreadyAccount: "لديك حساب بالفعل؟",
      login: "تسجيل الدخول",
      language: "English",
      darkMode: "الوضع الليلي",
      lightMode: "الوضع النهاري",
      requiredFields: "يرجى تعبئة جميع الحقول.",
      invalidEmail: "يرجى إدخال بريد إلكتروني صحيح.",
      passwordShort: "يجب أن تكون كلمة المرور 6 أحرف على الأقل.",
      emailExists: "هذا البريد الإلكتروني مسجل مسبقاً.",
      unableCreate: "تعذر إنشاء الحساب.",
      unexpectedError: "حدث خطأ غير متوقع. حاول مرة أخرى.",
    },

  };

  // اختيار النصوص حسب اللغة
  const currentText = language === "ar" ? text.ar : text.en;

  // ==========================================
  // استقبال تغيير اللغة من Navbar
  // ==========================================

  useEffect(() => {

    const handleLanguageChange = (event) => {
      setLanguage(event.detail);
    };

    window.addEventListener("languageChanged", handleLanguageChange);

    return () => {
      window.removeEventListener("languageChanged", handleLanguageChange);
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
    localStorage.setItem("language", language);

  }, [language]);

  // ==========================================
  // تغيير اللغة من صفحة التسجيل
  // ==========================================

  const toggleLanguage = () => {

    const newLanguage = language === "en" ? "ar" : "en";

    setLanguage(newLanguage);

    // حفظ اللغة
    localStorage.setItem("language", newLanguage);

    // إرسال اللغة لباقي الصفحات
    window.dispatchEvent(
      new CustomEvent("languageChanged", {
        detail: newLanguage,
      })
    );

  };

  // ==========================================
  // ترجمة أخطاء Supabase
  // ==========================================

  function getTranslatedError(error) {

    if (!error) {
      return currentText.unexpectedError;
    }

    const message = error.message?.toLowerCase() || "";

    // البريد مستخدم مسبقاً
    if (
      message.includes("already registered") ||
      message.includes("user already registered") ||
      message.includes("already been registered") ||
      message.includes("email already") ||
      message.includes("already exists")
    ) {
      return currentText.emailExists;
    }

    // كلمة المرور قصيرة
    if (
      message.includes("password should be at least") ||
      message.includes("password must be at least")
    ) {
      return currentText.passwordShort;
    }

    // البريد غير صحيح
    if (message.includes("invalid email")) {
      return currentText.invalidEmail;
    }

    return currentText.unexpectedError;
  }

  // ==========================================
  // إنشاء الحساب
  // ==========================================

  async function handleRegister(e) {

    // منع تحديث الصفحة
    e.preventDefault();

    // مسح التنبيه السابق
    setError("");

    // ==========================================
    // التحقق من الحقول الفارغة
    // ==========================================

    if (!name.trim() || !email.trim() || !password.trim()) {

      setError(currentText.requiredFields);

      return;
    }

    // ==========================================
    // تنظيف البريد الإلكتروني
    // ==========================================

    const cleanEmail = email.trim().toLowerCase();

    // ==========================================
    // التحقق من البريد الإلكتروني
    // ==========================================

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(cleanEmail)) {

      setError(currentText.invalidEmail);

      return;
    }

    // ==========================================
    // التحقق من كلمة المرور
    // ==========================================

    if (password.length < 6) {

      setError(currentText.passwordShort);

      return;
    }

    try {

      // ==========================================
      // إنشاء الحساب في Supabase Auth
      // ==========================================

      const {
        data,
        error: signUpError,
      } = await supabase.auth.signUp({

        email: cleanEmail,

        password: password,

        options: {
          data: {
            name: name.trim(),
          },
        },

      });

      // ==========================================
      // إذا حدث خطأ أثناء التسجيل
      // ==========================================

      if (signUpError) {

        console.log("Sign up error:", signUpError);

        setError(getTranslatedError(signUpError));

        return;
      }

      // ==========================================
      // التأكد من وجود المستخدم
      // ==========================================

      if (!data.user) {

        setError(currentText.unableCreate);

        return;
      }

      // ==========================================
      // ملاحظة:
      // profiles يتم إنشاؤه تلقائياً
      // بواسطة Trigger الموجود في Supabase
      // ==========================================

      // ==========================================
      // الانتقال إلى Login
      // ==========================================

      navigate("/login");

    } catch (error) {

      // ==========================================
      // خطأ غير متوقع
      // ==========================================

      console.log("Register error:", error);

      setError(currentText.unexpectedError);
    }

  }

  // ==========================================
  // واجهة الصفحة
  // ==========================================

  return (

    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "background.default",
        color: "text.primary",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: {
          xs: "24px 16px",
          sm: "40px 20px",
        },
        transition: "background-color 0.3s, color 0.3s",
      }}
    >

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
              color: "text.secondary",
              borderRadius: "10px",

              "&:hover": {
                backgroundColor: darkMode
                  ? "rgba(128,203,196,0.10)"
                  : "rgba(0,137,123,0.06)",
                color: "primary.main",
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
              color: "text.secondary",
              borderRadius: "10px",

              "&:hover": {
                backgroundColor: darkMode
                  ? "rgba(128,203,196,0.10)"
                  : "rgba(0,137,123,0.06)",
                color: "primary.main",
              },

            }}
          >

            {darkMode ? <LightModeIcon /> : <DarkModeIcon />}

          </IconButton>

        </Box>

        {/* ==========================================
            العنوان
        ========================================== */}

        <Typography
          sx={{
            textAlign: "center",
            fontSize: {
              xs: "27px",
              sm: "30px",
            },
            fontWeight: "700",
            color: "text.primary",
            marginBottom: "8px",
          }}
        >

          {currentText.title}

        </Typography>

        {/* الوصف */}

        <Typography
          sx={{
            textAlign: "center",
            color: "text.secondary",
            fontSize: "14px",
            lineHeight: "1.6",
            marginBottom: "28px",
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
              display: "flex",
              alignItems: "center",
              gap: "10px",
              backgroundColor: darkMode
                ? "#3B1F1F"
                : "#FFEBEE",
              border: darkMode
                ? "1px solid #7F1D1D"
                : "1px solid #FFCDD2",
              color: darkMode
                ? "#FF8A80"
                : "#D32F2F",
              borderRadius: "10px",
              padding: "12px 14px",
              marginBottom: "20px",
              fontSize: "13px",
              fontWeight: "500",
              lineHeight: "1.6",
              boxShadow: darkMode
                ? "0 4px 12px rgba(239,83,80,0.18)"
                : "0 4px 12px rgba(211,47,47,0.08)",
            }}
          >

            {/* علامة التنبيه */}

            <Box
              sx={{
                minWidth: "28px",
                width: "28px",
                height: "28px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: darkMode
                  ? "#7F1D1D"
                  : "#FFCDD2",
                color: darkMode
                  ? "#FF8A80"
                  : "#D32F2F",
                fontSize: "16px",
                fontWeight: "700",
              }}
            >

              !

            </Box>

            {/* رسالة الخطأ */}

            <Typography
              sx={{
                fontSize: "13px",
                fontWeight: "600",
                color: "inherit",
                lineHeight: "1.6",
              }}
            >

              {error}

            </Typography>

          </Box>

        )}

        {/* ==========================================
            Form
        ========================================== */}

        <Box
          component="form"
          onSubmit={handleRegister}
          noValidate
        >

          {/* الاسم */}

          <Typography
            sx={{
              fontSize: "14px",
              fontWeight: "600",
              color: "text.primary",
              marginBottom: "8px",
              textAlign:
                language === "ar"
                  ? "right"
                  : "left",
            }}
          >

            {currentText.name}

          </Typography>

          <TextField
            fullWidth
            type="text"
            placeholder={currentText.namePlaceholder}
            value={name}
            onChange={(e) => setName(e.target.value)}
            sx={{
              marginBottom: "20px",
            }}
          />

          {/* البريد الإلكتروني */}

          <Typography
            sx={{
              fontSize: "14px",
              fontWeight: "600",
              color: "text.primary",
              marginBottom: "8px",
              textAlign:
                language === "ar"
                  ? "right"
                  : "left",
            }}
          >

            {currentText.email}

          </Typography>

          <TextField
            fullWidth
            type="email"
            placeholder={currentText.emailPlaceholder}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{
              marginBottom: "20px",
            }}
          />

          {/* كلمة المرور */}

          <Typography
            sx={{
              fontSize: "14px",
              fontWeight: "600",
              color: "text.primary",
              marginBottom: "8px",
              textAlign:
                language === "ar"
                  ? "right"
                  : "left",
            }}
          >

            {currentText.password}

          </Typography>

          <TextField
            fullWidth
            type={showPassword ? "text" : "password"}
            placeholder={currentText.passwordPlaceholder}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{
              marginBottom: "22px",
            }}
            slotProps={{
              input: {

                endAdornment: (

                  <InputAdornment position="end">

                    <IconButton
                      onClick={() =>
                        setShowPassword(!showPassword)
                      }
                      edge="end"
                    >

                      {showPassword ? (
                        <VisibilityOff />
                      ) : (
                        <Visibility />
                      )}

                    </IconButton>

                  </InputAdornment>

                ),

              },
            }}
          />

          {/* زر إنشاء الحساب */}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              height: "48px",
              borderRadius: "10px",
              backgroundColor: "primary.main",
              color: darkMode
                ? "#0F172A"
                : "#FFFFFF",
              textTransform: "none",
              fontSize: "15px",
              fontWeight: "700",
              boxShadow: "none",

              "&:hover": {
                backgroundColor: "primary.main",
                opacity: 0.9,
                boxShadow: "none",
              },

            }}
          >

            {currentText.register}

          </Button>

        </Box>

        {/* ==========================================
            رابط تسجيل الدخول
        ========================================== */}

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "5px",
            flexWrap: "wrap",
            marginTop: "24px",
          }}
        >

          <Typography
            sx={{
              color: "text.secondary",
              fontSize: "13px",
            }}
          >

            {currentText.alreadyAccount}

          </Typography>

          <Typography
            component={Link}
            to="/login"
            sx={{
              color: "secondary.main",
              fontWeight: "700",
              fontSize: "13px",
              textDecoration: "none",

              "&:hover": {
                textDecoration: "underline",
              },

            }}
          >

            {currentText.login}

          </Typography>

        </Box>

      </Paper>

    </Box>

  );
}

export default Register;

