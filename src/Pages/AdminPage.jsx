import { useEffect, useState } from "react";

import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Chip from "@mui/material/Chip";

import { supabase } from "../supabaseClient";

function AdminPage() {
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);

  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingTasks, setLoadingTasks] = useState(true);

  const [message, setMessage] = useState("");

  // Search users
  const [searchUser, setSearchUser] = useState("");

  // Get users
  async function getUsers() {
    setLoadingUsers(true);

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .order("id");

    if (error) {
      console.error("Error getting users:", error);
      setMessage("Error loading users");
    } else {
      setUsers(data || []);
    }

    setLoadingUsers(false);
  }

  // Get tasks
  async function getTasks() {
    setLoadingTasks(true);

    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      console.error("Error getting tasks:", error);
      setMessage("Error loading tasks");
    } else {
      setTasks(data || []);
    }

    setLoadingTasks(false);
  }

  // Get data when the page opens
  useEffect(() => {
    getUsers();
    getTasks();
  }, []);

  // Change user role
  async function changeRole(id, newRole) {
    const { error } = await supabase
      .from("profiles")
      .update({
        role: newRole,
      })
      .eq("id", id);

    if (error) {
      console.error("Error changing role:", error);
      setMessage("Error changing user role");
      return;
    }

    setMessage("User role changed successfully");

    getUsers();
  }

  // Activate or deactivate user
  async function toggleUser(id, currentStatus) {
    const newStatus = currentStatus === 1 ? 0 : 1;

    const { error } = await supabase
      .from("profiles")
      .update({
        is_active: newStatus,
      })
      .eq("id", id);

    if (error) {
      console.error("Error changing account status:", error);
      setMessage("Error changing account status");
      return;
    }

    setMessage(
      newStatus === 1
        ? "Account activated successfully"
        : "Account deactivated successfully"
    );

    getUsers();
  }

  // Delete user
  async function deleteUser(id) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this account?"
    );

    if (!confirmDelete) {
      return;
    }

    const { error } = await supabase
      .from("profiles")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting user:", error);
      setMessage("Error deleting account");
      return;
    }

    setMessage("Account deleted successfully");

    getUsers();
  }

  // Update task
  async function updateTask(id, newTask, newPriority) {
    if (!newTask.trim()) {
      setMessage("Task is required");
      return;
    }

    const { error } = await supabase
      .from("tasks")
      .update({
        task: newTask.trim(),
        priority: newPriority,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) {
      console.error("Error updating task:", error);
      setMessage("Error updating task");
      return;
    }

    setMessage("Task updated successfully");

    getTasks();
  }

  // Delete task
  async function deleteTask(id) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmDelete) {
      return;
    }

    const { error } = await supabase
      .from("tasks")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting task:", error);
      setMessage("Error deleting task");
      return;
    }

    setMessage("Task deleted successfully");

    getTasks();
  }

  // Search users by name or email
  const filteredUsers = users.filter((user) => {
    const search = searchUser.toLowerCase().trim();

    if (!search) {
      return true;
    }

    const name = String(user.name || "").toLowerCase();
    const email = String(user.email || "").toLowerCase();
    const id = String(user.id || "").toLowerCase();

    return (
      name.includes(search) ||
      email.includes(search) ||
      id.includes(search)
    );
  });

  return (
    <Box
      sx={{
        padding: 4,
        maxWidth: 1200,
        margin: "auto",
      }}
    >
      {/* Page title */}
      <Typography
        variant="h4"
        sx={{
          fontWeight: "bold",
          marginBottom: 3,
        }}
      >
        Admin Dashboard
      </Typography>

      {/* Messages */}
      {message && (
        <Typography
          sx={{
            marginBottom: 3,
            fontWeight: "bold",
          }}
        >
          {message}
        </Typography>
      )}

      {/* ================= Users ================= */}

      <Typography
        variant="h5"
        sx={{
          fontWeight: "bold",
          marginBottom: 2,
        }}
      >
        User Management
      </Typography>

      {/* Search */}
      <TextField
        fullWidth
        label="Search user by name or email"
        value={searchUser}
        onChange={(event) => setSearchUser(event.target.value)}
        sx={{
          marginBottom: 3,
        }}
      />

      {loadingUsers ? (
        <Typography>Loading users...</Typography>
      ) : filteredUsers.length === 0 ? (
        <Typography>No users found</Typography>
      ) : (
        filteredUsers.map((user) => (
          <Paper
            key={user.id}
            sx={{
              padding: 3,
              marginBottom: 2,
            }}
          >
            {/* User name */}
            {user.name && (
              <Typography
                sx={{
                  marginBottom: 1,
                }}
              >
                <strong>Name:</strong> {user.name}
              </Typography>
            )}

            {/* User email */}
            {user.email && (
              <Typography
                sx={{
                  marginBottom: 1,
                }}
              >
                <strong>Email:</strong> {user.email}
              </Typography>
            )}

            {/* User ID */}
            <Typography
              sx={{
                marginBottom: 1,
                wordBreak: "break-all",
              }}
            >
              <strong>ID:</strong> {user.id}
            </Typography>

            {/* Status */}
            <Typography
              sx={{
                marginBottom: 2,
              }}
            >
              <strong>Status:</strong>{" "}
              {user.is_active === 1 ? "Active" : "Inactive"}
            </Typography>

            {/* Role */}
            <FormControl
              sx={{
                minWidth: 180,
                marginRight: 2,
                marginBottom: 2,
              }}
            >
              <InputLabel>Role</InputLabel>

              <Select
                value={user.role || "USER"}
                label="Role"
                onChange={(event) =>
                  changeRole(
                    user.id,
                    event.target.value
                  )
                }
              >
                <MenuItem value="USER">
                  USER
                </MenuItem>

                <MenuItem value="SUPERADMIN">
                  SUPERADMIN
                </MenuItem>
              </Select>
            </FormControl>

            {/* Activate / Deactivate */}
            <Button
              variant="contained"
              sx={{
                marginRight: 1,
                marginBottom: 2,
              }}
              onClick={() =>
                toggleUser(
                  user.id,
                  user.is_active
                )
              }
            >
              {user.is_active === 1
                ? "Deactivate Account"
                : "Activate Account"}
            </Button>

            {/* Delete user */}
            <Button
              variant="contained"
              color="error"
              sx={{
                marginBottom: 2,
              }}
              onClick={() =>
                deleteUser(user.id)
              }
            >
              Delete Account
            </Button>
          </Paper>
        ))
      )}

      {/* ================= Tasks ================= */}

      <Typography
        variant="h5"
        sx={{
          fontWeight: "bold",
          marginTop: 5,
          marginBottom: 2,
        }}
      >
        Task Management
      </Typography>

      {loadingTasks ? (
        <Typography>Loading tasks...</Typography>
      ) : tasks.length === 0 ? (
        <Typography>No tasks found</Typography>
      ) : (
        tasks.map((task) => (
          <TaskAdminItem
            key={task.id}
            task={task}
            onUpdate={updateTask}
            onDelete={deleteTask}
          />
        ))
      )}
    </Box>
  );
}


