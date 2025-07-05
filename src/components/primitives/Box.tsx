import { FC, forwardRef } from "react";
import { BoxProps } from "@types/primitives";

export const Box = forwardRef<HTMLDivElement, BoxProps>(
  (
    {
      display,
      flexDirection,
      alignItems,
      justifyContent,
      gap,
      padding,
      margin,
      width,
      height,
      background,
      border,
      borderRadius,
      position,
      top,
      right,
      bottom,
      left,
      zIndex,
      overflow,
      gridTemplateColumns,
      gridGap,
      style,
      ...props
    },
    ref
  ) => {
    const boxStyle = {
      display,
      flexDirection,
      alignItems,
      justifyContent,
      gap,
      padding,
      margin,
      width,
      height,
      background,
      border,
      borderRadius,
      position,
      top,
      right,
      bottom,
      left,
      zIndex,
      overflow,
      gridTemplateColumns,
      gridGap,
      ...style,
    };

    return <div ref={ref} style={boxStyle} {...props} />;
  }
);

Box.displayName = "Box";