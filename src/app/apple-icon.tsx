import { ImageResponse } from 'next/og';

export const size = {
  width: 180,
  height: 180,
};

export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <svg
        width="180"
        height="180"
        viewBox="0 0 180 180"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          x="3"
          y="3"
          width="174"
          height="174"
          rx="44"
          fill="#050505"
          stroke="#ededed"
          strokeOpacity="0.18"
          strokeWidth="3"
        />
        <path
          d="M38 141V39h27l25 45 25-45h27v102h-27V84l-25 46-25-46v57z"
          fill="#ededed"
        />
        <circle cx="151" cy="151" r="9" fill="#7ef0c0" />
      </svg>
    ),
    {
      ...size,
    },
  );
}
