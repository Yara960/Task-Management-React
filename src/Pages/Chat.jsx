
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

import { useTheme } from "@mui/material/styles";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";

import SendIcon from "@mui/icons-material/Send";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ChatIcon from "@mui/icons-material/Chat";
import PersonIcon from "@mui/icons-material/Person";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";

export default function Chat() {
  // ==========================================
  // الثيم
  // ==========================================

  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  // ==========================================
  // اللغة
  // ==========================================

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

  // ==========================================
  // النصوص
  // ==========================================

  const text = {
    en: {
      chats: "Chats",
      chooseUser: "Choose a user to chat",
      searchUsers: "Search users...",
      loadingUsers: "Loading users...",
      noUsersFound: "No users found",
      noUsersAvailable: "No users available",

      welcomeChat: "Welcome to Chat",
      startConversation:
        "Search for a user and select them to start a conversation.",

      startChatting: "Start chatting",

      loadingMessages: "Loading messages...",
      noMessages: "No messages yet",
      firstMessage: "Send the first message!",

      writeMessage: "Write a message...",
      send: "Send",

      editMessage: "Edit Message",
      cancel: "Cancel",
      save: "Save",

      deleteMessage: "Delete Message",
      deleteConfirmation:
        "Are you sure you want to delete this message?",
      delete: "Delete",

      user: "User",
      today: "Today",
      yesterday: "Yesterday",
    },

    ar: {
      chats: "المحادثات",
      chooseUser: "اختر مستخدمًا لبدء المحادثة",
      searchUsers: "البحث عن مستخدمين...",
      loadingUsers: "جاري تحميل المستخدمين...",
      noUsersFound: "لم يتم العثور على مستخدمين",
      noUsersAvailable: "لا يوجد مستخدمون متاحون",

      welcomeChat: "مرحبًا بك في المحادثة",
      startConversation:
        "ابحث عن مستخدم واختره لبدء محادثة.",

      startChatting: "ابدأ المحادثة",

      loadingMessages: "جاري تحميل الرسائل...",
      noMessages: "لا توجد رسائل بعد",
      firstMessage: "أرسل أول رسالة!",

      writeMessage: "اكتب رسالة...",
      send: "إرسال",

      editMessage: "تعديل الرسالة",
      cancel: "إلغاء",
      save: "حفظ",

      deleteMessage: "حذف الرسالة",
      deleteConfirmation:
        "هل أنت متأكد أنك تريد حذف هذه الرسالة؟",
      delete: "حذف",

      user: "مستخدم",
      today: "اليوم",
      yesterday: "أمس",
    },
  };

  const currentText =
    language === "ar" ? text.ar : text.en;

  // ==========================================
  // الحالات
  // ==========================================

  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const [search, setSearch] = useState("");

  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);

  // حالات التعديل
  const [editOpen, setEditOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editMessage, setEditMessage] = useState("");

  // حالات الحذف
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // ==========================================
  // الألوان
  // ==========================================

  const colors = {
    background: theme.palette.background.default,
    card: theme.palette.background.paper,

    field: isDark ? "#273449" : "#F8FAFC",

    border: isDark ? "#334155" : "#DCE3E8",

    primary: theme.palette.primary.main,

    secondary: theme.palette.secondary.main,

    text: theme.palette.text.primary,

    muted: theme.palette.text.secondary,

    delete: "#EF5350",

    selected: isDark ? "#273B46" : "#E0F2F1",

    selectedHover: isDark
      ? "#2B414C"
      : "#D5ECE9",

    hover: isDark
      ? "#243344"
      : "#F1F5F9",
  };

  // ==========================================
  // جلب المستخدم الحالي
  // ==========================================

  useEffect(() => {
    getCurrentUser();
  }, []);

  // ==========================================
  // جلب المستخدمين
  // ==========================================

  useEffect(() => {
    if (currentUser) {
      getUsers();
    }
  }, [currentUser]);

  // ==========================================
  // جلب الرسائل عند اختيار مستخدم
  // ==========================================

  useEffect(() => {
    if (currentUser && selectedUser) {
      getMessages(selectedUser);
    }
  }, [currentUser, selectedUser]);

  // ==========================================
  // Realtime للمحادثة
  // ==========================================

  useEffect(() => {
    if (!currentUser || !selectedUser) {
      return;
    }

    const channel = supabase
      .channel(
        "chat-" +
          currentUser.id +
          "-" +
          selectedUser.id
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "messages",
        },
        (payload) => {
          const newMessage = payload.new || {};
          const oldMessage = payload.old || {};

          const isConversationMessage =
            (newMessage.sender_id === currentUser.id &&
              newMessage.receiver_id === selectedUser.id) ||
            (newMessage.sender_id === selectedUser.id &&
              newMessage.receiver_id === currentUser.id) ||
            (oldMessage.sender_id === currentUser.id &&
              oldMessage.receiver_id === selectedUser.id) ||
            (oldMessage.sender_id === selectedUser.id &&
              oldMessage.receiver_id === currentUser.id);

          if (isConversationMessage) {
            getMessages(selectedUser);
          }
        }
      )
      .subscribe((status) => {
        console.log("Realtime status:", status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUser, selectedUser]);

  // ==========================================
  // معرفة المستخدم الحالي
  // ==========================================

  async function getCurrentUser() {
    const { data, error } =
      await supabase.auth.getUser();

    if (error) {
      console.error(
        "Error getting user:",
        error
      );
      return;
    }

    setCurrentUser(data.user);
  }

  // ==========================================
  // جلب المستخدمين
  // ==========================================

  async function getUsers() {
    setLoadingUsers(true);

    const { data, error } = await supabase
      .from("profiles")
      .select("id, display_name, email");

    if (error) {
      console.error(
        "Error getting users:",
        error
      );

      setLoadingUsers(false);
      return;
    }

    const otherUsers = data.filter(
      (user) =>
        user.id !== currentUser.id
    );

    setUsers(otherUsers);
    setLoadingUsers(false);
  }

  // ==========================================
  // جلب رسائل المحادثة
  // ==========================================

  async function getMessages(userToChat) {
    setLoadingMessages(true);

    const conversationFilter =
      "and(sender_id.eq." +
      currentUser.id +
      ",receiver_id.eq." +
      userToChat.id +
      "),and(sender_id.eq." +
      userToChat.id +
      ",receiver_id.eq." +
      currentUser.id +
      ")";

    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .or(conversationFilter)
      .order("created_at", {
        ascending: true,
      });

    if (error) {
      console.error(
        "Error getting messages:",
        error
      );

      setLoadingMessages(false);
      return;
    }

    setMessages(data || []);
    setLoadingMessages(false);
  }

  // ==========================================
  // إرسال الرسالة
  // ==========================================

  async function sendMessage() {
    if (
      !message.trim() ||
      !selectedUser ||
      !currentUser
    ) {
      return;
    }

    const { error } = await supabase
      .from("messages")
      .insert([
        {
          sender_id: currentUser.id,
          receiver_id: selectedUser.id,
          message: message.trim(),
        },
      ]);

    if (error) {
      console.error(
        "Error sending message:",
        error
      );
      return;
    }

    setMessage("");
  }

  // ==========================================
  // إرسال بالضغط على Enter
  // ==========================================

  function handleKeyDown(event) {
    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {
      event.preventDefault();
      sendMessage();
    }
  }

  // ==========================================
  // فتح التعديل
  // ==========================================

  function openEdit(messageItem) {
    setEditId(messageItem.id);
    setEditMessage(messageItem.message);
    setEditOpen(true);
  }

  // ==========================================
  // إغلاق التعديل
  // ==========================================

  function closeEdit() {
    setEditOpen(false);
    setEditId(null);
    setEditMessage("");
  }

  // ==========================================
  // تحديث الرسالة
  // ==========================================

  async function updateMessage() {
    if (!editMessage.trim()) {
      return;
    }

    const { error } = await supabase
      .from("messages")
      .update({
        message: editMessage.trim(),
      })
      .eq("id", editId)
      .eq("sender_id", currentUser.id);

    if (error) {
      console.error(
        "Error updating message:",
        error
      );
      return;
    }

    closeEdit();
  }

  // ==========================================
  // فتح نافذة الحذف
  // ==========================================

  function openDelete(messageId) {
    setDeleteId(messageId);
    setDeleteOpen(true);
  }

  // ==========================================
  // إغلاق نافذة الحذف
  // ==========================================

  function closeDelete() {
    setDeleteOpen(false);
    setDeleteId(null);
  }

  // ==========================================
  // حذف الرسالة
  // ==========================================

  async function confirmDelete() {
    const { error } = await supabase
      .from("messages")
      .delete()
      .eq("id", deleteId)
      .eq("sender_id", currentUser.id);

    if (error) {
      console.error(
        "Error deleting message:",
        error
      );
      return;
    }

    closeDelete();
  }

  // ==========================================
  // الحصول على اسم المستخدم
  // ==========================================

  function getUserName(user) {
    return (
      user.display_name ||
      user.email ||
      currentText.user
    );
  }

  // ==========================================
  // أول حرف من الاسم
  // ==========================================

  function getInitial(user) {
    return getUserName(user)
      .charAt(0)
      .toUpperCase();
  }

  // ==========================================
  // تنسيق الوقت
  // ==========================================

  function formatTime(dateValue) {
    if (!dateValue) {
      return "";
    }

    const date = new Date(dateValue);

    return date.toLocaleTimeString(
      language === "ar"
        ? "ar-SA"
        : "en-US",
      {
        hour: "numeric",
        minute: "2-digit",
      }
    );
  }

  // ==========================================
  // تنسيق التاريخ
  // ==========================================

  function formatDate(dateValue) {
    if (!dateValue) {
      return "";
    }

    const date = new Date(dateValue);
    const now = new Date();

    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );

    const messageDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );

    const difference =
      startOfToday.getTime() -
      messageDate.getTime();

    const oneDay = 24 * 60 * 60 * 1000;

    if (difference === 0) {
      return currentText.today;
    }

    if (difference === oneDay) {
      return currentText.yesterday;
    }

    return date.toLocaleDateString(
      language === "ar"
        ? "ar-SA"
        : "en-US",
      {
        year: "numeric",
        month: "long",
        day: "numeric",
      }
    );
  }

  // ==========================================
  // معرفة هل التاريخ مختلف عن الرسالة السابقة
  // ==========================================

  function shouldShowDate(index) {
    if (index === 0) {
      return true;
    }

    const currentDate = new Date(
      messages[index].created_at
    );

    const previousDate = new Date(
      messages[index - 1].created_at
    );

    return (
      currentDate.toDateString() !==
      previousDate.toDateString()
    );
  }

  // ==========================================
  // البحث عن المستخدمين
  // ==========================================

  const filteredUsers = users.filter(
    (user) => {
      const name =
        user.display_name || "";

      const email =
        user.email || "";

      return (
        name
          .toLowerCase()
          .includes(
            search.toLowerCase()
          ) ||
        email
          .toLowerCase()
          .includes(
            search.toLowerCase()
          )
      );
    }
  );

  // ==========================================
  // الواجهة
  // ==========================================

  return (
    <Box
      sx={{
        minHeight:
          "calc(100vh - 64px)",

        p: {
          xs: 1.5,
          sm: 2,
          md: 4,
        },

        backgroundColor:
          colors.background,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          maxWidth: 1250,

          height: {
            xs: "calc(100vh - 110px)",
            md: "78vh",
          },

          minHeight: {
            xs: 600,
            md: 600,
          },

          mx: "auto",

          display: "flex",

          overflow: "hidden",

          borderRadius: {
            xs: 2.5,
            md: 4,
          },

          backgroundColor:
            colors.card,

          border:
            `1px solid ${colors.border}`,

          boxShadow: isDark
            ? "0 8px 30px rgba(0,0,0,0.20)"
            : "0 8px 30px rgba(15,23,42,0.08)",
        }}
      >
        {/* ==========================================
            قائمة المستخدمين
        ========================================== */}

        <Box
          sx={{
            width: {
              xs: "38%",
              sm: 300,
            },

            minWidth: {
              xs: 125,
              sm: 250,
            },

            borderRight:
              `1px solid ${colors.border}`,

            backgroundColor:
              colors.card,

            display: "flex",

            flexDirection:
              "column",
          }}
        >
          {/* عنوان القائمة */}

          <Box
            sx={{
              p: {
                xs: 1.5,
                sm: 2,
              },

              backgroundColor:
                colors.card,

              borderBottom:
                `1px solid ${colors.border}`,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Box
                sx={{
                  width: 38,
                  height: 38,
                  borderRadius: "12px",

                  display: "flex",
                  alignItems: "center",
                  justifyContent:
                    "center",

                  backgroundColor:
                    isDark
                      ? "rgba(128,203,196,0.12)"
                      : "#E6F4F2",

                  color:
                    colors.primary,
                }}
              >
                <ChatIcon />
              </Box>

              <Typography
                variant="h6"
                sx={{
                  fontWeight: 800,
                  color: colors.text,
                  fontSize: {
                    xs: 15,
                    sm: 18,
                  },
                }}
              >
                {currentText.chats}
              </Typography>
            </Box>

            <Typography
              variant="body2"
              sx={{
                mt: 1,
                color: colors.muted,
                fontSize: {
                  xs: 11,
                  sm: 13,
                },
              }}
            >
              {currentText.chooseUser}
            </Typography>
          </Box>

          {/* البحث */}

          <Box
            sx={{
              p: {
                xs: 1,
                sm: 1.5,
              },
            }}
          >
            <TextField
              fullWidth
              size="small"
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
              placeholder={
                currentText.searchUsers
              }
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon
                      sx={{
                        color:
                          colors.muted,
                        fontSize: {
                          xs: 19,
                          sm: 22,
                        },
                      }}
                    />
                  </InputAdornment>
                ),

                endAdornment:
                  search && (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        onClick={() =>
                          setSearch("")
                        }
                        sx={{
                          color:
                            colors.muted,
                        }}
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  ),
              }}
              sx={{
                "& .MuiOutlinedInput-root":
                  {
                    borderRadius:
                      "13px",

                    backgroundColor:
                      colors.field,

                    "& fieldset": {
                      borderColor:
                        colors.border,
                    },

                    "&:hover fieldset":
                      {
                        borderColor:
                          colors.primary,
                      },

                    "&.Mui-focused fieldset":
                      {
                        borderColor:
                          colors.primary,
                      },
                  },

                "& .MuiInputBase-input":
                  {
                    color:
                      colors.text,

                    fontSize: {
                      xs: 12,
                      sm: 14,
                    },
                  },

                "& .MuiInputBase-input::placeholder":
                  {
                    color:
                      colors.muted,
                    opacity: 1,
                  },
              }}
            />
          </Box>

          <Divider
            sx={{
              borderColor:
                colors.border,
            }}
          />

          {/* قائمة المستخدمين */}

          <List
            sx={{
              p: 1,

              overflowY: "auto",

              flex: 1,

              "&::-webkit-scrollbar":
                {
                  width: "5px",
                },

              "&::-webkit-scrollbar-thumb":
                {
                  backgroundColor:
                    isDark
                      ? "#475569"
                      : "#CBD5E1",

                  borderRadius: 10,
                },
            }}
          >
            {loadingUsers ? (
              <Box
                sx={{
                  p: 3,
                  textAlign: "center",
                }}
              >
                <Typography
                  sx={{
                    color:
                      colors.muted,
                    fontSize: 13,
                  }}
                >
                  {
                    currentText.loadingUsers
                  }
                </Typography>
              </Box>
            ) : filteredUsers.length ===
              0 ? (
              <Box
                sx={{
                  p: 3,
                  textAlign: "center",
                }}
              >
                <PersonIcon
                  sx={{
                    fontSize: 42,
                    color:
                      colors.muted,
                  }}
                />

                <Typography
                  sx={{
                    mt: 1,
                    color:
                      colors.muted,
                    fontSize: 13,
                  }}
                >
                  {search
                    ? currentText.noUsersFound
                    : currentText.noUsersAvailable}
                </Typography>
              </Box>
            ) : (
              filteredUsers.map(
                (user) => (
                  <ListItemButton
                    key={user.id}
                    selected={
                      selectedUser?.id ===
                      user.id
                    }
                    onClick={() =>
                      setSelectedUser(
                        user
                      )
                    }
                    sx={{
                      py: 1.2,
                      px: 1.2,
                      mb: 0.5,

                      borderRadius:
                        "14px",

                      border:
                        "1px solid transparent",

                      "&.Mui-selected":
                        {
                          backgroundColor:
                            colors.selected,

                          borderColor:
                            isDark
                              ? "#3E5B60"
                              : "#B2DFDB",
                        },

                      "&.Mui-selected:hover":
                        {
                          backgroundColor:
                            colors.selectedHover,
                        },

                      "&:hover": {
                        backgroundColor:
                          colors.hover,
                      },
                    }}
                  >
                    <ListItemAvatar
                      sx={{
                        minWidth: {
                          xs: 42,
                          sm: 52,
                        },
                      }}
                    >
                      <Avatar
                        sx={{
                          width: {
                            xs: 34,
                            sm: 42,
                          },

                          height: {
                            xs: 34,
                            sm: 42,
                          },

                          backgroundColor:
                            colors.primary,

                          color: isDark
                            ? "#0F172A"
                            : "#FFFFFF",

                          fontWeight:
                            "bold",

                          fontSize: {
                            xs: 13,
                            sm: 16,
                          },
                        }}
                      >
                        {getInitial(user)}
                      </Avatar>
                    </ListItemAvatar>

                    <ListItemText
                      primary={
                        <Typography
                          sx={{
                            fontWeight:
                              selectedUser?.id ===
                              user.id
                                ? 800
                                : 600,

                            color:
                              colors.text,

                            fontSize: {
                              xs: 12,
                              sm: 14,
                            },

                            overflow:
                              "hidden",

                            textOverflow:
                              "ellipsis",

                            whiteSpace:
                              "nowrap",
                          }}
                        >
                          {getUserName(user)}
                        </Typography>
                      }
                    />
                  </ListItemButton>
                )
              )
            )}
          </List>
        </Box>

        {/* ==========================================
            منطقة المحادثة
        ========================================== */}

        <Box
          sx={{
            flex: 1,

            display: "flex",

            flexDirection:
              "column",

            minWidth: 0,

            backgroundColor:
              colors.background,
          }}
        >
          {!selectedUser ? (
            <Box
              sx={{
                flex: 1,

                display: "flex",

                flexDirection:
                  "column",

                alignItems:
                  "center",

                justifyContent:
                  "center",

                p: 3,

                textAlign:
                  "center",
              }}
            >
              <Box
                sx={{
                  width: 100,
                  height: 100,
                  borderRadius: "30px",

                  display: "flex",
                  alignItems: "center",
                  justifyContent:
                    "center",

                  backgroundColor:
                    isDark
                      ? "rgba(128,203,196,0.10)"
                      : "#E6F4F2",

                  mb: 2,
                }}
              >
                <Avatar
                  sx={{
                    width: 72,
                    height: 72,

                    backgroundColor:
                      colors.primary,

                    color: isDark
                      ? colors.background
                      : "#FFFFFF",
                  }}
                >
                  <ChatIcon
                    sx={{
                      fontSize: 38,
                    }}
                  />
                </Avatar>
              </Box>

              <Typography
                variant="h5"
                sx={{
                  fontWeight: 800,
                  color: colors.text,
                }}
              >
                {currentText.welcomeChat}
              </Typography>

              <Typography
                sx={{
                  mt: 1,
                  maxWidth: 400,
                  color: colors.muted,
                  lineHeight: 1.7,
                }}
              >
                {
                  currentText.startConversation
                }
              </Typography>
            </Box>
          ) : (
            <>
              {/* ==========================================
                  Header المحادثة
              ========================================== */}

              <Box
                sx={{
                  p: {
                    xs: 1.5,
                    md: 2,
                  },

                  backgroundColor:
                    colors.card,

                  borderBottom:
                    `1px solid ${colors.border}`,

                  display: "flex",

                  alignItems:
                    "center",

                  gap: 1.5,
                }}
              >
                <Avatar
                  sx={{
                    width: {
                      xs: 40,
                      sm: 46,
                    },

                    height: {
                      xs: 40,
                      sm: 46,
                    },

                    backgroundColor:
                      colors.primary,

                    color: isDark
                      ? colors.background
                      : "#FFFFFF",

                    fontWeight:
                      "bold",
                  }}
                >
                  {getInitial(
                    selectedUser
                  )}
                </Avatar>

                <Box
                  sx={{
                    minWidth: 0,
                  }}
                >
                  <Typography
                    sx={{
                      fontWeight:
                        800,

                      color:
                        colors.text,

                      fontSize: {
                        xs: 14,
                        sm: 16,
                      },

                      overflow:
                        "hidden",

                      textOverflow:
                        "ellipsis",

                      whiteSpace:
                        "nowrap",
                    }}
                  >
                    {getUserName(
                      selectedUser
                    )}
                  </Typography>

                  <Typography
                    variant="caption"
                    sx={{
                      color:
                        colors.muted,
                    }}
                  >
                    {
                      currentText.startChatting
                    }
                  </Typography>
                </Box>
              </Box>

              {/* ==========================================
                  الرسائل
              ========================================== */}

              <Box
                sx={{
                  flex: 1,

                  overflowY:
                    "auto",

                  p: {
                    xs: 1.5,
                    sm: 2,
                    md: 3,
                  },

                  display: "flex",

                  flexDirection:
                    "column",

                  gap: 0.8,

                  "&::-webkit-scrollbar":
                    {
                      width: "6px",
                    },

                  "&::-webkit-scrollbar-thumb":
                    {
                      backgroundColor:
                        isDark
                          ? "#475569"
                          : "#CBD5E1",

                      borderRadius: 10,
                    },
                }}
              >
                {loadingMessages ? (
                  <Box
                    sx={{
                      flex: 1,

                      display: "flex",

                      justifyContent:
                        "center",

                      alignItems:
                        "center",
                    }}
                  >
                    <Typography
                      sx={{
                        color:
                          colors.muted,
                      }}
                    >
                      {
                        currentText.loadingMessages
                      }
                    </Typography>
                  </Box>
                ) : messages.length ===
                  0 ? (
                  <Box
                    sx={{
                      flex: 1,

                      display: "flex",

                      justifyContent:
                        "center",

                      alignItems:
                        "center",

                      textAlign:
                        "center",
                    }}
                  >
                    <Box>
                      <Box
                        sx={{
                          width: 70,
                          height: 70,
                          borderRadius:
                            "22px",

                          margin:
                            "0 auto",

                          display:
                            "flex",

                          alignItems:
                            "center",

                          justifyContent:
                            "center",

                          backgroundColor:
                            isDark
                              ? "rgba(128,203,196,0.10)"
                              : "#E6F4F2",
                        }}
                      >
                        <ChatIcon
                          sx={{
                            fontSize: 38,
                            color:
                              colors.primary,
                          }}
                        />
                      </Box>

                      <Typography
                        sx={{
                          mt: 2,
                          color:
                            colors.muted,
                          fontWeight:
                            700,
                        }}
                      >
                        {
                          currentText.noMessages
                        }
                      </Typography>

                      <Typography
                        variant="body2"
                        sx={{
                          mt: 0.5,
                          color:
                            colors.muted,
                        }}
                      >
                        {
                          currentText.firstMessage
                        }
                      </Typography>
                    </Box>
                  </Box>
                ) : (
                  messages.map(
                    (item, index) => {
                      const isMine =
                        item.sender_id ===
                        currentUser.id;

                      return (
                        <Box
                          key={item.id}
                        >
                          {/* التاريخ */}

                          {shouldShowDate(
                            index
                          ) && (
                            <Box
                              sx={{
                                display:
                                  "flex",

                                alignItems:
                                  "center",

                                gap: 1.5,

                                my: 2,
                              }}
                            >
                              <Divider
                                sx={{
                                  flex: 1,
                                  borderColor:
                                    colors.border,
                                }}
                              />

                              <Typography
                                variant="caption"
                                sx={{
                                  px: 1.5,
                                  py: 0.5,

                                  borderRadius:
                                    "20px",

                                  backgroundColor:
                                    isDark
                                      ? "#273449"
                                      : "#EAF0F2",

                                  color:
                                    colors.muted,

                                  fontWeight:
                                    700,

                                  whiteSpace:
                                    "nowrap",
                                }}
                              >
                                {formatDate(
                                  item.created_at
                                )}
                              </Typography>

                              <Divider
                                sx={{
                                  flex: 1,
                                  borderColor:
                                    colors.border,
                                }}
                              />
                            </Box>
                          )}

                          {/* الرسالة */}

                          <Box
                            sx={{
                              display:
                                "flex",

                              justifyContent:
                                isMine
                                  ? "flex-end"
                                  : "flex-start",

                              mb: 0.8,
                            }}
                          >
                            <Box
                              sx={{
                                maxWidth: {
                                  xs: "88%",
                                  sm: "72%",
                                  md: "65%",
                                },
                              }}
                            >
                              <Paper
                                elevation={
                                  0
                                }
                                sx={{
                                  p: 1.4,
                                  px: 1.8,

                                  borderRadius:
                                    isMine
                                      ? "18px 18px 5px 18px"
                                      : "18px 18px 18px 5px",

                                  backgroundColor:
                                    isMine
                                      ? colors.primary
                                      : colors.card,

                                  color:
                                    isMine
                                      ? isDark
                                        ? colors.background
                                        : "#FFFFFF"
                                      : colors.text,

                                  border:
                                    isMine
                                      ? "none"
                                      : `1px solid ${colors.border}`,

                                  boxShadow:
                                    isMine
                                      ? "none"
                                      : isDark
                                      ? "0 2px 8px rgba(0,0,0,0.12)"
                                      : "0 2px 8px rgba(15,23,42,0.05)",
                                }}
                              >
                                <Typography
                                  sx={{
                                    whiteSpace:
                                      "pre-wrap",

                                    wordBreak:
                                      "break-word",

                                    lineHeight:
                                      1.55,

                                    fontSize:
                                      {
                                        xs: 13,
                                        sm: 14,
                                      },
                                  }}
                                >
                                  {
                                    item.message
                                  }
                                </Typography>

                                {/* وقت الرسالة */}

                                <Typography
                                  variant="caption"
                                  sx={{
                                    display:
                                      "block",

                                    textAlign:
                                      "right",

                                    mt: 0.7,

                                    fontSize:
                                      10,

                                    color:
                                      isMine
                                        ? isDark
                                          ? "rgba(15,23,42,0.70)"
                                          : "rgba(255,255,255,0.80)"
                                        : colors.muted,
                                  }}
                                >
                                  {formatTime(
                                    item.created_at
                                  )}
                                </Typography>
                              </Paper>

                              {/* أزرار التعديل والحذف */}

                              {isMine && (
                                <Box
                                  sx={{
                                    display:
                                      "flex",

                                    justifyContent:
                                      "flex-end",

                                    gap: 0.3,

                                    mt: 0.2,
                                  }}
                                >
                                  <IconButton
                                    size="small"
                                    onClick={() =>
                                      openEdit(
                                        item
                                      )
                                    }
                                    sx={{
                                      width: 30,
                                      height: 30,

                                      color:
                                        colors.primary,

                                      "&:hover":
                                        {
                                          backgroundColor:
                                            isDark
                                              ? "rgba(128,203,196,0.10)"
                                              : "rgba(0,137,123,0.08)",
                                        },
                                    }}
                                  >
                                    <EditIcon
                                      sx={{
                                        fontSize: 17,
                                      }}
                                    />
                                  </IconButton>

                                  <IconButton
                                    size="small"
                                    onClick={() =>
                                      openDelete(
                                        item.id
                                      )
                                    }
                                    sx={{
                                      width: 30,
                                      height: 30,

                                      color:
                                        colors.delete,

                                      "&:hover":
                                        {
                                          backgroundColor:
                                            "rgba(239,83,80,0.08)",
                                        },
                                    }}
                                  >
                                    <DeleteIcon
                                      sx={{
                                        fontSize: 17,
                                      }}
                                    />
                                  </IconButton>
                                </Box>
                              )}
                            </Box>
                          </Box>
                        </Box>
                      );
                    }
                  )
                )}
              </Box>

              {/* ==========================================
                  كتابة وإرسال الرسالة
              ========================================== */}

              <Box
                sx={{
                  p: {
                    xs: 1,
                    sm: 1.5,
                  },

                  backgroundColor:
                    colors.card,

                  borderTop:
                    `1px solid ${colors.border}`,

                  display: "flex",

                  alignItems:
                    "center",

                  gap: 1,
                }}
              >
                <TextField
                  fullWidth
                  multiline
                  maxRows={4}
                  value={message}
                  onChange={(event) =>
                    setMessage(
                      event.target.value
                    )
                  }
                  onKeyDown={
                    handleKeyDown
                  }
                  placeholder={
                    currentText.writeMessage
                  }
                  size="small"
                  sx={{
                    "& .MuiOutlinedInput-root":
                      {
                        borderRadius:
                          "14px",

                        backgroundColor:
                          colors.field,

                        "& fieldset": {
                          borderColor:
                            colors.border,
                        },

                        "&:hover fieldset":
                          {
                            borderColor:
                              colors.primary,
                          },

                        "&.Mui-focused fieldset":
                          {
                            borderColor:
                              colors.primary,
                          },
                      },

                    "& .MuiInputBase-input":
                      {
                        color:
                          colors.text,

                        fontSize: {
                          xs: 13,
                          sm: 14,
                        },
                      },

                    "& .MuiInputBase-input::placeholder":
                      {
                        color:
                          colors.muted,

                        opacity: 1,
                      },
                  }}
                />

                <Button
                  variant="contained"
                  onClick={
                    sendMessage
                  }
                  disabled={
                    !message.trim()
                  }
                  sx={{
                    minWidth: {
                      xs: 44,
                      sm: 90,
                    },

                    width: {
                      xs: 44,
                      sm: "auto",
                    },

                    height: 44,

                    borderRadius:
                      "13px",

                    textTransform:
                      "none",

                    fontWeight:
                      "bold",

                    backgroundColor:
                      colors.primary,

                    color: isDark
                      ? colors.background
                      : "#FFFFFF",

                    boxShadow:
                      "none",

                    "&:hover": {
                      backgroundColor:
                        isDark
                          ? "#6DB8B1"
                          : "#00796B",

                      boxShadow:
                        "none",
                    },

                    "&.Mui-disabled":
                      {
                        backgroundColor:
                          isDark
                            ? "#334155"
                            : "#DCE3E8",

                        color: isDark
                          ? "#64748B"
                          : "#90A4AE",
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
                    {currentText.send}
                  </Box>
                </Button>
              </Box>
            </>
          )}
        </Box>
      </Paper>

      {/* ==========================================
          نافذة تعديل الرسالة
      ========================================== */}

      <Dialog
        open={editOpen}
        onClose={closeEdit}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            backgroundColor:
              colors.card,

            color: colors.text,

            border:
              `1px solid ${colors.border}`,

            borderRadius:
              "20px",
          },
        }}
      >
        <DialogTitle
          sx={{
            color: colors.text,
            fontWeight: 800,
          }}
        >
          {currentText.editMessage}
        </DialogTitle>

        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            multiline
            minRows={3}
            value={editMessage}
            onChange={(event) =>
              setEditMessage(
                event.target.value
              )
            }
            sx={{
              mt: 1,

              "& .MuiOutlinedInput-root":
                {
                  borderRadius:
                    "14px",

                  backgroundColor:
                    colors.field,

                  "& fieldset": {
                    borderColor:
                      colors.border,
                  },

                  "&:hover fieldset":
                    {
                      borderColor:
                        colors.primary,
                    },

                  "&.Mui-focused fieldset":
                    {
                      borderColor:
                        colors.primary,
                    },
                },

              "& .MuiInputBase-input":
                {
                  color:
                    colors.text,
                },
            }}
          />
        </DialogContent>

        <DialogActions
          sx={{
            px: 3,
            pb: 2.5,
            gap: 1,
          }}
        >
          <Button
            onClick={closeEdit}
            sx={{
              textTransform:
                "none",

              color:
                colors.muted,

              borderRadius:
                "10px",

              "&:hover": {
                backgroundColor:
                  colors.hover,
              },
            }}
          >
            {currentText.cancel}
          </Button>

          <Button
            variant="contained"
            onClick={
              updateMessage
            }
            disabled={
              !editMessage.trim()
            }
            sx={{
              textTransform:
                "none",

              borderRadius:
                "10px",

              backgroundColor:
                colors.primary,

              color: isDark
                ? colors.background
                : "#FFFFFF",

              "&:hover": {
                backgroundColor:
                  isDark
                    ? "#6DB8B1"
                    : "#00796B",
              },
            }}
          >
            {currentText.save}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ==========================================
          نافذة تأكيد حذف الرسالة
      ========================================== */}

      <Dialog
        open={deleteOpen}
        onClose={closeDelete}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            backgroundColor:
              colors.card,

            color: colors.text,

            border:
              `1px solid ${colors.border}`,

            borderRadius:
              "20px",
          },
        }}
      >
        <DialogTitle
          sx={{
            color: colors.text,
            fontWeight: 800,
          }}
        >
          {currentText.deleteMessage}
        </DialogTitle>

        <DialogContent>
          <Typography
            sx={{
              color: colors.muted,
              lineHeight: 1.7,
            }}
          >
            {
              currentText.deleteConfirmation
            }
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
              textTransform:
                "none",

              color:
                colors.muted,

              borderRadius:
                "10px",

              "&:hover": {
                backgroundColor:
                  colors.hover,
              },
            }}
          >
            {currentText.cancel}
          </Button>

          <Button
            variant="contained"
            onClick={
              confirmDelete
            }
            sx={{
              textTransform:
                "none",

              borderRadius:
                "10px",

              backgroundColor:
                colors.delete,

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

