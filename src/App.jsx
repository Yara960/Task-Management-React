
// استيراد useState و useEffect من React
import { useState, useEffect } from "react";

// استيراد Supabase
import { supabase } from "./supabaseClient";

// استيراد تنسيق الصفحة
import "./App.css";

// استيراد React Router
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// استيراد مكونات Material UI
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";

// استيراد Dialog من Material UI
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";

// استيراد الأيقونات
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import TaskAltIcon from "@mui/icons-material/TaskAlt";

// استيراد Components
import Header from "./Components/Header";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";

// استيراد صفحات تسجيل الدخول والتسجيل
import Login from "./Components/Login";
import Register from "./Components/Register";


// ==========================================
// صفحة المهام
// ==========================================

function TasksPage() {

  // task يخزن المهمة الحالية
  const [task, setTask] = useState("");

  // tasks تخزن جميع المهام
  const [tasks, setTasks] = useState([]);

  // editingId يخزن ID المهمة التي نريد تعديلها
  const [editingId, setEditingId] = useState(null);

  // deleteId يخزن ID المهمة التي نريد حذفها
  const [deleteId, setDeleteId] = useState(null);

  // التحكم في ظهور نافذة تأكيد الحذف
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);


  // ==========================================
  // جلب المهام من Supabase
  // ==========================================

  async function getTasks() {

    const { data, error } = await supabase
      .from("tasks")
      .select("*");

    if (error) {

      console.log(error);

    } else {

      setTasks(data);

    }
  }


  // تشغيل getTasks عند فتح الصفحة
  useEffect(() => {

    getTasks();

  }, []);


  // ==========================================
  // إضافة أو تعديل مهمة
  // ==========================================

  async function addTask() {

    // التأكد أن المستخدم كتب مهمة
    if (!task.trim()) {
      return;
    }

    if (editingId !== null) {

      // تعديل المهمة
      const { error } = await supabase
        .from("tasks")
        .update({ task: task })
        .eq("id", editingId);

      if (error) {

        console.log(error);

      } else {

        setTask("");
        setEditingId(null);

        getTasks();

      }

    } else {

      // إضافة مهمة جديدة
      const { error } = await supabase
        .from("tasks")
        .insert([{ task: task }]);

      if (error) {

        console.log(error);

      } else {

        setTask("");

        getTasks();

      }
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
  // تنفيذ حذف المهمة
  // ==========================================

  async function deleteTask() {

    const { error } = await supabase
      .from("tasks")
      .delete()
      .eq("id", deleteId);

    if (error) {

      console.log(error);

    } else {

      getTasks();

    }

    // إغلاق نافذة التأكيد
    setOpenDeleteDialog(false);

    setDeleteId(null);
  }


  // ==========================================
  // بدء تعديل مهمة
  // ==========================================

  function startEdit(task) {

    setTask(task.task);

    setEditingId(task.id);
  }


  // ==========================================
  // واجهة صفحة المهام
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

      {/* Navbar */}
      <Navbar />


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
              My Tasks
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


        {/* Card إضافة المهمة */}

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
            {editingId !== null
              ? "Edit Task"
              : "Add New Task"}
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

            {/* خانة كتابة المهمة */}

            <TextField
              fullWidth
              label={
                editingId !== null
                  ? "Edit your task"
                  : "What do you need to do?"
              }
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


            {/* زر Add / Update */}

            <Button
              onClick={addTask}
              variant="contained"
              startIcon={
                editingId !== null
                  ? <EditIcon />
                  : <AddIcon />
              }
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
              {editingId !== null
                ? "Update"
                : "Add Task"}
            </Button>

          </Box>


          {/* زر إلغاء التعديل */}

          {editingId !== null && (

            <Button
              onClick={() => {
                setTask("");
                setEditingId(null);
              }}
              sx={{
                marginTop: "12px",
                color: "#607D8B",
                textTransform: "none",
              }}
            >
              Cancel Edit
            </Button>

          )}

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


        {/* Cards المهام */}

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
                  backgroundColor: "#FFFFFF",
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
                      gap: "15px",
                      minWidth: 0,
                      flex: 1,
                    }}
                  >

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
                          color: "#263238",
                          fontSize: "16px",
                          fontWeight: "600",
                          wordBreak: "break-word",
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
                        Task #{task.id}
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
        onClose={() => setOpenDeleteDialog(false)}
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
            onClick={() => setOpenDeleteDialog(false)}
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

    </Box>
  );
}


// ==========================================
// حماية صفحة المهام
// ==========================================

function ProtectedRoute({ children }) {

  const [user, setUser] = useState(null);
  

  const [loading, setLoading] = useState(true);


  useEffect(() => {

    async function getUser() {

      const {
        data: { user },
      } = await supabase.auth.getUser();

      setUser(user);

      setLoading(false);
    }


    getUser();


    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event, session) => {

        setUser(session?.user ?? null);

      }
    );


    return () => {

      subscription.unsubscribe();

    };

  }, []);


  if (loading) {

    return (

      <Box
        sx={{
          minHeight: "100vh",
          backgroundColor: "#F5F7FA",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >

        <Typography
          sx={{
            color: "#00897B",
            fontWeight: "bold",
          }}
        >
          Loading...
        </Typography>

      </Box>

    );
  }

  // console.log(user.user_metadata.name);
  if (!user) {

    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }


  return children;
}


// ==========================================
// Layout
// ==========================================

function Layout({ children }) {

  return (

    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >

      
      {/* محتوى الصفحة */}
      <Box
        sx={{
          flex: 1,
        }}
      >
        {children}
      </Box>

     
    </Box>
  );
}


// ==========================================
// App
// ==========================================

function App() {

  return (

    <BrowserRouter>

      <Routes>

        {/* Login */}

        <Route
          path="/login"
          element={
            <Layout>
              <Login />
            </Layout>
          }
        />


        {/* Register */}

        <Route
          path="/register"
          element={
            <Layout>
              <Register />
            </Layout>
          }
        />


        {/* صفحة المهام */}

        <Route
          path="/"
          element={
            <Layout>

              <ProtectedRoute>
                <TasksPage />
              </ProtectedRoute>

            </Layout>
          }
        />


        {/* أي رابط غير موجود */}

        <Route
          path="*"
          element={
            <Navigate
              to="/login"
              replace
            />
          }
        />

      </Routes>

    </BrowserRouter>
  );
}


export default App;

