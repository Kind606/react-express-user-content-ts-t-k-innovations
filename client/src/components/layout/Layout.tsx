import { Container } from "@mui/material";
import { Outlet } from "react-router-dom";
import Footer from "./footer";
import Header from "./header";

const Layout = () => {
  return (
    <div className="app-container">
      <Header />
      <main className="main-content">
        <Container maxWidth="lg">
          <Outlet />
        </Container>
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
