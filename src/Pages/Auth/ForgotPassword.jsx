import { useState } from "react";

import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

import LockResetIcon from "@mui/icons-material/LockReset";

import { supabase } from "../../supabaseClient";

import { Link } from "react-router-dom";

function ForgotPassword() {

// تخزين البريد الإلكتروني
const [email, setEmail] = useState("");

// رسالة الخطأ
const [error, setError] = useState("");

// رسالة النجاح
const [message, setMessage] = useState("");

// ==========================================
// إرسال رابط تغيير كلمة المرور
// ==========================================

async function handleReset(e) {


e.preventDefault();

setError("");
setMessage("");


const { error } = await supabase.auth.resetPasswordForEmail(
  email,
  {
    redirectTo: `${window.location.origin}/reset-password`,
  }
);


if (error) {

  setError(error.message);

  return;
}


setMessage(
  "Password reset link has been sent to your email."
);


}

return (


<Box
  sx={{
    minHeight: "70vh",
    backgroundColor: "#F5F7FA",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "30px 16px",
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

    {/* الأيقونة */}

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

      <LockResetIcon
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
        fontSize: "26px",
        fontWeight: "800",
        color: "#263238",
      }}
    >
      Forgot Password?
    </Typography>


    <Typography
      sx={{
        textAlign: "center",
        color: "#78909C",
        fontSize: "14px",
        marginTop: "8px",
        marginBottom: "28px",
      }}
    >
      Enter your email to reset your password
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


    {/* رسالة النجاح */}

    {message && (

      <Box
        sx={{
          backgroundColor: "#E8F5E9",
          border: "1px solid #C8E6C9",
          color: "#2E7D32",
          borderRadius: "10px",
          padding: "12px",
          marginBottom: "18px",
          fontSize: "13px",
        }}
      >
        {message}
      </Box>

    )}


    {/* Form */}

    <Box
      component="form"
      onSubmit={handleReset}
    >

      <TextField
        fullWidth
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        sx={{
          marginBottom: "20px",

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


      <Button
        type="submit"
        fullWidth
        variant="contained"
        startIcon={<LockResetIcon />}
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
        Send Reset Link
      </Button>

    </Box>


    {/* العودة لتسجيل الدخول */}

    <Typography
      sx={{
        textAlign: "center",
        color: "#78909C",
        fontSize: "14px",
        marginTop: "24px",
      }}
    >

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
        Back to Login
      </Box>

    </Typography>

  </Paper>

</Box>


);
}

export default ForgotPassword;
