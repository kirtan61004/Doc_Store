import React, { useEffect, useState, useRef, useCallback, useMemo } from "react";
import "./StudentTasks.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API = "http://localhost:2000";

const StudentTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(null); // taskId being uploaded
  const [mySubmissions, setMySubmissions] = useState({}); // { taskId: submission }
  const fileInputRefs = useRef({});

  const token = sessionStorage.getItem("token");
  const authHeaders = useMemo(() => ({ Authorization: `Bearer ${token}` }), [token]);

  // ── Fetch assigned tasks ──────────────────────────────────────────────────
  const fetchMySubmission = useCallback((taskId) => {
    fetch(`${API}/submissions/my/${taskId}`, { headers: authHeaders })
      .then(r => r.json())
      .then(d => {
        if (d.status && d.submission) {
          setMySubmissions(prev => ({ ...prev, [taskId]: d.submission }));
        }
      })
      .catch(() => {});
  }, [authHeaders]);

  useEffect(() => {
    fetch(`${API}/tasks/my`, { headers: authHeaders })
      .then(r => r.json())
      .then(d => {
        if (d.status) {
          setTasks(d.tasks);
          // Fetch submission status for each task
          d.tasks.forEach(task => fetchMySubmission(task._id));
        } else {
          toast.error("Failed to load tasks");
        }
      })
      .catch(() => toast.error("Server error"))
      .finally(() => setLoading(false));
  }, [authHeaders, fetchMySubmission]);


  // ── Upload file for a task ────────────────────────────────────────────────
  const handleFileUpload = async (taskId, file) => {
    if (!file) return;

    setUploading(taskId);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`${API}/submissions/${taskId}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();

      if (data.status) {
        toast.success("File submitted successfully!");
        setMySubmissions(prev => ({ ...prev, [taskId]: data.submission }));
      } else {
        toast.error(data.message || "Upload failed");
      }
    } catch {
      toast.error("Server error during upload");
    } finally {
      setUploading(null);
    }
  };

  // ── Download submitted file ───────────────────────────────────────────────
  const handleDownload = (subId) => {
    const a = document.createElement("a");
    a.href = `${API}/submissions/download/${subId}?token=${token}`;
    a.click();
  };

  const isPast = (d) => new Date(d) < new Date();
  const formatDate = (d) =>
    new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  const daysLeft = (d) => {
    const diff = Math.ceil((new Date(d) - new Date()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  if (loading) {
    return (
      <div className="st-container">
        <p className="st-loading">Loading your tasks...</p>
      </div>
    );
  }

  return (
    <div className="st-container">
      <ToastContainer />
      <div className="st-header">
        <h1 className="st-title">My Tasks</h1>
        <p className="st-subtitle">Tasks assigned to you by your faculty. Upload your work before the deadline.</p>
      </div>

      {tasks.length === 0 ? (
        <div className="st-empty">
          <div className="st-empty-icon">📭</div>
          <h3>No tasks assigned yet</h3>
          <p>Your faculty hasn't assigned any tasks to you yet. Check back later.</p>
        </div>
      ) : (
        <div className="st-grid">
          {tasks.map(task => {
            const submission = mySubmissions[task._id];
            const expired = isPast(task.deadline);
            const days = daysLeft(task.deadline);

            return (
              <div
                key={task._id}
                className={`st-card${expired ? " st-card--expired" : ""}${submission ? " st-card--submitted" : ""}`}
              >
                {/* Header */}
                <div className="st-card-header">
                  <h2 className="st-card-title">{task.title}</h2>
                  <span className={`st-badge${submission ? " st-badge--submitted" : expired ? " st-badge--expired" : " st-badge--open"}`}>
                    {submission ? "✅ Submitted" : expired ? "⏰ Expired" : "📌 Open"}
                  </span>
                </div>

                {/* Description */}
                {task.description && (
                  <p className="st-card-desc">{task.description}</p>
                )}

                {/* Deadline */}
                <div className="st-deadline">
                  <span className="st-deadline-label">Deadline:</span>
                  <span className={`st-deadline-val${expired ? " st-deadline-val--expired" : days <= 2 ? " st-deadline-val--urgent" : ""}`}>
                    {formatDate(task.deadline)}
                    {!expired && <span className="st-days-left"> ({days} day{days !== 1 ? "s" : ""} left)</span>}
                  </span>
                </div>

                {/* Submission info */}
                {submission ? (
                  <div className="st-submitted-info">
                    <div className="st-submitted-file">
                      <span>📄 {submission.originalname}</span>
                      <span className={`st-sub-status${submission.status === "reviewed" ? " st-sub-status--reviewed" : ""}`}>
                        {submission.status === "reviewed" ? "Reviewed ✓" : "Pending Review"}
                      </span>
                    </div>
                    <div className="st-submitted-actions">
                      <button
                        className="st-btn-outline"
                        onClick={() => handleDownload(submission._id)}
                      >
                        Download My File
                      </button>
                      {!expired && (
                        <button
                          className="st-btn-resubmit"
                          onClick={() => fileInputRefs.current[task._id]?.click()}
                          disabled={uploading === task._id}
                        >
                          {uploading === task._id ? "Uploading..." : "Re-submit"}
                        </button>
                      )}
                    </div>
                  </div>
                ) : expired ? (
                  <p className="st-expired-msg">The deadline has passed. Submission is no longer available.</p>
                ) : (
                  <div className="st-upload-area">
                    <p className="st-upload-hint">Upload your work (PDF, DOC, DOCX, TXT, ZIP — max 10 MB)</p>
                    <button
                      className="st-btn-upload"
                      onClick={() => fileInputRefs.current[task._id]?.click()}
                      disabled={uploading === task._id}
                    >
                      {uploading === task._id ? "Uploading..." : "📎 Choose & Upload File"}
                    </button>
                  </div>
                )}

                {/* Hidden file input */}
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.txt,.zip"
                  style={{ display: "none" }}
                  ref={el => (fileInputRefs.current[task._id] = el)}
                  onChange={e => {
                    const file = e.target.files[0];
                    if (file) handleFileUpload(task._id, file);
                    e.target.value = "";
                  }}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default StudentTasks;
