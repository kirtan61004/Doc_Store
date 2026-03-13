import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  MdPeople,
  MdSchool,
  MdUploadFile,
  MdHourglassTop,
  MdFolder,
  MdTrendingUp,
  MdArrowForward,
  MdInsertDriveFile,
} from "react-icons/md";
import AdminLayout from "./components/AdminLayout";
import Badge from "../components/ui/Badge";
import styles from "./Admin.module.css";

const Admin = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [recentUploads, setRecentUploads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (sessionStorage.getItem("isAdmin") !== "true") {
      navigate("/adminlogin", { replace: true });
      return;
    }

    const token = sessionStorage.getItem("adminToken");
    const authH = { headers: { Authorization: `Bearer ${token}` } };

    Promise.all([
      axios.get("http://localhost:2000/admin/stats", authH),
      axios.get("http://localhost:2000/uploads/search?limit=8", authH),
    ])
      .then(([statsRes, uploadsRes]) => {
        if (statsRes.data.status) setStats(statsRes.data.stats);
        if (uploadsRes.data.status) setRecentUploads(uploadsRes.data.data || []);
      })
      .catch((err) => {
        if (err.response?.status === 401 || err.response?.status === 403) {
          sessionStorage.removeItem("isAdmin");
          sessionStorage.removeItem("adminToken");
          navigate("/adminlogin", { replace: true });
        }
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  if (loading)
    return (
      <AdminLayout title="Dashboard">
        <div className={styles.loadingState}>
          <div className={styles.spinner} />
          <p>Loading dashboard�</p>
        </div>
      </AdminLayout>
    );

  const adminName = sessionStorage.getItem("adminName") || "Admin";

  const statCards = [
    { title: "Total Users",      value: stats?.totalStudents,   icon: <MdPeople />,       grad: "var(--grad-blue)",   path: "/admin/students" },
    { title: "Students",         value: stats?.totalStudents,   icon: <MdSchool />,       grad: "var(--grad-green)",  path: "/admin/students" },
    { title: "Faculty",          value: stats?.totalFaculty,    icon: <MdTrendingUp />,   grad: "var(--grad-yellow)", path: "/admin/faculty"  },
    { title: "Documents",        value: stats?.totalDocuments,  icon: <MdFolder />,       grad: "var(--grad-purple)", path: "/admin/documents"},
    { title: "Pending Requests", value: stats?.pendingRequests, icon: <MdHourglassTop />, grad: "var(--grad-red)",    path: "/admin/faculty"  },
  ];

  const quickActions = [
    { label: "Manage Students",     icon: <MdSchool />,       path: "/admin/students",  color: "#3b82f6" },
    { label: "Manage Faculty",      icon: <MdPeople />,       path: "/admin/faculty",   color: "#10b981" },
    { label: "All Documents",       icon: <MdFolder />,       path: "/admin/documents", color: "#8b5cf6" },
    { label: "Upload Document",     icon: <MdUploadFile />,   path: "/admin/uploads",   color: "#f59e0b" },
  ];

  return (
    <AdminLayout title="Dashboard">

      {/* Welcome banner */}
      <div className={styles.welcomeBanner}>
        <div className={styles.welcomeText}>
          <h2 className={styles.welcomeTitle}>Welcome back, {adminName}! ??</h2>
          <p className={styles.welcomeSub}>Here's what's happening with your DocStore today.</p>
        </div>
        <div className={styles.welcomeDate}>
          {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
        </div>
      </div>

      {/* Stats grid */}
      <div className={styles.statsGrid}>
        {statCards.map((s) => (
          <div key={s.title} className={styles.statCard} style={{ background: s.grad }} onClick={() => navigate(s.path)}>
            <div className={styles.statIconWrap}>{s.icon}</div>
            <div className={styles.statInfo}>
              <span className={styles.statValue}>{s.value ?? 0}</span>
              <span className={styles.statTitle}>{s.title}</span>
            </div>
            <MdArrowForward className={styles.statArrow} />
          </div>
        ))}
      </div>

      {/* Main content row */}
      <div className={styles.contentRow}>

        {/* Recent uploads table */}
        <div className={styles.tableCard}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Recent Uploads</h2>
            <button className={styles.viewAll} onClick={() => navigate("/admin/documents")}>
              View all <MdArrowForward style={{ verticalAlign: "middle" }} />
            </button>
          </div>

          {recentUploads.length === 0 ? (
            <div className={styles.emptyState}>
              <MdInsertDriveFile className={styles.emptyIcon} />
              <p>No uploads yet</p>
            </div>
          ) : (
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Filename</th>
                    <th>Uploaded By</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentUploads.map((file, i) => (
                    <tr key={file._id}>
                      <td className={styles.muted}>{i + 1}</td>
                      <td>
                        <div className={styles.filename}>
                          <span className={styles.fileIconWrap}><MdInsertDriveFile /></span>
                          <span className={styles.fileNameText}>{file.originalname}</span>
                        </div>
                      </td>
                      <td>{file.uploadedBy || "�"}</td>
                      <td className={styles.muted}>
                        {new Date(file.createdAt).toLocaleDateString("en-IN", {
                          day: "2-digit", month: "short", year: "numeric",
                        })}
                      </td>
                      <td>
                        <Badge variant={file.isDeleted ? "danger" : "success"}>
                          {file.isDeleted ? "Deleted" : "Active"}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Quick actions sidebar */}
        <div className={styles.sidebar}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Quick Actions</h2>
          </div>
          <div className={styles.quickActions}>
            {quickActions.map((a) => (
              <button key={a.path} className={styles.actionCard} onClick={() => navigate(a.path)}>
                <span className={styles.actionIconWrap} style={{ background: a.color + "1a", color: a.color }}>
                  {a.icon}
                </span>
                <span className={styles.actionLabel}>{a.label}</span>
                <MdArrowForward className={styles.actionArrow} style={{ color: a.color }} />
              </button>
            ))}
          </div>

          {/* Mini summary */}
          <div className={styles.summaryBox}>
            <p className={styles.summaryTitle}>Summary</p>
            <div className={styles.summaryRow}><span>Active Documents</span><strong>{(stats?.totalDocuments ?? 0) - (stats?.totalDeleted ?? 0)}</strong></div>
            <div className={styles.summaryRow}><span>Deleted Documents</span><strong>{stats?.totalDeleted ?? 0}</strong></div>
            <div className={styles.summaryRow}><span>Total Members</span><strong>{stats?.totalStudents ?? 0}</strong></div>
          </div>
        </div>

      </div>
    </AdminLayout>
  );
};

export default Admin;

