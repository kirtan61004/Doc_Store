import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  MdDashboard,
  MdPeople,
  MdUploadFile,
  MdSchool,
  MdSettings,
  MdLogout,
  MdMenu,
  MdClose,
  MdFolder,
} from "react-icons/md";
import styles from "./AdminLayout.module.css";

const NAV_ITEMS = [
  { label: "Dashboard",        icon: <MdDashboard />,  path: "/adminpanel" },
  { label: "Students",         icon: <MdSchool />,     path: "/admin/students" },
  { label: "Faculty",          icon: <MdPeople />,     path: "/admin/faculty" },
  { label: "Documents",        icon: <MdFolder />,     path: "/admin/documents" },
  { label: "Uploads",          icon: <MdUploadFile />, path: "/admin/uploads" },
  { label: "Settings",         icon: <MdSettings />,   path: "/admin/settings" },
];

const AdminLayout = ({ children, title = "Dashboard" }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const adminName = sessionStorage.getItem("adminName") || "Admin";
  const adminEmail = sessionStorage.getItem("adminEmail") || "";

  const handleLogout = () => {
    ["isAdmin", "adminToken", "adminEmail", "adminName"].forEach((k) =>
      sessionStorage.removeItem(k)
    );
    navigate("/adminlogin", { replace: true });
  };

  return (
    <div className={styles.shell}>
      {/* ── Sidebar ───────────────────────────────────── */}
      <aside className={`${styles.sidebar} ${collapsed ? styles.collapsed : ""}`}>
        {/* Brand */}
        <div className={styles.brand}>
          {!collapsed && (
            <span className={styles.brandName}>
              <span className={styles.brandDot}>Doc</span>Store
            </span>
          )}
          <button
            className={styles.collapseBtn}
            onClick={() => setCollapsed((c) => !c)}
            title={collapsed ? "Expand" : "Collapse"}
          >
            {collapsed ? <MdMenu /> : <MdClose />}
          </button>
        </div>

        {/* Nav items */}
        <nav className={styles.nav}>
          {NAV_ITEMS.map(({ label, icon, path }) => {
            const active = location.pathname === path;
            return (
              <button
                key={path}
                className={`${styles.navItem} ${active ? styles.active : ""}`}
                onClick={() => navigate(path)}
                title={collapsed ? label : ""}
              >
                <span className={styles.navIcon}>{icon}</span>
                {!collapsed && <span className={styles.navLabel}>{label}</span>}
                {active && !collapsed && <span className={styles.activePill} />}
              </button>
            );
          })}
        </nav>

        {/* Bottom — user + logout */}
        <div className={styles.sidebarFooter}>
          {!collapsed && (
            <div className={styles.userInfo}>
              <div className={styles.avatar}>
                {adminName.charAt(0).toUpperCase()}
              </div>
              <div className={styles.userText}>
                <p className={styles.userName}>{adminName}</p>
                <p className={styles.userEmail}>{adminEmail}</p>
              </div>
            </div>
          )}
          <button
            className={`${styles.navItem} ${styles.logoutItem}`}
            onClick={handleLogout}
            title="Logout"
          >
            <span className={styles.navIcon}><MdLogout /></span>
            {!collapsed && <span className={styles.navLabel}>Logout</span>}
          </button>
        </div>
      </aside>

      {/* ── Main area ─────────────────────────────────── */}
      <div className={`${styles.main} ${collapsed ? styles.mainCollapsed : ""}`}>
        {/* Top navbar */}
        <header className={styles.navbar}>
          <h1 className={styles.pageTitle}>{title}</h1>
          <div className={styles.navbarRight}>
            <div className={styles.navAvatar}>
              {adminName.charAt(0).toUpperCase()}
            </div>
            <div className={styles.navUserInfo}>
              <span className={styles.navUserName}>{adminName}</span>
              <span className={styles.navUserRole}>Administrator</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className={styles.content}>{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
