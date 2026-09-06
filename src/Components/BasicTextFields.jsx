import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";

function BasicTextFields({ value, onChange }) {
  return (
    <Box>
      <TextField
        label="Task Name"
        variant="outlined"
        required
        value={value}
        onChange={onChange}
        sx={{
          width: "350px",

          "& .MuiOutlinedInput-root": {
            borderRadius: "12px",
          },
        }}
      />
    </Box>
  );
}

export default BasicTextFields;