interface ArrowDownProps {
  width?: number;
  height?: number;
  color?: string;
}

export default function ArrowDown({
  width = 32,
  height = 32,
  color = "white",
}: ArrowDownProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M22.7847 17.082C22.0714 16.3673 19.6554 16.1206 17.3287 16.054V5.09798C17.3287 4.36065 16.7327 3.76465 15.9954 3.76465C15.2581 3.76465 14.6621 4.36065 14.6621 5.09798V16.046C11.6794 16.1166 9.85274 16.4633 9.23407 17.082C8.4834 17.834 8.86874 19.0873 9.2874 20.0953C10.1554 22.1873 13.8167 28.2353 16.0101 28.2353C18.2701 28.2353 21.9194 21.918 22.7154 19.9993C23.1487 18.9566 23.4954 17.7953 22.7847 17.082Z"
        fill={color}
      />
    </svg>
  );
}
