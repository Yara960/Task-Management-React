// استيراد useState و useEffect من React
import { useState, useEffect } from "react";

// استيراد Supabase
import { supabase } from "../supabaseClient";

// استيراد تنسيق الصفحة
import "../App.css";

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

// ==========================================
// صفحة المهام
// ==========================================

function TasksPage() {

  // المهمة الجديدة
  const [task, setTask] = useState("");

  // قائمة المهام
  const [tasks, setTasks] = useState([]);

  // ID المهمة التي نعدلها
  const [editingId, setEditingId] = useState(null);

  // ID المهمة التي نريد حذفها
  const [deleteId, setDeleteId] = useState(null);

  // التحكم في نافذة تأكيد الحذف
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  // التحكم في نافذة التعديل
  const [openEditDialog, setOpenEditDialog] = useState(false);

  // النص الجديد للمهمة
  const [editTask, setEditTask] = useState("");


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
      .is("deleted_at", null);

    if (error) {

      console.log("Get tasks error:", error);

    } else {

      setTasks(data || []);

    }
  }


  // ==========================================
  // تشغيل getTasks عند فتح الصفحة
  // ==========================================

  useEffect(() => {

    getTasks();

  }, []);


  // ==========================================
  // إضافة مهمة
  // ==========================================

  async function addTask() {

    if (!task.trim()) {
      return;
    }

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
          completed: false,
          user_id: user.id,
        },
      ]);

    if (error) {

      console.log("Add task error:", error);

    } else {

      setTask("");

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
  // فتح نافذة تأكيد الحذف
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

    // تسجيل وقت الحذف بدل حذف الصف نهائيًا
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

    // إزالة المهمة من الصفحة
    setTasks((currentTasks) =>
      currentTasks.filter((task) => task.id !== deleteId)
    );

    // إغلاق نافذة الحذف
    setOpenDeleteDialog(false);

    // تنظيف ID
    setDeleteId(null);
  }


  // ==========================================
  // فتح نافذة تعديل المهمة
  // ==========================================

  function startEdit(task) {

    setEditingId(task.id);

    setEditTask(task.task);

    setOpenEditDialog(true);
  }


  // ==========================================
  // تحديث المهمة
  // ==========================================

  async function updateTask() {

    if (!editTask.trim() || !editingId) {
      return;
    }

    const { data, error } = await supabase
      .from("tasks")
      .update({
        task: editTask.trim(),

        // تسجيل وقت آخر تعديل
        updated_at: new Date().toISOString(),
      })
      .eq("id", editingId)
      .select()
      .single();

    if (error) {

      console.log("Update error:", error);

      return;
    }

    // تحديث المهمة في الصفحة مباشرة
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === editingId ? data : task
      )
    );

    // إغلاق نافذة التعديل
    setOpenEditDialog(false);

    // تنظيف البيانات
    setEditingId(null);

    setEditTask("");
  }


  // ==========================================
  // واجهة الصفحة
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
          maxWidth: "1000px",
          margin: "0 auto",
          padding: {
            xs: "30px 16px",
            sm: "45px 25px",
          },
          flex: 1,
        }}
      >

        {/* عنوان الصفحة */}

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "15px",
            marginBottom: "30px",
          }}
        >

          <Box>

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
              Tasks
            </Typography>

            <Typography
              sx={{
                color: "#78909C",
                fontSize: "15px",
              }}
            >
              Manage your tasks easily and stay organized.
            </Typography>

          </Box>


          {/* عدد المهام */}

          <Chip
            icon={<TaskAltIcon />}
            label={`${tasks.length} ${
              tasks.length === 1 ? "Task" : "Tasks"
            }`}
            sx={{
              backgroundColor: "#E0F2F1",
              color: "#00695C",
              fontWeight: "bold",
              padding: "5px 8px",
              borderRadius: "20px",

              "& .MuiChip-icon": {
                color: "#00897B",
              },
            }}
          />

        </Box>


        {/* إضافة مهمة */}

        <Paper
          elevation={0}
          sx={{
            padding: {
              xs: "20px",
              sm: "25px",
            },
            borderRadius: "18px",
            backgroundColor: "#FFFFFF",
            border: "1px solid #E8ECEF",
            marginBottom: "30px",
          }}
        >

          <Typography
            sx={{
              fontWeight: "bold",
              color: "#263238",
              fontSize: "18px",
              marginBottom: "15px",
            }}
          >
            Add New Task
          </Typography>


          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              flexDirection: {
                xs: "column",
                sm: "row",
              },
            }}
          >

            <TextField
              fullWidth
              label="What do you need to do?"
              value={task}
              onChange={(e) => setTask(e.target.value)}
              onKeyDown={(e) => {

                if (e.key === "Enter") {
                  addTask();
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

                "& label.Mui-focused": {
                  color: "#00897B",
                },
              }}
            />


            <Button
              onClick={addTask}
              variant="contained"
              startIcon={<AddIcon />}
              sx={{
                minWidth: {
                  xs: "100%",
                  sm: "135px",
                },
                height: "56px",
                borderRadius: "12px",
                backgroundColor: "#00897B",
                textTransform: "none",
                fontSize: "15px",
                fontWeight: "bold",
                boxShadow: "none",

                "&:hover": {
                  backgroundColor: "#00695C",
                  boxShadow: "none",
                },
              }}
            >
              Add Task
            </Button>

          </Box>

        </Paper>


        {/* عنوان قائمة المهام */}

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "15px",
          }}
        >

          <Typography
            sx={{
              fontSize: "20px",
              fontWeight: "bold",
              color: "#263238",
            }}
          >
            Your Tasks
          </Typography>

        </Box>


        {/* قائمة المهام */}

        {tasks.length > 0 ? (

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "14px",
            }}
          >

            {tasks.map((task) => (

              <Card
                key={task.id}
                elevation={0}
                sx={{
                  borderRadius: "16px",

                  backgroundColor: task.completed
                    ? "#F8FAFA"
                    : "#FFFFFF",

                  border: "1px solid #E8ECEF",
                  transition: "all 0.2s ease",

                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow:
                      "0 6px 20px rgba(38, 50, 56, 0.08)",
                  },
                }}
              >

                <CardContent
                  sx={{
                    padding: "18px 20px !important",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "15px",
                    flexWrap: "wrap",
                  }}
                >

                  {/* معلومات المهمة */}

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      minWidth: 0,
                      flex: 1,
                    }}
                  >

                    {/* Checkbox */}

                    <Checkbox
                      checked={Boolean(task.completed)}
                      onChange={() => toggleTask(task)}
                      sx={{
                        color: "#B0BEC5",

                        "&.Mui-checked": {
                          color: "#00897B",
                        },

                        "&:hover": {
                          backgroundColor: "#E0F2F1",
                        },
                      }}
                    />


                    {/* أيقونة المهمة */}

                    <Box
                      sx={{
                        width: "42px",
                        height: "42px",
                        minWidth: "42px",
                        borderRadius: "12px",
                        backgroundColor: "#E0F2F1",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >

                      <TaskAltIcon
                        sx={{
                          color: "#00897B",
                          fontSize: "22px",
                        }}
                      />

                    </Box>


                    {/* اسم المهمة */}

                    <Box
                      sx={{
                        minWidth: 0,
                      }}
                    >

                      <Typography
                        sx={{
                          color: task.completed
                            ? "#90A4AE"
                            : "#263238",

                          fontSize: "16px",
                          fontWeight: "600",
                          wordBreak: "break-word",

                          textDecoration: task.completed
                            ? "line-through"
                            : "none",

                          transition: "all 0.2s ease",
                        }}
                      >
                        {task.task}
                      </Typography>


                      <Typography
                        sx={{
                          color: "#90A4AE",
                          fontSize: "12px",
                          marginTop: "3px",
                        }}
                      >
                        {task.completed
                          ? "Completed"
                          : "Task"}{" "}
                        #{task.id}
                      </Typography>

                    </Box>

                  </Box>


                  {/* أزرار التحكم */}

                  <Box
                    sx={{
                      display: "flex",
                      gap: "8px",
                    }}
                  >

                    {/* Edit */}

                    <Button
                      onClick={() => startEdit(task)}
                      variant="outlined"
                      startIcon={<EditIcon />}
                      sx={{
                        color: "#1976D2",
                        borderColor: "#BBDEFB",
                        borderRadius: "10px",
                        textTransform: "none",
                        fontWeight: "600",

                        "&:hover": {
                          borderColor: "#1976D2",
                          backgroundColor: "#E3F2FD",
                        },
                      }}
                    >
                      Edit
                    </Button>


                    {/* Delete */}

                    <Button
                      onClick={() => confirmDelete(task.id)}
                      variant="outlined"
                      startIcon={<DeleteIcon />}
                      sx={{
                        color: "#D32F2F",
                        borderColor: "#FFCDD2",
                        borderRadius: "10px",
                        textTransform: "none",
                        fontWeight: "600",

                        "&:hover": {
                          borderColor: "#D32F2F",
                          backgroundColor: "#FFEBEE",
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
              padding: "50px 20px",
              textAlign: "center",
              borderRadius: "16px",
              backgroundColor: "#FFFFFF",
              border: "1px solid #E8ECEF",
            }}
          >

            <Box
              sx={{
                width: "65px",
                height: "65px",
                borderRadius: "50%",
                backgroundColor: "#E0F2F1",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 15px",
              }}
            >

              <TaskAltIcon
                sx={{
                  fontSize: "32px",
                  color: "#00897B",
                }}
              />

            </Box>


            <Typography
              sx={{
                fontWeight: "bold",
                color: "#37474F",
                fontSize: "18px",
                marginBottom: "6px",
              }}
            >
              No tasks yet
            </Typography>


            <Typography
              sx={{
                color: "#90A4AE",
                fontSize: "14px",
              }}
            >
              Add your first task to get started.
            </Typography>

          </Paper>

        )}

      </Box>


      {/* ==========================================
          Dialog تأكيد الحذف
      ========================================== */}

      <Dialog
        open={openDeleteDialog}
        onClose={() => {
          setOpenDeleteDialog(false);
          setDeleteId(null);
        }}
        PaperProps={{
          sx: {
            width: "100%",
            maxWidth: "430px",
            borderRadius: "20px",
            padding: "8px",
          },
        }}
      >

        <DialogTitle
          sx={{
            fontWeight: "bold",
            color: "#263238",
            fontSize: "21px",
          }}
        >
          Delete Task?
        </DialogTitle>


        <DialogContent>

          <Typography
            sx={{
              color: "#607D8B",
              fontSize: "15px",
              lineHeight: 1.6,
            }}
          >
            Are you sure you want to delete this task?
            This action cannot be undone.
          </Typography>

        </DialogContent>


        <DialogActions
          sx={{
            padding: "15px",
            gap: "8px",
          }}
        >

          <Button
            onClick={() => {
              setOpenDeleteDialog(false);
              setDeleteId(null);
            }}
            variant="outlined"
            sx={{
              color: "#607D8B",
              borderColor: "#CFD8DC",
              textTransform: "none",
              borderRadius: "10px",
              padding: "8px 20px",

              "&:hover": {
                borderColor: "#90A4AE",
                backgroundColor: "#F5F7F8",
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
              backgroundColor: "#D32F2F",
              textTransform: "none",
              borderRadius: "10px",
              padding: "8px 20px",

              "&:hover": {
                backgroundColor: "#B71C1C",
              },
            }}
          >
            Delete
          </Button>

        </DialogActions>

      </Dialog>


      {/* ==========================================
          Dialog تعديل المهمة
      ========================================== */}

      <Dialog
        open={openEditDialog}
        onClose={() => {
          setOpenEditDialog(false);
          setEditingId(null);
          setEditTask("");
        }}
        PaperProps={{
          sx: {
            width: "100%",
            maxWidth: "430px",
            borderRadius: "20px",
            padding: "8px",
          },
        }}
      >

        <DialogTitle
          sx={{
            fontWeight: "bold",
            color: "#263238",
            fontSize: "21px",
          }}
        >
          Edit Task
        </DialogTitle>


        <DialogContent>

          <Typography
            sx={{
              color: "#607D8B",
              fontSize: "14px",
              marginBottom: "15px",
            }}
          >
            Update your task below.
          </Typography>


          <TextField
            fullWidth
            label="Task"
            value={editTask}
            onChange={(e) => setEditTask(e.target.value)}
            autoFocus
            onKeyDown={(e) => {

              if (e.key === "Enter") {
                updateTask();
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

              "& label.Mui-focused": {
                color: "#00897B",
              },
            }}
          />

        </DialogContent>


        <DialogActions
          sx={{
            padding: "15px",
            gap: "8px",
          }}
        >

          <Button
            onClick={() => {
              setOpenEditDialog(false);
              setEditingId(null);
              setEditTask("");
            }}
            variant="outlined"
            sx={{
              color: "#607D8B",
              borderColor: "#CFD8DC",
              textTransform: "none",
              borderRadius: "10px",
              padding: "8px 20px",

              "&:hover": {
                borderColor: "#90A4AE",
                backgroundColor: "#F5F7F8",
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
              backgroundColor: "#00897B",
              textTransform: "none",
              borderRadius: "10px",
              padding: "8px 20px",

              "&:hover": {
                backgroundColor: "#00695C",
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


// تصدير صفحة المهام
export default TasksPage;