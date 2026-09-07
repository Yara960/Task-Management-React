
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
import TaskAltIcon from "@mui/icons-material/TaskAlt";
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


    // إنشاء الحساب عن طريق Supabase
    const { error } = await supabase.auth.signUp({
      email: email,
      password: password,

      // تخزين الاسم مع بيانات المستخدم
      options: {
        data: {
          name: name,
        },
      },
    });


    // إذا حدث خطأ
    if (error) {

      setError(error.message);

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
        backgroundColor: "#F5F7FA",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: {
          xs: "30px 16px",
          sm: "45px 20px",
        },
      }}
    >

      <Paper
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: "430px",
          padding: {
            xs: "28px 22px",
            sm: "38px",
          },
          borderRadius: "20px",
          backgroundColor: "#FFFFFF",
          border: "1px solid #E8ECEF",
          boxShadow:
            "0 8px 30px rgba(38, 50, 56, 0.08)",
        }}
      >

        {/* أيقونة التسجيل */}

        <Box
          sx={{
            width: "65px",
            height: "65px",
            borderRadius: "18px",
            backgroundColor: "#E0F2F1",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            margin: "0 auto 18px",
          }}
        >

          <TaskAltIcon
            sx={{
              color: "#00897B",
              fontSize: "34px",
            }}
          />

        </Box>


        {/* العنوان */}

        <Typography
          sx={{
            textAlign: "center",
            fontSize: "27px",
            fontWeight: "800",
            color: "#263238",
          }}
        >
          Create Account
        </Typography>


        <Typography
          sx={{
            textAlign: "center",
            color: "#78909C",
            fontSize: "14px",
            marginTop: "6px",
            marginBottom: "28px",
          }}
        >
          Create your account to start managing tasks
        </Typography>


        {/* رسالة الخطأ */}

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


        {/* Form */}

        <Box
          component="form"
          onSubmit={handleRegister}
        >

          {/* الاسم */}

          <TextField
            fullWidth
            label="Name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            sx={{
              marginBottom: "18px",

              "& .MuiOutlinedInput-root": {
                borderRadius: "12px",

                "&:hover fieldset": {
                  borderColor: "#00897B",
                },

                "&.Mui-focused fieldset": {
                  borderColor: "#00897B",
                },
              },

              "& label.Mui-focused": {
                color: "#00897B",
              },
            }}
          />


          {/* البريد الإلكتروني */}

          <TextField
            fullWidth
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            sx={{
              marginBottom: "18px",

              "& .MuiOutlinedInput-root": {
                borderRadius: "12px",

                "&:hover fieldset": {
                  borderColor: "#00897B",
                },

                "&.Mui-focused fieldset": {
                  borderColor: "#00897B",
                },
              },

              "& label.Mui-focused": {
                color: "#00897B",
              },
            }}
          />


          {/* كلمة المرور */}

          <TextField
            fullWidth
            label="Password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            sx={{
              marginBottom: "22px",

              "& .MuiOutlinedInput-root": {
                borderRadius: "12px",

                "&:hover fieldset": {
                  borderColor: "#00897B",
                },

                "&.Mui-focused fieldset": {
                  borderColor: "#00897B",
                },
              },

              "& label.Mui-focused": {
                color: "#00897B",
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


          {/* زر إنشاء الحساب */}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            startIcon={<PersonAddIcon />}
            sx={{
              height: "52px",
              borderRadius: "12px",
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


        {/* رابط Login */}

        <Typography
          sx={{
            textAlign: "center",
            color: "#78909C",
            fontSize: "14px",
            marginTop: "24px",
          }}
        >
          Already have an account?{" "}

          <Box
            component={Link}
            to="/login"
            sx={{
              color: "#00897B",
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

