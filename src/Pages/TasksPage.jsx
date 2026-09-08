
// استيراد useState و useEffect من React
import { useState, useEffect } from "react";

// استيراد Supabase
import { supabase } from "../supabaseClient";

// استيراد Material UI
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Checkbox from "@mui/material/Checkbox";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";

// استيراد Dialog
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";

// استيراد الأيقونات
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import TaskAltIcon from "@mui/icons-material/TaskAlt";

// استيراد Navbar
import Navbar from "../Components/Navbar";

function TasksPage() {

  // ==========================================
  // الحالات
  // ==========================================

  const [task, setTask] = useState("");
  const [priority, setPriority] = useState("NORMAL");
  const [taskError, setTaskError] = useState("");

  const [tasks, setTasks] = useState([]);

  // التعديل
  const [editingId, setEditingId] = useState(null);
  const [editTask, setEditTask] = useState("");
  const [editPriority, setEditPriority] = useState("NORMAL");
  const [editTaskError, setEditTaskError] = useState("");

  // الحذف
  const [deleteId, setDeleteId] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  // Dialog التعديل
  const [openEditDialog, setOpenEditDialog] = useState(false);


  // ==========================================
  // جلب مهام المستخدم
  // ==========================================

  async function getTasks() {

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return;
    }

    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("user_id", user.id)
      .is("deleted_at", null)
      .order("id", { ascending: false });

    if (error) {
      console.log("Get tasks error:", error);
    } else {
      setTasks(data || []);
    }
  }


  // ==========================================
  // تشغيل جلب المهام عند فتح الصفحة
  // ==========================================

  useEffect(() => {
    getTasks();
  }, []);


  // ==========================================
  // إضافة مهمة
  // ==========================================

  async function addTask() {

    if (!task.trim()) {
      setTaskError("Task is required");
      return;
    }

    setTaskError("");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return;
    }

    const { error } = await supabase
      .from("tasks")
      .insert([
        {
          task: task.trim(),
          priority: priority,
          completed: false,
          user_id: user.id,
        },
      ]);

    if (error) {

      console.log("Add task error:", error);

    } else {

      setTask("");
      setPriority("NORMAL");
      setTaskError("");

      getTasks();
    }
  }


  // ==========================================
  // تغيير حالة المهمة
  // ==========================================

  async function toggleTask(task) {

    const { error } = await supabase
      .from("tasks")
      .update({
        completed: !task.completed,
        updated_at: new Date().toISOString(),
      })
      .eq("id", task.id);

    if (error) {
      console.log("Toggle task error:", error);
    } else {
      getTasks();
    }
  }


  // ==========================================
  // فتح نافذة الحذف
  // ==========================================

  function confirmDelete(id) {

    setDeleteId(id);
    setOpenDeleteDialog(true);
  }


  // ==========================================
  // حذف المهمة
  // ==========================================

  async function deleteTask() {

    if (!deleteId) {
      return;
    }

    // Soft Delete
    const { error } = await supabase
      .from("tasks")
      .update({
        deleted_at: new Date().toISOString(),
      })
      .eq("id", deleteId);

    if (error) {

      console.log("Delete error:", error);
      return;
    }

    setTasks((currentTasks) =>
      currentTasks.filter(
        (task) => task.id !== deleteId
      )
    );

    setOpenDeleteDialog(false);
    setDeleteId(null);
  }


  // ==========================================
  // فتح نافذة التعديل
  // ==========================================

  function startEdit(task) {

    setEditingId(task.id);
    setEditTask(task.task);
    setEditPriority(task.priority || "NORMAL");
    setEditTaskError("");
    setOpenEditDialog(true);
  }


  // ==========================================
  // تحديث المهمة
  // ==========================================

  async function updateTask() {

    if (!editTask.trim()) {

      setEditTaskError("Task is required");
      return;
    }

    if (!editingId) {
      return;
    }

    setEditTaskError("");

    const { data, error } = await supabase
      .from("tasks")
      .update({
        task: editTask.trim(),
        priority: editPriority,
        updated_at: new Date().toISOString(),
      })
      .eq("id", editingId)
      .select()
      .single();

    if (error) {

      console.log("Update error:", error);
      return;
    }

    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === editingId
          ? data
          : task
      )
    );

    setOpenEditDialog(false);

    setEditingId(null);
    setEditTask("");
    setEditPriority("NORMAL");
    setEditTaskError("");
  }


  // ==========================================
  // إغلاق Dialog التعديل
  // ==========================================

  function closeEditDialog() {

    setOpenEditDialog(false);
    setEditingId(null);
    setEditTask("");
    setEditPriority("NORMAL");
    setEditTaskError("");
  }


  // ==========================================
  // إغلاق Dialog الحذف
  // ==========================================

  function closeDeleteDialog() {

    setOpenDeleteDialog(false);
    setDeleteId(null);
  }


  // ==========================================
  // الواجهة
  // ==========================================

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#0F172A",
        color: "#FFFFFF",
      }}
    >

      


      {/* المحتوى */}
      <Box
        sx={{
          padding: {
            xs: 2,
            sm: 3,
            md: 4,
          },

          maxWidth: 1200,
          margin: "auto",
        }}
      >

        {/* ==========================================
            العنوان
        ========================================== */}

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 2,
            marginBottom: 4,
          }}
        >

          <Box>

            <Typography
              variant="h4"
              sx={{
                fontWeight: "bold",
                color: "#FFFFFF",
                marginBottom: 1,
              }}
            >
              Tasks
            </Typography>

            <Typography
              sx={{
                color: "#94A3B8",
              }}
            >
              Manage your tasks easily and stay organized.
            </Typography>

          </Box>


          {/* عدد المهام */}

          <Chip
            icon={<TaskAltIcon />}
            label={`${tasks.length} ${
              tasks.length === 1
                ? "Task"
                : "Tasks"
            }`}
            sx={{
              backgroundColor: "#273449",
              color: "#80CBC4",
              fontWeight: "bold",
              border: "1px solid #334155",

              "& .MuiChip-icon": {
                color: "#80CBC4",
              },
            }}
          />

        </Box>


        {/* ==========================================
            إضافة مهمة
        ========================================== */}

        <Paper
          elevation={0}
          sx={{
            padding: {
              xs: 2,
              sm: 3,
            },

            marginBottom: 4,

            backgroundColor: "#1E293B",
            border: "1px solid #334155",
            borderRadius: "16px",
          }}
        >

          <Typography
            sx={{
              fontWeight: "bold",
              color: "#FFFFFF",
              marginBottom: 2,
              fontSize: "20px",
            }}
          >
            Add New Task
          </Typography>


          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,

              flexDirection: {
                xs: "column",
                sm: "row",
              },
            }}
          >

            {/* Task input */}

            <TextField
              fullWidth
              label="What do you need to do?"
              value={task}
              error={Boolean(taskError)}
              helperText={taskError}
              onChange={(e) => {

                setTask(e.target.value);

                if (e.target.value.trim()) {
                  setTaskError("");
                }

              }}
              onKeyDown={(e) => {

                if (e.key === "Enter") {
                  addTask();
                }

              }}
              sx={{
                "& .MuiInputLabel-root": {
                  color: "#94A3B8",
                },

                "& .MuiInputLabel-root.Mui-focused": {
                  color: "#80CBC4",
                },

                "& .MuiOutlinedInput-root": {
                  backgroundColor: "#273449",
                  borderRadius: "12px",
                  color: "#FFFFFF",

                  "& fieldset": {
                    borderColor: "#334155",
                  },

                  "&:hover fieldset": {
                    borderColor: "#80CBC4",
                  },

                  "&.Mui-focused fieldset": {
                    borderColor: "#80CBC4",
                  },
                },

                "& .MuiFormHelperText-root": {
                  color: "#EF5350",
                },
              }}
            />


            {/* Priority */}

            <FormControl
              sx={{
                minWidth: {
                  xs: "100%",
                  sm: 160,
                },
              }}
            >

              <InputLabel
                sx={{
                  color: "#94A3B8",

                  "&.Mui-focused": {
                    color: "#80CBC4",
                  },
                }}
              >
                Priority
              </InputLabel>

              <Select
                value={priority}
                label="Priority"
                onChange={(e) =>
                  setPriority(e.target.value)
                }
                sx={{
                  backgroundColor: "#273449",
                  color: "#FFFFFF",
                  borderRadius: "12px",

                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#334155",
                  },

                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#80CBC4",
                  },

                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#80CBC4",
                  },

                  "& .MuiSvgIcon-root": {
                    color: "#80CBC4",
                  },
                }}
              >

                <MenuItem value="NORMAL">
                  Normal
                </MenuItem>

                <MenuItem value="URGENT">
                  Urgent
                </MenuItem>

              </Select>

            </FormControl>


            {/* Add */}

            <Button
              onClick={addTask}
              variant="contained"
              startIcon={<AddIcon />}
              sx={{
                minWidth: {
                  xs: "100%",
                  sm: 140,
                },

                height: 56,

                borderRadius: "12px",

                backgroundColor: "#80CBC4",
                color: "#0F172A",

                textTransform: "none",
                fontWeight: "bold",
                boxShadow: "none",

                "&:hover": {
                  backgroundColor: "#6FB8B1",
                  boxShadow: "none",
                },
              }}
            >
              Add Task
            </Button>

          </Box>

        </Paper>


        {/* ==========================================
            Your Tasks
        ========================================== */}

        <Typography
          variant="h5"
          sx={{
            fontWeight: "bold",
            color: "#FFFFFF",
            marginBottom: 2,
          }}
        >
          Your Tasks
        </Typography>


        {/* ==========================================
            قائمة المهام
        ========================================== */}

        {tasks.length > 0 ? (

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >

            {tasks.map((task) => (

              <Card
                key={task.id}
                elevation={0}
                sx={{
                  backgroundColor: "#1E293B",
                  border: "1px solid #334155",
                  borderRadius: "16px",

                  transition: "0.2s",

                  "&:hover": {
                    borderColor: "#475569",
                    transform: "translateY(-2px)",
                  },
                }}
              >

                <CardContent
                  sx={{
                    padding: "20px !important",

                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",

                    gap: 2,
                    flexWrap: "wrap",
                  }}
                >

                  {/* معلومات المهمة */}

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,

                      minWidth: 0,
                      flex: 1,
                    }}
                  >

                    {/* Checkbox */}

                    <Checkbox
                      checked={Boolean(task.completed)}
                      onChange={() =>
                        toggleTask(task)
                      }
                      sx={{
                        color: "#64748B",

                        "&.Mui-checked": {
                          color: "#80CBC4",
                        },

                        "&:hover": {
                          backgroundColor: "rgba(128,203,196,0.08)",
                        },
                      }}
                    />


                    {/* Task icon */}

                    <Box
                      sx={{
                        width: 44,
                        height: 44,
                        minWidth: 44,

                        borderRadius: "12px",

                        backgroundColor: "#273449",

                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",

                        border: "1px solid #334155",
                      }}
                    >

                      <TaskAltIcon
                        sx={{
                          color: "#80CBC4",
                        }}
                      />

                    </Box>


                    {/* Task text */}

                    <Box
                      sx={{
                        minWidth: 0,
                      }}
                    >

                      <Typography
                        sx={{
                          color: task.completed
                            ? "#64748B"
                            : "#FFFFFF",

                          fontWeight: "600",
                          fontSize: "16px",

                          wordBreak: "break-word",

                          textDecoration:
                            task.completed
                              ? "line-through"
                              : "none",
                        }}
                      >
                        {task.task}
                      </Typography>


                      <Typography
                        sx={{
                          color: "#64748B",
                          fontSize: "12px",
                          marginTop: "4px",
                        }}
                      >
                        {task.completed
                          ? "Completed"
                          : "Task"}{" "}
                        #{task.id}
                      </Typography>

                    </Box>

                  </Box>


                  {/* Priority */}

                  <Chip
                    label={
                      task.priority === "URGENT"
                        ? "Urgent"
                        : "Normal"
                    }
                    size="small"
                    sx={{
                      fontWeight: "bold",

                      backgroundColor:
                        task.priority === "URGENT"
                          ? "rgba(244,143,177,0.15)"
                          : "rgba(128,203,196,0.12)",

                      color:
                        task.priority === "URGENT"
                          ? "#F48FB1"
                          : "#80CBC4",

                      border:
                        task.priority === "URGENT"
                          ? "1px solid rgba(244,143,177,0.3)"
                          : "1px solid rgba(128,203,196,0.25)",
                    }}
                  />


                  {/* Buttons */}

                  <Box
                    sx={{
                      display: "flex",
                      gap: 1,
                    }}
                  >

                    {/* Edit */}

                    <Button
                      onClick={() =>
                        startEdit(task)
                      }
                      variant="outlined"
                      startIcon={<EditIcon />}
                      sx={{
                        color: "#80CBC4",
                        borderColor: "#334155",

                        borderRadius: "10px",

                        textTransform: "none",
                        fontWeight: "600",

                        "&:hover": {
                          borderColor: "#80CBC4",
                          backgroundColor:
                            "rgba(128,203,196,0.08)",
                        },
                      }}
                    >
                      Edit
                    </Button>


                    {/* Delete */}

                    <Button
                      onClick={() =>
                        confirmDelete(task.id)
                      }
                      variant="outlined"
                      startIcon={<DeleteIcon />}
                      sx={{
                        color: "#EF5350",
                        borderColor: "#7F1D1D",

                        borderRadius: "10px",

                        textTransform: "none",
                        fontWeight: "600",

                        "&:hover": {
                          borderColor: "#EF5350",
                          backgroundColor:
                            "rgba(239,83,80,0.08)",
                        },
                      }}
                    >
                      Delete
                    </Button>

                  </Box>

                </CardContent>

              </Card>

            ))}

          </Box>

        ) : (

          /* لا توجد مهام */

          <Paper
            elevation={0}
            sx={{
              padding: "55px 20px",

              textAlign: "center",

              backgroundColor: "#1E293B",
              border: "1px solid #334155",

              borderRadius: "16px",
            }}
          >

            <Box
              sx={{
                width: 65,
                height: 65,

                borderRadius: "50%",

                backgroundColor: "#273449",

                display: "flex",
                alignItems: "center",
                justifyContent: "center",

                margin: "0 auto 15px",

                border: "1px solid #334155",
              }}
            >

              <TaskAltIcon
                sx={{
                  fontSize: 32,
                  color: "#80CBC4",
                }}
              />

            </Box>


            <Typography
              sx={{
                fontWeight: "bold",
                color: "#FFFFFF",
                fontSize: "18px",
                marginBottom: 1,
              }}
            >
              No tasks yet
            </Typography>


            <Typography
              sx={{
                color: "#64748B",
                fontSize: "14px",
              }}
            >
              Add your first task to get started.
            </Typography>

          </Paper>

        )}

      </Box>


      {/* ==========================================
          Delete Dialog
      ========================================== */}

      <Dialog
        open={openDeleteDialog}
        onClose={closeDeleteDialog}
        PaperProps={{
          sx: {
            width: "100%",
            maxWidth: 430,

            backgroundColor: "#1E293B",
            color: "#FFFFFF",

            border: "1px solid #334155",
            borderRadius: "16px",

            padding: 1,
          },
        }}
      >

        <DialogTitle
          sx={{
            fontWeight: "bold",
            color: "#FFFFFF",
          }}
        >
          Delete Task?
        </DialogTitle>


        <DialogContent>

          <Typography
            sx={{
              color: "#94A3B8",
              lineHeight: 1.6,
            }}
          >
            Are you sure you want to delete this task?
            This action cannot be undone.
          </Typography>

        </DialogContent>


        <DialogActions
          sx={{
            padding: 2,
            gap: 1,
          }}
        >

          <Button
            onClick={closeDeleteDialog}
            variant="outlined"
            sx={{
              color: "#94A3B8",
              borderColor: "#334155",

              textTransform: "none",
              borderRadius: "10px",

              "&:hover": {
                borderColor: "#64748B",
                backgroundColor: "#273449",
              },
            }}
          >
            Cancel
          </Button>


          <Button
            onClick={deleteTask}
            variant="contained"
            startIcon={<DeleteIcon />}
            sx={{
              backgroundColor: "#EF5350",

              color: "#FFFFFF",

              textTransform: "none",
              borderRadius: "10px",

              "&:hover": {
                backgroundColor: "#D32F2F",
              },
            }}
          >
            Delete
          </Button>

        </DialogActions>

      </Dialog>


      {/* ==========================================
          Edit Dialog
      ========================================== */}

      <Dialog
        open={openEditDialog}
        onClose={closeEditDialog}
        PaperProps={{
          sx: {
            width: "100%",
            maxWidth: 430,

            backgroundColor: "#1E293B",
            color: "#FFFFFF",

            border: "1px solid #334155",
            borderRadius: "16px",

            padding: 1,
          },
        }}
      >

        <DialogTitle
          sx={{
            fontWeight: "bold",
            color: "#FFFFFF",
          }}
        >
          Edit Task
        </DialogTitle>


        <DialogContent>

          <Typography
            sx={{
              color: "#94A3B8",
              fontSize: "14px",
              marginBottom: 2,
            }}
          >
            Update your task below.
          </Typography>


          {/* Task */}

          <TextField
            fullWidth
            label="Task"
            value={editTask}
            error={Boolean(editTaskError)}
            helperText={editTaskError}
            autoFocus

            onChange={(e) => {

              setEditTask(e.target.value);

              if (e.target.value.trim()) {
                setEditTaskError("");
              }

            }}

            onKeyDown={(e) => {

              if (e.key === "Enter") {
                updateTask();
              }

            }}

            sx={{
              marginBottom: 2,

              "& .MuiInputLabel-root": {
                color: "#94A3B8",
              },

              "& .MuiInputLabel-root.Mui-focused": {
                color: "#80CBC4",
              },

              "& .MuiOutlinedInput-root": {
                backgroundColor: "#273449",
                color: "#FFFFFF",
                borderRadius: "12px",

                "& fieldset": {
                  borderColor: "#334155",
                },

                "&:hover fieldset": {
                  borderColor: "#80CBC4",
                },

                "&.Mui-focused fieldset": {
                  borderColor: "#80CBC4",
                },
              },

              "& .MuiFormHelperText-root": {
                color: "#EF5350",
              },
            }}
          />


          {/* Priority */}

          <FormControl fullWidth>

            <InputLabel
              sx={{
                color: "#94A3B8",

                "&.Mui-focused": {
                  color: "#80CBC4",
                },
              }}
            >
              Priority
            </InputLabel>

            <Select
              value={editPriority}
              label="Priority"
              onChange={(e) =>
                setEditPriority(e.target.value)
              }
              sx={{
                backgroundColor: "#273449",
                color: "#FFFFFF",

                borderRadius: "12px",

                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#334155",
                },

                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#80CBC4",
                },

                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#80CBC4",
                },

                "& .MuiSvgIcon-root": {
                  color: "#80CBC4",
                },
              }}
            >

              <MenuItem value="NORMAL">
                Normal
              </MenuItem>

              <MenuItem value="URGENT">
                Urgent
              </MenuItem>

            </Select>

          </FormControl>

        </DialogContent>


        <DialogActions
          sx={{
            padding: 2,
            gap: 1,
          }}
        >

          <Button
            onClick={closeEditDialog}
            variant="outlined"
            sx={{
              color: "#94A3B8",
              borderColor: "#334155",

              textTransform: "none",
              borderRadius: "10px",

              "&:hover": {
                borderColor: "#64748B",
                backgroundColor: "#273449",
              },
            }}
          >
            Cancel
          </Button>


          <Button
            onClick={updateTask}
            variant="contained"
            startIcon={<EditIcon />}
            sx={{
              backgroundColor: "#80CBC4",
              color: "#0F172A",

              textTransform: "none",
              borderRadius: "10px",

              "&:hover": {
                backgroundColor: "#6FB8B1",
              },
            }}
          >
            Save Changes
          </Button>

        </DialogActions>

      </Dialog>

    </Box>
  );
}

export default TasksPage;

