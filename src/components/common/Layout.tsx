import { FC, ReactNode } from "react";
import styles from "./Layout.module.css";

interface LayoutProps {
  children: ReactNode;
}

export const Layout: FC<LayoutProps> = ({ children }) => {
  return (
    <div className={styles.layout}>
      <div className={styles.background}></div>
      <div className={styles.content}>
        {children}
      </div>
    </div>
  );
};