// استيراد Routes الخاصة بالتطبيق
import AppRoutes from "./AppRoutes";
import Login from "./Pages/Auth/Login";
import Register from "./Pages/Auth/Register";
import "./App.css";
// المكون الرئيسي للتطبيق
function App() {
  return <AppRoutes />;
}

export default App;