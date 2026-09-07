import { useState, useEffect } from "react";

// استيراد Supabase
import { supabase } from "../supabaseClient";

// استيراد Material UI
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";

// استيراد الأيقونات
import SendIcon from "@mui/icons-material/Send";
import ChatIcon from "@mui/icons-material/Chat";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";

function Chat() {
  // النص الذي يكتبه المستخدم
  const [message, setMessage] = useState("");

  // قائمة الرسائل
  const [messages, setMessages] = useState([]);

  // المستخدم الحالي
  const [currentUser, setCurrentUser] = useState(null);

  // رقم الرسالة التي يتم تعديلها
  const [editingId, setEditingId] = useState(null);

  // النص أثناء التعديل
  const [editMessage, setEditMessage] = useState("");

  // ==========================================
  // جلب المستخدم الحالي
  // ==========================================

  async function getCurrentUser() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    setCurrentUser(user);
  }

  // ==========================================
  // جلب الرسائل من Supabase
  // ==========================================

  async function getMessages() {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .order("created_at", {
        ascending: true,
      });

    if (error) {
      console.log("Get messages error:", error);
      return;
    }

    setMessages(data || []);
  }

  // ==========================================
  // تشغيل جلب البيانات عند فتح الصفحة
  // ==========================================

  useEffect(() => {
    getCurrentUser();
    getMessages();
  }, []);

  // ==========================================
  // إرسال رسالة
  // ==========================================

  async function sendMessage() {
    // التأكد أن الرسالة ليست فارغة
    if (!message.trim()) {
      return;
    }

    // جلب المستخدم الحالي
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // التأكد أن المستخدم مسجل دخول
    if (!user) {
      return;
    }

    // إضافة الرسالة إلى Supabase
    const { error } = await supabase
      .from("messages")
      .insert([
        {
          sender_id: user.id,
          message: message.trim(),
        },
      ]);

    // التحقق من وجود خطأ
    if (error) {
      console.log("Send message error:", error);
      return;
    }

    // تنظيف خانة الكتابة
    setMessage("");

    // تحديث الرسائل
    getMessages();
  }

  // ==========================================
  // بدء تعديل الرسالة
  // ==========================================

  function startEdit(item) {
    setEditingId(item.id);
    setEditMessage(item.message);
  }

  // ==========================================
  // إلغاء التعديل
  // ==========================================

  function cancelEdit() {
    setEditingId(null);
    setEditMessage("");
  }

  // ==========================================
  // حفظ تعديل الرسالة
  // ==========================================

  async function updateMessage(id) {
    // التأكد أن الرسالة ليست فارغة
    if (!editMessage.trim()) {
      return;
    }

    // التأكد من وجود المستخدم
    if (!currentUser) {
      return;
    }

    // تحديث الرسالة في Supabase
    const { error } = await supabase
      .from("messages")
      .update({
        message: editMessage.trim(),
      })
      .eq("id", id)
      .eq("sender_id", currentUser.id);

    // التحقق من وجود خطأ
    if (error) {
      console.log("Update message error:", error);
      return;
    }

    // تحديث الرسالة في الصفحة مباشرة
    setMessages((prevMessages) =>
      prevMessages.map((item) =>
        item.id === id
          ? {
              ...item,
              message: editMessage.trim(),
            }
          : item
      )
    );

    // إغلاق وضع التعديل
    setEditingId(null);
    setEditMessage("");
  }

  // ==========================================
  // حذف الرسالة
  // ==========================================

  async function deleteMessage(id) {
    // التأكد من وجود المستخدم
    if (!currentUser) {
      return;
    }

    // حذف الرسالة من Supabase
    const { error } = await supabase
      .from("messages")
      .delete()
      .eq("id", id)
      .eq("sender_id", currentUser.id);

    // التحقق من وجود خطأ
    if (error) {
      console.log("Delete message error:", error);
      return;
    }

    // حذف الرسالة من الشاشة
    setMessages((prevMessages) =>
      prevMessages.filter((item) => item.id !== id)
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#F5F7FA",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* محتوى الدردشة */}
      <Box
        sx={{
          width: "100%",
          maxWidth: "900px",
          margin: "0 auto",
          padding: {
            xs: "25px 16px",
            sm: "40px 25px",
          },
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* عنوان الصفحة */}
        <Box
          sx={{
            marginBottom: "25px",
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
            Chat
          </Typography>

          <Typography
            sx={{
              color: "#78909C",
              fontSize: "15px",
            }}
          >
            Send and receive messages.
          </Typography>
        </Box>

        {/* صندوق الدردشة */}
        <Paper
          elevation={0}
          sx={{
            flex: 1,
            minHeight: "500px",
            borderRadius: "18px",
            backgroundColor: "#FFFFFF",
            border: "1px solid #E8ECEF",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {/* رأس الدردشة */}
          <Box
            sx={{
              padding: "18px 20px",
              borderBottom: "1px solid #E8ECEF",
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <Box
              sx={{
                width: "42px",
                height: "42px",
                borderRadius: "12px",
                backgroundColor: "#E0F2F1",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ChatIcon
                sx={{
                  color: "#00897B",
                }}
              />
            </Box>

            <Box>
              <Typography
                sx={{
                  fontWeight: "bold",
                  color: "#263238",
                }}
              >
                Messages
              </Typography>

              <Typography
                sx={{
                  color: "#90A4AE",
                  fontSize: "12px",
                }}
              >
                Start a conversation
              </Typography>
            </Box>
          </Box>

          {/* الرسائل */}
          <Box
            sx={{
              flex: 1,
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              overflowY: "auto",
            }}
          >
            {messages.length === 0 ? (
              <Box
                sx={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ChatIcon
                  sx={{
                    fontSize: "55px",
                    color: "#B0BEC5",
                    marginBottom: "10px",
                  }}
                />

                <Typography
                  sx={{
                    fontWeight: "bold",
                    color: "#607D8B",
                    fontSize: "18px",
                  }}
                >
                  No messages yet
                </Typography>

                <Typography
                  sx={{
                    color: "#90A4AE",
                    fontSize: "14px",
                    marginTop: "5px",
                  }}
                >
                  Send your first message.
                </Typography>
              </Box>
            ) : (
              messages.map((item) => {
                // التحقق أن الرسالة تخص المستخدم الحالي
                const isMyMessage =
                  currentUser &&
                  item.sender_id === currentUser.id;

                return (
                  <Box
                    key={item.id}
                    sx={{
                      display: "flex",
                      justifyContent: isMyMessage
                        ? "flex-end"
                        : "flex-start",
                    }}
                  >
                    <Box
                      sx={{
                        maxWidth: "70%",
                      }}
                    >
                      {editingId === item.id ? (
                        /* خانة تعديل الرسالة */
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: "5px",
                          }}
                        >
                          <TextField
                            size="small"
                            value={editMessage}
                            onChange={(e) =>
                              setEditMessage(e.target.value)
                            }
                            autoFocus
                            sx={{
                              backgroundColor: "#FFFFFF",
                              "& .MuiOutlinedInput-root": {
                                borderRadius: "10px",
                                "&.Mui-focused fieldset": {
                                  borderColor: "#00897B",
                                },
                              },
                            }}
                          />

                          {/* زر حفظ التعديل */}
                          <IconButton
                            onClick={() =>
                              updateMessage(item.id)
                            }
                            sx={{
                              color: "#00897B",
                            }}
                          >
                            <CheckIcon />
                          </IconButton>

                          {/* زر إلغاء التعديل */}
                          <IconButton
                            onClick={cancelEdit}
                            sx={{
                              color: "#78909C",
                            }}
                          >
                            <CloseIcon />
                          </IconButton>
                        </Box>
                      ) : (
                        <>
                          {/* الرسالة */}
                          <Box
                            sx={{
                              backgroundColor: isMyMessage
                                ? "#00897B"
                                : "#ECEFF1",
                              color: isMyMessage
                                ? "#FFFFFF"
                                : "#263238",
                              padding: "10px 15px",
                              borderRadius: isMyMessage
                                ? "15px 15px 4px 15px"
                                : "15px 15px 15px 4px",
                            }}
                          >
                            <Typography
                              sx={{
                                fontSize: "15px",
                                wordBreak: "break-word",
                              }}
                            >
                              {item.message}
                            </Typography>
                          </Box>

                          {/* أزرار التعديل والحذف لرسائلي فقط */}
                          {isMyMessage && (
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "flex-end",
                                gap: "2px",
                                marginTop: "2px",
                              }}
                            >
                              {/* زر التعديل */}
                              <IconButton
                                size="small"
                                onClick={() =>
                                  startEdit(item)
                                }
                                sx={{
                                  color: "#78909C",
                                }}
                              >
                                <EditIcon
                                  sx={{
                                    fontSize: "17px",
                                  }}
                                />
                              </IconButton>

                              {/* زر الحذف */}
                              <IconButton
                                size="small"
                                onClick={() =>
                                  deleteMessage(item.id)
                                }
                                sx={{
                                  color: "#78909C",
                                }}
                              >
                                <DeleteIcon
                                  sx={{
                                    fontSize: "17px",
                                  }}
                                />
                              </IconButton>
                            </Box>
                          )}
                        </>
                      )}
                    </Box>
                  </Box>
                );
              })
            )}
          </Box>

          {/* كتابة الرسالة */}
          <Box
            sx={{
              padding: "15px",
              borderTop: "1px solid #E8ECEF",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <TextField
              fullWidth
              placeholder="Write a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  sendMessage();
                }
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",

                  "&:hover fieldset": {
                    borderColor: "#00897B",
                  },

                  "&.Mui-focused fieldset": {
                    borderColor: "#00897B",
                  },
                },
              }}
            />

            {/* زر الإرسال */}
            <IconButton
              onClick={sendMessage}
              sx={{
                width: "50px",
                height: "50px",
                backgroundColor: "#00897B",
                color: "#FFFFFF",

                "&:hover": {
                  backgroundColor: "#00695C",
                },
              }}
            >
              <SendIcon />
            </IconButton>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}

export default Chat;