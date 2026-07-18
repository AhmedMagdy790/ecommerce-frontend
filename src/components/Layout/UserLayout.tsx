import { Outlet } from "react-router-dom";

import Topbar from "./Topbar";
import Navbar from "./Navbar";
import Footer from "./Footer";


export default function UserLayout() {
  return (
    <div
      className="
        flex
        min-h-screen
        flex-col
        bg-background
        text-text-primary
      "
    >
      {/* Header */}
      <header className="sticky top-0 z-50">
        <Topbar />

        <Navbar />
      </header>

      {/* Main Content */}
      <main
        id="main-content"
        className="
          flex-1
          overflow-x-hidden
        "
      >
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}