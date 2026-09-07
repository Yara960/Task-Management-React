import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Box from "@mui/material/Box";

import Login from "./Pages/Auth/Login";
import Register from "./Pages/Auth/Register";
import ForgotPassword from "./Pages/Auth/ForgotPassword";
import ResetPassword from "./Pages/Auth/ResetPassword";

import TasksPage from "./Pages/TasksPage";
import Profile from "./Pages/Profile";
import Chat from "./Pages/Chat";

import Navbar from "./Components/Navbar";

import { supabase } from "./supabaseClient";

// حماية الصفحات من المستخدم غير المسجل
function ProtectedRoute({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setUser(user);
      setLoading(false);
    }

    getUser();

    // متابعة حالة تسجيل الدخول والخروج
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return null;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

// Layout يحتوي على الـ Navbar
function Layout({ children }) {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Navbar />

      <Box sx={{ flex: 1 }}>
        {children}
      </Box>
    </Box>
  );
}

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        {/* صفحة تسجيل الدخول */}
        <Route path="/login" element={<Login />} />

        {/* صفحة إنشاء حساب */}
        <Route path="/register" element={<Register />} />

        {/* نسيت كلمة المرور */}
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* إعادة تعيين كلمة المرور */}
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* الصفحة الرئيسية - المهام */}
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

        {/* صفحة البروفايل */}
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

        {/* صفحة الشات */}
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

        {/* أي رابط غير موجود يرجع إلى تسجيل الدخول */}
        <Route path="*" element={<Navigate to="/login" replace />} />

      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;