import { FC, ReactNode } from "react";
import { Box } from "@components/primitives";
import styles from "./ProfileBox.module.css";

interface ProfileBoxProps {
  title: string;
  children: ReactNode;
  variant?: "default" | "neon" | "gradient";
  animated?: boolean;
}

export const ProfileBox: FC<ProfileBoxProps> = ({
  title,
  children,
  variant = "default",
  animated = true,
}) => {
  return (
    <Box className={`${styles.profileBox} ${styles[variant]} ${animated && styles.animated}`}>
      <div className={styles.header}>
        <h3 className={styles.title}>{title}</h3>
        <div className={styles.decoration}></div>
      </div>
      <div className={styles.content}>{children}</div>
    </Box>
  );
};