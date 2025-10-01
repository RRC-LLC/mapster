'use client'
import { useState } from "react";

export default function InnerButton ({text, onClick}){
    const [effect, setEffect] = useState(false);
    return (
        <button 
            className={`dark-wood-small hover:brightness-110 transition-brightness duration-200 ease h-10 p-2 px-4 font-pg flex flex-grow shadow-inner-button justify-center items-center rounded text-lg`}
            onClick={() => {
                setEffect(true);
                if(onClick) onClick()
              }}
            onAnimationEnd={() => setEffect(false)}
        >
            <span className="opacity-90">
            {text}
            </span>
        </button>
    )
}