
// استيراد مكونات Material UI
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";

// استيراد أيقونة المهام
import TaskAltIcon from "@mui/icons-material/TaskAlt";


// ==========================================
// Footer
// ==========================================

function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        width: "100%",
        backgroundColor: "#263238",
        color: "#FFFFFF",
        marginTop: "auto",
      }}
    >
    

      {/* محتوى الفوتر */}
      <Box
        sx={{
          maxWidth: "1200px",
          margin: "0 auto",

          padding: {
            xs: "25px 20px",
            sm: "30px",
          },
        }}
      >

        {/* القسم الرئيسي */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",

            flexWrap: "wrap",
            gap: "20px",
          }}
        >

          {/* اسم المشروع */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >

            {/* أيقونة */}
            <Box
              sx={{
                width: "42px",
                height: "42px",
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
                  fontSize: "23px",
                }}
              />
            </Box>


            {/* النص */}
            <Box>

              <Typography
                sx={{
                  fontSize: "17px",
                  fontWeight: "bold",
                  color: "#FFFFFF",
                }}
              >
                Task Management
              </Typography>

              <Typography
                sx={{
                  fontSize: "12px",
                  color: "#B0BEC5",
                  marginTop: "3px",
                }}
              >
                Manage your tasks easily
              </Typography>

            </Box>

          </Box>


          {/* النص الجانبي */}
          <Typography
            sx={{
              color: "#B0BEC5",
              fontSize: "13px",
            }}
          >
            Stay organized. Stay productive.
          </Typography>

        </Box>


        {/* خط فاصل */}
        <Divider
          sx={{
            margin: "22px 0 15px",
            borderColor: "rgba(255,255,255,0.12)",
          }}
        />


        {/* حقوق المشروع */}
        <Typography
          sx={{
            textAlign: "center",
            color: "#90A4AE",
            fontSize: "12px",
          }}
        >
          © 2026 Task Management. All rights reserved.
        </Typography>

      </Box>

    </Box>
  );
}


// تصدير Footer
export default Footer;

