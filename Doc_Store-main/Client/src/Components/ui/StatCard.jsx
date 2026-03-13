import styles from "./StatCard.module.css";

/**
 * StatCard — used in admin dashboard
 * Props: title, value, icon, color ("blue"|"green"|"yellow"|"red"|"purple")
 */
const StatCard = ({ title, value, icon, color = "blue", trend }) => (
  <div className={`${styles.card} ${styles[color]}`}>
    <div className={styles.top}>
      <div>
        <p className={styles.title}>{title}</p>
        <p className={styles.value}>{value ?? "—"}</p>
        {trend && <p className={styles.trend}>{trend}</p>}
      </div>
      <div className={styles.iconBox}>{icon}</div>
    </div>
  </div>
);

export default StatCard;
