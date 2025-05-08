import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { deleteUser, getAllUsers, updateUser } from "../services/authService";
import { User } from "../types/User";

const AdminPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [newRole, setNewRole] = useState<boolean>(false);

  const {
    data: users,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["users"],
    queryFn: getAllUsers,
  });

  const updateUserMutation = useMutation({
    mutationFn: (data: { id: string; isAdmin: boolean }) =>
      updateUser(data.id, { isAdmin: data.isAdmin }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setEditingUser(null);
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: (id: string) => deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  useEffect(() => {
    if (user && !user.isAdmin) {
      navigate("/");
    } else if (!user) {
      navigate("/login", {
        state: {
          message: "You must be logged in as an admin to view this page",
        },
      });
    }
  }, [user, navigate]);

  if (!user || (user && !user.isAdmin)) {
    return null;
  }

  const handleRoleChange = (userId: string, isAdmin: boolean) => {
    if (user && userId === user._id) {
      if (
        !confirm(
          "Are you sure you want to change your own admin status? This might lock you out of the admin panel."
        )
      ) {
        return;
      }
    }
    updateUserMutation.mutate({ id: userId, isAdmin });
  };

  const handleDeleteUser = (userId: string, username: string) => {
    if (user && userId === user._id) {
      alert("You cannot delete your own account while logged in");
      return;
    }

    if (confirm(`Are you sure you want to delete user ${username}?`)) {
      deleteUserMutation.mutate(userId);
    }
  };

  const handleEditClick = (user: User) => {
    setEditingUser(user);
    setNewRole(user.isAdmin);
  };

  const submitRoleChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUser) {
      handleRoleChange(editingUser._id, newRole);
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ textAlign: "center", marginTop: 4 }}>
        <CircularProgress />
        <Typography variant="body1" sx={{ marginTop: 2 }}>
          Loading users...
        </Typography>
      </Box>
    );
  }

  if (isError) {
    return (
      <Box sx={{ textAlign: "center", marginTop: 4 }}>
        <Alert severity="error">
          {error?.message || "Failed to load users"}
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 800, margin: "50px auto", padding: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom
      sx={{ color: "#8f7474", borderBottom: "2px solid #8f7474", paddingBottom: 2 }}>
        Admin Dashboard
      </Typography>
      <Typography variant="h6" component="h2" gutterBottom>
        User Management
      </Typography>

      <TableContainer component={Paper} sx={{ marginBottom: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Username</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users?.map((user: User) => (
              <TableRow key={user._id}>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.isAdmin ? "Admin" : "User"}</TableCell>
                <TableCell>
                  <Button
                    onClick={() => handleEditClick(user)}
                    variant="outlined"
                    size="small"
                    sx={{
                      marginRight: 1,
                      color: "#8f7474",
                      borderColor: "#8f7474",
                      "&:hover": {
                        backgroundColor: "#655353",
                        color: "white",
                        borderColor: "#655353",
                      },
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDeleteUser(user._id, user.username)}
                    variant="outlined"
                    size="small"
                    sx={{
                      color: "#8f7474",
                      borderColor: "#8f7474",
                      "&:hover": {
                        backgroundColor: "#655353",
                        color: "white",
                        borderColor: "#655353",
                      },
                    }}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {editingUser && (
        <Dialog open={!!editingUser} onClose={() => setEditingUser(null)}>
          <DialogTitle>Edit User: {editingUser.username}</DialogTitle>
          <DialogContent>
            <FormControl fullWidth sx={{ marginBottom: 2 }}>
              <InputLabel>Role</InputLabel>
              <Select
                value={newRole ? "admin" : "user"}
                onChange={(e) => setNewRole(e.target.value === "admin")}
              >
                <MenuItem value="user">User</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setEditingUser(null)}
              variant="outlined"
              sx={{
                color: "#8f7474",
                borderColor: "#8f7474",
                "&:hover": {
                  backgroundColor: "#655353",
                  color: "white",
                  borderColor: "#655353",
                },
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={submitRoleChange}
              variant="contained"
              sx={{
                backgroundColor: "#8f7474",
                color: "white",
                "&:hover": {
                  backgroundColor: "#655353",
                },
              }}
            >
              Save Changes
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
};

export default AdminPage;
