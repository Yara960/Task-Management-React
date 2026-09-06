
// استيراد useState و useEffect من React
import { useState, useEffect } from "react";

// استيراد React Router
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// استيراد Material UI
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

// استيراد Supabase
import { supabase } from "./supabaseClient";

// استيراد الصفحات
import TasksPage from "./Pages/TasksPage";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import ForgotPassword from "./Pages/ForgotPassword";
import ResetPassword from "./Pages/ResetPassword";


// ==========================================
// حماية صفحة المهام
// ==========================================

function ProtectedRoute({ children }) {

  // تخزين المستخدم الحالي
  const [user, setUser] = useState(null);

  // معرفة هل ما زلنا نتحقق من المستخدم
  const [loading, setLoading] = useState(true);


  useEffect(() => {

    // جلب المستخدم الحالي من Supabase
    async function getUser() {

      const {
        data: { user },
      } = await supabase.auth.getUser();

      setUser(user);

      setLoading(false);
    }


    getUser();


    // مراقبة حالة تسجيل الدخول
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event, session) => {

        setUser(session?.user ?? null);

      }
    );


    // إلغاء المراقبة عند مغادرة الصفحة
    return () => {

      subscription.unsubscribe();

    };

  }, []);


  // أثناء التحقق من المستخدم
  if (loading) {

    return (

      <Box
        sx={{
          minHeight: "100vh",
          backgroundColor: "#F5F7FA",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >

        <Typography
          sx={{
            color: "#00897B",
            fontWeight: "bold",
          }}
        >
          Loading...
        </Typography>

      </Box>

    );
  }


  // إذا لم يكن المستخدم مسجل دخول
  if (!user) {

    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }


  // إذا كان المستخدم مسجل دخول
  return children;
}


// ==========================================
// Layout
// ==========================================

function Layout({ children }) {

  return (

    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >

      <Box
        sx={{
          flex: 1,
        }}
      >

        {children}

      </Box>

    </Box>

  );
}


// ==========================================
// Routes
// ==========================================

function AppRoutes() {

  return (

    <BrowserRouter>

      <Routes>

        {/* ==========================
            استعادة كلمة المرور
        ========================== */}

        <Route
          path="/forgot-password"
          element={
            <Layout>
              <ForgotPassword />
            </Layout>
          }
        />

        <Route
          path="/reset-password"
          element={
            <Layout>
              <ResetPassword />
            </Layout>
          }
        />


        {/* ==========================
            صفحة تسجيل الدخول
        ========================== */}

        <Route
          path="/login"
          element={
            <Layout>
              <Login />
            </Layout>
          }
        />


        {/* ==========================
            صفحة التسجيل
        ========================== */}

        <Route
          path="/register"
          element={
            <Layout>
              <Register />
            </Layout>
          }
        />


        {/* ==========================
            صفحة المهام
        ========================== */}

        <Route
          path="/"
          element={
            <Layout>

              <ProtectedRoute>
                <TasksPage />
              </ProtectedRoute>

            </Layout>
          }
        />


        {/* ==========================
            أي رابط غير موجود
        ========================== */}

        <Route
          path="*"
          element={
            <Navigate
              to="/login"
              replace
            />
          }
        />

      </Routes>

    </BrowserRouter>

  );
}


export default AppRoutes;