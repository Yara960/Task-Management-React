import Button from "@mui/material/Button";

function CustomButton({
  children,
  onClick,
  color = "primary",
  variant = "contained",
}) {
  return (
    <Button
      variant={variant}
      color={color}
      onClick={onClick}
      sx={{
        margin: "5px",
        borderRadius: "8px",
        textTransform: "none",
      }}
    >
      {children}
    </Button>
  );
}

export default CustomButton;