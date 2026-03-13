import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  MdSearch, MdDelete, MdDownload, MdInsertDriveFile,
  MdRefresh, MdVisibility,
} from "react-icons/md";
import AdminLayout from "./components/AdminLayout";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import styles from "./AdminTable.module.css";

const AdminDocuments = () => {
  const navigate = useNavigate();
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const authHeader = () => ({
    headers: { Authorization: `Bearer ${sessionStorage.getItem("adminToken")}` },
  });

  const fetchDocs = async (q = "", pg = 1) => {
    setLoading(true);
    try {
      const res = await axios.get(
        `http://localhost:2000/uploads/search?q=${encodeURIComponent(q)}&page=${pg}&limit=12`,
        authHeader()
      );
      setDocs(res.data.data || res.data || []);
      setTotalPages(res.data.pagination?.totalPages || 1);
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403)
        navigate("/adminlogin", { replace: true });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (sessionStorage.getItem("isAdmin") !== "true") {
      navigate("/adminlogin", { replace: true });
      return;
    }
    fetchDocs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = (e) => {
    const q = e.target.value;
    setSearch(q);
    setPage(1);
    fetchDocs(q, 1);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Soft-delete this document?")) return;
    try {
      await axios.patch(`http://localhost:2000/uploads/soft-delete/${id}`, {}, authHeader());
      setDocs((prev) => prev.filter((d) => d._id !== id));
    } catch { alert("Failed to delete document."); }
  };

  const changePage = (p) => {
    setPage(p);
    fetchDocs(search, p);
  };

  const getFileType = (filename = "") => {
    const ext = filename.split(".").pop()?.toLowerCase();
    if (ext === "pdf") return "PDF";
    if (["doc", "docx"].includes(ext)) return "DOCX";
    return ext?.toUpperCase() || "FILE";
  };

  const formatDate = (d) => d ? new Date(d).toLocaleDateString("en-IN", {
    day: "2-digit", month: "short", year: "numeric"
  }) : "—";

  return (
    <AdminLayout title="Documents">
      <Card padding="md">
        {/* Toolbar */}
        <div className={styles.toolbar}>
          <div className={styles.searchBox}>
            <MdSearch className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search by filename or uploader…"
              value={search}
              onChange={handleSearch}
              className={styles.searchInput}
            />
          </div>
          <Button icon={<MdRefresh />} variant="outline" size="sm" onClick={() => fetchDocs(search, page)}>
            Refresh
          </Button>
        </div>

        {/* Table */}
        {loading ? (
          <div className={styles.emptyState}>
            <div className={styles.spinner} />
            <p>Loading documents…</p>
          </div>
        ) : docs.length === 0 ? (
          <div className={styles.emptyState}>
            <MdInsertDriveFile size={48} style={{ color: "var(--gray-300)", marginBottom: "0.5rem" }} />
            <p style={{ color: "var(--gray-400)" }}>No documents found</p>
          </div>
        ) : (
          <>
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>File Name</th>
                    <th>Type</th>
                    <th>Uploaded By</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {docs.map((doc, i) => (
                    <tr key={doc._id}>
                      <td>{(page - 1) * 12 + i + 1}</td>
                      <td>
                        <div className={styles.userCell}>
                          <div className={styles.fileIcon}>
                            <MdInsertDriveFile />
                          </div>
                          <div>
                            <p className={styles.userName} title={doc.originalname}>
                              {doc.originalname?.length > 35
                                ? doc.originalname.slice(0, 35) + "…"
                                : doc.originalname || "Untitled"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td>
                        <Badge variant={getFileType(doc.originalname) === "PDF" ? "danger" : "info"}>
                          {getFileType(doc.originalname)}
                        </Badge>
                      </td>
                      <td style={{ color: "var(--gray-700)" }}>{doc.uploadedBy || "—"}</td>
                      <td style={{ color: "var(--gray-500)", fontSize: "var(--text-sm)" }}>
                        {formatDate(doc.createdAt)}
                      </td>
                      <td>
                        <Badge variant={doc.isDeleted ? "warning" : "success"}>
                          {doc.isDeleted ? "Deleted" : "Active"}
                        </Badge>
                      </td>
                      <td>
                        <div className={styles.actionRow}>
                          <a
                            href={`http://localhost:2000/uploads/${doc.filename}`}
                            target="_blank"
                            rel="noreferrer"
                            className={styles.downloadLink}
                            title="View"
                          >
                            <MdVisibility />
                          </a>
                          <a
                            href={`http://localhost:2000/uploads/${doc.filename}`}
                            download={doc.originalname}
                            className={styles.downloadLink}
                            title="Download"
                          >
                            <MdDownload />
                          </a>
                          {!doc.isDeleted && (
                            <button
                              className={styles.deleteBtn}
                              onClick={() => handleDelete(doc._id)}
                              title="Delete"
                            >
                              <MdDelete />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className={styles.pagination}>
                <Button variant="outline" size="sm" onClick={() => changePage(page - 1)} disabled={page === 1}>
                  ← Prev
                </Button>
                <span style={{ fontSize: "var(--text-sm)", color: "var(--gray-600)" }}>
                  Page {page} of {totalPages}
                </span>
                <Button variant="outline" size="sm" onClick={() => changePage(page + 1)} disabled={page === totalPages}>
                  Next →
                </Button>
              </div>
            )}
          </>
        )}
      </Card>
    </AdminLayout>
  );
};

export default AdminDocuments;
