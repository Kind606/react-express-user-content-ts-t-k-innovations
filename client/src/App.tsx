import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./components/layout/Layout";
import HomePage from "./pages/HomePage";
import PostsPage from "./pages/PostsPage";
// import PostDetailPage from "./pages/PostDetailPage";
// import CreatePostPage from "./pages/CreatePostPage";
// import AdminPage from "./pages/AdminPage";
import ErrorPage from "./pages/ErrorPage";

import "./App.css";
import LoginPage from "./pages/LoginPage";
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
      // { path: "posts/:id", element: <PostDetailPage /> },
      // { path: "create-post", element: <CreatePostPage /> },
      // { path: "admin", element: <AdminPage /> },
      { path: "*", element: <ErrorPage /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
