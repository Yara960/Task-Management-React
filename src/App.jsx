import { useState } from "react";
import "./App.css";
function App() {

  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);
  return (
    <div>

      <h1>📝 إدارة المهام</h1>

      <input
        type="text"
        placeholder="اكتب مهمة"
        value={task}
        onChange={(e) => setTask(e.target.value)}
      />

      <button onClick={() => setTasks([...tasks, task])}>
  إضافة
</button>

<ul>
  {tasks.map((item, index) => (
    <li key={index}>
      {item}

      <button onClick={() => setTasks(tasks.filter((_, i) => i !== index))}>
        حذف
      </button>

    </li>
  ))}
</ul>
      

    </div>
  );
}

export default App;