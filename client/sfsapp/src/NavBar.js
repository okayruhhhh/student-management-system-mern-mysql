import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

function NavBar() {
  const [open, setOpen] = useState(false);
  const loc = useLocation();

  const isActive = (path) => loc.pathname === path;

  return (
    <nav className="sms-navbar">
      <div className="sms-nav-brand">Student Management System</div>

      {/* Hamburger toggle — visible on mobile */}
      <button
        className="sms-menu-toggle"
        aria-label="Toggle menu"
        onClick={() => setOpen((o) => !o)}
      >
        <span style={open ? { transform: "rotate(45deg) translate(5px,5px)" } : {}} />
        <span style={open ? { opacity: 0 } : {}} />
        <span style={open ? { transform: "rotate(-45deg) translate(5px,-5px)" } : {}} />
      </button>

      {/* Nav links */}
      <div className={`sms-nav-links${open ? " open" : ""}`}>
        <Link
          to="/"
          aria-current={isActive("/") ? "page" : undefined}
          onClick={() => setOpen(false)}
        >
          🏠 Home
        </Link>
        <Link
          to="/create"
          aria-current={isActive("/create") ? "page" : undefined}
          onClick={() => setOpen(false)}
        >
          ✚ Add Student
        </Link>
      </div>
    </nav>
  );
}

export default NavBar;