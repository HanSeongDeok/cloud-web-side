// Layout.js
import { Outlet } from "react-router-dom";
import HeaderV2 from "@/header/Header.v2";
import Footer from "../footer/Footer";

const Layout = () => {
  return (
    <div>
      {/* <Header /> */}
      <HeaderV2 />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
