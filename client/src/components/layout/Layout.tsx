import { Outlet } from "react-router";
import { Header } from "./Header";
import { Footer } from "./Footer";

const Layout = () => {
  return (
    <div className="app-container">
      <Header />
      <main className="main-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
