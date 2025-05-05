import { createBrowserRouter, RouterProvider } from "react-router-dom";

import ProtectedRoute from "./components/auth/ProtectedRoute";
import Layout from "./components/layout/Layout";
import { AuthProvider } from "./context/AuthContext";
// import AdminPage from "./pages/AdminPage";
// import CreatePostPage from "./pages/CreatePostPage";
// import ErrorPage from "./pages/ErrorPage";
// import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import PostsPage from "./pages/PostsPage";
import RegisterPage from "./pages/RegisterPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    // errorElement: <ErrorPage />,
    children: [
      { index: true, element: <PostsPage /> },
      { path: "login", element: <LoginPage /> },
      { path: "register", element: <RegisterPage /> },
      { path: "posts", element: <PostsPage /> },
      // {
      //   path: "create-post",
      //   element: (
      //     <ProtectedRoute>
      //       <CreatePostPage />
      //     </ProtectedRoute>
      //   ),
      // },
      // {
      //   path: "admin",
      //   element: (
      //     <ProtectedRoute adminOnly>
      //       <AdminPage />
      //     </ProtectedRoute>
      //   ),
      // },
      // { path: "*", element: <ErrorPage /> },
    ],
  },
]);

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
