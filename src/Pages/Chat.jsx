import { useEffect, useState } from "react";

import { supabase } from "../supabaseClient";

import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import Badge from "@mui/material/Badge";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

import SendIcon from "@mui/icons-material/Send";
import SearchIcon from "@mui/icons-material/Search";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import NotificationsIcon from "@mui/icons-material/Notifications";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import AddTaskIcon from "@mui/icons-material/AddTask";

import { useAppTheme } from "../ThemeContext";

export default function Chat() {
  const { darkMode, language } = useAppTheme();

  // المستخدم الحالي
  const [currentUser, setCurrentUser] = useState(null);

  // قائمة المستخدمين
  const [users, setUsers] = useState([]);

  // المستخدم المختار
  const [selectedUser, setSelectedUser] = useState(null);

  // الرسالة
  const [message, setMessage] = useState("");

  // الرسائل
  const [messages, setMessages] = useState([]);

  // البحث
  const [search, setSearch] = useState("");

  // التحميل
  const [loading, setLoading] = useState(true);

  // فتح المحادثة بالجوال
  const [mobileChatOpen, setMobileChatOpen] = useState(false);

  // تعديل الرسالة
  const [editingMessage, setEditingMessage] = useState(null);
  const [editText, setEditText] = useState("");
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  // حذف الرسالة
  const [deletingMessage, setDeletingMessage] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // الإشعارات
  const [unreadCounts, setUnreadCounts] = useState({});
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [notificationAnchorEl, setNotificationAnchorEl] =
    useState(null);

  // ==========================================
  // المهام
  // ==========================================

  const [tasks, setTasks] = useState([]);

  // نافذة إضافة مهمة
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);

  // اسم المهمة
  const [taskTitle, setTaskTitle] = useState("");

  // تحميل إضافة المهمة
  const [taskLoading, setTaskLoading] = useState(false);

  // المهمة التي سيتم حذفها
  const [deletingTask, setDeletingTask] = useState(null);

  // نافذة حذف المهمة
  const [deleteTaskDialogOpen, setDeleteTaskDialogOpen] =
    useState(false);

  // ==========================================
  // النصوص
  // ==========================================

  const text = {
    ar: {
      chats: "المحادثات",
      search: "بحث عن مستخدم...",
      selectUser: "اختر مستخدمًا لبدء المحادثة",
      typeMessage: "اكتب رسالة...",
      send: "إرسال",

      edit: "تعديل",
      delete: "حذف",
      cancel: "إلغاء",
      save: "حفظ",

      deleteConfirm: "هل أنت متأكد من حذف هذه الرسالة؟",
      deleteTaskConfirm: "هل أنت متأكد من حذف هذه المهمة؟",

      noNotifications: "لا توجد إشعارات جديدة",
      notifications: "الإشعارات",
      newMessage: "رسالة جديدة",

      messageDeleted: "تم حذف الرسالة",
      messageUpdated: "تم تعديل الرسالة",
      taskDeleted: "تم حذف المهمة",

      error: "حدث خطأ",

      addTask: "إضافة مهمة",
      taskTitle: "اسم المهمة",
      taskTitlePlaceholder: "اكتب اسم المهمة...",
      taskAdded: "تمت إضافة المهمة",

      tasks: "المهام",
      status: "الحالة",

      pending: "قيد الانتظار",
      inProgress: "قيد التنفيذ",
      completed: "مكتملة",

      taskError: "حدث خطأ أثناء إضافة المهمة",
      taskUpdated: "تم تحديث حالة المهمة",
      noTasks: "لا توجد مهام",
    },

    en: {
      chats: "Chats",
      search: "Search for a user...",
      selectUser: "Select a user to start chatting",
      typeMessage: "Type a message...",
      send: "Send",

      edit: "Edit",
      delete: "Delete",
      cancel: "Cancel",
      save: "Save",

      deleteConfirm: "Are you sure you want to delete this message?",
      deleteTaskConfirm: "Are you sure you want to delete this task?",

      noNotifications: "No new notifications",
      notifications: "Notifications",
      newMessage: "New message",

      messageDeleted: "Message deleted",
      messageUpdated: "Message updated",
      taskDeleted: "Task deleted",

      error: "An error occurred",

      addTask: "Add Task",
      taskTitle: "Task name",
      taskTitlePlaceholder: "Enter task name...",
      taskAdded: "Task added successfully",

      tasks: "Tasks",
      status: "Status",

      pending: "Pending",
      inProgress: "In Progress",
      completed: "Completed",

      taskError: "Error adding task",
      taskUpdated: "Task status updated",
      noTasks: "No tasks",
    },
  };

  const t = text[language] || text.en;

  // ==========================================
  // جلب المستخدم الحالي
  // ==========================================

  useEffect(() => {
    getCurrentUser();
  }, []);

  async function getCurrentUser() {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      setCurrentUser(user);

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .neq("id", user.id)
        .order("display_name", {
          ascending: true,
        });

      if (error) {
        console.error("Error fetching users:", error);
      } else {
        const usersList = data || [];

        setUsers(usersList);

        // استرجاع آخر محادثة بعد Refresh
        const savedSelectedUserId =
          localStorage.getItem("selectedChatUserId");

        if (savedSelectedUserId) {
          const savedUser = usersList.find(
            (item) => item.id === savedSelectedUserId
          );

          if (savedUser) {
            setSelectedUser(savedUser);
            setMobileChatOpen(true);
          } else {
            localStorage.removeItem(
              "selectedChatUserId"
            );
          }
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  // ==========================================
  // عند اختيار المستخدم
  // ==========================================

  useEffect(() => {
    if (!currentUser || !selectedUser) return;

    getMessages();
    getTasks();

    setUnreadCounts((prev) => ({
      ...prev,
      [selectedUser.id]: 0,
    }));

    setNotifications((prev) =>
      prev.filter(
        (item) => item.senderId !== selectedUser.id
      )
    );
  }, [currentUser, selectedUser]);

  // ==========================================
  // جلب الرسائل
  // ==========================================

  async function getMessages() {
    if (!currentUser || !selectedUser) return;

    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .or(
        `and(sender_id.eq.${currentUser.id},receiver_id.eq.${selectedUser.id}),and(sender_id.eq.${selectedUser.id},receiver_id.eq.${currentUser.id})`
      )
      .order("created_at", {
        ascending: true,
      });

    if (error) {
      console.error(
        "Error fetching messages:",
        error
      );
      return;
    }

    setMessages(data || []);
  }

  // ==========================================
  // جلب المهام
  // ==========================================

  async function getTasks() {
    if (!currentUser || !selectedUser) return;

    const { data, error } = await supabase
      .from("task_assignments")
      .select("*")
      .order("created_at", {
        ascending: true,
      });

    if (error) {
      console.error(
        "Error fetching tasks:",
        error
      );
      return;
    }

    // عرض مهام المحادثة الحالية فقط
    const conversationTasks = (data || []).filter(
      (task) =>
        (task.created_by === currentUser.id &&
          task.assigned_to === selectedUser.id) ||
        (task.created_by === selectedUser.id &&
          task.assigned_to === currentUser.id)
    );

    setTasks(conversationTasks);
  }

  // ==========================================
  // Realtime للرسائل
  // ==========================================

  useEffect(() => {
    if (!currentUser) return;

    const channel = supabase
      .channel("messages-realtime")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
        },
        async (payload) => {
          const newMessage = payload.new;

          // لا نحتاج إشعار للرسائل التي أرسلناها نحن
          if (newMessage.sender_id === currentUser.id) {
            return;
          }

          const { data: sender } = await supabase
            .from("profiles")
            .select(
              "display_name, name, avatar_url, avatar"
            )
            .eq("id", newMessage.sender_id)
            .single();

          const senderName =
            sender?.display_name ||
            sender?.name ||
            "User";

          // إذا كانت المحادثة مفتوحة مع نفس المستخدم
          if (
            selectedUser &&
            selectedUser.id === newMessage.sender_id
          ) {
            setMessages((prev) => {
              const exists = prev.some(
                (msg) => msg.id === newMessage.id
              );

              if (exists) {
                return prev;
              }

              return [...prev, newMessage];
            });

            setUnreadCounts((prev) => ({
              ...prev,
              [newMessage.sender_id]: 0,
            }));

            return;
          }

          // زيادة الرسائل غير المقروءة
          setUnreadCounts((prev) => ({
            ...prev,
            [newMessage.sender_id]:
              (prev[newMessage.sender_id] || 0) + 1,
          }));

          // إضافة الإشعار
          setNotifications((prev) => [
            {
              id: newMessage.id,
              senderId: newMessage.sender_id,
              senderName,
              message: newMessage.message,
              avatar:
                sender?.avatar_url ||
                sender?.avatar ||
                "",
            },
            ...prev,
          ]);

          setNotificationMessage(
            `${senderName}: ${newMessage.message}`
          );

          setNotificationOpen(true);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUser, selectedUser]);

  // ==========================================
  // Realtime للمهام
  // ==========================================

  useEffect(() => {
    if (!currentUser) return;

    const channel = supabase
      .channel("task-assignments-realtime")

      // إضافة مهمة
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "task_assignments",
        },
        (payload) => {
          const newTask = payload.new;

          // المهمة لا تخص المستخدم الحالي
          if (
            newTask.created_by !== currentUser.id &&
            newTask.assigned_to !== currentUser.id
          ) {
            return;
          }

          // التأكد أن المهمة تخص المحادثة الحالية
          if (
            selectedUser &&
            (
              (
                newTask.created_by === currentUser.id &&
                newTask.assigned_to === selectedUser.id
              ) ||
              (
                newTask.created_by === selectedUser.id &&
                newTask.assigned_to === currentUser.id
              )
            )
          ) {
            setTasks((prev) => {
              const exists = prev.some(
                (task) => task.id === newTask.id
              );

              if (exists) {
                return prev;
              }

              return [...prev, newTask];
            });
          }

          // إذا الطرف الآخر أنشأ المهمة
          if (newTask.created_by !== currentUser.id) {
            setNotificationMessage(
              `${t.newMessage}: ${newTask.title}`
            );

            setNotificationOpen(true);
          }
        }
      )

      // تحديث المهمة
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "task_assignments",
        },
        (payload) => {
          const updatedTask = payload.new;

          if (
            updatedTask.created_by !== currentUser.id &&
            updatedTask.assigned_to !== currentUser.id
          ) {
            return;
          }

          setTasks((prev) =>
            prev.map((task) =>
              task.id === updatedTask.id
                ? updatedTask
                : task
            )
          );
        }
      )

      // حذف المهمة
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "task_assignments",
        },
        (payload) => {
          const deletedTask = payload.old;

          setTasks((prev) =>
            prev.filter(
              (task) => task.id !== deletedTask.id
            )
          );
        }
      )

      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUser, selectedUser, language]);

  // ==========================================
  // إرسال رسالة
  // ==========================================

  async function sendMessage() {
    if (
      !message.trim() ||
      !currentUser ||
      !selectedUser
    ) {
      return;
    }

    const { data, error } = await supabase
      .from("messages")
      .insert([
        {
          sender_id: currentUser.id,
          receiver_id: selectedUser.id,
          message: message.trim(),
        },
      ])
      .select()
      .single();

    if (error) {
      console.error(
        "Error sending message:",
        error
      );
      return;
    }

    setMessages((prev) => {
      const exists = prev.some(
        (msg) => msg.id === data.id
      );

      if (exists) {
        return prev;
      }

      return [...prev, data];
    });

    setMessage("");
  }

  // ==========================================
  // فتح نافذة إضافة مهمة
  // ==========================================

  function openTaskDialog() {
    if (!selectedUser) return;

    setTaskTitle("");
    setTaskDialogOpen(true);
  }

  // ==========================================
  // إضافة مهمة
  // ==========================================

  async function addTask() {
    if (
      !taskTitle.trim() ||
      !currentUser ||
      !selectedUser
    ) {
      return;
    }

    setTaskLoading(true);

    const { data, error } = await supabase
      .from("task_assignments")
      .insert([
        {
          title: taskTitle.trim(),
          created_by: currentUser.id,
          assigned_to: selectedUser.id,
          status: "PENDING",
        },
      ])
      .select()
      .single();

    setTaskLoading(false);

    if (error) {
      console.error(
        "Error adding task:",
        error
      );

      setNotificationMessage(t.taskError);
      setNotificationOpen(true);

      return;
    }

    // إضافة المهمة للواجهة
    setTasks((prev) => {
      const exists = prev.some(
        (task) => task.id === data.id
      );

      if (exists) {
        return prev;
      }

      return [...prev, data];
    });

    setTaskDialogOpen(false);
    setTaskTitle("");

    setNotificationMessage(t.taskAdded);
    setNotificationOpen(true);
  }

  // ==========================================
  // تحديث حالة المهمة
  // ==========================================

  async function updateTaskStatus(
    task,
    newStatus
  ) {
    if (!task || !currentUser) return;

    const updateData = {
      status: newStatus,
      completed_at:
        newStatus === "COMPLETED"
          ? new Date().toISOString()
          : null,
    };

    const { data, error } = await supabase
      .from("task_assignments")
      .update(updateData)
      .eq("id", task.id)
      .select()
      .single();

    if (error) {
      console.error(
        "Error updating task:",
        error
      );

      setNotificationMessage(t.error);
      setNotificationOpen(true);

      return;
    }

    setTasks((prev) =>
      prev.map((item) =>
        item.id === task.id
          ? data
          : item
      )
    );

    setNotificationMessage(t.taskUpdated);
    setNotificationOpen(true);
  }

  // ==========================================
  // فتح حذف المهمة
  // ==========================================

  function openDeleteTaskDialog(task) {
    setDeletingTask(task);
    setDeleteTaskDialogOpen(true);
  }

  // ==========================================
  // حذف المهمة
  // ==========================================

  async function deleteTask() {
    if (!deletingTask || !currentUser) {
      return;
    }

    const { error } = await supabase
      .from("task_assignments")
      .delete()
      .eq("id", deletingTask.id);

    if (error) {
      console.error(
        "Error deleting task:",
        error
      );

      setNotificationMessage(t.error);
      setNotificationOpen(true);

      return;
    }

    // حذف المهمة من الواجهة
    setTasks((prev) =>
      prev.filter(
        (task) => task.id !== deletingTask.id
      )
    );

    setDeleteTaskDialogOpen(false);
    setDeletingTask(null);

    setNotificationMessage(t.taskDeleted);
    setNotificationOpen(true);
  }

  // ==========================================
  // تعديل الرسالة
  // ==========================================

  function openEditDialog(msg) {
    setEditingMessage(msg);
    setEditText(msg.message);
    setEditDialogOpen(true);
  }

  async function updateMessage() {
    if (
      !editingMessage ||
      !editText.trim() ||
      !currentUser
    ) {
      return;
    }

    const { error } = await supabase
      .from("messages")
      .update({
        message: editText.trim(),
      })
      .eq("id", editingMessage.id)
      .eq("sender_id", currentUser.id);

    if (error) {
      console.error(
        "Error updating message:",
        error
      );
      return;
    }

    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === editingMessage.id
          ? {
              ...msg,
              message: editText.trim(),
            }
          : msg
      )
    );

    setEditDialogOpen(false);
    setEditingMessage(null);
    setEditText("");

    setNotificationMessage(
      t.messageUpdated
    );

    setNotificationOpen(true);
  }

  // ==========================================
  // فتح حذف الرسالة
  // ==========================================

  function openDeleteDialog(msg) {
    setDeletingMessage(msg);
    setDeleteDialogOpen(true);
  }

  // ==========================================
  // حذف الرسالة
  // ==========================================

  async function deleteMessage() {
    if (
      !deletingMessage ||
      !currentUser
    ) {
      return;
    }

    const { error } = await supabase
      .from("messages")
      .delete()
      .eq("id", deletingMessage.id)
      .eq("sender_id", currentUser.id);

    if (error) {
      console.error(
        "Error deleting message:",
        error
      );
      return;
    }

    setMessages((prev) =>
      prev.filter(
        (msg) =>
          msg.id !== deletingMessage.id
      )
    );

    setDeleteDialogOpen(false);
    setDeletingMessage(null);

    setNotificationMessage(
      t.messageDeleted
    );

    setNotificationOpen(true);
  }

  // ==========================================
  // البحث
  // ==========================================

  const filteredUsers = users.filter(
    (user) => {
      const name =
        user.display_name ||
        user.name ||
        user.email ||
        "";

      return name
        .toLowerCase()
        .includes(
          search.toLowerCase()
        );
    }
  );

  // ==========================================
  // عدد الإشعارات
  // ==========================================

  const totalUnread =
    Object.values(unreadCounts).reduce(
      (total, count) =>
        total + count,
      0
    );

  // ==========================================
  // فتح الإشعارات
  // ==========================================

  function handleNotificationClick(event) {
    setNotificationAnchorEl(
      event.currentTarget
    );
  }

  // ==========================================
  // إغلاق الإشعارات
  // ==========================================

  function handleNotificationClose() {
    setNotificationAnchorEl(null);
  }

  // ==========================================
  // فتح محادثة من الإشعار
  // ==========================================

  function openNotification(notification) {
    const user = users.find(
      (item) =>
        item.id === notification.senderId
    );

    if (user) {
      localStorage.setItem(
        "selectedChatUserId",
        user.id
      );

      setSelectedUser(user);
      setMobileChatOpen(true);
    }

    setUnreadCounts((prev) => ({
      ...prev,
      [notification.senderId]: 0,
    }));

    setNotifications((prev) =>
      prev.filter(
        (item) =>
          item.id !== notification.id
      )
    );

    handleNotificationClose();
  }

  // ==========================================
  // إغلاق Snackbar
  // ==========================================

  function closeNotification() {
    setNotificationOpen(false);
  }

  // ==========================================
  // Loading
  // ==========================================

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "70vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography>
          Loading...
        </Typography>
      </Box>
    );
  }

  // ==========================================
  // الواجهة
  // ==========================================

  return (
    <Box
      sx={{
        width: "100%",
        height: {
          xs: "calc(100vh - 120px)",
          md: "calc(100vh - 140px)",
        },
        minHeight: "500px",
        display: "flex",
        gap: 2,
        direction:
          language === "ar"
            ? "rtl"
            : "ltr",
        p: {
          xs: 1,
          md: 2,
        },
      }}
    >
      {/* ==========================================
          قائمة المستخدمين
      ========================================== */}

      <Paper
        elevation={darkMode ? 4 : 1}
        sx={{
          width: {
            xs: "100%",
            md: 320,
          },
          display: mobileChatOpen
            ? {
                xs: "none",
                md: "flex",
              }
            : "flex",
          flexDirection: "column",
          overflow: "hidden",
          borderRadius: 3,
        }}
      >
        {/* عنوان المحادثات */}

        <Box
          sx={{
            p: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 1,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold",
            }}
          >
            {t.chats}
          </Typography>

          {/* الإشعارات */}

          <IconButton
            onClick={
              handleNotificationClick
            }
            aria-label={
              t.notifications
            }
          >
            <Badge
              badgeContent={totalUnread}
              color="error"
              max={99}
            >
              {totalUnread > 0 ? (
                <NotificationsIcon />
              ) : (
                <NotificationsNoneIcon />
              )}
            </Badge>
          </IconButton>
        </Box>

        {/* قائمة الإشعارات */}

        <Menu
          anchorEl={
            notificationAnchorEl
          }
          open={Boolean(
            notificationAnchorEl
          )}
          onClose={
            handleNotificationClose
          }
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          PaperProps={{
            sx: {
              width: {
                xs: 300,
                sm: 360,
              },
              maxHeight: 400,
              mt: 1,
            },
          }}
        >
          {notifications.length === 0 ? (
            <MenuItem disabled>
              {t.noNotifications}
            </MenuItem>
          ) : (
            notifications.map(
              (notification) => (
                <MenuItem
                  key={notification.id}
                  onClick={() =>
                    openNotification(
                      notification
                    )
                  }
                  sx={{
                    display: "flex",
                    gap: 1.5,
                    alignItems:
                      "flex-start",
                    whiteSpace:
                      "normal",
                    py: 1.5,
                  }}
                >
                  <Avatar
                    src={
                      notification.avatar ||
                      undefined
                    }
                    sx={{
                      width: 38,
                      height: 38,
                      flexShrink: 0,
                    }}
                  >
                    {notification.senderName
                      ?.charAt(0)
                      ?.toUpperCase()}
                  </Avatar>

                  <Box
                    sx={{
                      minWidth: 0,
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight:
                          "bold",
                      }}
                    >
                      {
                        notification.senderName
                      }
                    </Typography>

                    <Typography
                      variant="body2"
                      sx={{
                        overflow:
                          "hidden",
                        textOverflow:
                          "ellipsis",
                        display:
                          "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient:
                          "vertical",
                      }}
                    >
                      {
                        notification.message
                      }
                    </Typography>
                  </Box>
                </MenuItem>
              )
            )
          )}
        </Menu>

        <Divider />

        {/* البحث */}

        <Box sx={{ p: 2 }}>
          <TextField
            fullWidth
            size="small"
            placeholder={t.search}
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            slotProps={{
              input: {
                startAdornment: (
                  <SearchIcon
                    sx={{
                      mr:
                        language === "ar"
                          ? 0
                          : 1,
                      ml:
                        language === "ar"
                          ? 1
                          : 0,
                    }}
                  />
                ),
              },
            }}
          />
        </Box>

        <Divider />

        {/* المستخدمين */}

        <List
          sx={{
            flex: 1,
            overflowY: "auto",
            p: 0,
          }}
        >
          {filteredUsers.map(
            (user) => {
              const userName =
                user.display_name ||
                user.name ||
                user.email ||
                "User";

              const avatar =
                user.avatar_url ||
                user.avatar ||
                "";

              const unread =
                unreadCounts[user.id] ||
                0;

              return (
                <ListItemButton
                  key={user.id}
                  selected={
                    selectedUser?.id ===
                    user.id
                  }
                  onClick={() => {
                    localStorage.setItem(
                      "selectedChatUserId",
                      user.id
                    );

                    setSelectedUser(user);
                    setMobileChatOpen(true);
                  }}
                  sx={{
                    py: 1.5,
                    px: 2,
                  }}
                >
                  <Avatar
                    src={
                      avatar ||
                      undefined
                    }
                    sx={{
                      width: 42,
                      height: 42,
                      mr:
                        language === "ar"
                          ? 0
                          : 1.5,
                      ml:
                        language === "ar"
                          ? 1.5
                          : 0,
                    }}
                  >
                    {userName
                      .charAt(0)
                      .toUpperCase()}
                  </Avatar>

                  <Box
                    sx={{
                      flex: 1,
                      minWidth: 0,
                    }}
                  >
                    <Typography
                      sx={{
                        fontWeight:
                          unread > 0
                            ? "bold"
                            : "normal",
                        overflow:
                          "hidden",
                        textOverflow:
                          "ellipsis",
                        whiteSpace:
                          "nowrap",
                      }}
                    >
                      {userName}
                    </Typography>
                  </Box>

                  {unread > 0 && (
                    <Badge
                      badgeContent={
                        unread
                      }
                      color="error"
                      max={99}
                    />
                  )}
                </ListItemButton>
              );
            }
          )}
        </List>
      </Paper>

      {/* ==========================================
          المحادثة
      ========================================== */}

      <Paper
        elevation={darkMode ? 4 : 1}
        sx={{
          flex: 1,
          display: !mobileChatOpen
            ? {
                xs: "none",
                md: "flex",
              }
            : "flex",
          flexDirection: "column",
          overflow: "hidden",
          borderRadius: 3,
        }}
      >
        {selectedUser ? (
          <>
            {/* رأس المحادثة */}

            <Box
              sx={{
                p: 1.5,
                display: "flex",
                alignItems: "center",
                gap: 1,
                borderBottom:
                  "1px solid",
                borderColor:
                  "divider",
              }}
            >
              <IconButton
                onClick={() => {
                  setMobileChatOpen(false);
                }}
                sx={{
                  display: {
                    xs: "flex",
                    md: "none",
                  },
                }}
              >
                <ArrowBackIcon />
              </IconButton>

              <Avatar
                src={
                  selectedUser.avatar_url ||
                  selectedUser.avatar ||
                  undefined
                }
              >
                {(
                  selectedUser.display_name ||
                  selectedUser.name ||
                  selectedUser.email ||
                  "U"
                )
                  .charAt(0)
                  .toUpperCase()}
              </Avatar>

              <Typography
                sx={{
                  fontWeight: "bold",
                  flex: 1,
                }}
              >
                {selectedUser.display_name ||
                  selectedUser.name ||
                  selectedUser.email}
              </Typography>
            </Box>

            {/* ==========================================
                الرسائل والمهام
            ========================================== */}

            <Box
              sx={{
                flex: 1,
                overflowY: "auto",
                p: {
                  xs: 1,
                  md: 2,
                },
                display: "flex",
                flexDirection:
                  "column",
                gap: 1.5,
              }}
            >
              {/* الرسائل */}

              {messages.map((msg) => {
                const isMine =
                  msg.sender_id ===
                  currentUser.id;

                return (
                  <Box
                    key={msg.id}
                    sx={{
                      display: "flex",
                      justifyContent:
                        isMine
                          ? "flex-end"
                          : "flex-start",
                    }}
                  >
                    <Box
                      sx={{
                        maxWidth: {
                          xs: "85%",
                          sm: "70%",
                        },
                        px: 1.5,
                        py: 1,
                        borderRadius: 2,
                        bgcolor: isMine
                          ? "primary.main"
                          : darkMode
                          ? "grey.800"
                          : "grey.200",
                        color: isMine
                          ? "primary.contrastText"
                          : "text.primary",
                      }}
                    >
                      <Typography
                        sx={{
                          whiteSpace:
                            "pre-wrap",
                          wordBreak:
                            "break-word",
                        }}
                      >
                        {msg.message}
                      </Typography>

                      {isMine && (
                        <Box
                          sx={{
                            display:
                              "flex",
                            justifyContent:
                              "flex-end",
                            mt: 0.5,
                            gap: 0.5,
                          }}
                        >
                          <IconButton
                            size="small"
                            onClick={() =>
                              openEditDialog(
                                msg
                              )
                            }
                            sx={{
                              color:
                                "inherit",
                            }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>

                          <IconButton
                            size="small"
                            onClick={() =>
                              openDeleteDialog(
                                msg
                              )
                            }
                            sx={{
                              color:
                                "inherit",
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      )}
                    </Box>
                  </Box>
                );
              })}

              {/* المهام */}

              {tasks.length > 0 && (
                <Box
                  sx={{
                    mt: 2,
                    display: "flex",
                    flexDirection:
                      "column",
                    gap: 1,
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight:
                        "bold",
                    }}
                  >
                    {t.tasks}
                  </Typography>

                  {tasks.map((task) => {
                    const createdByMe =
                      task.created_by ===
                      currentUser.id;

                    return (
                      <Paper
                        key={task.id}
                        elevation={1}
                        sx={{
                          p: 1.5,
                          borderRadius: 2,
                          border:
                            "1px solid",
                          borderColor:
                            "divider",
                        }}
                      >
                        <Box
                          sx={{
                            display:
                              "flex",
                            alignItems:
                              "flex-start",
                            justifyContent:
                              "space-between",
                            gap: 1,
                          }}
                        >
                          <Typography
                            sx={{
                              fontWeight:
                                "bold",
                              mb: 1,
                              wordBreak:
                                "break-word",
                              flex: 1,
                            }}
                          >
                            {task.title}
                          </Typography>

                          {/* حذف المهمة */}

                          <IconButton
                            size="small"
                            color="error"
                            onClick={() =>
                              openDeleteTaskDialog(
                                task
                              )
                            }
                            title={t.delete}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>

                        <Box
                          sx={{
                            display:
                              "flex",
                            alignItems:
                              "center",
                            justifyContent:
                              "space-between",
                            gap: 1,
                            flexWrap:
                              "wrap",
                          }}
                        >
                          <Typography
                            variant="body2"
                            color="text.secondary"
                          >
                            {t.status}
                          </Typography>

                          <select
                            value={
                              task.status ||
                              "PENDING"
                            }
                            onChange={(e) =>
                              updateTaskStatus(
                                task,
                                e.target.value
                              )
                            }
                            style={{
                              padding:
                                "6px 10px",
                              borderRadius:
                                "8px",
                              border:
                                "1px solid #ccc",
                              background:
                                darkMode
                                  ? "#333"
                                  : "#fff",
                              color:
                                darkMode
                                  ? "#fff"
                                  : "#000",
                              cursor:
                                "pointer",
                            }}
                          >
                            <option value="PENDING">
                              {t.pending}
                            </option>

                            <option value="IN_PROGRESS">
                              {t.inProgress}
                            </option>

                            <option value="COMPLETED">
                              {t.completed}
                            </option>
                          </select>
                        </Box>

                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{
                            display:
                              "block",
                            mt: 1,
                          }}
                        >
                          {createdByMe
                            ? language ===
                              "ar"
                              ? "أنت أنشأت هذه المهمة"
                              : "You created this task"
                            : language ===
                              "ar"
                            ? "تم إرسال هذه المهمة إليك"
                            : "This task was assigned to you"}
                        </Typography>
                      </Paper>
                    );
                  })}
                </Box>
              )}

              {/* لا توجد رسائل أو مهام */}

              {messages.length === 0 &&
                tasks.length === 0 && (
                  <Box
                    sx={{
                      flex: 1,
                      display: "flex",
                      alignItems:
                        "center",
                      justifyContent:
                        "center",
                    }}
                  >
                    <Typography
                      color="text.secondary"
                    >
                      {t.selectUser}
                    </Typography>
                  </Box>
                )}
            </Box>

            {/* ==========================================
                كتابة الرسالة
            ========================================== */}

            <Box
              sx={{
                p: 1.5,
                borderTop:
                  "1px solid",
                borderColor:
                  "divider",
                display: "flex",
                alignItems:
                  "center",
                gap: 1,
              }}
            >
              {/* إضافة مهمة */}

              <IconButton
                color="primary"
                onClick={
                  openTaskDialog
                }
                title={t.addTask}
              >
                <AddTaskIcon />
              </IconButton>

              <TextField
                fullWidth
                size="small"
                placeholder={
                  t.typeMessage
                }
                value={message}
                onChange={(e) =>
                  setMessage(
                    e.target.value
                  )
                }
                onKeyDown={(e) => {
                  if (
                    e.key === "Enter" &&
                    !e.shiftKey
                  ) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
              />

              <Button
                variant="contained"
                onClick={
                  sendMessage
                }
                sx={{
                  minWidth: {
                    xs: 45,
                    sm: 90,
                  },
                }}
              >
                <SendIcon
                  sx={{
                    display: {
                      xs: "block",
                      sm: "none",
                    },
                  }}
                />

                <Box
                  component="span"
                  sx={{
                    display: {
                      xs: "none",
                      sm: "block",
                    },
                  }}
                >
                  {t.send}
                </Box>
              </Button>
            </Box>
          </>
        ) : (
          <Box
            sx={{
              flex: 1,
              display: "flex",
              alignItems:
                "center",
              justifyContent:
                "center",
              p: 3,
            }}
          >
            <Typography
              color="text.secondary"
            >
              {t.selectUser}
            </Typography>
          </Box>
        )}
      </Paper>

      {/* ==========================================
          نافذة إضافة مهمة
      ========================================== */}

      {taskDialogOpen && (
        <Box
          sx={{
            position: "fixed",
            inset: 0,
            backgroundColor:
              "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems:
              "center",
            justifyContent:
              "center",
            zIndex: 2000,
            p: 2,
          }}
        >
          <Paper
            sx={{
              width: "100%",
              maxWidth: 450,
              p: 3,
              borderRadius: 3,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight:
                  "bold",
                mb: 2,
              }}
            >
              {t.addTask}
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mb: 2,
              }}
            >
              {language === "ar"
                ? `سيتم إرسال المهمة إلى ${
                    selectedUser?.display_name ||
                    selectedUser?.name ||
                    selectedUser?.email ||
                    ""
                  }`
                : `The task will be assigned to ${
                    selectedUser?.display_name ||
                    selectedUser?.name ||
                    selectedUser?.email ||
                    ""
                  }`}
            </Typography>

            <TextField
              fullWidth
              autoFocus
              label={t.taskTitle}
              placeholder={
                t.taskTitlePlaceholder
              }
              value={taskTitle}
              onChange={(e) =>
                setTaskTitle(
                  e.target.value
                )
              }
              onKeyDown={(e) => {
                if (
                  e.key === "Enter" &&
                  !taskLoading
                ) {
                  addTask();
                }
              }}
            />

            <Box
              sx={{
                display: "flex",
                justifyContent:
                  "flex-end",
                gap: 1,
                mt: 3,
              }}
            >
              <Button
                onClick={() => {
                  setTaskDialogOpen(
                    false
                  );
                  setTaskTitle("");
                }}
                disabled={taskLoading}
              >
                {t.cancel}
              </Button>

              <Button
                variant="contained"
                onClick={addTask}
                disabled={
                  taskLoading ||
                  !taskTitle.trim()
                }
              >
                {taskLoading
                  ? "..."
                  : t.addTask}
              </Button>
            </Box>
          </Paper>
        </Box>
      )}

      {/* ==========================================
          نافذة تعديل الرسالة
      ========================================== */}

      {editDialogOpen && (
        <Box
          sx={{
            position: "fixed",
            inset: 0,
            backgroundColor:
              "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems:
              "center",
            justifyContent:
              "center",
            zIndex: 2000,
            p: 2,
          }}
        >
          <Paper
            sx={{
              width: "100%",
              maxWidth: 450,
              p: 3,
              borderRadius: 3,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight:
                  "bold",
                mb: 2,
              }}
            >
              {t.edit}
            </Typography>

            <TextField
              fullWidth
              multiline
              minRows={3}
              value={editText}
              onChange={(e) =>
                setEditText(
                  e.target.value
                )
              }
            />

            <Box
              sx={{
                display: "flex",
                justifyContent:
                  "flex-end",
                gap: 1,
                mt: 3,
              }}
            >
              <Button
                onClick={() => {
                  setEditDialogOpen(
                    false
                  );
                  setEditingMessage(null);
                  setEditText("");
                }}
              >
                {t.cancel}
              </Button>

              <Button
                variant="contained"
                onClick={
                  updateMessage
                }
                disabled={
                  !editText.trim()
                }
              >
                {t.save}
              </Button>
            </Box>
          </Paper>
        </Box>
      )}

      {/* ==========================================
          نافذة حذف المهمة
      ========================================== */}

      {deleteTaskDialogOpen && (
        <Box
          sx={{
            position: "fixed",
            inset: 0,
            backgroundColor:
              "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems:
              "center",
            justifyContent:
              "center",
            zIndex: 2000,
            p: 2,
          }}
        >
          <Paper
            sx={{
              width: "100%",
              maxWidth: 450,
              p: 3,
              borderRadius: 3,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight:
                  "bold",
                mb: 2,
              }}
            >
              {t.delete}
            </Typography>

            <Typography
              sx={{
                mb: 3,
              }}
            >
              {t.deleteTaskConfirm}
            </Typography>

            <Box
              sx={{
                display: "flex",
                justifyContent:
                  "flex-end",
                gap: 1,
              }}
            >
              <Button
                onClick={() => {
                  setDeleteTaskDialogOpen(
                    false
                  );
                  setDeletingTask(null);
                }}
              >
                {t.cancel}
              </Button>

              <Button
                variant="contained"
                color="error"
                onClick={
                  deleteTask
                }
              >
                {t.delete}
              </Button>
            </Box>
          </Paper>
        </Box>
      )}

      {/* ==========================================
          نافذة حذف الرسالة
      ========================================== */}

      {deleteDialogOpen && (
        <Box
          sx={{
            position: "fixed",
            inset: 0,
            backgroundColor:
              "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems:
              "center",
            justifyContent:
              "center",
            zIndex: 2000,
            p: 2,
          }}
        >
          <Paper
            sx={{
              width: "100%",
              maxWidth: 450,
              p: 3,
              borderRadius: 3,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight:
                  "bold",
                mb: 2,
              }}
            >
              {t.delete}
            </Typography>

            <Typography
              sx={{
                mb: 3,
              }}
            >
              {t.deleteConfirm}
            </Typography>

            <Box
              sx={{
                display: "flex",
                justifyContent:
                  "flex-end",
                gap: 1,
              }}
            >
              <Button
                onClick={() => {
                  setDeleteDialogOpen(
                    false
                  );
                  setDeletingMessage(null);
                }}
              >
                {t.cancel}
              </Button>

              <Button
                variant="contained"
                color="error"
                onClick={
                  deleteMessage
                }
              >
                {t.delete}
              </Button>
            </Box>
          </Paper>
        </Box>
      )}

      {/* ==========================================
          Snackbar
      ========================================== */}

      <Snackbar
        open={notificationOpen}
        autoHideDuration={3000}
        onClose={
          closeNotification
        }
        anchorOrigin={{
          vertical: "bottom",
          horizontal:
            language === "ar"
              ? "left"
              : "right",
        }}
      >
        <Alert
          onClose={
            closeNotification
          }
          severity="info"
          variant="filled"
          sx={{
            width: "100%",
          }}
        >
          {notificationMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}