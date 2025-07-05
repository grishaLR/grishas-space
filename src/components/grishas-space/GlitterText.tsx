import { FC, HTMLAttributes } from "react";
import styles from "./GlitterText.module.css";

interface GlitterTextProps extends HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  intensity?: "low" | "medium" | "high";
}

export const GlitterText: FC<GlitterTextProps> = ({
  children,
  intensity = "medium",
  className,
  ...props
}) => {
  return (
    <span className={`${styles.glitterText} ${styles[intensity]} ${className || ""}`} {...props}>
      <span className={styles.content}>{children}</span>
      <span className={styles.sparkle1}></span>
      <span className={styles.sparkle2}></span>
      <span className={styles.sparkle3}></span>
    </span>
  );
};