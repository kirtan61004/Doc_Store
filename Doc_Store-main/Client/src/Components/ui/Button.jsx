import styles from "./Button.module.css";

/**
 * Button
 * variant: "primary" | "danger" | "ghost" | "outline" | "success"
 * size: "sm" | "md" | "lg"
 */
const Button = ({
  children,
  onClick,
  variant = "primary",
  size = "md",
  disabled = false,
  type = "button",
  fullWidth = false,
  icon,
  className = "",
}) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled}
    className={`${styles.btn} ${styles[variant]} ${styles[size]} ${fullWidth ? styles.fullWidth : ""} ${className}`}
  >
    {icon && <span className={styles.icon}>{icon}</span>}
    {children}
  </button>
);

export default Button;
