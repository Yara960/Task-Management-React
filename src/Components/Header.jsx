
// استيراد مكونات Material UI
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

// استيراد أيقونة المهام
import TaskAltIcon from "@mui/icons-material/TaskAlt";


// ==========================================
// Header
// ==========================================

function Header() {
  return (
    <Box
      component="header"
      sx={{
        width: "100%",
        backgroundColor: "#FFFFFF",
        borderBottom: "1px solid #E8ECEF",
        boxShadow: "0 2px 10px rgba(38, 50, 56, 0.05)",
      }}
    >

      {/* محتوى الهيدر */}
      <Box
        sx={{
          maxWidth: "1200px",
          margin: "0 auto",
          minHeight: "85px",

          display: "flex",
          alignItems: "center",

          padding: {
            xs: "0 20px",
            sm: "0 30px",
          },
        }}
      >

        {/* أيقونة المشروع */}
        <Box
          sx={{
            width: {
              xs: "45px",
              sm: "52px",
            },

            height: {
              xs: "45px",
              sm: "52px",
            },

            borderRadius: "15px",
            backgroundColor: "#E0F2F1",

            display: "flex",
            alignItems: "center",
            justifyContent: "center",

            marginRight: "14px",
          }}
        >
          <TaskAltIcon
            sx={{
              color: "#00897B",
              fontSize: {
                xs: "25px",
                sm: "29px",
              },
            }}
          />
        </Box>


        {/* اسم المشروع */}
        <Box>

          <Typography
            sx={{
              color: "#263238",
              fontSize: {
                xs: "21px",
                sm: "25px",
              },

              fontWeight: "800",
              letterSpacing: "-0.5px",
              lineHeight: 1.2,
            }}
          >
            Task Management
          </Typography>


          {/* الوصف الصغير */}
          <Typography
            sx={{
              color: "#78909C",
              fontSize: {
                xs: "12px",
                sm: "13px",
              },

              marginTop: "4px",
            }}
          >
            Manage your tasks easily
          </Typography>

        </Box>

      </Box>

    </Box>
  );
}


// تصدير Header
export default Header;

