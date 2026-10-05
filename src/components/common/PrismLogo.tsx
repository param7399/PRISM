import React from 'react';

interface PrismLogoProps {
  className?: string;
  size?: number;
}

export const PrismIcon: React.FC<PrismLogoProps> = ({ className = '', size = 24 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Clean geometric prism triangle with subtle internal facet lines */}
      <path
        d="M14 3L25 23H3L14 3Z"
        className="stroke-blue-600 dark:stroke-blue-400"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M14 3L14 23"
        className="stroke-blue-600/60 dark:stroke-blue-400/60"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M14 14L25 23"
        className="stroke-blue-600/40 dark:stroke-blue-400/40"
        strokeWidth="1.25"
      />
    </svg>
  );
};
