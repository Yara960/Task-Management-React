// استيراد useState من React
import { useState } from "react";

// إنشاء دالة اسمها App
function App() {

  // task يخزن المهمة الحالية، و setTask تستخدم لتغيير قيمتها
  const [task, setTask] = useState("");

  // إنشاء state لتخزين قائمة جميع المهام
  // tasks لتخزين المهام، و setTasks لتحديث قائمة المهام
  const [tasks, setTasks] = useState([]);

  return (
    <div>

      {/* إرجاع وعرض عنوان الصفحة */}
      <h1>Task Management</h1>

      {/* عند الكتابة يتم تحديث task بقيمة input الحالية */}
      <input
        value={task}
        onChange={(e) => setTask(e.target.value)}
      />

      {/* عند الضغط على Add يتم إضافة المهمة إلى قائمة المهام ثم إفراغ input */}
      <button
        onClick={() => {
          setTasks([...tasks, task]);
          setTask("");
        }}
      >
        Add
      </button>

      {/* استخدام map للمرور على جميع المهام وعرضها */}
      {tasks.map((task, index) => (
        <p key={index}>{task}</p>
      ))}

    </div>
  );
}

// App تصدير لاستخدامه في ملفات أخرى
export default App;