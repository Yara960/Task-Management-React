
// استيراد useState و useEffect من React
import { useState, useEffect } from "react";

// استيراد Material UI
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";

// استيراد الأيقونات
import PersonIcon from "@mui/icons-material/Person";
import TaskAltIcon from "@mui/icons-material/TaskAlt";

// استيراد Supabase
import { supabase } from "../supabaseClient";

// ==========================================
// صفحة الملف الشخصي
// ==========================================

function Profile() {

  // تخزين بيانات المستخدم
  const [user, setUser] = useState(null);

  // تخزين عدد المهام
  const [taskCount, setTaskCount] = useState(0);

  // ==========================================
  // جلب بيانات المستخدم وعدد المهام
  // ==========================================

  useEffect(() => {

    async function getProfileData() {

      // جلب المستخدم الحالي
      const {
        data: { user },
      } = await supabase.auth.getUser();

      // إذا لم يوجد مستخدم
      if (!user) {
        return;
      }

      // حفظ بيانات المستخدم
      setUser(user);

      // جلب عدد مهام المستخدم الحالية
      const { count, error } = await supabase
        .from("tasks")
        .select("*", {
          count: "exact",
          head: true,
        })
        .eq("user_id", user.id)
        .is("deleted_at", null);

      // التحقق من وجود خطأ
      if (error) {

        console.log("Get task count error:", error);

      } else {

        // حفظ عدد المهام
        setTaskCount(count || 0);

      }
    }

    // تشغيل جلب البيانات
    getProfileData();

  }, []);


  // ==========================================
  // واجهة صفحة Profile
  // ==========================================

  return (

    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#F5F7FA",
        display: "flex",
        flexDirection: "column",
      }}
    >

      {/* المحتوى الرئيسي */}

      <Box
        sx={{
          width: "100%",
          maxWidth: "900px",
          margin: "0 auto",
          padding: {
            xs: "30px 16px",
            sm: "50px 25px",
          },
          flex: 1,
        }}
      >

        {/* ==========================================
            عنوان الصفحة
        ========================================== */}

        <Box
          sx={{
            marginBottom: "30px",
          }}
        >

          <Typography
            variant="h4"
            sx={{
              fontWeight: "800",
              color: "#263238",
              marginBottom: "6px",
              fontSize: {
                xs: "28px",
                sm: "34px",
              },
            }}
          >
            Profile
          </Typography>

          <Typography
            sx={{
              color: "#78909C",
              fontSize: "15px",
            }}
          >
            View your account information and task statistics.
          </Typography>

        </Box>


        {/* ==========================================
            بطاقة الملف الشخصي
        ========================================== */}

        <Paper
          elevation={0}
          sx={{
            borderRadius: "20px",
            backgroundColor: "#FFFFFF",
            border: "1px solid #E8ECEF",
            padding: {
              xs: "25px 20px",
              sm: "35px",
            },
            marginBottom: "20px",
          }}
        >

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "20px",
            }}
          >

            {/* صورة المستخدم */}

            <Avatar
              sx={{
                width: {
                  xs: 65,
                  sm: 75,
                },
                height: {
                  xs: 65,
                  sm: 75,
                },
                backgroundColor: "#E0F2F1",
                color: "#00897B",
              }}
            >

              <PersonIcon
                sx={{
                  fontSize: {
                    xs: 35,
                    sm: 42,
                  },
                }}
              />

            </Avatar>


            {/* معلومات المستخدم */}

            <Box>

              <Typography
                sx={{
                  fontSize: {
                    xs: "21px",
                    sm: "24px",
                  },
                  fontWeight: "800",
                  color: "#263238",
                  marginBottom: "5px",
                }}
              >
                {user?.user_metadata?.name ||
                  user?.user_metadata?.full_name ||
                  "User"}
              </Typography>

              <Typography
                sx={{
                  color: "#78909C",
                  fontSize: "14px",
                }}
              >
                {user?.email}
              </Typography>

            </Box>

          </Box>

        </Paper>


        {/* ==========================================
            بطاقة عدد المهام
        ========================================== */}

        <Paper
          elevation={0}
          sx={{
            borderRadius: "20px",
            backgroundColor: "#FFFFFF",
            border: "1px solid #E8ECEF",
            padding: {
              xs: "25px 20px",
              sm: "30px",
            },
          }}
        >

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "20px",
              flexWrap: "wrap",
            }}
          >

            {/* عنوان الإحصائية */}

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "15px",
              }}
            >

              <Box
                sx={{
                  width: "55px",
                  height: "55px",
                  borderRadius: "15px",
                  backgroundColor: "#E0F2F1",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >

                <TaskAltIcon
                  sx={{
                    color: "#00897B",
                    fontSize: "30px",
                  }}
                />

              </Box>


              <Box>

                <Typography
                  sx={{
                    fontSize: "17px",
                    fontWeight: "700",
                    color: "#37474F",
                  }}
                >
                  Total Tasks
                </Typography>

                <Typography
                  sx={{
                    color: "#90A4AE",
                    fontSize: "13px",
                    marginTop: "3px",
                  }}
                >
                  Your total number of tasks
                </Typography>

              </Box>

            </Box>


            {/* عدد المهام */}

            <Chip
              label={`${taskCount} ${
                taskCount === 1 ? "Task" : "Tasks"
              }`}
              sx={{
                height: "48px",
                padding: "0 12px",
                borderRadius: "14px",
                backgroundColor: "#E0F2F1",
                color: "#00695C",
                fontSize: "18px",
                fontWeight: "800",

                "& .MuiChip-label": {
                  padding: "0 8px",
                },
              }}
            />

          </Box>

        </Paper>

      </Box>

    </Box>
  );
}


// تصدير صفحة Profile
export default Profile;

