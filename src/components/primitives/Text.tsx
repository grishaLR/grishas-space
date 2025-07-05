import { FC, createElement } from "react";
import { TextProps } from "@types/primitives";
import styles from "./Text.module.css";

export const Text: FC<TextProps> = ({
  as = "p",
  size = "md",
  color,
  weight,
  align,
  glitch = false,
  rainbow = false,
  shadow = false,
  className,
  style,
  children,
  ...props
}) => {
  const classes = [
    styles.text,
    styles[size],
    glitch && styles.glitch,
    rainbow && styles.rainbow,
    shadow && styles.shadow,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const textStyle = {
    color,
    fontWeight: weight,
    textAlign: align,
    ...style,
  };

  return createElement(
    as,
    {
      className: classes,
      style: textStyle,
      "data-text": glitch ? children : undefined,
      ...props,
    },
    children
  );
};