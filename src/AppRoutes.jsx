// استيراد React
import { useEffect, useState } from "react";

// استيراد React Router
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// استيراد Material UI
import Box from "@mui/material/Box";

// استيراد Theme Provider
import { AppThemeProvider } from "./ThemeContext";

// استيراد الصفحات
import Login from "./Pages/Auth/Login";
import Register from "./Pages/Auth/Register";
import ForgotPassword from "./Pages/Auth/ForgotPassword";
import ResetPassword from "./Pages/Auth/ResetPassword";

import TasksPage from "./Pages/TasksPage";
import Profile from "./Pages/Profile";
import Chat from "./Pages/Chat";
import AdminPage from "./Pages/AdminPage";

// استيراد Navbar
import Navbar from "./Components/Navbar";

// استيراد Supabase
import { supabase } from "./supabaseClient";


// =====================================================
// Layout
// =====================================================

function Layout({ children }) {

  return (

    <>

      {/* Navbar */}
      <Navbar />


      {/* محتوى الصفحات */}

      <Box
        sx={{
          minHeight: "100vh",
          backgroundColor: "background.default",
          color: "text.primary",
          transition: "background-color 0.3s, color 0.3s",
        }}
      >

        {children}

      </Box>

    </>
  );
}


// =====================================================
// Protected Route
// الصفحات التي تحتاج تسجيل دخول
// =====================================================

function ProtectedRoute({ children }) {

  const [loading, setLoading] = useState(true);

  const [user, setUser] = useState(null);


  useEffect(() => {

    checkUser();

  }, []);


  const checkUser = async () => {

    const {
      data,
      error,
    } = await supabase.auth.getUser();


    // إذا حدث خطأ

    if (error) {

      console.log(error);

      setLoading(false);

      return;
    }


    // حفظ المستخدم

    setUser(data?.user || null);

    setLoading(false);
  };


  // أثناء التحقق

  if (loading) {

    return (

      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "background.default",
          color: "text.primary",
        }}
      >

        Loading...

      </Box>
    );
  }


  // إذا لم يكن المستخدم مسجل دخول

  if (!user) {

    return <Navigate to="/login" replace />;
  }


  return children;
}


// =====================================================
// Admin Route
// SUPERADMIN فقط يستطيع الدخول
// =====================================================

function AdminRoute({ children }) {

  const [loading, setLoading] = useState(true);

  const [allowed, setAllowed] = useState(false);


  useEffect(() => {

    checkAdmin();

  }, []);


  const checkAdmin = async () => {

    try {

      // الحصول على المستخدم الحالي

      const {
        data: {
          user,
        },
      } = await supabase.auth.getUser();


      // إذا لم يكن مسجل دخول

      if (!user) {

        setAllowed(false);

        setLoading(false);

        return;
      }


      // الحصول على بيانات المستخدم

      const {
        data: profile,
        error,
      } = await supabase
        .from("profiles")
        .select("role, is_active")
        .eq("id", user.id)
        .single();


      // إذا حدث خطأ

      if (error) {

        console.log("Profile error:", error);

        setAllowed(false);

        setLoading(false);

        return;
      }


      // SUPERADMIN فقط

      if (
        profile?.role === "SUPERADMIN" &&
        profile?.is_active === 1
      ) {

        setAllowed(true);

      } else {

        setAllowed(false);
      }


      setLoading(false);

    } catch (error) {

      console.log(error);

      setAllowed(false);

      setLoading(false);
    }
  };


  // أثناء التحقق

  if (loading) {

    return (

      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "background.default",
          color: "text.primary",
        }}
      >

        Loading...

      </Box>
    );
  }


  // إذا لم يكن SUPERADMIN

  if (!allowed) {

    return <Navigate to="/" replace />;
  }


  return children;
}


// =====================================================
// App Routes
// =====================================================

export default function AppRoutes() {

  return (

    <AppThemeProvider>

      <BrowserRouter>

        <Routes>


          {/* =========================================
              Authentication
          ========================================= */}

          <Route
            path="/login"
            element={<Login />}
          />


          <Route
            path="/register"
            element={<Register />}
          />


          <Route
            path="/forgot-password"
            element={<ForgotPassword />}
          />


          <Route
            path="/reset-password"
            element={<ResetPassword />}
          />


          {/* =========================================
              Tasks
          ========================================= */}

          <Route
            path="/"
            element={

              <ProtectedRoute>

                <Layout>

                  <TasksPage />

                </Layout>

              </ProtectedRoute>

            }
          />


          {/* =========================================
              Profile
          ========================================= */}

          <Route
            path="/profile"
            element={

              <ProtectedRoute>

                <Layout>

                  <Profile />

                </Layout>

              </ProtectedRoute>

            }
          />


          {/* =========================================
              Chat
          ========================================= */}

          <Route
            path="/chat"
            element={

              <ProtectedRoute>

                <Layout>

                  <Chat />

                </Layout>

              </ProtectedRoute>

            }
          />


          {/* =========================================
              Admin
              SUPERADMIN فقط
          ========================================= */}

          <Route
            path="/admin"
            element={

              <AdminRoute>

                <Layout>

                  <AdminPage />

                </Layout>

              </AdminRoute>

            }
          />


          {/* =========================================
              Route غير موجود
          ========================================= */}

          <Route
            path="*"
            element={
              <Navigate
                to="/"
                replace
              />
            }
          />

        </Routes>

      </BrowserRouter>

    </AppThemeProvider>
  );
}