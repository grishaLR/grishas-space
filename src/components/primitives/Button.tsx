import { FC, forwardRef } from "react";
import { ButtonProps } from "@types/primitives";
import styles from "./Button.module.css";

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "grishas-space", size = "medium", glitter = false, animated = true, className, children, ...props }, ref) => {
    const classes = [
      styles.button,
      styles[variant],
      styles[size],
      glitter && styles.glitter,
      animated && styles.animated,
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <button ref={ref} className={classes} {...props}>
        {glitter && <span className={styles.glitterLayer} />}
        <span className={styles.content}>{children}</span>
      </button>
    );
  }
);

Button.displayName = "Button";