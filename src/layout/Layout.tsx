// Layout.js
import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import HeaderV2 from "@/components/pages/Header.v2";
import Footer from "../components/Footer";

const Layout = () => {
  return (
    <div>
      <Header />
      <HeaderV2 />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
