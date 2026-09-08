import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

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

  // الألوان المستخدمة في جميع الصفحات
  const colors = {
    background: "#0F172A",
    card: "#1E293B",
    field: "#273449",
    border: "#334155",
    primary: "#80CBC4",
    secondary: "#F48FB1",
    text: "#FFFFFF",
    muted: "#94A3B8",
    delete: "#EF5350",
  };

  // جلب المستخدم الحالي
  useEffect(() => {
    getCurrentUser();
  }, []);

  // جلب المستخدمين
  useEffect(() => {
    if (currentUser) {
      getUsers();
    }
  }, [currentUser]);

  // جلب الرسائل عند اختيار مستخدم
  useEffect(() => {
    if (currentUser && selectedUser) {
      getMessages(selectedUser);
    }
  }, [currentUser, selectedUser]);

  // Realtime للمحادثة
  useEffect(() => {
    if (!currentUser || !selectedUser) return;

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

  // معرفة المستخدم الحالي
  async function getCurrentUser() {
    const { data, error } = await supabase.auth.getUser();

    if (error) {
      console.error("Error getting user:", error);
      return;
    }

    setCurrentUser(data.user);
  }

  // جلب المستخدمين
  async function getUsers() {
    setLoadingUsers(true);

    const { data, error } = await supabase
      .from("profiles")
      .select("id, display_name, email");

    if (error) {
      console.error("Error getting users:", error);
      setLoadingUsers(false);
      return;
    }

    // عدم إظهار المستخدم الحالي
    const otherUsers = data.filter(
      (user) => user.id !== currentUser.id
    );

    setUsers(otherUsers);
    setLoadingUsers(false);
  }

  // جلب رسائل المحادثة
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
      console.error("Error getting messages:", error);
      setLoadingMessages(false);
      return;
    }

    setMessages(data || []);
    setLoadingMessages(false);
  }

  // إرسال الرسالة
  async function sendMessage() {
    if (!message.trim() || !selectedUser || !currentUser) {
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
      console.error("Error sending message:", error);
      return;
    }

    setMessage("");
  }

  // إرسال بالضغط على Enter
  function handleKeyDown(event) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  }

  // فتح التعديل
  function openEdit(messageItem) {
    setEditId(messageItem.id);
    setEditMessage(messageItem.message);
    setEditOpen(true);
  }

  // إغلاق التعديل
  function closeEdit() {
    setEditOpen(false);
    setEditId(null);
    setEditMessage("");
  }

  // تحديث الرسالة
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
      console.error("Error updating message:", error);
      return;
    }

    closeEdit();
  }

  // فتح نافذة تأكيد الحذف
  function openDelete(messageId) {
    setDeleteId(messageId);
    setDeleteOpen(true);
  }

  // إغلاق نافذة الحذف
  function closeDelete() {
    setDeleteOpen(false);
    setDeleteId(null);
  }

  // حذف الرسالة
  async function confirmDelete() {
    const { error } = await supabase
      .from("messages")
      .delete()
      .eq("id", deleteId)
      .eq("sender_id", currentUser.id);

    if (error) {
      console.error("Error deleting message:", error);
      return;
    }

    closeDelete();
  }

  // الحصول على اسم المستخدم
  function getUserName(user) {
    return (
      user.display_name ||
      user.email ||
      "User"
    );
  }

  // أول حرف من الاسم
  function getInitial(user) {
    return getUserName(user)
      .charAt(0)
      .toUpperCase();
  }

  // البحث عن المستخدمين
  const filteredUsers = users.filter((user) => {
    const name = user.display_name || "";
    const email = user.email || "";

    return (
      name.toLowerCase().includes(search.toLowerCase()) ||
      email.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 64px)",
        p: { xs: 2, md: 4 },
        backgroundColor: colors.background,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          maxWidth: 1200,
          height: { xs: "auto", md: "75vh" },
          minHeight: { xs: 650, md: 600 },
          mx: "auto",
          display: "flex",
          overflow: "hidden",
          borderRadius: 3,
          backgroundColor: colors.card,
          border: `1px solid ${colors.border}`,
        }}
      >
        {/* قائمة المستخدمين */}
        <Box
          sx={{
            width: { xs: "38%", sm: 290 },
            minWidth: { xs: 130, sm: 250 },
            borderRight: `1px solid ${colors.border}`,
            backgroundColor: colors.card,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* عنوان القائمة */}
          <Box
            sx={{
              p: 2,
              backgroundColor: colors.card,
              borderBottom: `1px solid ${colors.border}`,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <ChatIcon
                sx={{
                  color: colors.primary,
                }}
              />

              <Typography
                variant="h6"
                sx={{
                  fontWeight: "bold",
                  color: colors.text,
                }}
              >
                Chats
              </Typography>
            </Box>

            <Typography
              variant="body2"
              sx={{
                mt: 0.5,
                color: colors.muted,
              }}
            >
              Choose a user to chat
            </Typography>
          </Box>

          {/* مربع البحث */}
          <Box
            sx={{
              p: 1.5,
              backgroundColor: colors.card,
            }}
          >
            <TextField
              fullWidth
              size="small"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search users..."
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon
                      sx={{
                        color: colors.muted,
                      }}
                    />
                  </InputAdornment>
                ),

                endAdornment: search && (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={() => setSearch("")}
                      sx={{
                        color: colors.muted,
                      }}
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  backgroundColor: colors.field,

                  "& fieldset": {
                    borderColor: colors.border,
                  },

                  "&:hover fieldset": {
                    borderColor: colors.primary,
                  },

                  "&.Mui-focused fieldset": {
                    borderColor: colors.primary,
                  },
                },

                "& .MuiInputBase-input": {
                  color: colors.text,
                },

                "& .MuiInputBase-input::placeholder": {
                  color: colors.muted,
                  opacity: 1,
                },
              }}
            />
          </Box>

          <Divider
            sx={{
              borderColor: colors.border,
            }}
          />

          {/* قائمة المستخدمين */}
          <List
            sx={{
              p: 0,
              overflowY: "auto",
              flex: 1,
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
                    color: colors.muted,
                  }}
                >
                  Loading users...
                </Typography>
              </Box>
            ) : filteredUsers.length === 0 ? (
              <Box
                sx={{
                  p: 3,
                  textAlign: "center",
                }}
              >
                <PersonIcon
                  sx={{
                    fontSize: 45,
                    color: colors.muted,
                  }}
                />

                <Typography
                  sx={{
                    mt: 1,
                    color: colors.muted,
                  }}
                >
                  {search
                    ? "No users found"
                    : "No users available"}
                </Typography>
              </Box>
            ) : (
              filteredUsers.map((user) => (
                <ListItemButton
                  key={user.id}
                  selected={
                    selectedUser?.id === user.id
                  }
                  onClick={() => setSelectedUser(user)}
                  sx={{
                    py: 1.5,
                    px: 1.5,
                    borderLeft: "3px solid transparent",

                    "&.Mui-selected": {
                      backgroundColor: "#273B46",
                      borderLeft: `3px solid ${colors.primary}`,
                    },

                    "&.Mui-selected:hover": {
                      backgroundColor: "#2B414C",
                    },

                    "&:hover": {
                      backgroundColor: "#243344",
                    },
                  }}
                >
                  <ListItemAvatar>
                    <Avatar
                      sx={{
                        backgroundColor: colors.primary,
                        color: "#0F172A",
                        fontWeight: "bold",
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
                            selectedUser?.id === user.id
                              ? "bold"
                              : "normal",

                          color: colors.text,

                          fontSize: {
                            xs: 13,
                            sm: 15,
                          },

                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {getUserName(user)}
                      </Typography>
                    }
                  />
                </ListItemButton>
              ))
            )}
          </List>
        </Box>

        {/* منطقة المحادثة */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            minWidth: 0,
            backgroundColor: colors.background,
          }}
        >
          {!selectedUser ? (
            // لم يتم اختيار مستخدم
            <Box
              sx={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                p: 3,
                textAlign: "center",
              }}
            >
              <Avatar
                sx={{
                  width: 85,
                  height: 85,
                  mb: 2,
                  backgroundColor: colors.primary,
                  color: colors.background,
                }}
              >
                <ChatIcon sx={{ fontSize: 45 }} />
              </Avatar>

              <Typography
                variant="h5"
                sx={{
                  fontWeight: "bold",
                  color: colors.text,
                }}
              >
                Welcome to Chat
              </Typography>

              <Typography
                sx={{
                  mt: 1,
                  maxWidth: 400,
                  color: colors.muted,
                }}
              >
                Search for a user and select them
                to start a conversation.
              </Typography>
            </Box>
          ) : (
            <>
              {/* Header المحادثة */}
              <Box
                sx={{
                  p: 1.5,
                  px: { xs: 1.5, md: 2.5 },
                  backgroundColor: colors.card,
                  borderBottom:
                    `1px solid ${colors.border}`,
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                }}
              >
                <Avatar
                  sx={{
                    backgroundColor: colors.primary,
                    color: colors.background,
                    fontWeight: "bold",
                  }}
                >
                  {getInitial(selectedUser)}
                </Avatar>

                <Box sx={{ minWidth: 0 }}>
                  <Typography
                    sx={{
                      fontWeight: "bold",
                      color: colors.text,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {getUserName(selectedUser)}
                  </Typography>

                  <Typography
                    variant="caption"
                    sx={{
                      color: colors.muted,
                    }}
                  >
                    Start chatting
                  </Typography>
                </Box>
              </Box>

              {/* الرسائل */}
              <Box
                sx={{
                  flex: 1,
                  overflowY: "auto",
                  p: { xs: 1.5, md: 3 },
                  display: "flex",
                  flexDirection: "column",
                  gap: 1.5,
                }}
              >
                {loadingMessages ? (
                  <Box
                    sx={{
                      flex: 1,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Typography
                      sx={{
                        color: colors.muted,
                      }}
                    >
                      Loading messages...
                    </Typography>
                  </Box>
                ) : messages.length === 0 ? (
                  <Box
                    sx={{
                      flex: 1,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      textAlign: "center",
                    }}
                  >
                    <Box>
                      <ChatIcon
                        sx={{
                          fontSize: 50,
                          color: colors.muted,
                        }}
                      />

                      <Typography
                        sx={{
                          mt: 1,
                          color: colors.muted,
                        }}
                      >
                        No messages yet
                      </Typography>

                      <Typography
                        variant="body2"
                        sx={{
                          color: colors.muted,
                        }}
                      >
                        Send the first message!
                      </Typography>
                    </Box>
                  </Box>
                ) : (
                  messages.map((item) => {
                    const isMine =
                      item.sender_id ===
                      currentUser.id;

                    return (
                      <Box
                        key={item.id}
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
                          }}
                        >
                          <Paper
                            elevation={0}
                            sx={{
                              p: 1.3,
                              px: 1.7,
                              borderRadius: isMine
                                ? "18px 18px 4px 18px"
                                : "18px 18px 18px 4px",

                              backgroundColor:
                                isMine
                                  ? colors.primary
                                  : colors.card,

                              color: isMine
                                ? colors.background
                                : colors.text,

                              border: isMine
                                ? "none"
                                : `1px solid ${colors.border}`,
                            }}
                          >
                            <Typography
                              sx={{
                                whiteSpace: "pre-wrap",
                                wordBreak: "break-word",
                                lineHeight: 1.5,
                              }}
                            >
                              {item.message}
                            </Typography>
                          </Paper>

                          {/* التعديل والحذف لرسائل المستخدم */}
                          {isMine && (
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent:
                                  "flex-end",
                                gap: 0.3,
                                mt: 0.3,
                              }}
                            >
                              {/* زر التعديل */}
                              <IconButton
                                size="small"
                                onClick={() =>
                                  openEdit(item)
                                }
                                sx={{
                                  color: colors.primary,

                                  "&:hover": {
                                    backgroundColor:
                                      "rgba(128,203,196,0.1)",
                                  },
                                }}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>

                              {/* زر الحذف */}
                              <IconButton
                                size="small"
                                onClick={() =>
                                  openDelete(item.id)
                                }
                                sx={{
                                  color: colors.delete,

                                  "&:hover": {
                                    backgroundColor:
                                      "rgba(239,83,80,0.1)",
                                  },
                                }}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Box>
                          )}
                        </Box>
                      </Box>
                    );
                  })
                )}
              </Box>

              {/* كتابة وإرسال الرسالة */}
              <Box
                sx={{
                  p: { xs: 1, md: 1.5 },
                  backgroundColor: colors.card,
                  borderTop:
                    `1px solid ${colors.border}`,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <TextField
                  fullWidth
                  multiline
                  maxRows={4}
                  value={message}
                  onChange={(event) =>
                    setMessage(event.target.value)
                  }
                  onKeyDown={handleKeyDown}
                  placeholder="Write a message..."
                  size="small"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      backgroundColor: colors.field,

                      "& fieldset": {
                        borderColor: colors.border,
                      },

                      "&:hover fieldset": {
                        borderColor: colors.primary,
                      },

                      "&.Mui-focused fieldset": {
                        borderColor: colors.primary,
                      },
                    },

                    "& .MuiInputBase-input": {
                      color: colors.text,
                    },

                    "& .MuiInputBase-input::placeholder": {
                      color: colors.muted,
                      opacity: 1,
                    },
                  }}
                />

                <Button
                  variant="contained"
                  onClick={sendMessage}
                  disabled={!message.trim()}
                  sx={{
                    minWidth: {
                      xs: 45,
                      sm: 90,
                    },

                    height: 42,
                    borderRadius: 2,
                    textTransform: "none",
                    fontWeight: "bold",

                    backgroundColor: colors.primary,
                    color: colors.background,

                    "&:hover": {
                      backgroundColor: "#6DB8B1",
                    },

                    "&.Mui-disabled": {
                      backgroundColor: "#334155",
                      color: "#64748B",
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
                    Send
                  </Box>
                </Button>
              </Box>
            </>
          )}
        </Box>
      </Paper>

      {/* نافذة تعديل الرسالة */}
      <Dialog
        open={editOpen}
        onClose={closeEdit}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            backgroundColor: colors.card,
            color: colors.text,
            border: `1px solid ${colors.border}`,
            borderRadius: 3,
          },
        }}
      >
        <DialogTitle
          sx={{
            color: colors.text,
            fontWeight: "bold",
          }}
        >
          Edit Message
        </DialogTitle>

        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            multiline
            minRows={3}
            value={editMessage}
            onChange={(event) =>
              setEditMessage(event.target.value)
            }
            sx={{
              mt: 1,

              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                backgroundColor: colors.field,

                "& fieldset": {
                  borderColor: colors.border,
                },

                "&:hover fieldset": {
                  borderColor: colors.primary,
                },

                "&.Mui-focused fieldset": {
                  borderColor: colors.primary,
                },
              },

              "& .MuiInputBase-input": {
                color: colors.text,
              },
            }}
          />
        </DialogContent>

        <DialogActions
          sx={{
            px: 3,
            pb: 2,
          }}
        >
          <Button
            onClick={closeEdit}
            sx={{
              textTransform: "none",
              color: colors.muted,

              "&:hover": {
                backgroundColor: "#273449",
              },
            }}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={updateMessage}
            disabled={!editMessage.trim()}
            sx={{
              textTransform: "none",
              borderRadius: 2,
              backgroundColor: colors.primary,
              color: colors.background,

              "&:hover": {
                backgroundColor: "#6DB8B1",
              },
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* نافذة تأكيد حذف الرسالة */}
      <Dialog
        open={deleteOpen}
        onClose={closeDelete}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            backgroundColor: colors.card,
            color: colors.text,
            border: `1px solid ${colors.border}`,
            borderRadius: 3,
          },
        }}
      >
        <DialogTitle
          sx={{
            color: colors.text,
            fontWeight: "bold",
          }}
        >
          Delete Message
        </DialogTitle>

        <DialogContent>
          <Typography
            sx={{
              color: colors.muted,
            }}
          >
            Are you sure you want to delete this message?
          </Typography>
        </DialogContent>

        <DialogActions
          sx={{
            px: 3,
            pb: 2,
          }}
        >
          <Button
            onClick={closeDelete}
            sx={{
              textTransform: "none",
              color: colors.muted,

              "&:hover": {
                backgroundColor: "#273449",
              },
            }}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={confirmDelete}
            sx={{
              textTransform: "none",
              borderRadius: 2,
              backgroundColor: colors.delete,

              "&:hover": {
                backgroundColor: "#D32F2F",
              },
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}