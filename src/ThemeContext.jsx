
// استيراد React
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

// استيراد Material UI Theme
import {
  createTheme,
  ThemeProvider,
} from "@mui/material/styles";

// إنشاء Context للـ Theme
const ThemeContext = createContext();


// =====================================================
// Theme Provider
// =====================================================

export function AppThemeProvider({ children }) {

  // قراءة الوضع المحفوظ
  const [darkMode, setDarkMode] = useState(() => {

    const savedMode = localStorage.getItem("darkMode");

    return savedMode === "true";
  });


  // =====================================================
  // تغيير الوضع
  // =====================================================

  const toggleDarkMode = () => {

    setDarkMode((previousMode) => !previousMode);

  };


  // =====================================================
  // حفظ الوضع وتطبيق Dark Mode على Tailwind
  // =====================================================

  useEffect(() => {

    // حفظ الاختيار
    localStorage.setItem("darkMode", darkMode);


    // إضافة أو إزالة dark من HTML
    if (darkMode) {

      document.documentElement.classList.add("dark");

    } else {

      document.documentElement.classList.remove("dark");

    }

  }, [darkMode]);


  // =====================================================
  // Material UI Theme
  // =====================================================

  const theme = useMemo(() => {

    return createTheme({

      palette: {

        // Light / Dark
        mode: darkMode ? "dark" : "light",


        // =================================================
        // اللون الأساسي
        // =================================================

        primary: {

          main: darkMode
            ? "#80CBC4"
            : "#00897B",

        },


        // =================================================
        // اللون الثانوي
        // =================================================

        secondary: {

          main: darkMode
            ? "#F48FB1"
            : "#E91E63",

        },


        // =================================================
        // الخلفيات
        // =================================================

        background: {

          default: darkMode
            ? "#0F172A"
            : "#F4F7F9",

          paper: darkMode
            ? "#1E293B"
            : "#FFFFFF",

        },


        // =================================================
        // النصوص
        // =================================================

        text: {

          primary: darkMode
            ? "#F8FAFC"
            : "#263238",

          secondary: darkMode
            ? "#CBD5E1"
            : "#607D8B",

        },

      },


      // =====================================================
      // تخصيص Material UI
      // =====================================================

      components: {


        // =================================================
        // Paper / Cards
        // =================================================

        MuiPaper: {

          styleOverrides: {

            root: {

              backgroundImage: "none",

              backgroundColor: darkMode
                ? "#1E293B"
                : "#FFFFFF",

              border: darkMode
                ? "1px solid #334155"
                : "1px solid #E2E8F0",

              boxShadow: darkMode
                ? "0 4px 15px rgba(0,0,0,0.20)"
                : "0 4px 15px rgba(15,23,42,0.06)",

              transition:
                "background-color 0.3s, border-color 0.3s, box-shadow 0.3s",

            },

          },

        },


        // =================================================
        // TextField
        // =================================================

        MuiTextField: {

          styleOverrides: {

            root: {

              "& .MuiOutlinedInput-root": {

                backgroundColor: darkMode
                  ? "#273449"
                  : "#FFFFFF",

                borderRadius: "10px",

                "& fieldset": {

                  borderColor: darkMode
                    ? "#475569"
                    : "#CBD5E1",

                },

                "&:hover fieldset": {

                  borderColor: darkMode
                    ? "#80CBC4"
                    : "#00897B",

                },

                "&.Mui-focused fieldset": {

                  borderColor: darkMode
                    ? "#80CBC4"
                    : "#00897B",

                },

              },


              "& .MuiInputLabel-root": {

                color: darkMode
                  ? "#CBD5E1"
                  : "#607D8B",

              },


              "& .MuiInputLabel-root.Mui-focused": {

                color: darkMode
                  ? "#80CBC4"
                  : "#00897B",

              },

            },

          },

        },


        // =================================================
        // Select
        // =================================================

        MuiSelect: {

          styleOverrides: {

            root: {

              backgroundColor: darkMode
                ? "#273449"
                : "#FFFFFF",

              borderRadius: "10px",

            },

          },

        },


        // =================================================
        // Buttons
        // =================================================

        MuiButton: {

          styleOverrides: {

            root: {

              textTransform: "none",

              borderRadius: "10px",

              fontWeight: 600,

            },

          },

        },


        // =================================================
        // AppBar / Navbar
        // =================================================

        MuiAppBar: {

          styleOverrides: {

            root: {

              // الوضع الليلي
              // الوضع النهاري
              backgroundColor: darkMode
                ? "#1E293B"
                : "#FFFFFF",

              color: darkMode
                ? "#F8FAFC"
                : "#263238",

              backgroundImage: "none",

              borderBottom: darkMode
                ? "1px solid #334155"
                : "1px solid #E2E8F0",

              boxShadow: darkMode
                ? "0 2px 10px rgba(15,23,42,0.30)"
                : "0 2px 10px rgba(15,23,42,0.08)",

              transition:
                "background-color 0.3s, color 0.3s, border-color 0.3s",

            },

          },

        },


        // =================================================
        // Avatar
        // =================================================

        MuiAvatar: {

          styleOverrides: {

            root: {

              transition: "background-color 0.3s",

            },

          },

        },

      },

    });

  }, [darkMode]);


  // =====================================================
  // Provider
  // =====================================================

  return (

    <ThemeContext.Provider
      value={{
        darkMode,
        toggleDarkMode,
      }}
    >

      <ThemeProvider theme={theme}>

        {children}

      </ThemeProvider>

    </ThemeContext.Provider>

  );

}


// =====================================================
// Hook لاستخدام Theme
// =====================================================

export function useAppTheme() {

  return useContext(ThemeContext);

}

