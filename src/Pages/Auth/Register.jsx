// استيراد useState من React
import { useState } from "react";

// استيراد مكونات Material UI
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";

// استيراد الأيقونات
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

// استيراد Supabase
import { supabase } from "../../supabaseClient";

// استيراد React Router
import { Link, useNavigate } from "react-router-dom";


// ==========================================
// Register
// ==========================================

function Register() {

  // تخزين الاسم
  const [name, setName] = useState("");

  // تخزين البريد الإلكتروني
  const [email, setEmail] = useState("");

  // تخزين كلمة المرور
  const [password, setPassword] = useState("");

  // التحكم في إظهار كلمة المرور
  const [showPassword, setShowPassword] = useState(false);

  // تخزين رسالة الخطأ
  const [error, setError] = useState("");

  // الانتقال بين الصفحات
  const navigate = useNavigate();


  // ==========================================
  // إنشاء حساب
  // ==========================================

  async function handleRegister(e) {

    e.preventDefault();

    // مسح رسالة الخطأ القديمة
    setError("");


    // التأكد من إدخال الاسم
    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }


    // ==========================================
    // إنشاء الحساب في Supabase Authentication
    // ==========================================

    const {
      data,
      error: signUpError,
    } = await supabase.auth.signUp({
      email: email,
      password: password,

      // تخزين الاسم مع بيانات المستخدم
      options: {
        data: {
          name: name.trim(),
        },
      },
    });


    // إذا حدث خطأ أثناء إنشاء الحساب
    if (signUpError) {
      setError(signUpError.message);
      return;
    }


    // التأكد من وجود المستخدم
    if (!data.user) {
      setError("Unable to create account.");
      return;
    }


    // ==========================================
    // إضافة المستخدم إلى جدول profiles
    // ==========================================

    const { error: profileError } = await supabase
      .from("profiles")
      .insert([
        {
          id: data.user.id,
          display_name: name.trim(),
          email: email,
        },
      ]);


    // إذا حدث خطأ في profiles
    if (profileError) {

      console.log("Profile error:", profileError);

      setError(profileError.message);

      return;
    }


    // الانتقال إلى Login
    navigate("/login");
  }


  // ==========================================
  // واجهة Register
  // ==========================================

  return (

    <Box
      sx={{
        minHeight: "70vh",

        // خلفية الصفحة
        backgroundColor: "#F5F7FA",

        display: "flex",
        justifyContent: "center",
        alignItems: "center",

        padding: {
          xs: "30px 16px",
          sm: "50px 20px",
        },
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
            xs: "30px 24px",
            sm: "40px",
          },

          borderRadius: "20px",

          // لون المربع المميز
          backgroundColor: "#E0F2F1",

          // حدود المربع
          border: "2px solid #80CBC4",

          // ظل المربع
          boxShadow:
            "0 12px 35px rgba(0, 137, 123, 0.20)",
        }}
      >

        {/* ==========================================
            العنوان
            ========================================== */}

        <Typography
          sx={{
            textAlign: "center",
            fontSize: "28px",
            fontWeight: "700",
            color: "#263238",
            marginBottom: "8px",
          }}
        >
          Create Account
        </Typography>


        {/* الوصف */}

        <Typography
          sx={{
            textAlign: "center",
            color: "#546E7A",
            fontSize: "14px",
            marginBottom: "30px",
          }}
        >
          Create your account to start managing tasks
        </Typography>


        {/* ==========================================
            رسالة الخطأ
            ========================================== */}

        {error && (

          <Box
            sx={{
              backgroundColor: "#FFEBEE",
              border: "1px solid #FFCDD2",
              color: "#D32F2F",
              borderRadius: "10px",
              padding: "12px",
              marginBottom: "18px",
              fontSize: "13px",
            }}
          >
            {error}
          </Box>

        )}


        {/* ==========================================
            Form
            ========================================== */}

        <Box
          component="form"
          onSubmit={handleRegister}
        >

          {/* ==========================================
              الاسم
              ========================================== */}

          <Typography
            sx={{
              fontSize: "14px",
              fontWeight: "600",
              color: "#37474F",
              marginBottom: "8px",
            }}
          >
            Name
          </Typography>


          <TextField
            fullWidth
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required

            sx={{
              marginBottom: "22px",

              "& .MuiOutlinedInput-root": {

                backgroundColor: "#FFFFFF",

                borderRadius: "10px",

                "&:hover fieldset": {
                  borderColor: "#00897B",
                },

                "&.Mui-focused fieldset": {
                  borderColor: "#00897B",
                },
              },
            }}
          />


          {/* ==========================================
              البريد الإلكتروني
              ========================================== */}

          <Typography
            sx={{
              fontSize: "14px",
              fontWeight: "600",
              color: "#37474F",
              marginBottom: "8px",
            }}
          >
            Email
          </Typography>


          <TextField
            fullWidth
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required

            sx={{
              marginBottom: "22px",

              "& .MuiOutlinedInput-root": {

                backgroundColor: "#FFFFFF",

                borderRadius: "10px",

                "&:hover fieldset": {
                  borderColor: "#00897B",
                },

                "&.Mui-focused fieldset": {
                  borderColor: "#00897B",
                },
              },
            }}
          />


          {/* ==========================================
              كلمة المرور
              ========================================== */}

          <Typography
            sx={{
              fontSize: "14px",
              fontWeight: "600",
              color: "#37474F",
              marginBottom: "8px",
            }}
          >
            Password
          </Typography>


          <TextField
            fullWidth
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required

            sx={{
              marginBottom: "22px",

              "& .MuiOutlinedInput-root": {

                backgroundColor: "#FFFFFF",

                borderRadius: "10px",

                "&:hover fieldset": {
                  borderColor: "#00897B",
                },

                "&.Mui-focused fieldset": {
                  borderColor: "#00897B",
                },
              },
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

                      {showPassword
                        ? <VisibilityOff />
                        : <Visibility />}

                    </IconButton>

                  </InputAdornment>

                ),
              },
            }}
          />


          {/* ==========================================
              زر إنشاء الحساب
              ========================================== */}

          <Button
            type="submit"
            fullWidth
            variant="contained"

            sx={{
              height: "50px",

              borderRadius: "10px",

              backgroundColor: "#00897B",

              textTransform: "none",

              fontSize: "15px",

              fontWeight: "bold",

              boxShadow: "none",

              "&:hover": {
                backgroundColor: "#00695C",
                boxShadow: "none",
              },
            }}
          >
            Register
          </Button>

        </Box>


        {/* ==========================================
            رابط Login
            ========================================== */}

        <Typography
          sx={{
            textAlign: "center",
            color: "#546E7A",
            fontSize: "14px",
            marginTop: "24px",
          }}
        >
          Already have an account?{" "}

          <Box
            component={Link}
            to="/login"
            sx={{
              color: "#00796B",
              fontWeight: "bold",
              textDecoration: "none",

              "&:hover": {
                textDecoration: "underline",
              },
            }}
          >
            Login
          </Box>

        </Typography>

      </Paper>

    </Box>
  );
}

export default Register;