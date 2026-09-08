
import { useEffect, useState } from "react";

import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import TaskIcon from "@mui/icons-material/Task";

import { useTheme } from "@mui/material/styles";

import { supabase } from "../supabaseClient";

function AdminPage() {
  const theme = useTheme();

  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);

  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingTasks, setLoadingTasks] = useState(true);

  const [message, setMessage] = useState("");

  // البحث عن المستخدمين
  const [searchUser, setSearchUser] = useState("");

  // اللغة
  const [language, setLanguage] = useState(
    () => localStorage.getItem("language") || "en"
  );

  // ==========================================
  // النصوص
  // ==========================================

  const text = {
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
      adminDashboard: "لوحة تحكم الإدارة",

      userManagement: "إدارة المستخدمين",
      searchUser:
        "البحث عن مستخدم بالاسم أو البريد الإلكتروني",
      loadingUsers: "جاري تحميل المستخدمين...",
      noUsersFound: "لم يتم العثور على مستخدمين",

      name: "الاسم",
      email: "البريد الإلكتروني",
      status: "الحالة",
      active: "نشط",
      inactive: "غير نشط",
      role: "الصلاحية",

      roleUser: "مستخدم",
      roleSuperAdmin: "مدير النظام",

      deactivateAccount: "تعطيل الحساب",
      activateAccount: "تفعيل الحساب",
      deleteAccount: "حذف الحساب",

      taskManagement: "إدارة المهام",
      loadingTasks: "جاري تحميل المهام...",
      noTasksFound: "لم يتم العثور على مهام",

      task: "المهمة",
      priority: "الأولوية",
      normal: "عادية",
      urgent: "عاجلة",

      updateTask: "تحديث المهمة",
      deleteTask: "حذف المهمة",

      taskRequired: "المهمة مطلوبة",

      confirmDeleteUser:
        "هل أنت متأكد أنك تريد حذف هذا الحساب؟",

      confirmDeleteTask:
        "هل أنت متأكد أنك تريد حذف هذه المهمة؟",

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
        "حدث خطأ أثناء تحديث المهمة",

      taskUpdated:
        "تم تحديث المهمة بنجاح",

      errorDeletingTask:
        "حدث خطأ أثناء حذف المهمة",

      taskDeleted:
        "تم حذف المهمة بنجاح",
    },
  };

  const currentText =
    language === "ar" ? text.ar : text.en;

  // ==========================================
  // الاستماع لتغيير اللغة
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
  // جلب المستخدمين
  // ==========================================

  async function getUsers() {
    setLoadingUsers(true);

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .order("id");

    if (error) {
      console.error(
        "Error getting users:",
        error
      );

      setMessage(
        currentText.errorLoadingUsers
      );
    } else {
      setUsers(data || []);
    }

    setLoadingUsers(false);
  }

  // ==========================================
  // جلب المهام
  // ==========================================

  async function getTasks() {
    setLoadingTasks(true);

    const { data, error } = await supabase
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

      setMessage(
        currentText.errorLoadingTasks
      );
    } else {
      setTasks(data || []);
    }

    setLoadingTasks(false);
  }

  // ==========================================
  // تشغيل جلب البيانات
  // ==========================================

  useEffect(() => {
    getUsers();
    getTasks();
  }, []);

  // ==========================================
  // تغيير صلاحية المستخدم
  // ==========================================

  async function changeRole(id, newRole) {
    const { error } = await supabase
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

      setMessage(
        currentText.errorChangingRole
      );

      return;
    }

    setMessage(
      currentText.roleChanged
    );

    getUsers();
  }

  // ==========================================
  // تفعيل / تعطيل المستخدم
  // ==========================================

  async function toggleUser(
    id,
    currentStatus
  ) {
    const newStatus =
      currentStatus === 1 ? 0 : 1;

    const { error } = await supabase
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

      setMessage(
        currentText.errorChangingStatus
      );

      return;
    }

    setMessage(
      newStatus === 1
        ? currentText.accountActivated
        : currentText.accountDeactivated
    );

    getUsers();
  }

  // ==========================================
  // حذف المستخدم
  // ==========================================

  async function deleteUser(id) {
    const confirmDelete =
      window.confirm(
        currentText.confirmDeleteUser
      );

    if (!confirmDelete) {
      return;
    }

    const { error } = await supabase
      .from("profiles")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(
        "Error deleting user:",
        error
      );

      setMessage(
        currentText.errorDeletingUser
      );

      return;
    }

    setMessage(
      currentText.accountDeleted
    );

    getUsers();
  }

  // ==========================================
  // تحديث المهمة
  // ==========================================

  async function updateTask(
    id,
    newTask,
    newPriority
  ) {
    if (!newTask.trim()) {
      setMessage(
        currentText.taskRequired
      );

      return;
    }

    const { error } = await supabase
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

      setMessage(
        currentText.errorUpdatingTask
      );

      return;
    }

    setMessage(
      currentText.taskUpdated
    );

    getTasks();
  }

  // ==========================================
  // حذف المهمة
  // ==========================================

  async function deleteTask(id) {
    const confirmDelete =
      window.confirm(
        currentText.confirmDeleteTask
      );

    if (!confirmDelete) {
      return;
    }

    const { error } = await supabase
      .from("tasks")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(
        "Error deleting task:",
        error
      );

      setMessage(
        currentText.errorDeletingTask
      );

      return;
    }

    setMessage(
      currentText.taskDeleted
    );

    getTasks();
  }

  // ==========================================
  // البحث عن المستخدمين
  // ==========================================

  const filteredUsers = users.filter(
    (user) => {
      const search =
        searchUser
          .toLowerCase()
          .trim();

      if (!search) {
        return true;
      }

      const name = String(
        user.name || ""
      ).toLowerCase();

      const email = String(
        user.email || ""
      ).toLowerCase();

      return (
        name.includes(search) ||
        email.includes(search)
      );
    }
  );

  // ==========================================
  // UI
  // ==========================================

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "background.default",
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
          maxWidth: 1200,
          margin: "0 auto",
        }}
      >
        {/* =====================================
            عنوان الصفحة
        ====================================== */}

        <Box
          sx={{
            marginBottom: 4,
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              marginBottom: 1,
            }}
          >
            {currentText.adminDashboard}
          </Typography>

          <Box
            sx={{
              width: 55,
              height: 4,
              borderRadius: 10,
              backgroundColor: "primary.main",
            }}
          />
        </Box>

        {/* =====================================
            الرسائل
        ====================================== */}

        {message && (
          <Paper
            sx={{
              padding: 2,
              marginBottom: 3,
              borderRadius: "14px",
              borderColor:
                theme.palette.mode === "dark"
                  ? "#334155"
                  : "#B2DFDB",
              backgroundColor:
                theme.palette.mode === "dark"
                  ? "#1E293B"
                  : "#F0FAF9",
            }}
          >
            <Typography
              sx={{
                fontWeight: 600,
                color: "primary.main",
              }}
            >
              {message}
            </Typography>
          </Paper>
        )}

        {/* =====================================
            إدارة المستخدمين
        ====================================== */}

        <Typography
          variant="h5"
          sx={{
            fontWeight: 800,
            marginBottom: 2,
          }}
        >
          {currentText.userManagement}
        </Typography>

        {/* البحث */}

        <TextField
          fullWidth
          label={currentText.searchUser}
          value={searchUser}
          onChange={(event) =>
            setSearchUser(
              event.target.value
            )
          }
          sx={{
            marginBottom: 3,

            "& .MuiOutlinedInput-root": {
              borderRadius: "14px",
            },
          }}
        />

        {/* المستخدمين */}

        {loadingUsers ? (
          <Typography>
            {currentText.loadingUsers}
          </Typography>
        ) : filteredUsers.length === 0 ? (
          <Paper
            sx={{
              padding: 4,
              borderRadius: "18px",
              textAlign: "center",
            }}
          >
            <Typography>
              {currentText.noUsersFound}
            </Typography>
          </Paper>
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
            {filteredUsers.map((user) => (
              <Paper
                key={user.id}
                sx={{
                  padding: 3,
                  borderRadius: "20px",
                  position: "relative",
                  overflow: "hidden",

                  transition:
                    "transform 0.2s, box-shadow 0.2s",

                  "&:hover": {
                    transform:
                      "translateY(-3px)",
                  },
                }}
              >
                {/* الخط العلوي */}

                <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 4,
                    backgroundColor:
                      "primary.main",
                  }}
                />

                {/* معلومات المستخدم */}

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    marginBottom: 2,
                  }}
                >
                  <Box
                    sx={{
                      width: 46,
                      height: 46,
                      borderRadius: "14px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor:
                        theme.palette.mode === "dark"
                          ? "rgba(128,203,196,0.12)"
                          : "#E6F4F2",
                      color:
                        "primary.main",
                    }}
                  >
                    <PersonIcon />
                  </Box>

                  <Box>
                    <Typography
                      sx={{
                        fontWeight: 800,
                        fontSize: "1.05rem",
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
                      }}
                    >
                      {user.email}
                    </Typography>
                  </Box>
                </Box>

                <Divider
                  sx={{
                    marginBottom: 2,
                  }}
                />

                {/* البيانات */}

                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 1.5,
                    marginBottom: 2.5,
                  }}
                >
                  {/* البريد */}

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      padding: 1.5,
                      borderRadius: "12px",
                      backgroundColor:
                        theme.palette.mode === "dark"
                          ? "#273449"
                          : "#F7FAFC",
                    }}
                  >
                    <EmailIcon
                      sx={{
                        fontSize: 20,
                        color:
                          "primary.main",
                      }}
                    />

                    <Box>
                      <Typography
                        variant="caption"
                        sx={{
                          color:
                            "text.secondary",
                          display: "block",
                        }}
                      >
                        {currentText.email}
                      </Typography>

                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 600,
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
                      alignItems: "center",
                      justifyContent:
                        "space-between",
                      padding: 1.5,
                      borderRadius: "12px",
                      backgroundColor:
                        theme.palette.mode === "dark"
                          ? "#273449"
                          : "#F7FAFC",
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        color:
                          "text.secondary",
                        fontWeight: 600,
                      }}
                    >
                      {currentText.status}
                    </Typography>

                    <Chip
                      label={
                        user.is_active === 1
                          ? currentText.active
                          : currentText.inactive
                      }
                      size="small"
                      sx={{
                        fontWeight: 700,

                        backgroundColor:
                          user.is_active === 1
                            ? theme.palette.mode ===
                              "dark"
                              ? "rgba(128,203,196,0.15)"
                              : "#E6F4F2"
                            : theme.palette.mode ===
                              "dark"
                              ? "rgba(239,83,80,0.12)"
                              : "#FFEBEE",

                        color:
                          user.is_active === 1
                            ? "primary.main"
                            : theme.palette.mode ===
                              "dark"
                              ? "#EF5350"
                              : "#D32F2F",
                      }}
                    />
                  </Box>
                </Box>

                {/* الصلاحية */}

                <FormControl
                  fullWidth
                  sx={{
                    marginBottom: 2,
                  }}
                >
                  <InputLabel>
                    {currentText.role}
                  </InputLabel>

                  <Select
                    value={
                      user.role || "USER"
                    }
                    label={currentText.role}
                    onChange={(event) =>
                      changeRole(
                        user.id,
                        event.target.value
                      )
                    }
                    sx={{
                      borderRadius: "12px",
                    }}
                  >
                    <MenuItem value="USER">
                      {currentText.roleUser}
                    </MenuItem>

                    <MenuItem value="SUPERADMIN">
                      {currentText.roleSuperAdmin}
                    </MenuItem>
                  </Select>
                </FormControl>

                {/* الأزرار */}

                <Box
                  sx={{
                    display: "flex",
                    gap: 1,
                    flexWrap: "wrap",
                  }}
                >
                  {/* تفعيل / تعطيل */}

                  <Button
                    variant="outlined"
                    startIcon={
                      <CheckCircleIcon />
                    }
                    onClick={() =>
                      toggleUser(
                        user.id,
                        user.is_active
                      )
                    }
                    sx={{
                      flex: 1,
                      minWidth: 170,

                      color:
                        "primary.main",

                      borderColor:
                        theme.palette.mode ===
                        "dark"
                          ? "#475569"
                          : "#B2DFDB",

                      borderRadius:
                        "10px",

                      textTransform:
                        "none",

                      fontWeight: 600,

                      "&:hover": {
                        borderColor:
                          "primary.main",

                        backgroundColor:
                          theme.palette
                            .mode ===
                          "dark"
                            ? "rgba(128,203,196,0.08)"
                            : "rgba(0,137,123,0.06)",
                      },
                    }}
                  >
                    {user.is_active === 1
                      ? currentText.deactivateAccount
                      : currentText.activateAccount}
                  </Button>

                  {/* حذف الحساب */}

                  <Button
                    variant="outlined"
                    startIcon={
                      <DeleteIcon />
                    }
                    onClick={() =>
                      deleteUser(
                        user.id
                      )
                    }
                    sx={{
                      flex: 1,
                      minWidth: 140,

                      color:
                        theme.palette.mode ===
                        "dark"
                          ? "#EF5350"
                          : "#D32F2F",

                      borderColor:
                        theme.palette.mode ===
                        "dark"
                          ? "#7F1D1D"
                          : "#FFCDD2",

                      borderRadius:
                        "10px",

                      textTransform:
                        "none",

                      fontWeight: 600,

                      "&:hover": {
                        borderColor:
                          "#EF5350",

                        backgroundColor:
                          theme.palette
                            .mode ===
                          "dark"
                            ? "rgba(239,83,80,0.08)"
                            : "rgba(239,83,80,0.06)",
                      },
                    }}
                  >
                    {currentText.deleteAccount}
                  </Button>
                </Box>
              </Paper>
            ))}
          </Box>
        )}

        {/* =====================================
            إدارة المهام
        ====================================== */}

        <Typography
          variant="h5"
          sx={{
            fontWeight: 800,
            marginTop: 6,
            marginBottom: 2,
          }}
        >
          {currentText.taskManagement}
        </Typography>

        {loadingTasks ? (
          <Typography>
            {currentText.loadingTasks}
          </Typography>
        ) : tasks.length === 0 ? (
          <Paper
            sx={{
              padding: 4,
              borderRadius: "18px",
              textAlign: "center",
            }}
          >
            <Typography>
              {currentText.noTasksFound}
            </Typography>
          </Paper>
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
                onDelete={deleteTask}
                currentText={currentText}
              />
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
}

// =====================================================
// بطاقة المهمة
// =====================================================

function TaskAdminItem({
  task,
  onUpdate,
  onDelete,
  currentText,
}) {
  const theme = useTheme();

  const [taskText, setTaskText] =
    useState(task.task || "");

  const [priority, setPriority] =
    useState(
      task.priority || "NORMAL"
    );

  const [taskError, setTaskError] =
    useState("");

  const handleUpdate = () => {
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
  };

  return (
    <Paper
      sx={{
        padding: 3,
        borderRadius: "20px",
        position: "relative",
        overflow: "hidden",

        transition:
          "transform 0.2s, box-shadow 0.2s",

        "&:hover": {
          transform: "translateY(-3px)",
        },
      }}
    >
      {/* الخط العلوي */}

      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          backgroundColor:
            priority === "URGENT"
              ? "#F48FB1"
              : "primary.main",
        }}
      />

      {/* عنوان المهمة */}

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          marginBottom: 2.5,
        }}
      >
        <Box
          sx={{
            width: 46,
            height: 46,
            borderRadius: "14px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",

            backgroundColor:
              priority === "URGENT"
                ? theme.palette.mode ===
                  "dark"
                  ? "rgba(244,143,177,0.12)"
                  : "#FCE7EF"
                : theme.palette.mode ===
                  "dark"
                  ? "rgba(128,203,196,0.12)"
                  : "#E6F4F2",

            color:
              priority === "URGENT"
                ? theme.palette.mode ===
                  "dark"
                  ? "#F48FB1"
                  : "#D81B60"
                : "primary.main",
          }}
        >
          <TaskIcon />
        </Box>

        <Typography
          sx={{
            fontWeight: 800,
            fontSize: "1.05rem",
          }}
        >
          {currentText.task}
        </Typography>
      </Box>

      {/* المهمة */}

      <TextField
        fullWidth
        label={currentText.task}
        value={taskText}
        error={Boolean(taskError)}
        helperText={taskError}
        onChange={(event) => {
          setTaskText(
            event.target.value
          );

          if (
            event.target.value.trim()
          ) {
            setTaskError("");
          }
        }}
        sx={{
          marginBottom: 2,

          "& .MuiOutlinedInput-root": {
            borderRadius: "12px",
          },
        }}
      />

      {/* الأولوية */}

      <FormControl
        fullWidth
        sx={{
          marginBottom: 2,
        }}
      >
        <InputLabel>
          {currentText.priority}
        </InputLabel>

        <Select
          value={priority}
          label={currentText.priority}
          onChange={(event) =>
            setPriority(
              event.target.value
            )
          }
          sx={{
            borderRadius: "12px",
          }}
        >
          <MenuItem value="NORMAL">
            {currentText.normal}
          </MenuItem>

          <MenuItem value="URGENT">
            {currentText.urgent}
          </MenuItem>
        </Select>
      </FormControl>

      {/* الأولوية الحالية */}

      <Box
        sx={{
          marginBottom: 2.5,
        }}
      >
        <Chip
          label={
            priority === "URGENT"
              ? currentText.urgent
              : currentText.normal
          }
          sx={{
            fontWeight: "bold",

            backgroundColor:
              priority === "URGENT"
                ? theme.palette.mode ===
                  "dark"
                  ? "rgba(244,143,177,0.15)"
                  : "#FCE7EF"
                : theme.palette.mode ===
                  "dark"
                  ? "rgba(128,203,196,0.12)"
                  : "#E6F4F2",

            color:
              priority === "URGENT"
                ? theme.palette.mode ===
                  "dark"
                  ? "#F48FB1"
                  : "#D81B60"
                : "primary.main",

            border:
              priority === "URGENT"
                ? theme.palette.mode ===
                  "dark"
                  ? "1px solid rgba(244,143,177,0.3)"
                  : "1px solid #F8BBD0"
                : theme.palette.mode ===
                  "dark"
                  ? "1px solid rgba(128,203,196,0.25)"
                  : "1px solid #B2DFDB",
          }}
        />
      </Box>

      {/* الأزرار */}

      <Box
        sx={{
          display: "flex",
          gap: 1,
          flexWrap: "wrap",
        }}
      >
        {/* تحديث */}

        <Button
          variant="outlined"
          startIcon={
            <EditIcon />
          }
          onClick={handleUpdate}
          sx={{
            flex: 1,
            minWidth: 130,

            color: "primary.main",

            borderColor:
              theme.palette.mode ===
              "dark"
                ? "#475569"
                : "#B2DFDB",

            borderRadius: "10px",

            textTransform: "none",
            fontWeight: 600,

            "&:hover": {
              borderColor:
                "primary.main",

              backgroundColor:
                theme.palette.mode ===
                "dark"
                  ? "rgba(128,203,196,0.08)"
                  : "rgba(0,137,123,0.06)",
            },
          }}
        >
          {currentText.updateTask}
        </Button>

        {/* حذف */}

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
            minWidth: 120,

            color:
              theme.palette.mode ===
              "dark"
                ? "#EF5350"
                : "#D32F2F",

            borderColor:
              theme.palette.mode ===
              "dark"
                ? "#7F1D1D"
                : "#FFCDD2",

            borderRadius: "10px",

            textTransform: "none",
            fontWeight: 600,

            "&:hover": {
              borderColor:
                "#EF5350",

              backgroundColor:
                theme.palette.mode ===
                "dark"
                  ? "rgba(239,83,80,0.08)"
                  : "rgba(239,83,80,0.06)",
            },
          }}
        >
          {currentText.deleteTask}
        </Button>
      </Box>
    </Paper>
  );
}

export default AdminPage;

