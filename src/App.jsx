// استيراد useState و useEffect من React
import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";


import CustomButton from "./Components/Button";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";


// إنشاء دالة اسمها App
function App() {
  // task يخزن المهمة الحالية
  const [task, setTask] = useState("");

  // tasks تخزن جميع المهام
  const [tasks, setTasks] = useState([]);

  // editingId يخزن ID المهمة التي نريد تعديلها
  const [editingId, setEditingId] = useState(null);

  // جلب المهام من Supabase
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

  // إضافة أو تعديل مهمة
  async function addTask() {
    if (editingId !== null) {
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

  // حذف مهمة
  async function deleteTask(id) {
    const { error } = await supabase
      .from("tasks")
      .delete()
      .eq("id", id);

    if (error) {
      console.log(error);
    } else {
      getTasks();
    }
  }

  // بدء تعديل مهمة
  function startEdit(task) {
    setTask(task.task);
    setEditingId(task.id);
  }

  return (
    
    <div>

       <Navbar />
     

      {/* عند الكتابة يتم تحديث task */}
      <input
        value={task}
        onChange={(e) => setTask(e.target.value)}
      />

      {/* إضافة أو تعديل المهمة */}
      <CustomButton onClick={addTask} color="primary">
        {editingId !== null ? "Update" : "Add"}
      </CustomButton>

      {/* المرور على جميع المهام وعرضها */}
      {tasks.map((task) => (
        <div key={task.id}>
          <p>{task.task}</p>

          <CustomButton
            onClick={() => startEdit(task)}
            color="warning"
          >
            Edit
          </CustomButton>

          <CustomButton
            onClick={() => deleteTask(task.id)}
            color="error"
          >
            Delete
          </CustomButton>
        </div>
      ))}
    <Footer />  

    </div>
  );
}

// تصدير App لاستخدامه في ملفات أخرى
export default App;

