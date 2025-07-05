import { CSSProperties, HTMLAttributes, ButtonHTMLAttributes } from "react";

export interface BoxProps extends HTMLAttributes<HTMLDivElement> {
  display?: CSSProperties["display"];
  flexDirection?: CSSProperties["flexDirection"];
  alignItems?: CSSProperties["alignItems"];
  justifyContent?: CSSProperties["justifyContent"];
  gap?: CSSProperties["gap"];
  padding?: CSSProperties["padding"];
  margin?: CSSProperties["margin"];
  width?: CSSProperties["width"];
  height?: CSSProperties["height"];
  background?: CSSProperties["background"];
  border?: CSSProperties["border"];
  borderRadius?: CSSProperties["borderRadius"];
  position?: CSSProperties["position"];
  top?: CSSProperties["top"];
  right?: CSSProperties["right"];
  bottom?: CSSProperties["bottom"];
  left?: CSSProperties["left"];
  zIndex?: CSSProperties["zIndex"];
  overflow?: CSSProperties["overflow"];
  gridTemplateColumns?: CSSProperties["gridTemplateColumns"];
  gridGap?: CSSProperties["gridGap"];
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "grishas-space" | "hot" | "cool" | "minimal";
  size?: "small" | "medium" | "large";
  glitter?: boolean;
  animated?: boolean;
}

export interface TextProps extends HTMLAttributes<HTMLParagraphElement> {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span";
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
  color?: string;
  weight?: CSSProperties["fontWeight"];
  align?: CSSProperties["textAlign"];
  glitch?: boolean;
  rainbow?: boolean;
  shadow?: boolean;
}