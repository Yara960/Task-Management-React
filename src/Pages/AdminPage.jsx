// استيراد React
import { useEffect, useState } from "react";

// استيراد Theme من Material UI
import { useTheme } from "@mui/material/styles";

// استيراد Supabase
import { supabase } from "../supabaseClient";

// استيراد Material UI
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";

// استيراد الأيقونات
import PersonIcon from "@mui/icons-material/Person";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import BlockIcon from "@mui/icons-material/Block";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

// ======================================================
// صفحة الأدمن
// ======================================================

function AdminPage() {
  // الحصول على الثيم مباشرة من Material UI
  const theme = useTheme();

  // ======================================================
  // اللغة
  // ======================================================

  const [language, setLanguage] = useState(() => {
    return localStorage.getItem("language") || "en";
  });

  // الاستماع لتغيير اللغة من Navbar
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

  // ------------------------------------------
  // النصوص
  // ------------------------------------------

  const texts = {
    en: {
      adminDashboard: "Admin Dashboard",
      userManagement: "User Management",
      searchUser: "Search user by name or email",

      loadingUsers: "Loading users...",
      noUsersFound: "No users found",

      name: "Name",
      email: "Email",
      status: "Status",

      active: "Active",
      inactive: "Inactive",

      role: "Role",
      roleUser: "User",
      roleSuperAdmin: "Super Admin",

      deactivateAccount: "Deactivate Account",
      activateAccount: "Activate Account",
      deleteAccount: "Delete Account",

      taskManagement: "Task Management",
      loadingTasks: "Loading tasks...",
      noTasksFound: "No tasks found",

      task: "Task",
      priority: "Priority",
      normal: "Normal",
      urgent: "Urgent",

      updateTask: "Update Task",
      deleteTask: "Delete Task",

      taskRequired: "Task is required",

      confirmDeleteUser:
        "Are you sure you want to delete this account?",

      confirmDeleteTask:
        "Are you sure you want to delete this task?",

      deleteUserTitle: "Delete Account",
      deleteTaskTitle: "Delete Task",

      cancel: "Cancel",
      delete: "Delete",

      errorLoadingUsers:
        "Error loading users",

      errorLoadingTasks:
        "Error loading tasks",

      errorChangingRole:
        "Error changing user role",

      roleChanged:
        "User role changed successfully",

      errorChangingStatus:
        "Error changing account status",

      accountActivated:
        "Account activated successfully",

      accountDeactivated:
        "Account deactivated successfully",

      errorDeletingUser:
        "Error deleting user",

      accountDeleted:
        "Account deleted successfully",

      errorUpdatingTask:
        "Error updating task",

      taskUpdated:
        "Task updated successfully",

      errorDeletingTask:
        "Error deleting task",

      taskDeleted:
        "Task deleted successfully",
    },

    ar: {
      adminDashboard: "لوحة تحكم الأدمن",
      userManagement: "إدارة المستخدمين",

      searchUser:
        "البحث عن مستخدم بالاسم أو البريد الإلكتروني",

      loadingUsers:
        "جاري تحميل المستخدمين...",

      noUsersFound:
        "لا يوجد مستخدمون",

      name: "الاسم",
      email: "البريد الإلكتروني",
      status: "الحالة",

      active: "نشط",
      inactive: "غير نشط",

      role: "الصلاحية",
      roleUser: "مستخدم",
      roleSuperAdmin: "أدمن",

      deactivateAccount:
        "تعطيل الحساب",

      activateAccount:
        "تفعيل الحساب",

      deleteAccount:
        "حذف الحساب",

      taskManagement:
        "إدارة المهام",

      loadingTasks:
        "جاري تحميل المهام...",

      noTasksFound:
        "لا توجد مهام",

      task: "المهمة",
      priority: "الأولوية",
      normal: "عادية",
      urgent: "عاجلة",

      updateTask:
        "تعديل المهمة",

      deleteTask:
        "حذف المهمة",

      taskRequired:
        "المهمة مطلوبة",

      confirmDeleteUser:
        "هل أنت متأكد من رغبتك في حذف هذا الحساب؟",

      confirmDeleteTask:
        "هل أنت متأكد من رغبتك في حذف هذه المهمة؟",

      deleteUserTitle:
        "حذف الحساب",

      deleteTaskTitle:
        "حذف المهمة",

      cancel: "إلغاء",
      delete: "حذف",

      errorLoadingUsers:
        "حدث خطأ أثناء تحميل المستخدمين",

      errorLoadingTasks:
        "حدث خطأ أثناء تحميل المهام",

      errorChangingRole:
        "حدث خطأ أثناء تغيير صلاحية المستخدم",

      roleChanged:
        "تم تغيير صلاحية المستخدم بنجاح",

      errorChangingStatus:
        "حدث خطأ أثناء تغيير حالة الحساب",

      accountActivated:
        "تم تفعيل الحساب بنجاح",

      accountDeactivated:
        "تم تعطيل الحساب بنجاح",

      errorDeletingUser:
        "حدث خطأ أثناء حذف المستخدم",

      accountDeleted:
        "تم حذف الحساب بنجاح",

      errorUpdatingTask:
        "حدث خطأ أثناء تعديل المهمة",

      taskUpdated:
        "تم تعديل المهمة بنجاح",

      errorDeletingTask:
        "حدث خطأ أثناء حذف المهمة",

      taskDeleted:
        "تم حذف المهمة بنجاح",
    },
  };

  const currentText =
    texts[language] || texts.en;

  // ======================================================
  // الحالات
  // ======================================================

  const [users, setUsers] =
    useState([]);

  const [tasks, setTasks] =
    useState([]);

  const [loadingUsers, setLoadingUsers] =
    useState(false);

  const [loadingTasks, setLoadingTasks] =
    useState(false);

  const [searchUser, setSearchUser] =
    useState("");

  // حالة التنبيه
  const [message, setMessage] =
    useState("");

  const [messageType, setMessageType] =
    useState("success");

  // ======================================================
  // حالات نافذة الحذف
  // ======================================================

  const [deleteOpen, setDeleteOpen] =
    useState(false);

  const [deleteId, setDeleteId] =
    useState(null);

  const [deleteType, setDeleteType] =
    useState(null);

  // ======================================================
  // إظهار التنبيه
  // ======================================================

  function showMessage(
    newMessage,
    type = "success"
  ) {
    setMessage(newMessage);
    setMessageType(type);
  }

  // ======================================================
  // إخفاء التنبيه بعد 4 ثواني
  // ======================================================

  useEffect(() => {
    if (!message) {
      return;
    }

    const timer = setTimeout(() => {
      setMessage("");
    }, 4000);

    return () => clearTimeout(timer);
  }, [message]);

  // ======================================================
  // جلب المستخدمين
  // ======================================================

  async function getUsers() {
    setLoadingUsers(true);

    const { data, error } =
      await supabase
        .from("profiles")
        .select("*")
        .order("id");

    if (error) {
      console.error(
        "Error getting users:",
        error
      );

      showMessage(
        currentText.errorLoadingUsers,
        "error"
      );
    } else {
      setUsers(data || []);
    }

    setLoadingUsers(false);
  }

  // ======================================================
  // جلب المهام
  // ======================================================

  async function getTasks() {
    setLoadingTasks(true);

    const { data, error } =
      await supabase
        .from("tasks")
        .select("*")
        .order("id", {
          ascending: false,
        });

    if (error) {
      console.error(
        "Error getting tasks:",
        error
      );

      showMessage(
        currentText.errorLoadingTasks,
        "error"
      );
    } else {
      setTasks(data || []);
    }

    setLoadingTasks(false);
  }

  // ======================================================
  // تحميل البيانات عند فتح الصفحة
  // ======================================================

  useEffect(() => {
    getUsers();
    getTasks();
  }, []);

  // ======================================================
  // تغيير صلاحية المستخدم
  // ======================================================

  async function changeRole(
    id,
    newRole
  ) {
    const { error } =
      await supabase
        .from("profiles")
        .update({
          role: newRole,
        })
        .eq("id", id);

    if (error) {
      console.error(
        "Error changing role:",
        error
      );

      showMessage(
        currentText.errorChangingRole,
        "error"
      );

      return;
    }

    await getUsers();

    showMessage(
      currentText.roleChanged,
      "success"
    );
  }

  // ======================================================
  // تفعيل / تعطيل المستخدم
  // ======================================================

  async function toggleUser(
    id,
    currentStatus
  ) {
    const newStatus =
      Number(currentStatus) === 1
        ? 0
        : 1;

    const { error } =
      await supabase
        .from("profiles")
        .update({
          is_active: newStatus,
        })
        .eq("id", id);

    if (error) {
      console.error(
        "Error changing account status:",
        error
      );

      showMessage(
        currentText.errorChangingStatus,
        "error"
      );

      return;
    }

    await getUsers();

    showMessage(
      newStatus === 1
        ? currentText.accountActivated
        : currentText.accountDeactivated,
      "success"
    );
  }

  // ======================================================
  // فتح نافذة حذف المستخدم
  // ======================================================

  function openDeleteUser(id) {
    setDeleteId(id);
    setDeleteType("user");
    setDeleteOpen(true);
  }

  // ======================================================
  // فتح نافذة حذف المهمة
  // ======================================================

  function openDeleteTask(id) {
    setDeleteId(id);
    setDeleteType("task");
    setDeleteOpen(true);
  }

  // ======================================================
  // إغلاق نافذة الحذف
  // ======================================================

  function closeDelete() {
    setDeleteOpen(false);
    setDeleteId(null);
    setDeleteType(null);
  }

  // ======================================================
  // تأكيد الحذف
  // ======================================================

  async function confirmDelete() {
    if (!deleteId || !deleteType) {
      return;
    }

    // حذف المستخدم
    if (deleteType === "user") {
      const { error } =
        await supabase
          .from("profiles")
          .delete()
          .eq("id", deleteId);

      if (error) {
        console.error(
          "Error deleting user:",
          error
        );

        closeDelete();

        showMessage(
          currentText.errorDeletingUser,
          "error"
        );

        return;
      }

      closeDelete();

      await getUsers();

      showMessage(
        currentText.accountDeleted,
        "success"
      );

      return;
    }

    // حذف المهمة
    if (deleteType === "task") {
      const { error } =
        await supabase
          .from("tasks")
          .delete()
          .eq("id", deleteId);

      if (error) {
        console.error(
          "Error deleting task:",
          error
        );

        closeDelete();

        showMessage(
          currentText.errorDeletingTask,
          "error"
        );

        return;
      }

      closeDelete();

      await getTasks();

      showMessage(
        currentText.taskDeleted,
        "success"
      );
    }
  }

  // ======================================================
  // تعديل المهمة
  // ======================================================

  async function updateTask(
    id,
    newTask,
    newPriority
  ) {
    if (!newTask.trim()) {
      showMessage(
        currentText.taskRequired,
        "error"
      );

      return;
    }

    const { error } =
      await supabase
        .from("tasks")
        .update({
          task: newTask.trim(),
          priority: newPriority,
          updated_at:
            new Date().toISOString(),
        })
        .eq("id", id);

    if (error) {
      console.error(
        "Error updating task:",
        error
      );

      showMessage(
        currentText.errorUpdatingTask,
        "error"
      );

      return;
    }

    await getTasks();

    showMessage(
      currentText.taskUpdated,
      "success"
    );
  }

  // ======================================================
  // البحث عن المستخدمين
  // ======================================================

  const filteredUsers =
    users.filter((user) => {
      const search =
        searchUser
          .toLowerCase()
          .trim();

      if (!search) {
        return true;
      }

      const name =
        String(
          user.name || ""
        ).toLowerCase();

      const email =
        String(
          user.email || ""
        ).toLowerCase();

      return (
        name.includes(search) ||
        email.includes(search)
      );
    });

  // ======================================================
  // واجهة الصفحة
  // ======================================================

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor:
          "background.default",
        color: "text.primary",
        padding: {
          xs: 2,
          sm: 3,
          md: 4,
        },
      }}
    >
      <Box
        sx={{
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        {/* عنوان الصفحة */}

        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
            }}
          >
            {currentText.adminDashboard}
          </Typography>

          <Box
            sx={{
              width: "55px",
              height: "4px",
              backgroundColor:
                "primary.main",
              borderRadius: "10px",
              mt: 1,
            }}
          />
        </Box>

        {/* التنبيه */}

        {message && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "10px",

              backgroundColor:
                messageType === "error"
                  ? theme.palette.mode ===
                    "dark"
                    ? "#3B1F1F"
                    : "#FFEBEE"
                  : theme.palette.mode ===
                    "dark"
                  ? "#163B38"
                  : "#E8F5F3",

              border:
                messageType === "error"
                  ? theme.palette.mode ===
                    "dark"
                    ? "1px solid #7F1D1D"
                    : "1px solid #FFCDD2"
                  : theme.palette.mode ===
                    "dark"
                  ? "1px solid #2F6F68"
                  : "1px solid #B2DFDB",

              color:
                messageType === "error"
                  ? theme.palette.mode ===
                    "dark"
                    ? "#FF8A80"
                    : "#D32F2F"
                  : theme.palette.mode ===
                    "dark"
                  ? "#80CBC4"
                  : "#00897B",

              borderRadius: "10px",
              padding: "12px 14px",
              marginBottom: 3,
              fontSize: "13px",
              fontWeight: "600",
              lineHeight: "1.6",

              boxShadow:
                messageType === "error"
                  ? theme.palette.mode ===
                    "dark"
                    ? "0 4px 12px rgba(239,83,80,0.18)"
                    : "0 4px 12px rgba(211,47,47,0.08)"
                  : theme.palette.mode ===
                    "dark"
                  ? "0 4px 12px rgba(128,203,196,0.12)"
                  : "0 4px 12px rgba(0,137,123,0.08)",
            }}
          >
            <Box
              sx={{
                minWidth: "28px",
                width: "28px",
                height: "28px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",

                backgroundColor:
                  messageType === "error"
                    ? theme.palette.mode ===
                      "dark"
                      ? "#7F1D1D"
                      : "#FFCDD2"
                    : theme.palette.mode ===
                      "dark"
                    ? "#245A54"
                    : "#B2DFDB",

                color:
                  messageType === "error"
                    ? theme.palette.mode ===
                      "dark"
                      ? "#FF8A80"
                      : "#D32F2F"
                    : theme.palette.mode ===
                      "dark"
                    ? "#80CBC4"
                    : "#00897B",

                fontSize: "16px",
                fontWeight: "700",
                flexShrink: 0,
              }}
            >
              {messageType === "error"
                ? "!"
                : "✓"}
            </Box>

            <Typography
              sx={{
                fontSize: "13px",
                fontWeight: "600",
                color: "inherit",
                lineHeight: "1.6",
              }}
            >
              {message}
            </Typography>
          </Box>
        )}

        {/* ======================================================
            إدارة المستخدمين
        ====================================================== */}

        <Typography
          variant="h5"
          sx={{
            fontWeight: 800,
            mb: 2,
          }}
        >
          {currentText.userManagement}
        </Typography>

        <TextField
          fullWidth
          placeholder={
            currentText.searchUser
          }
          value={searchUser}
          onChange={(e) =>
            setSearchUser(
              e.target.value
            )
          }
          sx={{
            mb: 3,

            "& .MuiOutlinedInput-root": {
              borderRadius: "14px",
            },
          }}
        />

        {loadingUsers ? (
          <Typography>
            {currentText.loadingUsers}
          </Typography>
        ) : filteredUsers.length === 0 ? (
          <Typography>
            {currentText.noUsersFound}
          </Typography>
        ) : (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                md: "repeat(2, 1fr)",
              },
              gap: 2.5,
            }}
          >
            {filteredUsers.map(
              (user) => {
                const isActive =
                  Number(
                    user.is_active
                  ) === 1;

                return (
                  <Paper
                    key={user.id}
                    sx={{
                      p: 3,
                      borderRadius: "20px",
                      position: "relative",
                      overflow: "hidden",

                      transition:
                        "transform 0.2s ease",

                      "&:hover": {
                        transform:
                          "translateY(-3px)",
                      },

                      "&::before": {
                        content: '""',
                        position:
                          "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        height: "4px",
                        backgroundColor:
                          "primary.main",
                      },
                    }}
                  >
                    {/* معلومات المستخدم */}

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        mb: 2,
                      }}
                    >
                      <Avatar
                        sx={{
                          width: 46,
                          height: 46,
                          borderRadius:
                            "14px",

                          backgroundColor:
                            theme.palette
                              .mode ===
                            "dark"
                              ? "rgba(128,203,196,0.12)"
                              : "#E6F4F2",

                          color:
                            "primary.main",
                        }}
                      >
                        <PersonIcon />
                      </Avatar>

                      <Box
                        sx={{
                          minWidth: 0,
                        }}
                      >
                        <Typography
                          sx={{
                            fontWeight: 800,
                            fontSize:
                              "1.05rem",
                          }}
                        >
                          {user.name ||
                            currentText.roleUser}
                        </Typography>

                        <Typography
                          variant="body2"
                          sx={{
                            color:
                              "text.secondary",
                            wordBreak:
                              "break-word",
                          }}
                        >
                          {user.email}
                        </Typography>
                      </Box>
                    </Box>

                    {/* الحالة */}

                    <Box
                      sx={{
                        display: "flex",
                        alignItems:
                          "center",
                        justifyContent:
                          "space-between",
                        gap: 1,
                        mb: 2,
                        padding: "10px 12px",
                        borderRadius: "12px",

                        backgroundColor:
                          theme.palette
                            .mode ===
                          "dark"
                            ? "#273449"
                            : "#F7FAFC",
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 600,
                        }}
                      >
                        {currentText.status}
                      </Typography>

                      <Chip
                        label={
                          isActive
                            ? currentText.active
                            : currentText.inactive
                        }
                        size="small"
                        sx={{
                          fontWeight: 700,

                          backgroundColor:
                            isActive
                              ? theme.palette
                                  .mode ===
                                "dark"
                                ? "rgba(128,203,196,0.16)"
                                : "#E6F4F2"
                              : theme.palette
                                  .mode ===
                                "dark"
                                ? "rgba(239,83,80,0.16)"
                                : "#FFEBEE",

                          color:
                            isActive
                              ? "primary.main"
                              : "#EF5350",
                        }}
                      />
                    </Box>

                    {/* الصلاحية */}

                    <Typography
                      sx={{
                        fontWeight: 700,
                        mb: 1,
                      }}
                    >
                      {currentText.role}
                    </Typography>

                    <Select
                      fullWidth
                      value={
                        user.role ||
                        "USER"
                      }
                      onChange={(e) =>
                        changeRole(
                          user.id,
                          e.target.value
                        )
                      }
                      sx={{
                        mb: 2,

                        "& .MuiOutlinedInput-notchedOutline":
                          {
                            borderRadius:
                              "12px",
                          },
                      }}
                    >
                      <MenuItem value="USER">
                        {currentText.roleUser}
                      </MenuItem>

                      <MenuItem value="SUPERADMIN">
                        {
                          currentText.roleSuperAdmin
                        }
                      </MenuItem>
                    </Select>

                    {/* الأزرار */}

                    <Box
                      sx={{
                        display: "flex",
                        gap: 1.5,
                        flexWrap: "wrap",
                      }}
                    >
                      <Button
                        variant="outlined"
                        startIcon={
                          isActive ? (
                            <BlockIcon />
                          ) : (
                            <CheckCircleIcon />
                          )
                        }
                        onClick={() =>
                          toggleUser(
                            user.id,
                            user.is_active
                          )
                        }
                        sx={{
                          flex: 1,
                          minWidth:
                            "170px",

                          color:
                            "primary.main",

                          borderColor:
                            theme.palette
                              .mode ===
                            "dark"
                              ? "#475569"
                              : "#B2DFDB",

                          borderRadius:
                            "10px",

                          textTransform:
                            "none",

                          fontWeight: 600,
                        }}
                      >
                        {isActive
                          ? currentText.deactivateAccount
                          : currentText.activateAccount}
                      </Button>

                      <Button
                        variant="outlined"
                        startIcon={
                          <DeleteIcon />
                        }
                        onClick={() =>
                          openDeleteUser(
                            user.id
                          )
                        }
                        sx={{
                          flex: 1,
                          minWidth:
                            "140px",

                          color:
                            theme.palette
                              .mode ===
                            "dark"
                              ? "#EF5350"
                              : "#D32F2F",

                          borderColor:
                            theme.palette
                              .mode ===
                            "dark"
                              ? "#7F1D1D"
                              : "#FFCDD2",

                          borderRadius:
                            "10px",

                          textTransform:
                            "none",

                          fontWeight: 600,
                        }}
                      >
                        {
                          currentText.deleteAccount
                        }
                      </Button>
                    </Box>
                  </Paper>
                );
              }
            )}
          </Box>
        )}

        {/* ======================================================
            إدارة المهام
        ====================================================== */}

        <Box sx={{ mt: 6 }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 800,
              mb: 2,
            }}
          >
            {currentText.taskManagement}
          </Typography>

          {loadingTasks ? (
            <Typography>
              {currentText.loadingTasks}
            </Typography>
          ) : tasks.length === 0 ? (
            <Typography>
              {currentText.noTasksFound}
            </Typography>
          ) : (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  md: "repeat(2, 1fr)",
                },
                gap: 2.5,
              }}
            >
              {tasks.map((task) => (
                <TaskAdminItem
                  key={task.id}
                  task={task}
                  onUpdate={updateTask}
                  onDelete={openDeleteTask}
                  currentText={currentText}
                />
              ))}
            </Box>
          )}
        </Box>
      </Box>

      {/* ======================================================
          نافذة تأكيد الحذف
      ====================================================== */}

      <Dialog
        open={deleteOpen}
        onClose={closeDelete}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            backgroundColor:
              theme.palette.background.paper,

            color:
              theme.palette.text.primary,

            border:
              `1px solid ${
                theme.palette.mode === "dark"
                  ? "#334155"
                  : "#DCE3E8"
              }`,

            borderRadius: "20px",
          },
        }}
      >
        <DialogTitle
          sx={{
            color:
              theme.palette.text.primary,
            fontWeight: 800,
          }}
        >
          {deleteType === "user"
            ? currentText.deleteUserTitle
            : currentText.deleteTaskTitle}
        </DialogTitle>

        <DialogContent>
          <Typography
            sx={{
              color:
                theme.palette.text.secondary,
              lineHeight: 1.7,
            }}
          >
            {deleteType === "user"
              ? currentText.confirmDeleteUser
              : currentText.confirmDeleteTask}
          </Typography>
        </DialogContent>

        <DialogActions
          sx={{
            px: 3,
            pb: 2.5,
            gap: 1,
          }}
        >
          <Button
            onClick={closeDelete}
            sx={{
              textTransform: "none",

              color:
                theme.palette.text.secondary,

              borderRadius: "10px",

              "&:hover": {
                backgroundColor:
                  theme.palette.mode ===
                  "dark"
                    ? "#243344"
                    : "#F1F5F9",
              },
            }}
          >
            {currentText.cancel}
          </Button>

          <Button
            variant="contained"
            onClick={confirmDelete}
            sx={{
              textTransform: "none",

              borderRadius: "10px",

              backgroundColor:
                "#EF5350",

              "&:hover": {
                backgroundColor:
                  "#D32F2F",
              },
            }}
          >
            {currentText.delete}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

