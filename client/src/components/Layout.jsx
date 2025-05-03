import { Outlet } from "react-router-dom";
import Navbar from "./navbar";
import Sidebar from "./sidebar";
import { useState } from "react";

export default function Layout() {
  const [showSidebar, setShowSidebar] = useState(false);

  return (
    <>
      <Navbar toggle={setShowSidebar} />

      <Sidebar onClose={() => setShowSidebar(false)} isOpen={showSidebar} />

      <main>
        <Outlet />
      </main>
    </>
  );
}
