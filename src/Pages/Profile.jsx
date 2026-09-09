
// استيراد useState و useEffect من React
import { useState, useEffect } from "react";

// استيراد useTheme من Material UI
import { useTheme } from "@mui/material/styles";

// استيراد Material UI
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";

// استيراد الأيقونات
import PersonIcon from "@mui/icons-material/Person";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import SaveIcon from "@mui/icons-material/Save";

// استيراد Supabase
import { supabase } from "../supabaseClient";

// ==========================================
// صفحة الملف الشخصي
// ==========================================

function Profile() {
  // معرفة الثيم الحالي
  const theme = useTheme();

  // معرفة هل الوضع Dark Mode
  const isDark = theme.palette.mode === "dark";

  // تخزين بيانات المستخدم
  const [user, setUser] = useState(null);

  // تخزين صورة المستخدم
  const [avatarUrl, setAvatarUrl] = useState("");

  // تخزين عدد المهام
  const [taskCount, setTaskCount] = useState(0);

  // تخزين الاسم الجديد
  const [name, setName] = useState("");

  // حالة الحفظ
  const [saving, setSaving] = useState(false);

  // رسالة النجاح أو الخطأ
  const [message, setMessage] = useState("");

  // نوع الرسالة
  const [messageType, setMessageType] = useState("success");

  // تخزين اللغة الحالية
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem("language") || "en";
  });

  // ==========================================
  // الاستماع لتغيير اللغة من Navbar
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
  // النصوص العربية والإنجليزية
  // ==========================================

  const text = {
    en: {
      profile: "Profile",
      description:
        "View your account information and task statistics.",

      totalTasks: "Total Tasks",
      totalTasksDescription:
        "Your total number of tasks",

      user: "User",
      task: "Task",
      tasks: "Tasks",

      name: "Name",
      namePlaceholder: "Enter your name",
      save: "Save Changes",
      saving: "Saving...",

      nameRequired: "Please enter your name.",
      updateSuccess:
        "Your name has been updated successfully.",
      updateError: "Failed to update your name.",
    },

    ar: {
      profile: "الملف الشخصي",
      description:
        "عرض معلومات حسابك وإحصائيات المهام الخاصة بك.",

      totalTasks: "إجمالي المهام",
      totalTasksDescription:
        "إجمالي عدد المهام الخاصة بك",

      user: "مستخدم",
      task: "مهمة",
      tasks: "مهام",

      name: "الاسم",
      namePlaceholder: "اكتب اسمك",
      save: "حفظ التغييرات",
      saving: "جاري الحفظ...",

      nameRequired: "يرجى إدخال الاسم.",
      updateSuccess: "تم تحديث اسمك بنجاح.",
      updateError: "حدث خطأ أثناء تحديث الاسم.",
    },
  };

  // اختيار النصوص حسب اللغة
  const currentText =
    language === "ar"
      ? text.ar
      : text.en;

  // ==========================================
  // الألوان تتغير تلقائيًا حسب Light / Dark
  // ==========================================

  const colors = {
    background: theme.palette.background.default,
    card: theme.palette.background.paper,

    field: isDark
      ? "#273449"
      : "#F8FAFC",

    border: isDark
      ? "#334155"
      : "#DCE3E8",

    primary: theme.palette.primary.main,
    secondary: theme.palette.secondary.main,

    text: theme.palette.text.primary,
    muted: theme.palette.text.secondary,
  };

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

      // ==========================================
      // جلب بيانات المستخدم من جدول profiles
      // ==========================================

      const {
        data: profile,
        error: profileError,
      } = await supabase
        .from("profiles")
        .select("name, avatar_url")
        .eq("id", user.id)
        .single();

      // التحقق من وجود خطأ
      if (profileError) {
        console.log(
          "Get profile error:",
          profileError
        );
      }

      // إذا تم جلب بيانات profile بنجاح
      if (profile) {
        // حفظ رابط صورة المستخدم
        setAvatarUrl(profile.avatar_url || "");

        // جلب الاسم من profiles
        const currentName =
          profile.name ||
          user?.user_metadata?.name ||
          user?.user_metadata?.full_name ||
          "";

        setName(currentName);
      } else {
        // إذا لم توجد بيانات profile
        const currentName =
          user?.user_metadata?.name ||
          user?.user_metadata?.full_name ||
          "";

        setName(currentName);
      }

      // ==========================================
      // جلب عدد مهام المستخدم الحالية
      // ==========================================

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
        console.log(
          "Get task count error:",
          error
        );
      } else {
        // حفظ عدد المهام
        setTaskCount(count || 0);
      }
    }

    // تشغيل جلب البيانات
    getProfileData();
  }, []);

  // ==========================================
  // تحديث الاسم
  // ==========================================

  const handleUpdateName = async () => {
    // إزالة المسافات الزائدة
    const newName = name.trim();

    // التحقق من الاسم
    if (!newName) {
      setMessage(currentText.nameRequired);
      setMessageType("error");
      return;
    }

    // بدء الحفظ
    setSaving(true);

    // إزالة الرسالة القديمة
    setMessage("");

    try {
      // جلب المستخدم الحالي
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser();

      // إذا لم يوجد مستخدم
      if (!currentUser) {
        setMessage(currentText.updateError);
        setMessageType("error");
        return;
      }

      // ==========================================
      // تحديث الاسم في Supabase Auth
      // ==========================================

      const {
        data: updatedUser,
        error: authError,
      } = await supabase.auth.updateUser({
        data: {
          name: newName,
        },
      });

      // التحقق من خطأ Auth
      if (authError) {
        console.log(
          "Update auth name error:",
          authError
        );

        setMessage(currentText.updateError);
        setMessageType("error");
        return;
      }

      // ==========================================
      // تحديث الاسم في جدول profiles
      // ==========================================

      const { error: profileError } =
        await supabase
          .from("profiles")
          .update({
            name: newName,
          })
          .eq("id", currentUser.id);

      // التحقق من خطأ profiles
      if (profileError) {
        console.log(
          "Update profile name error:",
          profileError
        );

        setMessage(currentText.updateError);
        setMessageType("error");
        return;
      }

      // ==========================================
      // تحديث بيانات المستخدم في الصفحة
      // ==========================================

      setUser(updatedUser.user);

      // إظهار رسالة النجاح
      setMessage(currentText.updateSuccess);
      setMessageType("success");

      // إرسال حدث لتحديث Navbar
      window.dispatchEvent(
        new CustomEvent("profileUpdated", {
          detail: newName,
        })
      );
    } catch (error) {
      console.log(
        "Update name error:",
        error
      );

      setMessage(currentText.updateError);
      setMessageType("error");
    } finally {
      // إنهاء حالة الحفظ
      setSaving(false);
    }
  };

  // ==========================================
  // واجهة صفحة Profile
  // ==========================================

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 64px)",
        backgroundColor: colors.background,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* المحتوى الرئيسي */}

      <Box
        sx={{
          width: "100%",
          maxWidth: "1200px",
          margin: "0 auto",
          padding: {
            xs: "30px 16px",
            sm: "40px 25px",
            md: "40px",
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
              color: colors.text,
              marginBottom: "6px",
              fontSize: {
                xs: "28px",
                sm: "34px",
              },
            }}
          >
            {currentText.profile}
          </Typography>

          <Typography
            sx={{
              color: colors.muted,
              fontSize: "15px",
            }}
          >
            {currentText.description}
          </Typography>
        </Box>

        {/* ==========================================
            بطاقة الملف الشخصي
        ========================================== */}

        <Paper
          elevation={0}
          sx={{
            borderRadius: 3,
            backgroundColor: colors.card,
            border: `1px solid ${colors.border}`,
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
            {/* ==========================================
                صورة المستخدم
            ========================================== */}

            <Avatar
              src={avatarUrl || undefined}
              alt={name}
              sx={{
                width: {
                  xs: 65,
                  sm: 75,
                },
                height: {
                  xs: 65,
                  sm: 75,
                },
                backgroundColor: colors.primary,

                color: isDark
                  ? colors.background
                  : "#FFFFFF",
              }}
            >
              {/* إذا لم توجد صورة تظهر الأيقونة */}
              {!avatarUrl && (
                <PersonIcon
                  sx={{
                    fontSize: {
                      xs: 35,
                      sm: 42,
                    },
                  }}
                />
              )}
            </Avatar>

            {/* ==========================================
                معلومات المستخدم
            ========================================== */}

            <Box sx={{ minWidth: 0 }}>
              <Typography
                sx={{
                  fontSize: {
                    xs: "21px",
                    sm: "24px",
                  },
                  fontWeight: "800",
                  color: colors.text,
                  marginBottom: "5px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {user?.user_metadata?.name ||
                  name ||
                  currentText.user}
              </Typography>

              <Typography
                sx={{
                  color: colors.muted,
                  fontSize: "14px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {user?.email}
              </Typography>
            </Box>
          </Box>

          {/* ==========================================
              تعديل الاسم
          ========================================== */}

          <Box
            sx={{
              marginTop: "30px",
              display: "flex",
              gap: "12px",
              alignItems: "flex-start",
              flexWrap: "wrap",
            }}
          >
            <TextField
              fullWidth
              label={currentText.name}
              placeholder={currentText.namePlaceholder}
              value={name}
              onChange={(event) => {
                setName(event.target.value);
              }}
              sx={{
                flex: 1,
                minWidth: {
                  xs: "100%",
                  sm: "300px",
                },
              }}
            />

            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={handleUpdateName}
              disabled={saving}
              sx={{
                minHeight: "56px",
                px: 3,
                width: {
                  xs: "100%",
                  sm: "auto",
                },
              }}
            >
              {saving
                ? currentText.saving
                : currentText.save}
            </Button>
          </Box>

          {/* رسالة النجاح أو الخطأ */}

          {message && (
            <Alert
              severity={messageType}
              sx={{
                marginTop: "15px",
                borderRadius: "10px",
              }}
            >
              {message}
            </Alert>
          )}
        </Paper>

        {/* ==========================================
            بطاقة عدد المهام
        ========================================== */}

        <Paper
          elevation={0}
          sx={{
            borderRadius: 3,
            backgroundColor: colors.card,
            border: `1px solid ${colors.border}`,
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
                  borderRadius: "14px",
                  backgroundColor: colors.field,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: `1px solid ${colors.border}`,
                }}
              >
                <TaskAltIcon
                  sx={{
                    color: colors.primary,
                    fontSize: "30px",
                  }}
                />
              </Box>

              <Box>
                <Typography
                  sx={{
                    fontSize: "17px",
                    fontWeight: "700",
                    color: colors.text,
                  }}
                >
                  {currentText.totalTasks}
                </Typography>

                <Typography
                  sx={{
                    color: colors.muted,
                    fontSize: "13px",
                    marginTop: "3px",
                  }}
                >
                  {currentText.totalTasksDescription}
                </Typography>
              </Box>
            </Box>

            {/* عدد المهام */}

            <Chip
              label={`${taskCount} ${
                taskCount === 1
                  ? currentText.task
                  : currentText.tasks
              }`}
              sx={{
                height: "48px",
                padding: "0 12px",
                borderRadius: "12px",
                backgroundColor: colors.field,
                color: colors.primary,
                fontSize: "18px",
                fontWeight: "800",
                border: `1px solid ${colors.border}`,

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

