
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

import { supabase } from "../../supabaseClient";

import { useNavigate } from "react-router-dom";

function ResetPassword() {

  // كلمة المرور الجديدة
  const [password, setPassword] = useState("");

  // تأكيد كلمة المرور
  const [confirmPassword, setConfirmPassword] = useState("");

  // إظهار كلمة المرور
  const [showPassword, setShowPassword] = useState(false);

  // إظهار تأكيد كلمة المرور
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // رسالة الخطأ
  const [error, setError] = useState("");

  // رسالة النجاح
  const [message, setMessage] = useState("");

  // حالة جلسة استرجاع كلمة المرور
  const [sessionReady, setSessionReady] = useState(false);

  // حالة التحميل
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();


  // ==========================================
  // التأكد من وجود جلسة استرجاع كلمة المرور
  // ==========================================

  useEffect(() => {

    let mounted = true;

    async function checkSession() {

      // الحصول على الجلسة الحالية
      const { data, error } = await supabase.auth.getSession();

      if (!mounted) return;

      if (error) {

        setError(error.message);
        setLoading(false);

        return;
      }

      // إذا كانت الجلسة موجودة
      if (data.session) {

        setSessionReady(true);

      } else {

        setError(
          "The password reset session is missing. Please open the reset link from your email again."
        );

      }

      setLoading(false);
    }


    checkSession();


    // الاستماع إلى أحداث تسجيل الدخول واسترجاع كلمة المرور
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (event, session) => {

        console.log("Auth event:", event);

        // عند استرجاع كلمة المرور
        if (event === "PASSWORD_RECOVERY" && session) {

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


    // تنظيف الاشتراك عند مغادرة الصفحة
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

    setError("");
    setMessage("");


    // التأكد من وجود جلسة
    if (!sessionReady) {

      setError(
        "Your password reset session is not ready. Please open the reset link from your email again."
      );

      return;
    }


    // التأكد من تطابق الباسورد
    if (password !== confirmPassword) {

      setError("Passwords do not match.");

      return;
    }


    // التأكد من أن الباسورد ليس قصيرًا
    if (password.length < 6) {

      setError("Password must be at least 6 characters.");

      return;
    }


    // تحديث كلمة المرور في Supabase
    const { error } = await supabase.auth.updateUser({
      password: password,
    });


    // إذا حدث خطأ
    if (error) {

      setError(error.message);

      return;
    }


    // رسالة النجاح
    setMessage("Password updated successfully.");


    // مسح الحقول
    setPassword("");
    setConfirmPassword("");


    // الانتقال إلى Login
    setTimeout(() => {

      navigate("/login");

    }, 1500);

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
          Reset Password
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
          Create a new password for your account
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


        {/* حالة التحميل */}

        {loading ? (

          <Typography
            sx={{
              textAlign: "center",
              color: "#78909C",
              padding: "20px 0",
            }}
          >
            Checking password reset session...
          </Typography>

        ) : (

          <Box
            component="form"
            onSubmit={handleUpdatePassword}
          >

            {/* الباسورد الجديد */}

            <TextField
              fullWidth
              label="New Password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={!sessionReady}
              sx={{
                marginBottom: "18px",

                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
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
                        disabled={!sessionReady}
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


            {/* تأكيد الباسورد */}

            <TextField
              fullWidth
              label="Confirm Password"
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(e.target.value)
              }
              required
              disabled={!sessionReady}
              sx={{
                marginBottom: "22px",

                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                },
              }}
              slotProps={{
                input: {
                  endAdornment: (

                    <InputAdornment position="end">

                      <IconButton
                        onClick={() =>
                          setShowConfirmPassword(
                            !showConfirmPassword
                          )
                        }
                        edge="end"
                        disabled={!sessionReady}
                      >

                        {showConfirmPassword
                          ? <VisibilityOff />
                          : <Visibility />}

                      </IconButton>

                    </InputAdornment>

                  ),
                },
              }}
            />


            {/* زر تحديث كلمة المرور */}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              startIcon={<LockResetIcon />}
              disabled={!sessionReady}
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

                "&.Mui-disabled": {
                  backgroundColor: "#B0BEC5",
                  color: "#FFFFFF",
                },
              }}
            >
              Update Password
            </Button>

          </Box>

        )}

      </Paper>

    </Box>

  );

}

export default ResetPassword;

