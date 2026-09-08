// استيراد React
import { createContext, useContext, useEffect, useMemo, useState } from "react";

// استيراد Material UI Theme
import { createTheme, ThemeProvider } from "@mui/material/styles";

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

        mode: darkMode ? "dark" : "light",


        // الألوان الأساسية
        primary: {
          main: darkMode ? "#80CBC4" : "#00897B",
        },


        secondary: {
          main: darkMode ? "#F48FB1" : "#E91E63",
        },


        // ألوان الخلفية
        background: {

          default: darkMode
            ? "#0F172A"
            : "#F5F7FA",

          paper: darkMode
            ? "#1E293B"
            : "#FFFFFF",
        },


        // ألوان النصوص
        text: {

          primary: darkMode
            ? "#FFFFFF"
            : "#263238",

          secondary: darkMode
            ? "#CBD5E1"
            : "#546E7A",
        },
      },


      // =================================================
      // تخصيص Material UI
      // =================================================

      components: {

        // Paper
        MuiPaper: {

          styleOverrides: {

            root: {

              backgroundImage: "none",

              border: darkMode
                ? "1px solid #334155"
                : "1px solid #E5E7EB",

              transition: "background-color 0.3s, border-color 0.3s",
            },
          },
        },


        // TextField
        MuiTextField: {

          styleOverrides: {

            root: {

              "& .MuiOutlinedInput-root": {

                backgroundColor: darkMode
                  ? "#273449"
                  : "#FFFFFF",

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
              },

              "& .MuiInputLabel-root": {

                color: darkMode
                  ? "#CBD5E1"
                  : "#546E7A",
              },
            },
          },
        },


        // Select
        MuiSelect: {

          styleOverrides: {

            root: {

              backgroundColor: darkMode
                ? "#273449"
                : "#FFFFFF",
            },
          },
        },


        // Button
        MuiButton: {

          styleOverrides: {

            root: {

              textTransform: "none",

              borderRadius: "10px",

              fontWeight: 600,
            },
          },
        },


        // AppBar
        MuiAppBar: {

          styleOverrides: {

            root: {

              backgroundColor: darkMode
                ? "#0B1120"
                : "#263238",

              backgroundImage: "none",

              boxShadow: darkMode
                ? "0 2px 10px rgba(0,0,0,0.4)"
                : "0 2px 10px rgba(0,0,0,0.15)",
            },
          },
        },
      },
    });

  }, [darkMode]);


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
// Hook لاستخدام Dark Mode
// =====================================================

export function useAppTheme() {

  return useContext(ThemeContext);
}