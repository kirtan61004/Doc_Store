import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { MdPersonAdd, MdDelete, MdCheck, MdClose, MdDownload, MdSearch } from "react-icons/md";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import AdminLayout from "./components/AdminLayout";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import styles from "./AdminTable.module.css";

const AdminFaculty = () => {
  const navigate = useNavigate();
  const [facultyList, setFacultyList] = useState([]);
  const [pendingList, setPendingList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("approved"); // "approved" | "pending"

  const authHeader = () => ({
    headers: { Authorization: `Bearer ${sessionStorage.getItem("adminToken")}` },
  });

  const fetchFaculties = async () => {
    try {
      setLoading(true);
      const [resUsers, resPending] = await Promise.all([
        axios.get("http://localhost:2000/admin/users?limit=100", authHeader()),
        axios.get("http://localhost:2000/admin/faculty-requests", authHeader()),
      ]);
      setFacultyList((resUsers.data.data || []).filter((u) => u.role === "faculty"));
      setPendingList(resPending.data || []);
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        navigate("/adminlogin", { replace: true });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (sessionStorage.getItem("isAdmin") !== "true") {
      navigate("/adminlogin", { replace: true });
      return;
    }
    fetchFaculties();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const deleteFaculty = async (id) => {
    if (!window.confirm("Delete this faculty member?")) return;
    try {
      await axios.delete(`http://localhost:2000/users/delete/${id}`, authHeader());
      setFacultyList((prev) => prev.filter((f) => f._id !== id));
    } catch { alert("Failed to delete."); }
  };

  const handlePendingAction = async (id, approve) => {
    try {
      await axios.post(`http://localhost:2000/admin/faculty-approve/${id}`, { approve }, authHeader());
      fetchFaculties();
    } catch { alert("Failed to update status."); }
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Faculty List", 14, 15);
    autoTable(doc, {
      head: [["Name", "Email"]],
      body: filteredFaculty.map((f) => [f.name, f.email]),
      startY: 20,
    });
    doc.save("faculty_list.pdf");
  };

  const filteredFaculty = facultyList.filter(
    (f) => f.name?.toLowerCase().includes(search.toLowerCase()) || f.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout title="Faculty Management">
      {/* Tabs */}
      <div className={styles.tabs}>
        <button className={`${styles.tab} ${tab === "approved" ? styles.tabActive : ""}`} onClick={() => setTab("approved")}>
          Approved Faculty
          <span className={styles.tabCount}>{facultyList.length}</span>
        </button>
        <button className={`${styles.tab} ${tab === "pending" ? styles.tabActive : ""}`} onClick={() => setTab("pending")}>
          Pending Requests
          {pendingList.length > 0 && <span className={`${styles.tabCount} ${styles.tabCountDanger}`}>{pendingList.length}</span>}
        </button>
      </div>

      {tab === "approved" && (
        <Card padding="lg">
          {/* Toolbar */}
          <div className={styles.toolbar}>
            <div className={styles.searchBox}>
              <MdSearch className={styles.searchIcon} />
              <input
                className={styles.searchInput}
                placeholder="Search faculty…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Button variant="outline" size="sm" icon={<MdDownload />} onClick={exportToPDF}>
              Export PDF
            </Button>
          </div>

          {loading ? (
            <div className={styles.center}><div className={styles.spinner} /></div>
          ) : (
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredFaculty.length === 0 ? (
                    <tr><td colSpan={5} className={styles.empty}>No faculty found.</td></tr>
                  ) : (
                    filteredFaculty.map((f, i) => (
                      <tr key={f._id}>
                        <td className={styles.muted}>{i + 1}</td>
                        <td>
                          <div className={styles.userCell}>
                            <div className={styles.userAvatar}>{f.name?.charAt(0).toUpperCase()}</div>
                            <span>{f.name}</span>
                          </div>
                        </td>
                        <td className={styles.muted}>{f.email}</td>
                        <td><Badge variant="info">Faculty</Badge></td>
                        <td>
                          <Button variant="danger" size="sm" icon={<MdDelete />} onClick={() => deleteFaculty(f._id)}>
                            Delete
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      )}

      {tab === "pending" && (
        <Card padding="lg">
          {loading ? (
            <div className={styles.center}><div className={styles.spinner} /></div>
          ) : (
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>ER Number</th>
                    <th>ID Proof</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingList.length === 0 ? (
                    <tr><td colSpan={6} className={styles.empty}>No pending requests.</td></tr>
                  ) : (
                    pendingList.map((f, i) => (
                      <tr key={f._id}>
                        <td className={styles.muted}>{i + 1}</td>
                        <td>
                          <div className={styles.userCell}>
                            <div className={styles.userAvatar} style={{ background: "var(--warning)", color: "#fff" }}>
                              {f.name?.charAt(0).toUpperCase()}
                            </div>
                            <span>{f.name}</span>
                          </div>
                        </td>
                        <td className={styles.muted}>{f.email}</td>
                        <td className={styles.muted}>{f.erNumber || "—"}</td>
                        <td>
                          <a
                            href={`http://localhost:2000/uploads/${f.facultyIdPhoto}`}
                            download target="_blank"
                            className={styles.downloadLink}
                          >
                            <MdDownload /> View ID
                          </a>
                        </td>
                        <td>
                          <div className={styles.actionRow}>
                            <Button variant="success" size="sm" icon={<MdCheck />} onClick={() => handlePendingAction(f._id, true)}>
                              Approve
                            </Button>
                            <Button variant="danger" size="sm" icon={<MdClose />} onClick={() => handlePendingAction(f._id, false)}>
                              Reject
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      )}
    </AdminLayout>
  );
};

export default AdminFaculty;
