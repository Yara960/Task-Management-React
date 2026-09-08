
import { useState, useEffect } from "react";

import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";

import LockResetIcon from "@mui/icons-material/LockReset";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import LanguageIcon from "@mui/icons-material/Language";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";

import { supabase } from "../../supabaseClient";

import { useNavigate } from "react-router-dom";

import { useAppTheme } from "../../ThemeContext";


function ResetPassword() {

  // ==========================================
  // التحكم في الوضع الليلي
  // ==========================================

  const {
    darkMode,
    toggleDarkMode,
  } = useAppTheme();


  // ==========================================
  // كلمة المرور الجديدة
  // ==========================================

  const [password, setPassword] = useState("");


  // ==========================================
  // تأكيد كلمة المرور
  // ==========================================

  const [confirmPassword, setConfirmPassword] =
    useState("");


  // ==========================================
  // إظهار كلمة المرور
  // ==========================================

  const [showPassword, setShowPassword] =
    useState(false);


  // ==========================================
  // إظهار تأكيد كلمة المرور
  // ==========================================

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);


  // ==========================================
  // رسالة الخطأ
  // ==========================================

  const [error, setError] = useState("");


  // ==========================================
  // رسالة النجاح
  // ==========================================

  const [message, setMessage] = useState("");


  // ==========================================
  // حالة جلسة استرجاع كلمة المرور
  // ==========================================

  const [sessionReady, setSessionReady] =
    useState(false);


  // ==========================================
  // حالة التحميل
  // ==========================================

  const [loading, setLoading] =
    useState(true);


  // ==========================================
  // اللغة الحالية
  // ==========================================

  const [language, setLanguage] = useState(
    () => localStorage.getItem("language") || "en"
  );


  const navigate = useNavigate();


  // ==========================================
  // النصوص باللغتين
  // ==========================================

  const text = {

    en: {

      title: "Reset Password",

      description:
        "Create a new password for your account",

      newPassword:
        "New Password",

      newPasswordPlaceholder:
        "Enter your new password",

      confirmPassword:
        "Confirm Password",

      confirmPasswordPlaceholder:
        "Confirm your new password",

      updatePassword:
        "Update Password",

      checkingSession:
        "Checking password reset session...",

      language:
        "العربية",

      darkMode:
        "Dark Mode",

      lightMode:
        "Light Mode",

      requiredFields:
        "Please fill in all fields.",

      passwordsNotMatch:
        "Passwords do not match.",

      passwordShort:
        "Password must be at least 6 characters.",

      sessionMissing:
        "Your password reset session is not ready. Please open the reset link from your email again.",

      sessionMissingInitial:
        "The password reset session is missing. Please open the reset link from your email again.",

      passwordUpdated:
        "Password updated successfully.",

      unexpectedError:
        "Something went wrong. Please try again.",

    },


    ar: {

      title:
        "إعادة تعيين كلمة المرور",

      description:
        "أنشئ كلمة مرور جديدة لحسابك",

      newPassword:
        "كلمة المرور الجديدة",

      newPasswordPlaceholder:
        "أدخل كلمة المرور الجديدة",

      confirmPassword:
        "تأكيد كلمة المرور",

      confirmPasswordPlaceholder:
        "أكد كلمة المرور الجديدة",

      updatePassword:
        "تحديث كلمة المرور",

      checkingSession:
        "جاري التحقق من جلسة استرجاع كلمة المرور...",

      language:
        "English",

      darkMode:
        "الوضع الليلي",

      lightMode:
        "الوضع النهاري",

      requiredFields:
        "يرجى تعبئة جميع الحقول.",

      passwordsNotMatch:
        "كلمتا المرور غير متطابقتين.",

      passwordShort:
        "يجب أن تكون كلمة المرور 6 أحرف على الأقل.",

      sessionMissing:
        "جلسة استرجاع كلمة المرور غير جاهزة. يرجى فتح رابط إعادة التعيين من بريدك الإلكتروني مرة أخرى.",

      sessionMissingInitial:
        "جلسة استرجاع كلمة المرور غير موجودة. يرجى فتح رابط إعادة التعيين من بريدك الإلكتروني مرة أخرى.",

      passwordUpdated:
        "تم تحديث كلمة المرور بنجاح.",

      unexpectedError:
        "حدث خطأ غير متوقع. حاول مرة أخرى.",

    },

  };


  // النصوص حسب اللغة الحالية

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
  // التأكد من وجود جلسة استرجاع كلمة المرور
  // ==========================================

  useEffect(() => {

    let mounted = true;


    async function checkSession() {

      const {
        data,
        error,
      } = await supabase.auth.getSession();


      if (!mounted) return;


      if (error) {

        setError(
          currentText.unexpectedError
        );

        setLoading(false);

        return;

      }


      // إذا كانت الجلسة موجودة

      if (data.session) {

        setSessionReady(true);

      } else {

        setError(
          currentText.sessionMissingInitial
        );

      }


      setLoading(false);

    }


    checkSession();


    // ==========================================
    // الاستماع لأحداث المصادقة
    // ==========================================

    const {
      data: {
        subscription,
      },
    } = supabase.auth.onAuthStateChange(
      (event, session) => {

        console.log(
          "Auth event:",
          event
        );


        // عند استرجاع كلمة المرور

        if (
          event === "PASSWORD_RECOVERY"
          && session
        ) {

          setSessionReady(true);

          setError("");

          setLoading(false);

        }


        // إذا أصبحت هناك جلسة

        if (session) {

          setSessionReady(true);

          setError("");

          setLoading(false);

        }

      }
    );


    // تنظيف الاشتراك

    return () => {

      mounted = false;

      subscription.unsubscribe();

    };

  }, []);


  // ==========================================
  // تغيير كلمة المرور
  // ==========================================

  async function handleUpdatePassword(e) {

    e.preventDefault();


    // مسح الرسائل القديمة

    setError("");

    setMessage("");


    // ==========================================
    // التأكد من وجود جلسة
    // ==========================================

    if (!sessionReady) {

      setError(
        currentText.sessionMissing
      );

      return;

    }


    // ==========================================
    // التأكد من تعبئة الحقول
    // ==========================================

    if (
      !password.trim()
      ||
      !confirmPassword.trim()
    ) {

      setError(
        currentText.requiredFields
      );

      return;

    }


    // ==========================================
    // التأكد من تطابق الباسورد
    // ==========================================

    if (
      password !== confirmPassword
    ) {

      setError(
        currentText.passwordsNotMatch
      );

      return;

    }


    // ==========================================
    // التأكد من طول الباسورد
    // ==========================================

    if (password.length < 6) {

      setError(
        currentText.passwordShort
      );

      return;

    }


    // ==========================================
    // تحديث كلمة المرور في Supabase
    // ==========================================

    const {
      error,
    } = await supabase.auth.updateUser({
      password: password,
    });


    // إذا حدث خطأ

    if (error) {

      console.log(
        "Update password error:",
        error
      );


      setError(
        currentText.unexpectedError
      );

      return;

    }


    // ==========================================
    // رسالة النجاح
    // ==========================================

    setMessage(
      currentText.passwordUpdated
    );


    // مسح الحقول

    setPassword("");

    setConfirmPassword("");


    // ==========================================
    // الانتقال إلى Login
    // ==========================================

    setTimeout(() => {

      navigate("/login");

    }, 1500);

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
            أزرار اللغة والوضع الليلي
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
            width: "65px",

            height: "65px",

            borderRadius: "18px",

            backgroundColor:
              darkMode
                ? "rgba(128,203,196,0.12)"
                : "#E0F2F1",

            display: "flex",

            justifyContent: "center",

            alignItems: "center",

            margin: "0 auto 18px",
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
            رسالة الخطأ
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

            {/* علامة التعجب */}

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

            {/* علامة النجاح */}

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
            حالة التحميل
            ========================================== */}

        {loading ? (

          <Typography
            sx={{
              textAlign:
                "center",

              color:
                "text.secondary",

              padding:
                "20px 0",

              fontSize:
                "14px",
            }}
          >

            {currentText.checkingSession}

          </Typography>

        ) : (

          <Box
            component="form"
            onSubmit={handleUpdatePassword}
            noValidate
          >

            {/* ==========================================
                كلمة المرور الجديدة
                ========================================== */}

            <TextField
              fullWidth

              label={
                currentText.newPassword
              }

              placeholder={
                currentText.newPasswordPlaceholder
              }

              type={
                showPassword
                  ? "text"
                  : "password"
              }

              value={
                password
              }

              onChange={(e) =>
                setPassword(
                  e.target.value
                )
              }

              disabled={
                !sessionReady
              }

              sx={{
                marginBottom:
                  "18px",
              }}

              slotProps={{
                input: {

                  endAdornment: (

                    <InputAdornment
                      position="end"
                    >

                      <IconButton
                        onClick={() =>
                          setShowPassword(
                            !showPassword
                          )
                        }

                        edge="end"

                        disabled={
                          !sessionReady
                        }
                      >

                        {showPassword
                          ? <VisibilityOff />
                          : <Visibility />
                        }

                      </IconButton>

                    </InputAdornment>

                  ),
                },
              }}
            />


            {/* ==========================================
                تأكيد كلمة المرور
                ========================================== */}

            <TextField
              fullWidth

              label={
                currentText.confirmPassword
              }

              placeholder={
                currentText.confirmPasswordPlaceholder
              }

              type={
                showConfirmPassword
                  ? "text"
                  : "password"
              }

              value={
                confirmPassword
              }

              onChange={(e) =>
                setConfirmPassword(
                  e.target.value
                )
              }

              disabled={
                !sessionReady
              }

              sx={{
                marginBottom:
                  "22px",
              }}

              slotProps={{
                input: {

                  endAdornment: (

                    <InputAdornment
                      position="end"
                    >

                      <IconButton
                        onClick={() =>
                          setShowConfirmPassword(
                            !showConfirmPassword
                          )
                        }

                        edge="end"

                        disabled={
                          !sessionReady
                        }
                      >

                        {showConfirmPassword
                          ? <VisibilityOff />
                          : <Visibility />
                        }

                      </IconButton>

                    </InputAdornment>

                  ),
                },
              }}
            />


            {/* ==========================================
                زر تحديث كلمة المرور
                ========================================== */}

            <Button
              type="submit"

              fullWidth

              variant="contained"

              startIcon={
                <LockResetIcon />
              }

              disabled={
                !sessionReady
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

                "&.Mui-disabled": {

                  backgroundColor:
                    darkMode
                      ? "#475569"
                      : "#B0BEC5",

                  color:
                    "#FFFFFF",
                },
              }}
            >

              {currentText.updatePassword}

            </Button>

          </Box>

        )}

      </Paper>

    </Box>

  );

}


export default ResetPassword;


