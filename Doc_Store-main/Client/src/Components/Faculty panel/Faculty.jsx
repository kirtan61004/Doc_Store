import React, { useEffect, useState, useCallback, useMemo } from 'react';
import './Faculty.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API = "http://localhost:2000";

const Faculty = () => {
  const [activeTab, setActiveTab] = useState("create");
  const [students, setStudents] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);

  // Create task form state
  const [form, setForm] = useState({
    title: "",
    description: "",
    deadline: "",
    assignedStudents: [],
  });

  const token = sessionStorage.getItem("token");
  const authHeaders = useMemo(
    () => ({ "Content-Type": "application/json", Authorization: `Bearer ${token}` }),
    [token]
  );

  // ── Fetch all students ──────────────────────────────────────────────────────
  useEffect(() => {
    fetch(`${API}/faculty/students`, { headers: authHeaders })
      .then(r => r.json())
      .then(d => { if (d.status) setStudents(d.students); })
      .catch(() => toast.error("Failed to load students"));
  }, [authHeaders]);

  // ── Fetch faculty's tasks ───────────────────────────────────────────────────
  const fetchTasks = useCallback(() => {
    fetch(`${API}/tasks`, { headers: authHeaders })
      .then(r => r.json())
      .then(d => { if (d.status) setTasks(d.tasks); else toast.error("Failed to load tasks"); })
      .catch(() => toast.error("Server error"));
  }, [authHeaders]);

  useEffect(() => {
    if (activeTab === "tasks") fetchTasks();
  }, [activeTab, fetchTasks]);

  // ── Create task ─────────────────────────────────────────────────────────────
  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!form.title || !form.deadline) { toast.error("Title and deadline are required."); return; }
    if (form.assignedStudents.length === 0) { toast.error("Assign at least one student."); return; }

    try {
      const res = await fetch(`${API}/tasks`, {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.status) {
        toast.success("Task created successfully!");
        setForm({ title: "", description: "", deadline: "", assignedStudents: [] });
      } else {
        toast.error(data.message || "Failed to create task");
      }
    } catch {
      toast.error("Server error");
    }
  };

  // ── Toggle student selection ────────────────────────────────────────────────
  const toggleStudent = (email) => {
    setForm(prev => ({
      ...prev,
      assignedStudents: prev.assignedStudents.includes(email)
        ? prev.assignedStudents.filter(e => e !== email)
        : [...prev.assignedStudents, email],
    }));
  };

  // ── Delete task ─────────────────────────────────────────────────────────────
  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("Delete this task?")) return;
    try {
      const res = await fetch(`${API}/tasks/${taskId}`, { method: "DELETE", headers: authHeaders });
      const data = await res.json();
      if (data.status) {
        toast.success("Task deleted.");
        setTasks(prev => prev.filter(t => t._id !== taskId));
        if (selectedTask?._id === taskId) setSelectedTask(null);
      } else {
        toast.error(data.message || "Failed to delete");
      }
    } catch {
      toast.error("Server error");
    }
  };

  // ── View submissions for a task ─────────────────────────────────────────────
  const handleViewSubmissions = async (task) => {
    setSelectedTask(task);
    setLoadingSubmissions(true);
    try {
      const res = await fetch(`${API}/submissions/task/${task._id}`, { headers: authHeaders });
      const data = await res.json();
      if (data.status) setSubmissions(data.submissions);
      else toast.error("Failed to load submissions");
    } catch {
      toast.error("Server error");
    } finally {
      setLoadingSubmissions(false);
    }
  };

  // ── Mark submission reviewed ────────────────────────────────────────────────
  const handleMarkReviewed = async (subId) => {
    try {
      const res = await fetch(`${API}/submissions/${subId}/review`, {
        method: "PATCH",
        headers: authHeaders,
      });
      const data = await res.json();
      if (data.status) {
        toast.success("Marked as reviewed.");
        setSubmissions(prev => prev.map(s => s._id === subId ? { ...s, status: "reviewed" } : s));
      } else {
        toast.error(data.message || "Failed to update");
      }
    } catch {
      toast.error("Server error");
    }
  };

  // ── Helpers ─────────────────────────────────────────────────────────────────
  const isPast = (deadline) => new Date(deadline) < new Date();
  const formatDate = (d) => new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  const todayISO = new Date().toISOString().split("T")[0];

  return (
    <div className="faculty-container">
      <ToastContainer />

      <div className="faculty-header">
        <h1 className="faculty-title">Faculty Panel</h1>
        <p className="faculty-subtitle">Create tasks, assign students, and review submissions.</p>
      </div>

      {/* Tabs */}
      <div className="faculty-tabs">
        {[
          { key: "create", label: "➕ Create Task" },
          { key: "tasks", label: "📋 My Tasks" },
        ].map(tab => (
          <button
            key={tab.key}
            className={`faculty-tab-btn${activeTab === tab.key ? " faculty-tab-active" : ""}`}
            onClick={() => { setActiveTab(tab.key); setSelectedTask(null); }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Create Task Tab ──────────────────────────────────────────────────── */}
      {activeTab === "create" && (
        <div className="faculty-card">
          <h2 className="faculty-card-title">New Task</h2>
          <form onSubmit={handleCreateTask} className="faculty-form">
            <div className="faculty-form-group">
              <label>Title *</label>
              <input
                className="faculty-input"
                placeholder="e.g. Assignment 1 - Data Structures"
                value={form.title}
                onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                required
              />
            </div>

            <div className="faculty-form-group">
              <label>Description</label>
              <textarea
                className="faculty-input faculty-textarea"
                placeholder="Describe the task in detail..."
                value={form.description}
                onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                rows={4}
              />
            </div>

            <div className="faculty-form-group">
              <label>Deadline *</label>
              <input
                type="date"
                className="faculty-input"
                min={todayISO}
                value={form.deadline}
                onChange={e => setForm(p => ({ ...p, deadline: e.target.value }))}
                required
              />
            </div>

            <div className="faculty-form-group">
              <label>Assign Students * ({form.assignedStudents.length} selected)</label>
              <div className="faculty-student-list">
                {students.length === 0 ? (
                  <p className="faculty-empty">No students registered yet.</p>
                ) : (
                  students.map(s => (
                    <label key={s._id} className="faculty-student-item">
                      <input
                        type="checkbox"
                        checked={form.assignedStudents.includes(s.email)}
                        onChange={() => toggleStudent(s.email)}
                      />
                      <span className="faculty-student-name">{s.name}</span>
                      <span className="faculty-student-email">{s.email}</span>
                    </label>
                  ))
                )}
              </div>
            </div>

            <button type="submit" className="faculty-btn-primary">Create Task</button>
          </form>
        </div>
      )}

      {/* ── My Tasks Tab ─────────────────────────────────────────────────────── */}
      {activeTab === "tasks" && (
        <div className="faculty-tasks-layout">
          <div className={`faculty-task-list${selectedTask ? " faculty-task-list--narrow" : ""}`}>
            <h2 className="faculty-card-title">My Tasks ({tasks.length})</h2>
            {tasks.length === 0 ? (
              <div className="faculty-empty-state">
                <p>No tasks created yet.</p>
                <button className="faculty-btn-secondary" onClick={() => setActiveTab("create")}>
                  Create your first task →
                </button>
              </div>
            ) : (
              tasks.map(task => (
                <div
                  key={task._id}
                  className={`faculty-task-card${selectedTask?._id === task._id ? " faculty-task-card--active" : ""}${isPast(task.deadline) ? " faculty-task-card--expired" : ""}`}
                >
                  <div className="faculty-task-card-header">
                    <h3>{task.title}</h3>
                    <span className={`faculty-badge${isPast(task.deadline) ? " faculty-badge--red" : " faculty-badge--green"}`}>
                      {isPast(task.deadline) ? "Expired" : "Active"}
                    </span>
                  </div>
                  {task.description && <p className="faculty-task-desc">{task.description}</p>}
                  <div className="faculty-task-meta">
                    <span>📅 {formatDate(task.deadline)}</span>
                    <span>👥 {task.assignedStudents.length} student{task.assignedStudents.length !== 1 ? "s" : ""}</span>
                  </div>
                  <div className="faculty-task-actions">
                    <button
                      className="faculty-btn-secondary"
                      onClick={() => handleViewSubmissions(task)}
                    >
                      View Submissions
                    </button>
                    <button
                      className="faculty-btn-danger"
                      onClick={() => handleDeleteTask(task._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Submissions panel */}
          {selectedTask && (
            <div className="faculty-submissions-panel">
              <div className="faculty-submissions-header">
                <h2>{selectedTask.title} — Submissions</h2>
                <button className="faculty-close-btn" onClick={() => setSelectedTask(null)}>✕</button>
              </div>

              {loadingSubmissions ? (
                <p className="faculty-loading">Loading submissions...</p>
              ) : submissions.length === 0 ? (
                <p className="faculty-empty">No submissions yet for this task.</p>
              ) : (
                <div className="faculty-sub-list">
                  {submissions.map(sub => (
                    <div key={sub._id} className="faculty-sub-card">
                      <div className="faculty-sub-info">
                        <strong>{sub.studentName || sub.studentEmail}</strong>
                        <span className="faculty-sub-email">{sub.studentEmail}</span>
                        <span className="faculty-sub-file">📄 {sub.originalname}</span>
                        <span className="faculty-sub-date">Submitted: {formatDate(sub.createdAt)}</span>
                      </div>
                      <div className="faculty-sub-actions">
                        <span className={`faculty-badge${sub.status === "reviewed" ? " faculty-badge--blue" : " faculty-badge--yellow"}`}>
                          {sub.status}
                        </span>
                        <a
                          href={`${API}/submissions/download/${sub._id}?token=${token}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="faculty-btn-secondary"
                        >
                          Download
                        </a>
                        {sub.status === "pending" && (
                          <button
                            className="faculty-btn-primary"
                            onClick={() => handleMarkReviewed(sub._id)}
                          >
                            Mark Reviewed
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Faculty;
