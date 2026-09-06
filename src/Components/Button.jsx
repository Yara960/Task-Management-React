import Button from "@mui/material/Button";

function CustomButton({
  children,
  onClick,
}) {
  const isDelete = children === "Delete";
  const isEdit = children === "Edit";

  return (
    <Button
      onClick={onClick}
      variant={isEdit || isDelete ? "outlined" : "contained"}
      color={isDelete ? "error" : isEdit ? "warning" : "primary"}
      sx={{
        margin: "4px",
        textTransform: "none",
      }}
    >
      {children}
    </Button>
  );
}

export default CustomButton;