import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { MdUploadFile, MdInsertDriveFile, MdClose, MdCheckCircle } from "react-icons/md";
import AdminLayout from "./components/AdminLayout";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import styles from "./AdminUploads.module.css";

const ALLOWED_TYPES = ["application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];

const AdminUploads = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const authHeader = () => ({
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("adminToken")}`,
      "Content-Type": "multipart/form-data",
    },
  });

  const validateFile = (f) => {
    if (!ALLOWED_TYPES.includes(f.type)) {
      setError("Only PDF, DOC, and DOCX files are allowed.");
      return false;
    }
    if (f.size > 5 * 1024 * 1024) {
      setError("File size must be under 5 MB.");
      return false;
    }
    setError("");
    return true;
  };

  const onFileSelect = (f) => {
    if (validateFile(f)) { setFile(f); setSuccess(false); }
  };

  const handleDrop = (e) => {
    e.preventDefault(); setDragging(false);
    const f = e.dataTransfer.files?.[0];
    if (f) onFileSelect(f);
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("uploadedBy", sessionStorage.getItem("adminEmail") || "admin");
      await axios.post("http://localhost:2000/uploads/upload", form, authHeader());
      setSuccess(true);
      setFile(null);
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403)
        navigate("/adminlogin", { replace: true });
      setError(err.response?.data?.message || "Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <AdminLayout title="Upload Document">
      <div className={styles.container}>
        <Card padding="lg" className={styles.uploadCard}>
          <h2 className={styles.heading}>Upload a New Document</h2>
          <p className={styles.sub}>Accepted formats: PDF, DOC, DOCX · Max size: 5 MB</p>

          {/* Success banner */}
          {success && (
            <div className={styles.successBanner}>
              <MdCheckCircle size={20} />
              <span>Document uploaded successfully!</span>
            </div>
          )}

          {/* Drop zone */}
          <div
            className={`${styles.dropZone} ${dragging ? styles.dragging : ""} ${file ? styles.hasFile : ""}`}
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => document.getElementById("adminFileInput").click()}
          >
            <input
              id="adminFileInput"
              type="file"
              accept=".pdf,.doc,.docx"
              style={{ display: "none" }}
              onChange={(e) => e.target.files?.[0] && onFileSelect(e.target.files[0])}
            />
            <MdUploadFile className={styles.dropIcon} />
            <p className={styles.dropText}>
              {dragging ? "Drop file here" : "Drag & drop file or click to browse"}
            </p>
          </div>

          {/* Selected file preview */}
          {file && (
            <div className={styles.filePreview}>
              <MdInsertDriveFile className={styles.filePreviewIcon} />
              <div className={styles.fileInfo}>
                <p className={styles.fileName}>{file.name}</p>
                <p className={styles.fileSize}>
                  {(file.size / 1024).toFixed(1)} KB
                </p>
              </div>
              <button className={styles.removeBtn} onClick={() => setFile(null)}>
                <MdClose />
              </button>
            </div>
          )}

          {/* Error */}
          {error && <p className={styles.error}>{error}</p>}

          {/* Upload btn */}
          <Button
            variant="primary"
            size="lg"
            icon={<MdUploadFile />}
            onClick={handleUpload}
            disabled={!file || uploading}
            className={styles.uploadBtn}
          >
            {uploading ? "Uploading…" : "Upload Document"}
          </Button>
        </Card>

        {/* Info card */}
        <Card padding="md" className={styles.infoCard}>
          <h3 className={styles.infoTitle}>Upload Guidelines</h3>
          <ul className={styles.infoList}>
            <li>Only <strong>PDF</strong>, <strong>DOC</strong>, and <strong>DOCX</strong> files are accepted.</li>
            <li>Maximum file size is <strong>5 MB</strong>.</li>
            <li>Uploaded files are immediately available in <strong>Documents</strong>.</li>
            <li>Use descriptive filenames for easy discovery.</li>
          </ul>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminUploads;
