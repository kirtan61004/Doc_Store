import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { MdDelete, MdDownload, MdSearch, MdPeople } from "react-icons/md";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import AdminLayout from "./components/AdminLayout";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import styles from "./AdminTable.module.css";

const AdminStudent = () => {
  const navigate = useNavigate();
  const [studentList, setStudentList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const authHeader = () => ({
    headers: { Authorization: `Bearer ${sessionStorage.getItem("adminToken")}` },
  });

  const fetchStudents = async () => {
    try {
      const res = await axios.get("http://localhost:2000/admin/users?limit=100", authHeader());
      setStudentList((res.data.data || []).filter((u) => u.role === "student"));
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
    fetchStudents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const deleteStudent = async (id) => {
    if (!window.confirm("Delete this student?")) return;
    try {
      await axios.delete(`http://localhost:2000/users/delete/${id}`, authHeader());
      setStudentList((prev) => prev.filter((s) => s._id !== id));
    } catch { alert("Failed to delete student."); }
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Student List", 14, 15);
    autoTable(doc, {
      head: [["#", "Name", "Email"]],
      body: filtered.map((s, i) => [i + 1, s.name, s.email]),
      startY: 20,
    });
    doc.save("student_list.pdf");
  };

  const filtered = studentList.filter(
    (s) => s.name?.toLowerCase().includes(search.toLowerCase()) || s.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout title="Student Management">
      <Card padding="lg">
        {/* Toolbar */}
        <div className={styles.toolbar}>
          <div className={styles.summary}>
            <MdPeople className={styles.summaryIcon} />
            <span>{studentList.length} students total</span>
          </div>
          <div className={styles.toolbarRight}>
            <div className={styles.searchBox}>
              <MdSearch className={styles.searchIcon} />
              <input
                className={styles.searchInput}
                placeholder="Search students…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Button variant="outline" size="sm" icon={<MdDownload />} onClick={exportToPDF}>
              Export PDF
            </Button>
          </div>
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
                {filtered.length === 0 ? (
                  <tr><td colSpan={5} className={styles.empty}>No students found.</td></tr>
                ) : (
                  filtered.map((s, i) => (
                    <tr key={s._id}>
                      <td className={styles.muted}>{i + 1}</td>
                      <td>
                        <div className={styles.userCell}>
                          <div className={styles.userAvatar}>{s.name?.charAt(0).toUpperCase()}</div>
                          <span>{s.name}</span>
                        </div>
                      </td>
                      <td className={styles.muted}>{s.email}</td>
                      <td><Badge variant="success">Student</Badge></td>
                      <td>
                        <Button variant="danger" size="sm" icon={<MdDelete />} onClick={() => deleteStudent(s._id)}>
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
    </AdminLayout>
  );
};

export default AdminStudent;
