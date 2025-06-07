import { useEffect, useRef, useState } from "react";
import "./ScrollRevealOverlay.css";

const ScrollRevealOverlay = ({ text }) => {
  const ref = useRef();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const winHeight = window.innerHeight;
      const reveal = 1 - rect.top / winHeight;
      setProgress(Math.min(Math.max(reveal, 0), 1));
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const speedFactor = 1; // lower = slower (try 0.3 or 0.1 for very slow)
  const visibleLength = Math.floor(text.length * progress * speedFactor);
  const chars = Array.from(text);

  return (
    <div className="scroll-layer-wrapper" ref={ref}>
      <div className="ghost-layer">
        {chars.map((char, i) => (
          <span key={i}>{char}</span>
        ))}
      </div>
      <div className="reveal-layer">
        {chars.map((char, i) => (
          <span key={i} className={i < visibleLength ? "visible" : ""}>
            {char}
          </span>
        ))}
      </div>
    </div>
  );
};

export default ScrollRevealOverlay;
