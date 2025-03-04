interface CurveProps {
  width?: number;
  height?: number;
  color?: string;
  rotate?: number;
}

export default function Curve({
  width = 24,
  height = 24,
  color = "white",
  rotate = 0,
}: CurveProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        transform: `rotate(${rotate}deg)`,
        transition: "transform 0.3s ease-in-out",
      }}
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M12.0001 7.49994C15.2661 7.49994 19.1211 13.7399 19.8601 14.9909C20.1421 15.4659 19.9841 16.0789 19.5091 16.3599C19.0331 16.6429 18.4201 16.4829 18.1401 16.0089C16.5851 13.3839 13.5601 9.49994 12.0001 9.49994C10.4381 9.49994 7.4131 13.3839 5.8601 16.0089C5.5791 16.4829 4.9641 16.6429 4.4911 16.3599C4.0161 16.0799 3.8581 15.4669 4.1401 14.9909C4.8791 13.7399 8.7341 7.49994 12.0001 7.49994Z"
        fill={color}
      />
    </svg>
  );
}
