import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllUsers,
  updateUserRole,
  deleteUser,
} from "../services/adminService";
import { getAllPosts, deletePost } from "../services/postService";
import { useAuth } from "../hooks/useAuth";

const AdminPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState("users");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  if (!user?.isAdmin) {
    navigate("/", {
      state: { error: "You do not have permission to access the admin page" },
    });
    return null;
  }

  const {
    data: users,
    isLoading: isLoadingUsers,
    isError: isUsersError,
    error: usersError,
  } = useQuery({
    queryKey: ["users"],
    queryFn: getAllUsers,
    enabled: activeTab === "users",
  });

  const {
    data: posts,
    isLoading: isLoadingPosts,
    isError: isPostsError,
    error: postsError,
  } = useQuery({
    queryKey: ["allPosts"],
    queryFn: getAllPosts,
    enabled: activeTab === "posts",
  });

  const updateRoleMutation = useMutation({
    mutationFn: updateUserRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setSuccess("User role updated successfully");

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(""), 3000);
    },
    onError: (error: Error) => {
      setError(error.message || "Failed to update user role");
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setSuccess("User deleted successfully");

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(""), 3000);
    },
    onError: (error: Error) => {
      setError(error.message || "Failed to delete user");
    },
  });

  const deletePostMutation = useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allPosts"] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      setSuccess("Post deleted successfully");

      setTimeout(() => setSuccess(""), 3000);
    },
    onError: (error: Error) => {
      setError(error.message || "Failed to delete post");
    },
  });

  const handleRoleToggle = (userId: string, currentIsAdmin: boolean) => {
    if (userId === user._id) {
      setError("You cannot change your own admin status");
      return;
    }

    updateRoleMutation.mutate({
      userId,
      isAdmin: !currentIsAdmin,
    });
  };

  const handleDeleteUser = (userId: string) => {
    if (userId === user._id) {
      setError("You cannot delete your own account");
      return;
    }

    if (
      window.confirm(
        "Are you sure you want to delete this user? This action cannot be undone."
      )
    ) {
      deleteUserMutation.mutate(userId);
    }
  };

  const handleDeletePost = (postId: string) => {
    if (
      window.confirm(
        "Are you sure you want to delete this post? This action cannot be undone."
      )
    ) {
      deletePostMutation.mutate(postId);
    }
  };

  return (
    <div className="admin-page">
      <h1>Admin Dashboard</h1>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <div className="admin-tabs">
        <button
          className={`tab-button ${activeTab === "users" ? "active" : ""}`}
          onClick={() => setActiveTab("users")}
        >
          Manage Users
        </button>
        <button
          className={`tab-button ${activeTab === "posts" ? "active" : ""}`}
          onClick={() => setActiveTab("posts")}
        >
          Manage Posts
        </button>
      </div>

      <div className="admin-content">
        {activeTab === "users" && (
          <div className="users-section">
            <h2>Users</h2>

            {isLoadingUsers ? (
              <div className="loading">Loading users...</div>
            ) : isUsersError ? (
              <div className="error-message">
                Error: {usersError?.message || "Failed to load users"}
              </div>
            ) : users && users.length > 0 ? (
              <table className="users-table">
                <thead>
                  <tr>
                    <th>Username</th>
                    <th>Role</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id}>
                      <td>{user.username}</td>
                      <td>{user.isAdmin ? "Admin" : "User"}</td>
                      <td>
                        <button
                          className="role-button"
                          onClick={() =>
                            handleRoleToggle(user._id, user.isAdmin)
                          }
                          disabled={updateRoleMutation.isPending}
                        >
                          {user.isAdmin ? "Remove Admin" : "Make Admin"}
                        </button>
                        <button
                          className="delete-button"
                          onClick={() => handleDeleteUser(user._id)}
                          disabled={deleteUserMutation.isPending}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="no-data">No users found</div>
            )}
          </div>
        )}

        {activeTab === "posts" && (
          <div className="posts-section">
            <h2>Posts</h2>

            {isLoadingPosts ? (
              <div className="loading">Loading posts...</div>
            ) : isPostsError ? (
              <div className="error-message">
                Error: {postsError?.message || "Failed to load posts"}
              </div>
            ) : posts && posts.length > 0 ? (
              <table className="posts-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Author</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {posts.map((post) => (
                    <tr key={post._id}>
                      <td>{post.title}</td>
                      <td>{post.author.username}</td>
                      <td>{new Date(post.createdAt).toLocaleDateString()}</td>
                      <td>
                        <button
                          className="view-button"
                          onClick={() => navigate(`/posts/${post._id}`)}
                        >
                          View
                        </button>
                        <button
                          className="edit-button"
                          onClick={() => navigate(`/posts/${post._id}/edit`)}
                        >
                          Edit
                        </button>
                        <button
                          className="delete-button"
                          onClick={() => handleDeletePost(post._id)}
                          disabled={deletePostMutation.isPending}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="no-data">No posts found</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
