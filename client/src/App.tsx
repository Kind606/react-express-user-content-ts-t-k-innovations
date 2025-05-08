import { Box, CircularProgress } from "@mui/material";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./components/layout/Layout";
import { useAuth } from "./hooks/useAuth";
import AdminPage from "./pages/AdminPage";
import CreatePostPage from "./pages/CreatePostPage";
import EditPostPage from "./pages/EditPostPage";
import ErrorPage from "./pages/ErrorPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import PostDetailPage from "./pages/PostDetailPage";
import PostsPage from "./pages/PostsPage";
import RegisterPage from "./pages/RegisterPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "login", element: <LoginPage /> },
      { path: "register", element: <RegisterPage /> },
      { path: "posts", element: <PostsPage /> },
      { path: "posts/:id", element: <PostDetailPage /> },
      { path: "posts/:id/edit", element: <EditPostPage /> },
      { path: "create-post", element: <CreatePostPage /> },
      { path: "admin", element: <AdminPage /> },
      { path: "*", element: <ErrorPage /> },
    ],
  },
]);

function App() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return <RouterProvider router={router} />;
}

export default App;
