import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { MdLock, MdEmail, MdPerson, MdSave, MdLogout } from "react-icons/md";
import AdminLayout from "./components/AdminLayout";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import styles from "./AdminSettings.module.css";

const AdminSettings = () => {
  const navigate = useNavigate();
  const adminEmail = sessionStorage.getItem("adminEmail") || "";
  const adminName = sessionStorage.getItem("adminName") || "Admin";

  const [currentPass, setCurrentPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState({ type: "", text: "" });

  const authHeader = () => ({
    headers: { Authorization: `Bearer ${sessionStorage.getItem("adminToken")}` },
  });

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setMsg({ type: "", text: "" });
    if (newPass !== confirmPass) {
      setMsg({ type: "error", text: "New passwords do not match." });
      return;
    }
    if (newPass.length < 6) {
      setMsg({ type: "error", text: "Password must be at least 6 characters." });
      return;
    }
    setSaving(true);
    try {
      await axios.patch(
        "http://localhost:2000/users/change-password",
        { currentPassword: currentPass, newPassword: newPass },
        authHeader()
      );
      setMsg({ type: "success", text: "Password changed successfully!" });
      setCurrentPass(""); setNewPass(""); setConfirmPass("");
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        navigate("/adminlogin", { replace: true });
        return;
      }
      setMsg({ type: "error", text: err.response?.data?.message || "Failed to change password." });
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    ["isAdmin", "adminToken", "adminEmail", "adminName"].forEach((k) =>
      sessionStorage.removeItem(k)
    );
    navigate("/adminlogin", { replace: true });
  };

  return (
    <AdminLayout title="Settings">
      <div className={styles.grid}>

        {/* Profile info card */}
        <Card padding="lg">
          <h2 className={styles.cardTitle}>Admin Profile</h2>
          <div className={styles.profileRow}>
            <div className={styles.avatar}>
              {adminName.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className={styles.profileName}>{adminName}</p>
              <p className={styles.profileRole}>Administrator</p>
            </div>
          </div>
          <div className={styles.infoItem}>
            <MdPerson className={styles.infoIcon} />
            <div>
              <p className={styles.infoLabel}>Full Name</p>
              <p className={styles.infoValue}>{adminName}</p>
            </div>
          </div>
          <div className={styles.infoItem}>
            <MdEmail className={styles.infoIcon} />
            <div>
              <p className={styles.infoLabel}>Email Address</p>
              <p className={styles.infoValue}>{adminEmail}</p>
            </div>
          </div>
          <div className={styles.infoItem}>
            <MdLock className={styles.infoIcon} />
            <div>
              <p className={styles.infoLabel}>Role</p>
              <p className={styles.infoValue}>Super Admin</p>
            </div>
          </div>
          <Button
            variant="danger"
            icon={<MdLogout />}
            size="sm"
            onClick={handleLogout}
            className={styles.logoutBtn}
          >
            Logout
          </Button>
        </Card>

        {/* Change password card */}
        <Card padding="lg">
          <h2 className={styles.cardTitle}>Change Password</h2>
          <p className={styles.cardSub}>Update your admin account password</p>

          {msg.text && (
            <div className={`${styles.msgBanner} ${msg.type === "error" ? styles.msgError : styles.msgSuccess}`}>
              {msg.text}
            </div>
          )}

          <form onSubmit={handleChangePassword} className={styles.form}>
            <div className={styles.field}>
              <label className={styles.label}>Current Password</label>
              <div className={styles.inputWrap}>
                <MdLock className={styles.inputIcon} />
                <input
                  type="password"
                  className={styles.input}
                  placeholder="Enter current password"
                  value={currentPass}
                  onChange={(e) => setCurrentPass(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className={styles.field}>
              <label className={styles.label}>New Password</label>
              <div className={styles.inputWrap}>
                <MdLock className={styles.inputIcon} />
                <input
                  type="password"
                  className={styles.input}
                  placeholder="Enter new password"
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Confirm New Password</label>
              <div className={styles.inputWrap}>
                <MdLock className={styles.inputIcon} />
                <input
                  type="password"
                  className={styles.input}
                  placeholder="Re-enter new password"
                  value={confirmPass}
                  onChange={(e) => setConfirmPass(e.target.value)}
                  required
                />
              </div>
            </div>
            <Button
              type="submit"
              variant="primary"
              icon={<MdSave />}
              disabled={saving}
              className={styles.saveBtn}
            >
              {saving ? "Saving…" : "Save Password"}
            </Button>
          </form>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
