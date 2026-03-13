import styles from "./Badge.module.css";

/**
 * Badge
 * variant: "success" | "danger" | "warning" | "info" | "gray"
 */
const Badge = ({ children, variant = "gray" }) => (
  <span className={`${styles.badge} ${styles[variant]}`}>{children}</span>
);

export default Badge;
