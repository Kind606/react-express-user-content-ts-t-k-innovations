import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { getAllUsers, updateUser, deleteUser } from "../services/authService";
import { useAuth } from "../hooks/useAuth";
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
    return <div className="loading">Loading users...</div>;
  }

  if (isError) {
    return (
      <div className="error-message">
        Error: {error?.message || "Failed to load users"}
      </div>
    );
  }

  return (
    <div className="admin-page">
      <h1>Admin Dashboard</h1>
      <h2>User Management</h2>

      <div className="user-list">
        <table>
          <thead>
            <tr>
              <th>Username</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users?.map((user: User) => (
              <tr key={user._id}>
                <td>{user.username}</td>
                <td>{user.isAdmin ? "Admin" : "User"}</td>
                <td>
                  <button
                    onClick={() => handleEditClick(user)}
                    className="edit-button"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteUser(user._id, user.username)}
                    className="delete-button"
                    disabled={deleteUserMutation.isPending}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingUser && (
        <div className="edit-user-modal">
          <div className="modal-content">
            <h3>Edit User: {editingUser.username}</h3>
            <form onSubmit={submitRoleChange}>
              <div className="form-group">
                <label>
                  Role:
                  <select
                    value={newRole ? "admin" : "user"}
                    onChange={(e) => setNewRole(e.target.value === "admin")}
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </label>
              </div>
              <div className="form-actions">
                <button type="submit" className="save-button">
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="cancel-button"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
