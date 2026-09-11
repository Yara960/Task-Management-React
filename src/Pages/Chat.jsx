// استيراد React Hooks
import { useEffect, useState } from "react";

// استيراد Supabase
import { supabase } from "../supabaseClient";

// استيراد مكونات Material UI
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

// استيراد الأيقونات
import SendIcon from "@mui/icons-material/Send";
import SearchIcon from "@mui/icons-material/Search";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import NotificationsIcon from "@mui/icons-material/Notifications";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";

// استيراد ThemeContext
import { useAppTheme } from "../ThemeContext";


export default function Chat() {
  // جلب اللغة والوضع الليلي
  const { darkMode, language } = useAppTheme();

  // المستخدم الحالي
  const [currentUser, setCurrentUser] = useState(null);

  // قائمة المستخدمين
  const [users, setUsers] = useState([]);

  // المستخدم الذي تم اختياره للمحادثة
  const [selectedUser, setSelectedUser] = useState(null);

  // الرسالة الحالية
  const [message, setMessage] = useState("");

  // رسائل المحادثة
  const [messages, setMessages] = useState([]);

  // البحث عن مستخدم
  const [search, setSearch] = useState("");

  // حالة التحميل
  const [loading, setLoading] = useState(true);

  // هل نحن في شاشة المحادثة في الجوال؟
  const [mobileChatOpen, setMobileChatOpen] = useState(false);

  // الرسالة التي سيتم تعديلها
  const [editingMessage, setEditingMessage] = useState(null);

  // قيمة تعديل الرسالة
  const [editText, setEditText] = useState("");

  // فتح Dialog التعديل
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  // الرسالة التي سيتم حذفها
  const [deletingMessage, setDeletingMessage] = useState(null);

  // فتح Dialog الحذف
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // عدد الرسائل غير المقروءة لكل مستخدم
  const [unreadCounts, setUnreadCounts] = useState({});

  // إشعار داخل التطبيق
  const [notificationOpen, setNotificationOpen] = useState(false);

  // نص الإشعار
  const [notificationMessage, setNotificationMessage] = useState("");

  // قائمة الإشعارات
  const [notifications, setNotifications] = useState([]);

  // فتح قائمة الإشعارات
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);

  // النصوص العربية والإنجليزية
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
      noNotifications: "لا توجد إشعارات جديدة",
      notifications: "الإشعارات",
      newMessage: "رسالة جديدة",
      messageDeleted: "تم حذف الرسالة",
      messageUpdated: "تم تعديل الرسالة",
      error: "حدث خطأ",
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
      noNotifications: "No new notifications",
      notifications: "Notifications",
      newMessage: "New message",
      messageDeleted: "Message deleted",
      messageUpdated: "Message updated",
      error: "An error occurred",
    },
  };

  const t = text[language] || text.en;


  // --------------------------------------------------
  // جلب المستخدم الحالي والمستخدمين
  // --------------------------------------------------

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

      // جلب جميع المستخدمين ما عدا المستخدم الحالي
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .neq("id", user.id)
        .order("display_name", { ascending: true });

      if (error) {
        console.error("Error fetching users:", error);
      } else {
        setUsers(data || []);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }


  // --------------------------------------------------
  // جلب الرسائل عند اختيار مستخدم
  // --------------------------------------------------

  useEffect(() => {
    if (!currentUser || !selectedUser) return;

    getMessages();

    // عند فتح المحادثة نعتبر رسائل هذا المستخدم مقروءة
    setUnreadCounts((prev) => ({
      ...prev,
      [selectedUser.id]: 0,
    }));

    // حذف إشعارات هذا المستخدم من القائمة
    setNotifications((prev) =>
      prev.filter((item) => item.senderId !== selectedUser.id)
    );
  }, [currentUser, selectedUser]);


  async function getMessages() {
    if (!currentUser || !selectedUser) return;

    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .or(
        `and(sender_id.eq.${currentUser.id},receiver_id.eq.${selectedUser.id}),and(sender_id.eq.${selectedUser.id},receiver_id.eq.${currentUser.id})`
      )
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching messages:", error);
      return;
    }

    setMessages(data || []);
  }


  // --------------------------------------------------
  // Realtime للرسائل
  // --------------------------------------------------

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

          // إذا كانت الرسالة مرسلة من المستخدم الحالي
          if (newMessage.sender_id === currentUser.id) {
            return;
          }

          // جلب بيانات المرسل
          const { data: sender } = await supabase
            .from("profiles")
            .select("display_name, name, avatar_url, avatar")
            .eq("id", newMessage.sender_id)
            .single();

          const senderName =
            sender?.display_name ||
            sender?.name ||
            "User";

          // إذا كانت المحادثة المفتوحة هي نفس المرسل
          if (
            selectedUser &&
            selectedUser.id === newMessage.sender_id
          ) {
            setMessages((prev) => [...prev, newMessage]);

            // تعتبر مقروءة
            setUnreadCounts((prev) => ({
              ...prev,
              [newMessage.sender_id]: 0,
            }));

            return;
          }

          // زيادة عدد الرسائل غير المقروءة
          setUnreadCounts((prev) => ({
            ...prev,
            [newMessage.sender_id]:
              (prev[newMessage.sender_id] || 0) + 1,
          }));

          // إضافة الإشعار إلى القائمة
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

          // إظهار Snackbar
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


  // --------------------------------------------------
  // إرسال رسالة
  // --------------------------------------------------

  async function sendMessage() {
    if (!message.trim() || !currentUser || !selectedUser) {
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
      console.error("Error sending message:", error);
      return;
    }

    setMessages((prev) => [...prev, data]);
    setMessage("");
  }


  // --------------------------------------------------
  // تعديل الرسالة
  // --------------------------------------------------

  function openEditDialog(msg) {
    setEditingMessage(msg);
    setEditText(msg.message);
    setEditDialogOpen(true);
  }


  async function updateMessage() {
    if (!editingMessage || !editText.trim()) {
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
      console.error("Error updating message:", error);
      return;
    }

    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === editingMessage.id
          ? { ...msg, message: editText.trim() }
          : msg
      )
    );

    setEditDialogOpen(false);
    setEditingMessage(null);
    setEditText("");

    setNotificationMessage(t.messageUpdated);
    setNotificationOpen(true);
  }


  // --------------------------------------------------
  // حذف الرسالة
  // --------------------------------------------------

  function openDeleteDialog(msg) {
    setDeletingMessage(msg);
    setDeleteDialogOpen(true);
  }


  async function deleteMessage() {
    if (!deletingMessage) return;

    const { error } = await supabase
      .from("messages")
      .delete()
      .eq("id", deletingMessage.id)
      .eq("sender_id", currentUser.id);

    if (error) {
      console.error("Error deleting message:", error);
      return;
    }

    setMessages((prev) =>
      prev.filter((msg) => msg.id !== deletingMessage.id)
    );

    setDeleteDialogOpen(false);
    setDeletingMessage(null);

    setNotificationMessage(t.messageDeleted);
    setNotificationOpen(true);
  }


  // --------------------------------------------------
  // البحث عن المستخدمين
  // --------------------------------------------------

  const filteredUsers = users.filter((user) => {
    const name =
      user.display_name ||
      user.name ||
      user.email ||
      "";

    return name
      .toLowerCase()
      .includes(search.toLowerCase());
  });


  // --------------------------------------------------
  // حساب مجموع الرسائل غير المقروءة
  // --------------------------------------------------

  const totalUnread = Object.values(unreadCounts).reduce(
    (total, count) => total + count,
    0
  );


  // --------------------------------------------------
  // فتح الإشعارات
  // --------------------------------------------------

  function handleNotificationClick(event) {
    setNotificationAnchorEl(event.currentTarget);
  }


  // --------------------------------------------------
  // إغلاق الإشعارات
  // --------------------------------------------------

  function handleNotificationClose() {
    setNotificationAnchorEl(null);
  }


  // --------------------------------------------------
  // الضغط على إشعار
  // --------------------------------------------------

  function openNotification(notification) {
    const user = users.find(
      (item) => item.id === notification.senderId
    );

    if (user) {
      setSelectedUser(user);
      setMobileChatOpen(true);
    }

    setUnreadCounts((prev) => ({
      ...prev,
      [notification.senderId]: 0,
    }));

    setNotifications((prev) =>
      prev.filter(
        (item) => item.id !== notification.id
      )
    );

    handleNotificationClose();
  }


  // --------------------------------------------------
  // إغلاق Snackbar
  // --------------------------------------------------

  function closeNotification() {
    setNotificationOpen(false);
  }


  // --------------------------------------------------
  // شاشة التحميل
  // --------------------------------------------------

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


  // --------------------------------------------------
  // الواجهة
  // --------------------------------------------------

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
        direction: language === "ar" ? "rtl" : "ltr",
        p: { xs: 1, md: 2 },
      }}
    >

      {/* ==========================================
          قائمة المستخدمين
      ========================================== */}

      <Paper
        elevation={darkMode ? 4 : 1}
        sx={{
          width: { xs: "100%", md: 320 },
          display:
            mobileChatOpen ? { xs: "none", md: "flex" } : "flex",
          flexDirection: "column",
          overflow: "hidden",
          borderRadius: 3,
        }}
      >

        {/* رأس قائمة المحادثات */}
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

          {/* زر الإشعارات */}
          <IconButton
            onClick={handleNotificationClick}
            aria-label={t.notifications}
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
          anchorEl={notificationAnchorEl}
          open={Boolean(notificationAnchorEl)}
          onClose={handleNotificationClose}
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
              width: { xs: 300, sm: 360 },
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
            notifications.map((notification) => (
              <MenuItem
                key={notification.id}
                onClick={() =>
                  openNotification(notification)
                }
                sx={{
                  display: "flex",
                  gap: 1.5,
                  alignItems: "flex-start",
                  whiteSpace: "normal",
                  py: 1.5,
                }}
              >

                <Avatar
                  src={notification.avatar || undefined}
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

                <Box sx={{ minWidth: 0 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: "bold",
                    }}
                  >
                    {notification.senderName}
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                    }}
                  >
                    {notification.message}
                  </Typography>
                </Box>

              </MenuItem>
            ))
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
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <SearchIcon
                  sx={{
                    mr: language === "ar" ? 0 : 1,
                    ml: language === "ar" ? 1 : 0,
                  }}
                />
              ),
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
          {filteredUsers.map((user) => {

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
              unreadCounts[user.id] || 0;

            return (
              <ListItemButton
                key={user.id}
                selected={
                  selectedUser?.id === user.id
                }
                onClick={() => {
                  setSelectedUser(user);
                  setMobileChatOpen(true);
                }}
                sx={{
                  py: 1.5,
                  px: 2,
                }}
              >

                <Avatar
                  src={avatar || undefined}
                  sx={{
                    width: 42,
                    height: 42,
                    mr: language === "ar" ? 0 : 1.5,
                    ml: language === "ar" ? 1.5 : 0,
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
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {userName}
                  </Typography>
                </Box>

                {unread > 0 && (
                  <Badge
                    badgeContent={unread}
                    color="error"
                    max={99}
                  />
                )}

              </ListItemButton>
            );
          })}
        </List>

      </Paper>


      {/* ==========================================
          شاشة المحادثة
      ========================================== */}

      <Paper
        elevation={darkMode ? 4 : 1}
        sx={{
          flex: 1,
          display:
            !mobileChatOpen
              ? { xs: "none", md: "flex" }
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
                borderBottom: "1px solid",
                borderColor: "divider",
              }}
            >

              {/* زر الرجوع في الجوال */}
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
                }}
              >
                {selectedUser.display_name ||
                  selectedUser.name ||
                  selectedUser.email}
              </Typography>

            </Box>


            {/* الرسائل */}
            <Box
              sx={{
                flex: 1,
                overflowY: "auto",
                p: { xs: 1, md: 2 },
                display: "flex",
                flexDirection: "column",
                gap: 1,
              }}
            >

              {messages.map((msg) => {

                const isMine =
                  msg.sender_id === currentUser.id;

                return (
                  <Box
                    key={msg.id}
                    sx={{
                      display: "flex",
                      justifyContent: isMine
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
                          whiteSpace: "pre-wrap",
                          wordBreak: "break-word",
                        }}
                      >
                        {msg.message}
                      </Typography>


                      {/* أزرار التعديل والحذف للرسائل الخاصة بالمستخدم */}
                      {isMine && (
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "flex-end",
                            mt: 0.5,
                            gap: 0.5,
                          }}
                        >

                          <IconButton
                            size="small"
                            onClick={() =>
                              openEditDialog(msg)
                            }
                            sx={{
                              color:
                                "inherit",
                            }}
                          >
                            <EditIcon
                              fontSize="small"
                            />
                          </IconButton>


                          <IconButton
                            size="small"
                            onClick={() =>
                              openDeleteDialog(msg)
                            }
                            sx={{
                              color:
                                "inherit",
                            }}
                          >
                            <DeleteIcon
                              fontSize="small"
                            />
                          </IconButton>

                        </Box>
                      )}

                    </Box>

                  </Box>
                );
              })}

            </Box>


            {/* إدخال الرسالة */}
            <Box
              sx={{
                p: 1.5,
                borderTop: "1px solid",
                borderColor: "divider",
                display: "flex",
                gap: 1,
                alignItems: "center",
              }}
            >

              <TextField
                fullWidth
                size="small"
                placeholder={t.typeMessage}
                value={message}
                onChange={(e) =>
                  setMessage(e.target.value)
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
                onClick={sendMessage}
                disabled={!message.trim()}
                sx={{
                  minWidth: {
                    xs: 48,
                    sm: 100,
                  },
                  height: 40,
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

                <Typography
                  sx={{
                    display: {
                      xs: "none",
                      sm: "block",
                    },
                  }}
                >
                  {t.send}
                </Typography>

              </Button>

            </Box>

          </>
        ) : (

          // لا يوجد مستخدم محدد
          <Box
            sx={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              p: 3,
            }}
          >
            <Typography
              color="text.secondary"
              textAlign="center"
            >
              {t.selectUser}
            </Typography>
          </Box>

        )}

      </Paper>


      {/* ==========================================
          Snackbar للإشعارات داخل التطبيق
      ========================================== */}

      <Snackbar
        open={notificationOpen}
        autoHideDuration={4000}
        onClose={closeNotification}
        anchorOrigin={{
          vertical: "top",
          horizontal:
            language === "ar"
              ? "left"
              : "right",
        }}
      >
        <Alert
          onClose={closeNotification}
          severity="info"
          variant="filled"
          sx={{
            width: "100%",
          }}
        >
          {notificationMessage}
        </Alert>
      </Snackbar>


      {/* ==========================================
          Dialog تعديل الرسالة
      ========================================== */}

      {editDialogOpen && (
        <Box
          sx={{
            position: "fixed",
            inset: 0,
            zIndex: 1300,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "rgba(0,0,0,0.5)",
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
                mb: 2,
                fontWeight: "bold",
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
                setEditText(e.target.value)
              }
            />


            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 1,
                mt: 2,
              }}
            >

              <Button
                onClick={() => {
                  setEditDialogOpen(false);
                  setEditingMessage(null);
                  setEditText("");
                }}
              >
                {t.cancel}
              </Button>


              <Button
                variant="contained"
                onClick={updateMessage}
                disabled={!editText.trim()}
              >
                {t.save}
              </Button>

            </Box>

          </Paper>

        </Box>
      )}


      {/* ==========================================
          Dialog حذف الرسالة
      ========================================== */}

      {deleteDialogOpen && (
        <Box
          sx={{
            position: "fixed",
            inset: 0,
            zIndex: 1300,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "rgba(0,0,0,0.5)",
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
                mb: 2,
                fontWeight: "bold",
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
                justifyContent: "flex-end",
                gap: 1,
              }}
            >

              <Button
                onClick={() => {
                  setDeleteDialogOpen(false);
                  setDeletingMessage(null);
                }}
              >
                {t.cancel}
              </Button>


              <Button
                variant="contained"
                color="error"
                onClick={deleteMessage}
              >
                {t.delete}
              </Button>

            </Box>

          </Paper>

        </Box>
      )}

    </Box>
  );
}