import React from "react";

const HandDrawnPlay = ({ size = 48, className = "pl-[2px]" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{ display: 'block' }}
  >
    <defs>
      <filter id="rough-play" x="-20%" y="-20%" width="140%" height="140%">
        <feTurbulence type="turbulence" baseFrequency="0.08" numOctaves="2" seed="2" result="turb" />
        <feDisplacementMap in2="turb" in="SourceGraphic" scale="2.5" xChannelSelector="R" yChannelSelector="G" />
      </filter>
    </defs>
    <path
      d="M14 8 L52 32 L14 56 Z"
      fill="none"
      stroke="#CB2C30"
      strokeWidth="8"
      strokeLinejoin="round"
      filter="url(#rough-play)"
    />
  </svg>
);

export default HandDrawnPlay; 