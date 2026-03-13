import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Faculty from '../Faculty panel/Faculty';
import {
  FiFile, FiX,
  FiCheckCircle, FiAlertCircle, FiDownload, FiSend, FiClipboard
} from 'react-icons/fi';

const API_BASE = 'http://localhost:2000';

// ─── StatusBanner ────────────────────────────────────────────────────────────
const StatusBanner = ({ type, message, onClose }) => {
  const cfg = {
    success: { wrap: 'bg-emerald-50 border-emerald-200', icon: <FiCheckCircle className="text-emerald-500 text-lg flex-shrink-0" />, text: 'text-emerald-700' },
    error:   { wrap: 'bg-red-50 border-red-200',         icon: <FiAlertCircle  className="text-red-500 text-lg flex-shrink-0" />,     text: 'text-red-700'     },
  }[type];
  return (
    <div className={`flex items-center gap-3 p-3.5 rounded-xl border ${cfg.wrap} mb-4`}>
      {cfg.icon}
      <p className={`text-sm font-medium flex-1 ${cfg.text}`}>{message}</p>
      <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors"><FiX /></button>
    </div>
  );
};

// ─── TaskCard ────────────────────────────────────────────────────────────────
const TaskCard = ({ file, onFileChange, onSubmit }) => (
  <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
    <div className="mb-3">
      <span className="text-xs font-semibold uppercase tracking-wide text-indigo-500 bg-indigo-50 px-2.5 py-1 rounded-full">
        Task Assigned
      </span>
      <h3 className="font-semibold text-gray-800 mt-2 text-sm">
        Faculty: <span className="text-indigo-600">{file.facultyName || 'Unknown'}</span>
      </h3>
    </div>

    {file.taskText && (
      <p className="text-sm text-gray-600 bg-gray-50 rounded-xl p-3 mb-3 leading-relaxed">
        📝 {file.taskText}
      </p>
    )}

    {file.filename && (
      <a href={`${API_BASE}/uploads/${file.filename}`} target="_blank" rel="noopener noreferrer"
        className="inline-flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-800 font-medium mb-3 transition-colors">
        <FiDownload /> {file.originalname || 'Download attachment'}
      </a>
    )}

    <div className="border-t border-gray-100 pt-3">
      <p className="text-xs text-gray-500 mb-2 font-medium">Upload your response:</p>
      <div className="flex flex-col sm:flex-row gap-2">
        <label className="flex-1 cursor-pointer">
          <div className={`flex items-center gap-2 px-3 py-2.5 border rounded-xl text-sm transition-colors
            ${file.responseFile
              ? 'border-emerald-300 bg-emerald-50 text-emerald-700'
              : 'border-gray-300 bg-gray-50 text-gray-500 hover:border-indigo-300 hover:bg-indigo-50'}`}>
            <FiFile className="flex-shrink-0" />
            <span className="truncate">{file.responseFile?.name || 'Choose file…'}</span>
          </div>
          <input type="file" className="hidden" onChange={onFileChange} />
        </label>
        <button
          onClick={onSubmit}
          disabled={!file.responseFile}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700
            disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed
            text-white text-sm font-semibold rounded-xl transition-colors flex-shrink-0">
          <FiSend /> Submit
        </button>
      </div>
    </div>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const Upload = () => {
  const navigate = useNavigate();
  const userEmail = sessionStorage.getItem('userEmail');
  const token = sessionStorage.getItem('token');
  const userRole = sessionStorage.getItem('userRole');

  // All hooks must be called before any early return (Rules of Hooks)
  const [assignedFiles, setAssignedFiles] = useState([]);
  const [studentResponses, setStudentResponses] = useState([]);
  const [status, setStatus] = useState(null);

  const logoutAndRedirect = useCallback(() => {
    sessionStorage.removeItem('userEmail');
    sessionStorage.removeItem('token');
    navigate('/login');
  }, [navigate]);

  useEffect(() => {
    if (!userEmail || !token) logoutAndRedirect();
  }, [userEmail, token, logoutAndRedirect]);

  const fetchWithAuth = useCallback(async (url) => {
    try {
      const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
      const ct = res.headers.get('content-type');
      if (!res.ok) { if (res.status === 401) logoutAndRedirect(); return null; }
      if (!ct?.includes('application/json')) return null;
      return res.json();
    } catch { return null; }
  }, [token, logoutAndRedirect]);

  const fetchAssignedFiles = useCallback(async () => {
    const data = await fetchWithAuth(`${API_BASE}/student/assigned-files/${userEmail}`);
    if (data) setAssignedFiles(data);
  }, [userEmail, fetchWithAuth]);

  const fetchStudentResponses = useCallback(async () => {
    const data = await fetchWithAuth(`${API_BASE}/student/responses/${userEmail}`);
    if (data) setStudentResponses(data);
  }, [userEmail, fetchWithAuth]);

  useEffect(() => {
    fetchAssignedFiles();
    fetchStudentResponses();
  }, [fetchAssignedFiles, fetchStudentResponses]);

  // Faculty sees their own panel here instead of the student upload UI
  if (userRole === 'faculty') return <Faculty />;

  const submittedTaskIds = new Set(studentResponses.map((r) => r.taskId));

  // ── Submit task response ──────────────────────────────────────────────────
  const handleSubmitResponse = async (file) => {
    if (!file.responseFile) { setStatus({ type: 'error', message: 'Please select a response file first.' }); return; }
    const formData = new FormData();
    formData.append('file', file.responseFile);
    formData.append('taskId', file._id);
    formData.append('studentEmail', userEmail);
    formData.append('facultyName', file.facultyName);
    try {
      const res = await fetch(`${API_BASE}/student/submit-task`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (data.status) {
        setStatus({ type: 'success', message: 'Response submitted successfully!' });
        fetchAssignedFiles();
        fetchStudentResponses();
      } else {
        setStatus({ type: 'error', message: data.message || 'Submission failed.' });
      }
    } catch {
      setStatus({ type: 'error', message: 'Something went wrong while submitting.' });
    }
  };

  const pendingTasks = assignedFiles.filter((f) => !submittedTaskIds.has(f._id));

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/40 to-violet-50/30 py-10 px-4">
      <div className="max-w-2xl mx-auto">

        {/* Page Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-200 mb-4">
            <FiClipboard className="text-white text-2xl" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">My Assigned Tasks</h1>
          <p className="text-gray-500 mt-2 text-sm">Complete and submit the tasks assigned to you by your faculty</p>
        </div>

        {/* Status Banner */}
        {status && (
          <StatusBanner type={status.type} message={status.message} onClose={() => setStatus(null)} />
        )}

        {/* ── Assigned Tasks Card ── */}
        <div className="bg-white rounded-3xl shadow-xl shadow-gray-100/60 border border-gray-100 p-6">
          <h2 className="text-base font-semibold text-gray-800 flex items-center gap-2 mb-1">
            <span className="w-1.5 h-5 bg-violet-500 rounded-full" />
            Complete Your Tasks
          </h2>
          <p className="text-xs text-gray-400 mb-5 ml-4">Tasks assigned to you by faculty</p>

          {pendingTasks.length === 0 ? (
            <div className="text-center py-10">
              <FiCheckCircle className="mx-auto text-4xl text-emerald-400 mb-3" />
              <p className="text-gray-600 font-semibold text-sm">All caught up!</p>
              <p className="text-gray-400 text-xs mt-1">No pending assignments right now.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {pendingTasks.map((file) => (
                <TaskCard
                  key={file._id}
                  file={file}
                  onFileChange={(e) => {
                    const newFile = e.target.files[0];
                    setAssignedFiles((prev) =>
                      prev.map((item) => item._id === file._id ? { ...item, responseFile: newFile } : item)
                    );
                  }}
                  onSubmit={() => handleSubmitResponse(file)}
                />
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Upload;
