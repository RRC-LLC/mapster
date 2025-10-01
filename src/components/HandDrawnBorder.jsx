const HandDrawnBorder = ({ active, animating }) => {
  return <>
    <svg
      className={`absolute inset-0 w-full h-full -z-10 ${active ? 'opacity-100' : 'opacity-0'}`}
      viewBox="0 0 100 40"
      preserveAspectRatio="none"
    >
      <path
        d="M2 2 L98 2 L98 38 L2 38 L2 2"
        fill="none"
        stroke="#B22222"
        strokeWidth="2"
        style={{
          filter: "url(#rough)"
        }}
      />
      <defs>
        <filter id="rough">
          <feTurbulence 
            type="turbulence" 
            baseFrequency="0.05" 
            numOctaves="3" 
            seed="1" 
            result="noise"
          />
          <feDisplacementMap 
            in="SourceGraphic" 
            in2="noise" 
            scale="0.7" 
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>
    </svg>
    {(animating && !active) &&
      <>
      <span className="absolute left-full top-0 size-3 rounded-full bg-[#B22222]"></span>
      <span className="absolute left-full top-0 size-3 rounded-full bg-[#B22222] opacity-75 animate-ping"></span>
      </>
    }
  </>;
};

export default HandDrawnBorder; 