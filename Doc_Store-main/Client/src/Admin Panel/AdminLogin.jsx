import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { MdLock, MdEmail, MdSecurity } from "react-icons/md";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "./AdminLogin.module.css";

const AdminLogin = () => {
  const [step, setStep] = useState("credentials"); // "credentials" | "otp"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [pendingEmail, setPendingEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const otpRefs = useRef([]);
  const navigate = useNavigate();

  // ── Step 1: Validate email + password ─────────────────────────────────────
  const handleCredentials = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:2000/users/login", { email, password });
      if (res.data.status && res.data.otpRequired) {
        setPendingEmail(res.data.email);
        setStep("otp");
        toast.info("OTP sent to your registered email!");
      } else if (res.data.status && res.data.role === "admin") {
        // Fallback: non-OTP admin (shouldn't happen, but safe)
        sessionStorage.setItem("isAdmin", "true");
        sessionStorage.setItem("adminToken", res.data.token);
        sessionStorage.setItem("adminEmail", res.data.email);
        sessionStorage.setItem("adminName", res.data.name);
        toast.success("Welcome back, Admin!");
        setTimeout(() => navigate("/adminpanel"), 900);
      } else {
        toast.error(res.data.message || "Invalid credentials.");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── Step 2: Verify OTP ────────────────────────────────────────────────────
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const otpValue = otp.join("");
    if (otpValue.length < 6) {
      toast.error("Please enter the complete 6-digit OTP.");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:2000/users/verify-otp", {
        email: pendingEmail,
        otp: otpValue,
      });
      if (res.data.status) {
        sessionStorage.setItem("isAdmin", "true");
        sessionStorage.setItem("adminToken", res.data.token);
        sessionStorage.setItem("adminEmail", res.data.email);
        sessionStorage.setItem("adminName", res.data.name);
        toast.success("Welcome back, Admin!");
        setTimeout(() => navigate("/adminpanel"), 900);
      } else {
        toast.error(res.data.message || "Invalid OTP.");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "OTP verification failed.");
    } finally {
      setLoading(false);
    }
  };

  // OTP digit input handler
  const handleOtpChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;
    const updated = [...otp];
    updated[index] = value;
    setOtp(updated);
    if (value && index < 5) otpRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(""));
      otpRefs.current[5]?.focus();
    }
    e.preventDefault();
  };

  return (
    <div className={styles.page}>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className={styles.card}>
        {/* Brand */}
        <div className={styles.brand}>
          <div className={styles.brandIcon}>
            {step === "otp" ? <MdSecurity /> : <MdLock />}
          </div>
          <h1 className={styles.brandName}><span>Doc</span>Store</h1>
          <p className={styles.brandSub}>Admin Portal</p>
        </div>

        {/* Step 1: Credentials */}
        {step === "credentials" && (
          <form onSubmit={handleCredentials} className={styles.form}>
            <div className={styles.field}>
              <label className={styles.label}>Email Address</label>
              <div className={styles.inputWrapper}>
                <MdEmail className={styles.inputIcon} />
                <input
                  type="email"
                  className={styles.input}
                  placeholder="admin@docstore.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Password</label>
              <div className={styles.inputWrapper}>
                <MdLock className={styles.inputIcon} />
                <input
                  type="password"
                  className={styles.input}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className={`${styles.submitBtn} ${loading ? styles.loading : ""}`}
              disabled={loading}
            >
              {loading ? "Sending OTP…" : "Continue"}
            </button>
          </form>
        )}

        {/* Step 2: OTP */}
        {step === "otp" && (
          <form onSubmit={handleVerifyOtp} className={styles.form}>
            <div className={styles.otpHeader}>
              <p className={styles.otpHint}>
                We sent a 6-digit OTP to
              </p>
              <p className={styles.otpEmail}>{pendingEmail}</p>
              <p className={styles.otpExpiry}>OTP expires in 5 minutes</p>
            </div>

            <div className={styles.otpBoxes} onPaste={handleOtpPaste}>
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => (otpRefs.current[i] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  className={styles.otpBox}
                  value={digit}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(i, e)}
                />
              ))}
            </div>

            <button
              type="submit"
              className={`${styles.submitBtn} ${loading ? styles.loading : ""}`}
              disabled={loading}
            >
              {loading ? "Verifying…" : "Verify & Sign In"}
            </button>

            <button
              type="button"
              className={styles.backBtn}
              onClick={() => { setStep("credentials"); setOtp(["", "", "", "", "", ""]); }}
            >
              ← Back to login
            </button>
          </form>
        )}

        <p className={styles.footer}>Doc Store © {new Date().getFullYear()}</p>
      </div>
    </div>
  );
};

export default AdminLogin;

