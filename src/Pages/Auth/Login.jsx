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
 
// استيراد التنقل 
import { Link, useNavigate } from "react-router-dom"; 
 
// استيراد الثيم 
import { useAppTheme } from "../../ThemeContext"; 
 
function Login() { 
 
  // ========================================== 
  // التحكم في الوضع الليلي 
  // ========================================== 
 
  const { darkMode, toggleDarkMode } = useAppTheme(); 
 
  // ========================================== 
  // الانتقال بين الصفحات 
  // ========================================== 
 
  const navigate = useNavigate(); 
 
  // ========================================== 
  // بيانات تسجيل الدخول 
  // ========================================== 
 
  const [email, setEmail] = useState(""); 
  const [password, setPassword] = useState(""); 
 
  // ========================================== 
  // إظهار وإخفاء كلمة المرور 
  // ========================================== 
 
  const [showPassword, setShowPassword] = useState(false); 
 
  // ========================================== 
  // رسالة الخطأ 
  // ========================================== 
 
  const [error, setError] = useState(""); 
 
  // ========================================== 
  // اللغة الحالية 
  // ========================================== 
 
  const [language, setLanguage] = useState( 
    () => localStorage.getItem("language") || "en" 
  ); 
 
  // ========================================== 
  // النصوص باللغتين 
  // ========================================== 
 
  const text = { 
 
    en: { 
 
      welcome: "Welcome Back", 
 
      description: 
        "Login to manage your tasks", 
 
      email: "Email", 
 
      emailPlaceholder: 
        "Enter your email", 
 
      password: "Password", 
 
      passwordPlaceholder: 
        "Enter your password", 
 
      forgotPassword: 
        "Forgot Password?", 
 
      login: "Login", 
 
      noAccount: 
        "Don't have an account?", 
 
      register: "Register", 
 
      language: "العربية", 
 
      darkMode: "Dark Mode", 
 
      lightMode: "Light Mode", 
 
      requiredFields: 
        "Please fill in all fields.", 
 
      invalidCredentials: 
        "Invalid email or password.", 
 
      emailNotConfirmed: 
        "Please confirm your email before logging in.", 
 
      tooManyRequests: 
        "Too many login attempts. Please try again later.", 
 
      networkError: 
        "Network error. Please check your internet connection.", 
 
      unexpectedError: 
        "Something went wrong. Please try again.", 

      accountDisabled:
        "This account has been disabled. Please contact the administrator.",
 
      showPassword: 
        "Show password", 
 
      hidePassword: 
        "Hide password", 
    }, 
 
    ar: { 
 
      welcome: 
        "مرحباً بعودتك", 
 
      description: 
        "سجل الدخول لإدارة مهامك", 
 
      email: 
        "البريد الإلكتروني", 
 
      emailPlaceholder: 
        "أدخل بريدك الإلكتروني", 
 
      password: 
        "كلمة المرور", 
 
      passwordPlaceholder: 
        "أدخل كلمة المرور", 
 
      forgotPassword: 
        "نسيت كلمة المرور؟", 
 
      login: 
        "تسجيل الدخول", 
 
      noAccount: 
        "ليس لديك حساب؟", 
 
      register: 
        "إنشاء حساب", 
 
      language: 
        "English", 
 
      darkMode: 
        "الوضع الليلي", 
 
      lightMode: 
        "الوضع النهاري", 
 
      requiredFields: 
        "يرجى تعبئة جميع الحقول.", 
 
      invalidCredentials: 
        "البريد الإلكتروني أو كلمة المرور غير صحيحة.", 
 
      emailNotConfirmed: 
        "يرجى تأكيد بريدك الإلكتروني قبل تسجيل الدخول.", 
 
      tooManyRequests: 
        "محاولات تسجيل الدخول كثيرة جداً. حاول مرة أخرى لاحقاً.", 
 
      networkError: 
        "حدث خطأ في الاتصال. تأكد من اتصالك بالإنترنت.", 
 
      unexpectedError: 
        "حدث خطأ غير متوقع. حاول مرة أخرى.", 

      accountDisabled:
        "هذا الحساب معطّل. يرجى التواصل مع المسؤول.",
 
      showPassword: 
        "إظهار كلمة المرور", 
 
      hidePassword: 
        "إخفاء كلمة المرور", 
    }, 
 
  }; 
 
  // ========================================== 
  // اختيار النصوص حسب اللغة 
  // ========================================== 
 
  const currentText = 
    language === "ar" 
      ? text.ar 
      : text.en; 
 
  // ========================================== 
  // تغيير اتجاه الصفحة حسب اللغة 
  // وحفظ اللغة 
  // ========================================== 
 
  useEffect(() => { 
 
    if (language === "ar") { 
 
      document.documentElement.dir = "rtl"; 
 
      document.documentElement.lang = "ar"; 
 
    } else { 
 
      document.documentElement.dir = "ltr"; 
 
      document.documentElement.lang = "en"; 
 
    } 
 
    // حفظ اللغة في Local Storage 
    localStorage.setItem( 
      "language", 
      language 
    ); 
 
  }, [language]); 
 
  // ========================================== 
  // تغيير اللغة 
  // ========================================== 
 
  const toggleLanguage = () => { 
 
    setLanguage((previousLanguage) => { 
 
      // تحديد اللغة الجديدة 
      const newLanguage = 
        previousLanguage === "en" 
          ? "ar" 
          : "en"; 
 
      // إرسال حدث تغيير اللغة 
      window.dispatchEvent( 
        new CustomEvent( 
          "languageChanged", 
          { 
            detail: newLanguage, 
          } 
        ) 
      ); 
 
      // إرجاع اللغة الجديدة 
      return newLanguage; 
 
    }); 
 
  }; 
 
  // ========================================== 
  // تحويل أخطاء Supabase إلى رسائل مترجمة 
  // ========================================== 
 
  function getTranslatedError(error) { 
 
    if (!error) { 
 
      return currentText.unexpectedError; 
 
    } 
 
    const message = 
      error.message?.toLowerCase() || ""; 
 
    if ( 
      message.includes( 
        "invalid login credentials" 
      ) || 
      message.includes( 
        "invalid email or password" 
      ) || 
      message.includes( 
        "invalid credentials" 
      ) 
    ) { 
 
      return currentText.invalidCredentials; 
 
    } 
 
    if ( 
      message.includes( 
        "email not confirmed" 
      ) || 
      message.includes( 
        "email_not_confirmed" 
      ) 
    ) { 
 
      return currentText.emailNotConfirmed; 
 
    } 
 
    if ( 
      message.includes( 
        "too many requests" 
      ) || 
      message.includes( 
        "rate limit" 
      ) 
    ) { 
 
      return currentText.tooManyRequests; 
 
    } 
 
    if ( 
      message.includes( 
        "network" 
      ) || 
      message.includes( 
        "fetch" 
      ) || 
      message.includes( 
        "failed to fetch" 
      ) 
    ) { 
 
      return currentText.networkError; 
 
    } 
 
    return currentText.unexpectedError; 
 
  } 
 
  // ========================================== 
  // تنفيذ تسجيل الدخول 
  // ========================================== 
 
  const handleLogin = async (event) => { 
 
    // منع تحديث الصفحة 
    event.preventDefault(); 
 
    // حذف رسالة الخطأ السابقة 
    setError(""); 
 
    // التحقق من أن الحقول ليست فارغة 
    if ( 
      !email.trim() || 
      !password.trim() 
    ) { 
 
      setError( 
        currentText.requiredFields 
      ); 
 
      return; 
 
    } 
 
    try { 
 
      // ========================================== 
      // تسجيل الدخول باستخدام Supabase 
      // ========================================== 
 
      const { data, error } = 
        await supabase.auth.signInWithPassword({ 
          email: email.trim(), 
          password, 
        }); 
 
      // إذا حدث خطأ في تسجيل الدخول 
      if (error) { 
 
        setError( 
          getTranslatedError(error) 
        ); 
 
        return; 
 
      } 
 
      // التأكد من وجود المستخدم 
      if (!data?.user) { 
 
        setError( 
          currentText.unexpectedError 
        ); 
 
        return; 
 
      } 
 
      // ========================================== 
      // التحقق من حالة الحساب
      // ========================================== 
      //
      // نبحث عن المستخدم بشرطين:
      //
      // 1- id يساوي المستخدم الحالي
      // 2- is_active يساوي 1
      //
      // إذا كان is_active = 0
      // لن يتم العثور على سجل
      //
      // ========================================== 
 
      const { data: profile, error: profileError } = 
        await supabase 
          .from("profiles") 
          .select("id, is_active") 
          .eq("id", data.user.id) 
          .eq("is_active", 1) 
          .maybeSingle(); 
 
      // ========================================== 
      // إذا حدث خطأ في جلب profile
      // ========================================== 
 
      if (profileError) { 
 
        // تسجيل خروج المستخدم 
        await supabase.auth.signOut(); 
 
        setError( 
          currentText.unexpectedError 
        ); 
 
        return; 
 
      } 
 
      // ========================================== 
      // إذا لم يوجد حساب فعال
      // فهذا يعني أن الحساب معطل
      // ========================================== 
 
      if (!profile) { 
 
        // تسجيل خروج المستخدم مباشرة 
        await supabase.auth.signOut(); 
 
        setError( 
          currentText.accountDisabled 
        ); 
 
        return; 
 
      } 
 
      // ========================================== 
      // الحساب فعال
      // السماح بالدخول
      // ========================================== 
 
      navigate("/"); 
 
    } catch (error) { 
 
      // أي خطأ غير متوقع 
      await supabase.auth.signOut(); 
 
      setError( 
        currentText.unexpectedError 
      ); 
 
    } 
 
  }; 
 
  // ========================================== 
  // الواجهة 
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
 
        alignItems: "center", 
 
        justifyContent: "center", 
 
        padding: "24px", 
 
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
            الأزرار العلوية 
        ========================================== */} 
 
        <Box 
          sx={{ 
            display: "flex", 
 
            justifyContent: 
              "flex-end", 
 
            alignItems: 
              "center", 
 
            gap: "6px", 
 
            marginBottom: "18px", 
          }} 
        > 
 
          {/* زر تغيير اللغة */} 
 
          <IconButton 
            onClick={toggleLanguage} 
 
            title={ 
              currentText.language 
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
 
            <LanguageIcon /> 
 
          </IconButton> 
 
          {/* زر الوضع الليلي والنهاري */} 
 
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
            العنوان 
        ========================================== */} 
 
        <Typography 
          sx={{ 
            fontSize: { 
              xs: "27px", 
              sm: "30px", 
            }, 
 
            fontWeight: 
              "700", 
 
            color: 
              "text.primary", 
 
            textAlign: 
              "center", 
 
            marginBottom: 
              "8px", 
          }} 
        > 
 
          {currentText.welcome} 
 
        </Typography> 
 
        {/* ========================================== 
            الوصف 
        ========================================== */} 
 
        <Typography 
          sx={{ 
            fontSize: 
              "14px", 
 
            color: 
              "text.secondary", 
 
            textAlign: 
              "center", 
 
            marginBottom: 
              "28px", 
          }} 
        > 
 
          {currentText.description} 
 
        </Typography> 
 
        {/* ========================================== 
            نموذج تسجيل الدخول 
        ========================================== */} 
 
        <Box 
          component="form" 
 
          onSubmit={ 
            handleLogin 
          } 
 
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
 
            value={email} 
 
            onChange={(event) => 
              setEmail( 
                event.target.value 
              ) 
            } 
 
            type="email" 
 
            sx={{ 
              marginBottom: 
                "18px", 
            }} 
          /> 
 
          {/* ========================================== 
              كلمة المرور + زر العين 
          ========================================== */} 
 
          <TextField 
            fullWidth 
 
            label={ 
              currentText.password 
            } 
 
            placeholder={ 
              currentText.passwordPlaceholder 
            } 
 
            value={password} 
 
            onChange={(event) => 
              setPassword( 
                event.target.value 
              ) 
            } 
 
            // إظهار أو إخفاء كلمة المرور 
            type={ 
              showPassword 
                ? "text" 
                : "password" 
            } 
 
            sx={{ 
              marginBottom: 
                "10px", 
            }} 
 
            // نفس طريقة صفحة التسجيل 
            slotProps={{ 
              input: { 
 
                endAdornment: ( 
 
                  <InputAdornment 
                    position="end" 
                  > 
 
                    <IconButton 
 
                      type="button" 
 
                      onClick={() => 
                        setShowPassword( 
                          (previous) => 
                            !previous 
                        ) 
                      } 
 
                      edge="end" 
 
                      title={ 
                        showPassword 
                          ? currentText.hidePassword 
                          : currentText.showPassword 
                      } 
 
                      aria-label={ 
                        showPassword 
                          ? currentText.hidePassword 
                          : currentText.showPassword 
                      } 
 
                      sx={{ 
                        color: 
                          "text.secondary", 
 
                        padding: 
                          "8px", 
 
                        "&:hover": { 
 
                          color: 
                            "primary.main", 
 
                          backgroundColor: 
                            darkMode 
                              ? "rgba(128,203,196,0.10)" 
                              : "rgba(0,137,123,0.06)", 
                        }, 
                      }} 
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
 
          {/* نسيت كلمة المرور */} 
 
          <Box 
            sx={{ 
              display: "flex", 
 
              justifyContent: 
                "flex-end", 
 
              marginBottom: 
                "20px", 
            }} 
          > 
 
            <Typography 
              component={Link} 
 
              to="/forgot-password" 
 
              sx={{ 
                color: 
                  "primary.main", 
 
                textDecoration: 
                  "none", 
 
                fontSize: 
                  "13px", 
 
                fontWeight: 
                  "600", 
 
                "&:hover": { 
 
                  textDecoration: 
                    "underline", 
 
                }, 
              }} 
            > 
 
              { 
                currentText.forgotPassword 
              } 
 
            </Typography> 
 
          </Box> 
 
          {/* ========================================== 
              تنبيه الخطأ 
          ========================================== */} 
 
          {error && ( 
 
            <Box 
              sx={{ 
                display: "flex", 
 
                alignItems: 
                  "center", 
 
                gap: "10px", 
 
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
 
              {/* دائرة علامة التنبيه */} 
 
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
 
              {/* نص التنبيه */} 
 
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
              زر تسجيل الدخول 
          ========================================== */} 
 
          <Button 
            type="submit" 
 
            fullWidth 
 
            variant="contained" 
 
            sx={{ 
              minHeight: 
                "48px", 
 
              borderRadius: 
                "10px", 
 
              backgroundColor: 
                "primary.main", 
 
              color: 
                darkMode 
                  ? "#0F172A" 
                  : "#FFFFFF", 
 
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
 
            {currentText.login} 
 
          </Button> 
 
        </Box> 
 
        {/* ========================================== 
            إنشاء حساب 
        ========================================== */} 
 
        <Box 
          sx={{ 
            display: 
              "flex", 
 
            justifyContent: 
              "center", 
 
            alignItems: 
              "center", 
 
            gap: 
              "5px", 
 
            marginTop: 
              "24px", 
 
            flexWrap: 
              "wrap", 
          }} 
        > 
 
          <Typography 
            sx={{ 
              fontSize: 
                "13px", 
 
              color: 
                "text.secondary", 
            }} 
          > 
 
            {currentText.noAccount} 
 
          </Typography> 
 
          <Typography 
            component={Link} 
 
            to="/register" 
 
            sx={{ 
              fontSize: 
                "13px", 
 
              fontWeight: 
                "700", 
 
              color: 
                "secondary.main", 
 
              textDecoration: 
                "none", 
 
              "&:hover": { 
 
                textDecoration: 
                  "underline", 
 
              }, 
            }} 
          > 
 
            {currentText.register} 
 
          </Typography> 
 
        </Box> 
 
      </Paper> 
 
    </Box> 
 
  ); 
 
} 
 
// تصدير Login 
export default Login;