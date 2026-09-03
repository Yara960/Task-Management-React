import Button from "@mui/material/Button";

function CustomButton({
  children,
  onClick,
  color = "primary",
  variant = "contained",
}) {
  const isDelete = children === "Delete";
  const isEdit = children === "Edit";
  const isUpdate = children === "Update";

  return (
    <Button
      variant={variant}
      color={color}
      onClick={onClick}
      sx={{
        margin: "2px",
        minWidth: "40px",
        width: "40px",
        height: "28px",
        padding: "2px",
        borderRadius: "8px",
        textTransform: "none",
        fontSize: "13px",
        backgroundColor: "#ec407a",
        color: "white",

        "&:hover": {
          backgroundColor: "#d81b60",
        },
      }}
    >
      {isDelete
        ? "🗑️"
        : isEdit
        ? "✏️"
        : isUpdate
        ? "✏️"
        : children}
    </Button>
  );
}

export default CustomButton;