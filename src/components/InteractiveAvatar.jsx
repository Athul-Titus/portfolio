import { useState, useRef, useEffect } from 'react';

export default function InteractiveAvatar({ className = "" }) {
  const containerRef = useRef(null);
  const [rotation, setRotation] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomOrigin, setZoomOrigin] = useState("50% 50%");
  
  // Drag state
  const [isDragging, setIsDragging] = useState(false);
  const startX = useRef(0);
  const currentRot = useRef(0);
  const hasDragged = useRef(false);

  const handlePointerDown = (e) => {
    setIsDragging(true);
    hasDragged.current = false;
    startX.current = e.clientX;
    currentRot.current = rotation;
    e.target.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    const deltaX = e.clientX - startX.current;
    if (Math.abs(deltaX) > 5) {
      hasDragged.current = true;
    }
    // 1 pixel drag = 1 degree rotation (tweakable)
    setRotation(currentRot.current + deltaX);
  };

  const handlePointerUp = (e) => {
    setIsDragging(false);
    e.target.releasePointerCapture(e.pointerId);
  };

  const handleClick = (e) => {
    // Prevent zooming if the user was just dragging to rotate
    if (hasDragged.current) return;

    if (isZoomed) {
      setIsZoomed(false);
      return;
    }

    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setZoomOrigin(`${x}% ${y}%`);
    setIsZoomed(true);
  };

  return (
    <div 
      ref={containerRef}
      className={`relative cursor-grab active:cursor-grabbing ${className}`}
      style={{ perspective: "1000px" }}
    >
      <div 
        className={`w-full h-full relative transition-transform ${isDragging ? 'duration-0' : 'duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]'} will-change-transform`}
        style={{
          transformStyle: "preserve-3d",
          transform: `rotateY(${rotation}deg) ${isZoomed ? 'scale(2.5)' : 'scale(1)'}`,
          transformOrigin: zoomOrigin,
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onClick={handleClick}
      >
        {/* Front Image */}
        <img
          src={`${import.meta.env.BASE_URL}avatar-front.png`}
          alt="Avatar Front"
          className="absolute inset-0 w-full h-full object-contain mix-blend-lighten pointer-events-none drop-shadow-[0_0_20px_rgba(230,57,70,0.4)]"
          style={{ backfaceVisibility: "hidden" }}
          draggable="false"
        />
        {/* Back Image */}
        <img
          src={`${import.meta.env.BASE_URL}avatar-back.png`}
          alt="Avatar Back"
          className="absolute inset-0 w-full h-full object-contain mix-blend-lighten pointer-events-none drop-shadow-[0_0_20px_rgba(230,57,70,0.4)]"
          style={{ 
            backfaceVisibility: "hidden", 
            transform: "rotateY(180deg)" 
          }}
          draggable="false"
        />
      </div>
      
      {/* Interaction Hint */}
      {!isZoomed && rotation === 0 && (
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 font-label-sm text-text-muted text-xs whitespace-nowrap animate-pulse pointer-events-none">
          Drag to rotate • Click to zoom
        </div>
      )}
    </div>
  );
}