// =====================================================
// Task Admin Item
// =====================================================

function TaskAdminItem({
  task,
  onUpdate,
  onDelete,
}) {
  const [taskText, setTaskText] = useState(
    task.task || ""
  );

  const [priority, setPriority] = useState(
    task.priority || "NORMAL"
  );

  const [taskError, setTaskError] = useState("");

  const handleUpdate = () => {
    if (!taskText.trim()) {
      setTaskError("Task is required");
      return;
    }

    setTaskError("");

    onUpdate(
      task.id,
      taskText,
      priority
    );
  };

  return (
    <Paper
      sx={{
        padding: 3,
        marginBottom: 2,
      }}
    >
      {/* Task ID */}
      <Typography
        sx={{
          marginBottom: 2,
        }}
      >
        <strong>ID:</strong> {task.id}
      </Typography>

      {/* Task */}
      <TextField
        fullWidth
        label="Task"
        value={taskText}
        error={Boolean(taskError)}
        helperText={taskError}
        onChange={(event) => {
          setTaskText(event.target.value);

          if (event.target.value.trim()) {
            setTaskError("");
          }
        }}
        sx={{
          marginBottom: 2,
        }}
      />

      {/* Priority */}
      <FormControl
        sx={{
          minWidth: 160,
          marginRight: 2,
          marginBottom: 2,
        }}
      >
        <InputLabel>Priority</InputLabel>

        <Select
          value={priority}
          label="Priority"
          onChange={(event) =>
            setPriority(event.target.value)
          }
        >
          <MenuItem value="NORMAL">
            Normal
          </MenuItem>

          <MenuItem value="URGENT">
            Urgent
          </MenuItem>
        </Select>
      </FormControl>

      {/* Current priority */}
      <Box
        sx={{
          marginBottom: 2,
        }}
      >
        <Chip
          label={
            priority === "URGENT"
              ? "Urgent"
              : "Normal"
          }
        />
      </Box>

      {/* Update */}
      <Button
        variant="contained"
        sx={{
          marginRight: 1,
        }}
        onClick={handleUpdate}
      >
        Update Task
      </Button>

      {/* Delete */}
      <Button
        variant="contained"
        color="error"
        onClick={() =>
          onDelete(task.id)
        }
      >
        Delete Task
      </Button>
    </Paper>
  );
}

export default AdminPage;