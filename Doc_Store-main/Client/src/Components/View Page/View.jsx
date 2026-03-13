import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiFile, FiEye, FiUploadCloud, FiCheckCircle, FiXCircle, FiClock, FiSend, FiX } from "react-icons/fi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const View = () => {
  const [userUploads, setUserUploads] = useState([]);
  const [assignedTasks, setAssignedTasks] = useState([]);
  const [studentResponses, setStudentResponses] = useState({});
  const [uploadingTaskId, setUploadingTaskId] = useState(null);
  const [uploadFile, setUploadFile] = useState(null);

  const navigate = useNavigate();
  const userEmail = sessionStorage.getItem("userEmail");
  const token = sessionStorage.getItem("token");

  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem("isLoggedIn") === "true";

    if (!isLoggedIn || !userEmail || !token) {
      toast.error("Please login to view documents!", { autoClose: 1000 });
      setTimeout(() => {
        navigate("/login");
      }, 1000);
      return;
    }

    fetchUserUploads();
    fetchFacultyAssignedTasks();
    fetchStudentResponses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate, userEmail, token]);

  // Fetch all admin-uploaded public documents
  const fetchUserUploads = () => {
    fetch(`http://localhost:2000/uploads/search?limit=50`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (res.status === 401) {
          toast.error("Session expired. Please login again.");
          navigate("/login");
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data && data.status) setUserUploads(data.data || []);
      })
      .catch((err) => console.error("Documents fetch error:", err));
  };

  // Fetch faculty assigned tasks with files
  const fetchFacultyAssignedTasks = () => {
    fetch(`http://localhost:2000/student/assigned-files/${userEmail}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (res.status === 401) {
          toast.error("Session expired. Please login again.");
          navigate("/login");
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data) setAssignedTasks(data);
      })
      .catch((err) => console.error("Student assigned tasks error:", err));
  };

  // Fetch student responses to tasks
  const fetchStudentResponses = () => {
    fetch(`http://localhost:2000/student/responses/${userEmail}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (res.status === 401) {
          toast.error("Session expired. Please login again.");
          navigate("/login");
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data) {
          const responseMap = {};
          data.forEach((resp) => {
            responseMap[resp.taskId] = resp;
          });
          setStudentResponses(responseMap);
        }
      })
      .catch((err) => console.error("Student responses fetch error:", err));
  };

  const handleDeleteResponse = async (responseId) => {
    if (!window.confirm("Are you sure you want to delete your submission?")) return;

    try {
      const res = await fetch(`http://localhost:2000/student/delete-response/${responseId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.status) {
        toast.success("Response deleted successfully");
        fetchStudentResponses();
      } else {
        toast.error("Failed to delete response");
      }
    } catch (err) {
      console.error("Delete response error:", err);
      toast.error("Server error during delete");
    }
  };

  const handleFileChange = (e) => {
    setUploadFile(e.target.files[0]);
  };

  const handleSubmitResponse = async (taskId, facultyName) => {
    if (!uploadFile) {
      toast.error("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", uploadFile);
    formData.append("taskId", taskId);
    formData.append("studentEmail", userEmail);
    formData.append("facultyName", facultyName);

    try {
      const res = await fetch("http://localhost:2000/student/submit-task", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();

      if (data.status) {
        toast.success("Response submitted successfully!");
        setUploadFile(null);
        setUploadingTaskId(null);
        fetchStudentResponses();
      } else {
        toast.error(data.message || "Failed to submit response");
      }
    } catch (err) {
      console.error("Submit response error:", err);
      toast.error("Server error during submission");
    }
  };

  const statusBadge = (status) => {
    if (status === "approved") return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700"><FiCheckCircle size={12}/>Approved</span>;
    if (status === "rejected") return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700"><FiXCircle size={12}/>Rejected</span>;
    return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700"><FiClock size={12}/>Pending</span>;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <ToastContainer />
      <div className="max-w-3xl mx-auto">

        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">
            My{' '}
            <span className="bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">Documents</span>
          </h1>
          <p className="text-gray-500 mt-1">Browse study resources and complete your assigned tasks.</p>
        </div>

        {/* Study Resources */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-4">
            <FiFile className="text-indigo-500" /> Study Resources
          </h2>
          {userUploads.length === 0 ? (
            <p className="text-gray-400 text-sm">No documents available yet.</p>
          ) : (
            <div className="space-y-3">
              {userUploads.map((file) => (
                <div key={file._id} className="flex items-center justify-between border border-gray-100 rounded-xl px-4 py-3 hover:bg-gray-50 transition">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center">
                      <FiFile className="text-indigo-500" size={15} />
                    </div>
                    <span className="text-sm text-gray-700 font-medium truncate max-w-xs">{file.originalname}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <a
                      href={`http://localhost:2000/uploads/${file.filename}`}
                      target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 border border-indigo-200 rounded-lg px-3 py-1.5 transition"
                    >
                      <FiEye size={13} /> View
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Faculty Assigned Tasks */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-4">
            <FiUploadCloud className="text-blue-500" /> Faculty Shared Files
          </h2>
          {assignedTasks.length === 0 ? (
            <p className="text-gray-400 text-sm">No faculty-assigned files or tasks yet.</p>
          ) : (
            <div className="space-y-4">
              {assignedTasks.map((task) => {
                const response = studentResponses[task._id];
                return (
                  <div key={task._id} className="border border-gray-200 rounded-xl p-5 hover:shadow-sm transition">
                    <p className="text-sm font-semibold text-gray-800 mb-1">{task.taskText}</p>
                    <p className="text-xs text-gray-400 mb-3">By: {task.facultyName}</p>

                    {task.filename && (
                      <a
                        href={`http://localhost:2000/uploads/${task.filename}`}
                        target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-indigo-600 hover:underline mb-3"
                      >
                        <FiFile size={13} /> {task.originalname}
                      </a>
                    )}

                    {response ? (
                      <div className="flex flex-wrap items-center gap-3 mt-2 pt-3 border-t border-gray-100">
                        <a
                          href={`http://localhost:2000/uploads/${response.filename}`}
                          target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-indigo-600 hover:underline"
                        >
                          <FiEye size={12} /> {response.originalname}
                        </a>
                        {statusBadge(response.status)}
                        {response.status === "pending" && (
                          <button
                            onClick={() => handleDeleteResponse(response._id)}
                            className="inline-flex items-center gap-1 text-xs font-medium text-red-500 hover:text-red-700 border border-red-200 hover:border-red-400 px-2.5 py-1 rounded-lg transition"
                          >
                            <FiX size={12} /> Delete
                          </button>
                        )}
                      </div>
                    ) : (
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        {uploadingTaskId === task._id ? (
                          <div className="flex flex-wrap items-center gap-3">
                            <label className="flex-1 min-w-[180px] border border-dashed border-gray-300 rounded-xl px-4 py-2.5 text-xs text-gray-500 cursor-pointer hover:border-indigo-400 transition text-center">
                              <input type="file" className="hidden" onChange={handleFileChange} />
                              {uploadFile ? uploadFile.name : "Choose a file…"}
                            </label>
                            <button
                              onClick={() => handleSubmitResponse(task._id, task.facultyName)}
                              className="flex items-center gap-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl transition"
                            >
                              <FiSend size={12} /> Submit
                            </button>
                            <button
                              onClick={() => setUploadingTaskId(null)}
                              className="flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-gray-700 border border-gray-200 px-3 py-2.5 rounded-xl transition"
                            >
                              <FiX size={12} /> Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => { setUploadingTaskId(task._id); setUploadFile(null); }}
                            className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 border border-indigo-200 hover:border-indigo-400 px-4 py-2 rounded-xl transition"
                          >
                            <FiSend size={12} /> Submit Response
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default View;
