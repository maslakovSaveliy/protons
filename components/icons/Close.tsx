import { SVGProps } from "react";

interface CloseProps extends SVGProps<SVGSVGElement> {
  color?: string;
  width?: string;
  height?: string;
}

export default function Close({
  color = "white",
  width = "32",
  height = "32",
  ...props
}: CloseProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
      {...props}
    >
      <path
        d="M18.3 5.71a.996.996 0 0 0-1.41 0L12 10.59 7.11 5.7A.996.996 0 1 0 5.7 7.11L10.59 12 5.7 16.89a.996.996 0 1 0 1.41 1.41L12 13.41l4.89 4.89a.996.996 0 1 0 1.41-1.41L13.41 12l4.89-4.89c.38-.38.38-1.02 0-1.4z"
        fill={color}
      />
    </svg>
  );
}
