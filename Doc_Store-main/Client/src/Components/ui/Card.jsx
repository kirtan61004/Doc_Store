import styles from "./Card.module.css";

/**
 * Card  — base surface component
 * Props: className, children, hover, padding
 */
const Card = ({ children, className = "", hover = false, padding = "lg", style = {} }) => {
  const padMap = { sm: "1rem", md: "1.5rem", lg: "2rem" };
  return (
    <div
      className={`${styles.card} ${hover ? styles.hover : ""} ${className}`}
      style={{ padding: padMap[padding] ?? padding, ...style }}
    >
      {children}
    </div>
  );
};

export default Card;