// ======================================================
// مكون المهمة
// ======================================================

function TaskAdminItem({
  task,
  onUpdate,
  onDelete,
  currentText,
}) {
  const [taskText, setTaskText] =
    useState(task.task || "");

  const [priority, setPriority] =
    useState(
      task.priority || "NORMAL"
    );

  const [taskError, setTaskError] =
    useState("");

  // ======================================================
  // تعديل المهمة
  // ======================================================

  function handleUpdate() {
    if (!taskText.trim()) {
      setTaskError(
        currentText.taskRequired
      );

      return;
    }

    setTaskError("");

    onUpdate(
      task.id,
      taskText,
      priority
    );
  }

  return (
    <Paper
      sx={{
        p: 3,
        borderRadius: "20px",
        position: "relative",
        overflow: "hidden",

        transition:
          "transform 0.2s ease",

        "&:hover": {
          transform:
            "translateY(-3px)",
        },

        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "4px",
          backgroundColor:
            "primary.main",
        },
      }}
    >
      {/* المهمة */}

      <Typography
        sx={{
          fontWeight: 700,
          mb: 1,
        }}
      >
        {currentText.task}
      </Typography>

      <TextField
        fullWidth
        value={taskText}
        onChange={(e) => {
          setTaskText(
            e.target.value
          );

          if (
            e.target.value.trim()
          ) {
            setTaskError("");
          }
        }}
        error={Boolean(taskError)}
        helperText={taskError}
        sx={{
          mb: 2,

          "& .MuiOutlinedInput-root": {
            borderRadius: "12px",
          },
        }}
      />

      {/* الأولوية */}

      <Typography
        sx={{
          fontWeight: 700,
          mb: 1,
        }}
      >
        {currentText.priority}
      </Typography>

      <Select
        fullWidth
        value={priority}
        onChange={(e) =>
          setPriority(
            e.target.value
          )
        }
        sx={{
          mb: 2,

          "& .MuiOutlinedInput-notchedOutline":
            {
              borderRadius:
                "12px",
            },
        }}
      >
        <MenuItem value="NORMAL">
          {currentText.normal}
        </MenuItem>

        <MenuItem value="URGENT">
          {currentText.urgent}
        </MenuItem>
      </Select>

      {/* عرض الأولوية */}

      <Chip
        label={
          priority === "URGENT"
            ? currentText.urgent
            : currentText.normal
        }
        size="small"
        sx={{
          mb: 2,
          fontWeight: 700,
        }}
      />

      {/* الأزرار */}

      <Box
        sx={{
          display: "flex",
          gap: 1.5,
          flexWrap: "wrap",
        }}
      >
        <Button
          variant="outlined"
          startIcon={
            <EditIcon />
          }
          onClick={handleUpdate}
          sx={{
            flex: 1,
            minWidth: "170px",

            color:
              "primary.main",

            borderColor:
              "primary.main",

            borderRadius:
              "10px",

            textTransform:
              "none",

            fontWeight: 600,
          }}
        >
          {currentText.updateTask}
        </Button>

        <Button
          variant="outlined"
          startIcon={
            <DeleteIcon />
          }
          onClick={() =>
            onDelete(task.id)
          }
          sx={{
            flex: 1,
            minWidth: "140px",

            color:
              "#EF5350",

            borderColor:
              "#EF5350",

            borderRadius:
              "10px",

            textTransform:
              "none",

            fontWeight: 600,
          }}
        >
          {currentText.deleteTask}
        </Button>
      </Box>
    </Paper>
  );
}

export default AdminPage;