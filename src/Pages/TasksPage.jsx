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

// استيراد Theme
import { useTheme } from "@mui/material/styles";

function TasksPage() {

  // ==========================================
  // Theme
  // ==========================================

  const theme = useTheme();


  // ==========================================
  // اللغة
  // ==========================================

  const [language, setLanguage] = useState(
    () => localStorage.getItem("language") || "en"
  );


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

      tasks: "Tasks",

      manageTasks:
        "Manage your tasks easily and stay organized.",

      task:
        "Task",

      taskCount:
        "Task",

      tasksCount:
        "Tasks",

      addNewTask:
        "Add New Task",

      whatToDo:
        "What do you need to do?",

      priority:
        "Priority",

      normal:
        "Normal",

      urgent:
        "Urgent",

      addTask:
        "Add Task",

      yourTasks:
        "Your Tasks",

      completed:
        "Completed",

      edit:
        "Edit",

      delete:
        "Delete",

      noTasks:
        "No tasks yet",

      firstTask:
        "Add your first task to get started.",

      deleteTask:
        "Delete Task?",

      deleteConfirmation:
        "Are you sure you want to delete this task? This action cannot be undone.",

      cancel:
        "Cancel",

      editTask:
        "Edit Task",

      updateTask:
        "Update your task below.",

      saveChanges:
        "Save Changes",

      required:
        "Task is required",

    },


    ar: {

      tasks: "المهام",

      manageTasks:
        "أدر مهامك بسهولة وحافظ على تنظيمك.",

      task:
        "مهمة",

      taskCount:
        "مهمة",

      tasksCount:
        "مهام",

      addNewTask:
        "إضافة مهمة جديدة",

      whatToDo:
        "ماذا تحتاج إلى إنجازه؟",

      priority:
        "الأولوية",

      normal:
        "عادية",

      urgent:
        "عاجلة",

      addTask:
        "إضافة مهمة",

      yourTasks:
        "مهامك",

      completed:
        "مكتملة",

      edit:
        "تعديل",

      delete:
        "حذف",

      noTasks:
        "لا توجد مهام بعد",

      firstTask:
        "أضف أول مهمة لك للبدء.",

      deleteTask:
        "حذف المهمة؟",

      deleteConfirmation:
        "هل أنت متأكد من أنك تريد حذف هذه المهمة؟ لا يمكن التراجع عن هذا الإجراء.",

      cancel:
        "إلغاء",

      editTask:
        "تعديل المهمة",

      updateTask:
        "قم بتحديث المهمة أدناه.",

      saveChanges:
        "حفظ التغييرات",

      required:
        "المهمة مطلوبة",

    },

  };


  // النص الحالي
  const currentText =
    language === "ar"
      ? text.ar
      : text.en;


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
  // تشغيل جلب المهام
  // ==========================================

  useEffect(() => {
    getTasks();
  }, []);


  // ==========================================
  // إضافة مهمة
  // ==========================================

  async function addTask() {

    if (!task.trim()) {

      setTaskError(currentText.required);

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

      setEditTaskError(currentText.required);

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

        backgroundColor:
          theme.palette.background.default,

        color:
          theme.palette.text.primary,

        transition:
          "background-color 0.3s, color 0.3s",
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

        {/* العنوان */}

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
                color: "text.primary",
                marginBottom: 1,
              }}
            >
              {currentText.tasks}
            </Typography>

            <Typography
              sx={{
                color: "text.secondary",
              }}
            >
              {currentText.manageTasks}
            </Typography>

          </Box>


          {/* عدد المهام */}

          <Chip
            icon={<TaskAltIcon />}
            label={`${tasks.length} ${
              tasks.length === 1
                ? currentText.taskCount
                : currentText.tasksCount
            }`}
            sx={{
              backgroundColor:
                theme.palette.mode === "dark"
                  ? "#273449"
                  : "#E6F4F2",

              color: "primary.main",

              fontWeight: "bold",

              border:
                theme.palette.mode === "dark"
                  ? "1px solid #334155"
                  : "1px solid #B2DFDB",

              "& .MuiChip-icon": {
                color: "primary.main",
              },
            }}
          />

        </Box>


        {/* إضافة مهمة */}

        <Paper
          elevation={0}
          sx={{
            padding: {
              xs: 2,
              sm: 3,
            },

            marginBottom: 4,

            backgroundColor:
              "background.paper",

            borderRadius: "16px",
          }}
        >

          <Typography
            sx={{
              fontWeight: "bold",
              color: "text.primary",
              marginBottom: 2,
              fontSize: "20px",
            }}
          >
            {currentText.addNewTask}
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
              label={currentText.whatToDo}
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
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
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

              <InputLabel>
                {currentText.priority}
              </InputLabel>

              <Select
                value={priority}
                label={currentText.priority}

                onChange={(e) =>
                  setPriority(e.target.value)
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

                backgroundColor:
                  "primary.main",

                color:
                  theme.palette.mode === "dark"
                    ? "#0F172A"
                    : "#FFFFFF",

                textTransform: "none",
                fontWeight: "bold",
                boxShadow: "none",

                "&:hover": {
                  backgroundColor:
                    theme.palette.mode === "dark"
                      ? "#6FB8B1"
                      : "#00796B",

                  boxShadow: "none",
                },
              }}
            >
              {currentText.addTask}
            </Button>

          </Box>

        </Paper>


        {/* Your Tasks */}

        <Typography
          variant="h5"
          sx={{
            fontWeight: "bold",
            color: "text.primary",
            marginBottom: 2,
          }}
        >
          {currentText.yourTasks}
        </Typography>


        {/* قائمة المهام */}

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
                  backgroundColor:
                    "background.paper",

                  borderRadius: "16px",

                  transition:
                    "background-color 0.3s, border-color 0.2s, transform 0.2s",

                  "&:hover": {
                    borderColor:
                      theme.palette.mode === "dark"
                        ? "#475569"
                        : "#B2DFDB",

                    transform:
                      "translateY(-2px)",
                  },
                }}
              >

                <CardContent
                  sx={{
                    padding:
                      "20px !important",

                    display: "flex",
                    alignItems: "center",
                    justifyContent:
                      "space-between",

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

                    <Checkbox
                      checked={
                        Boolean(task.completed)
                      }

                      onChange={() =>
                        toggleTask(task)
                      }

                      sx={{
                        color:
                          theme.palette.text.secondary,

                        "&.Mui-checked": {
                          color:
                            "primary.main",
                        },

                        "&:hover": {
                          backgroundColor:
                            theme.palette.mode === "dark"
                              ? "rgba(128,203,196,0.08)"
                              : "rgba(0,137,123,0.08)",
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

                        backgroundColor:
                          theme.palette.mode === "dark"
                            ? "#273449"
                            : "#E6F4F2",

                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",

                        border:
                          theme.palette.mode === "dark"
                            ? "1px solid #334155"
                            : "1px solid #B2DFDB",
                      }}
                    >

                      <TaskAltIcon
                        sx={{
                          color:
                            "primary.main",
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
                          color:
                            task.completed
                              ? "text.secondary"
                              : "text.primary",

                          fontWeight: "600",
                          fontSize: "16px",

                          wordBreak:
                            "break-word",

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
                          color:
                            "text.secondary",

                          fontSize: "12px",
                          marginTop: "4px",
                        }}
                      >
                        {task.completed
                          ? currentText.completed
                          : currentText.task}{" "}
                        #{task.id}
                      </Typography>

                    </Box>

                  </Box>


                  {/* Priority */}

                  <Chip
                    label={
                      task.priority === "URGENT"
                        ? currentText.urgent
                        : currentText.normal
                    }

                    size="small"

                    sx={{
                      fontWeight: "bold",

                      backgroundColor:
                        task.priority === "URGENT"
                          ? theme.palette.mode === "dark"
                            ? "rgba(244,143,177,0.15)"
                            : "#FCE7EF"
                          : theme.palette.mode === "dark"
                            ? "rgba(128,203,196,0.12)"
                            : "#E6F4F2",

                      color:
                        task.priority === "URGENT"
                          ? theme.palette.mode === "dark"
                            ? "#F48FB1"
                            : "#D81B60"
                          : "primary.main",

                      border:
                        task.priority === "URGENT"
                          ? theme.palette.mode === "dark"
                            ? "1px solid rgba(244,143,177,0.3)"
                            : "1px solid #F8BBD0"
                          : theme.palette.mode === "dark"
                            ? "1px solid rgba(128,203,196,0.25)"
                            : "1px solid #B2DFDB",
                    }}
                  />


                  {/* الأزرار */}

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
                        color:
                          "primary.main",

                        borderColor:
                          theme.palette.mode === "dark"
                            ? "#475569"
                            : "#B2DFDB",

                        borderRadius: "10px",

                        textTransform: "none",
                        fontWeight: "600",

                        "&:hover": {
                          borderColor:
                            "primary.main",

                          backgroundColor:
                            theme.palette.mode === "dark"
                              ? "rgba(128,203,196,0.08)"
                              : "rgba(0,137,123,0.06)",
                        },
                      }}
                    >
                      {currentText.edit}
                    </Button>


                    {/* Delete */}

                    <Button
                      onClick={() =>
                        confirmDelete(task.id)
                      }

                      variant="outlined"
                      startIcon={<DeleteIcon />}

                      sx={{
                        color:
                          theme.palette.mode === "dark"
                            ? "#EF5350"
                            : "#D32F2F",

                        borderColor:
                          theme.palette.mode === "dark"
                            ? "#7F1D1D"
                            : "#FFCDD2",

                        borderRadius: "10px",

                        textTransform: "none",
                        fontWeight: "600",

                        "&:hover": {
                          borderColor:
                            "#EF5350",

                          backgroundColor:
                            theme.palette.mode === "dark"
                              ? "rgba(239,83,80,0.08)"
                              : "rgba(239,83,80,0.06)",
                        },
                      }}
                    >
                      {currentText.delete}
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

              backgroundColor:
                "background.paper",

              borderRadius: "16px",
            }}
          >

            <Box
              sx={{
                width: 65,
                height: 65,

                borderRadius: "50%",

                backgroundColor:
                  theme.palette.mode === "dark"
                    ? "#273449"
                    : "#E6F4F2",

                display: "flex",
                alignItems: "center",
                justifyContent: "center",

                margin:
                  "0 auto 15px",

                border:
                  theme.palette.mode === "dark"
                    ? "1px solid #334155"
                    : "1px solid #B2DFDB",
              }}
            >

              <TaskAltIcon
                sx={{
                  fontSize: 32,
                  color: "primary.main",
                }}
              />

            </Box>


            <Typography
              sx={{
                fontWeight: "bold",
                color: "text.primary",
                fontSize: "18px",
                marginBottom: 1,
              }}
            >
              {currentText.noTasks}
            </Typography>


            <Typography
              sx={{
                color: "text.secondary",
                fontSize: "14px",
              }}
            >
              {currentText.firstTask}
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
            backgroundColor: "background.paper",
            color: "text.primary",
            borderRadius: "16px",
            padding: 1,
          },
        }}
      >

        <DialogTitle
          sx={{
            fontWeight: "bold",
            color: "text.primary",
          }}
        >
          {currentText.deleteTask}
        </DialogTitle>


        <DialogContent>

          <Typography
            sx={{
              color: "text.secondary",
              lineHeight: 1.6,
            }}
          >
            {currentText.deleteConfirmation}
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
              color: "text.secondary",

              borderColor:
                theme.palette.mode === "dark"
                  ? "#475569"
                  : "#CBD5E1",

              textTransform: "none",
              borderRadius: "10px",

              "&:hover": {
                borderColor:
                  theme.palette.text.secondary,

                backgroundColor:
                  theme.palette.mode === "dark"
                    ? "#273449"
                    : "#F1F5F9",
              },
            }}
          >
            {currentText.cancel}
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
            {currentText.delete}
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
            backgroundColor: "background.paper",
            color: "text.primary",
            borderRadius: "16px",
            padding: 1,
          },
        }}
      >

        <DialogTitle
          sx={{
            fontWeight: "bold",
            color: "text.primary",
          }}
        >
          {currentText.editTask}
        </DialogTitle>


        <DialogContent>

          <Typography
            sx={{
              color: "text.secondary",
              fontSize: "14px",
              marginBottom: 2,
            }}
          >
            {currentText.updateTask}
          </Typography>


          {/* Task */}

          <TextField
            fullWidth
            label={currentText.task}
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

              "& .MuiOutlinedInput-root": {
                borderRadius: "12px",
              },

              "& .MuiFormHelperText-root": {
                color: "#EF5350",
              },
            }}
          />


          {/* Priority */}

          <FormControl fullWidth>

            <InputLabel>
              {currentText.priority}
            </InputLabel>

            <Select
              value={editPriority}
              label={currentText.priority}

              onChange={(e) =>
                setEditPriority(e.target.value)
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
              color: "text.secondary",

              borderColor:
                theme.palette.mode === "dark"
                  ? "#475569"
                  : "#CBD5E1",

              textTransform: "none",
              borderRadius: "10px",

              "&:hover": {
                borderColor:
                  theme.palette.text.secondary,

                backgroundColor:
                  theme.palette.mode === "dark"
                    ? "#273449"
                    : "#F1F5F9",
              },
            }}
          >
            {currentText.cancel}
          </Button>


          <Button
            onClick={updateTask}
            variant="contained"
            startIcon={<EditIcon />}
            sx={{
              backgroundColor:
                "primary.main",

              color:
                theme.palette.mode === "dark"
                  ? "#0F172A"
                  : "#FFFFFF",

              textTransform: "none",
              borderRadius: "10px",

              "&:hover": {
                backgroundColor:
                  theme.palette.mode === "dark"
                    ? "#6FB8B1"
                    : "#00796B",
              },
            }}
          >
            {currentText.saveChanges}
          </Button>

        </DialogActions>

      </Dialog>

    </Box>
  );
}

export default TasksPage;

