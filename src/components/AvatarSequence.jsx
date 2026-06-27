import { forwardRef, useImperativeHandle, useEffect, useRef, useState } from 'react';

const FRAME_COUNT = 240;

const AvatarSequence = forwardRef(({ className = "" }, ref) => {
  const imgRef = useRef(null);
  const imagesRef = useRef([]);
  const [isZoomed, setIsZoomed] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useImperativeHandle(ref, () => ({
    updateFrame: (normalizedX) => {
      // normalizedX is expected to be between -1 and 1
      if (!loaded || !imgRef.current) return;
      
      // Convert -1 -> 1 to 0 -> 1
      const percentage = (normalizedX + 1) / 2;
      let frameIndex = Math.floor(percentage * (FRAME_COUNT - 1));
      frameIndex = Math.max(0, Math.min(FRAME_COUNT - 1, frameIndex));
      
      if (imagesRef.current[frameIndex]) {
        imgRef.current.src = imagesRef.current[frameIndex].src;
      }
    }
  }));

  useEffect(() => {
    let loadedCount = 0;
    for (let i = 1; i <= FRAME_COUNT; i++) {
      const img = new Image();
      const frameNumber = i.toString().padStart(3, '0');
      img.src = `${import.meta.env.BASE_URL}3d_frames/ezgif-frame-${frameNumber}.jpg`;
      img.onload = () => {
        loadedCount++;
        // Allow rendering after some frames are loaded to show something quickly, 
        // but fully activate when all are loaded to prevent flicker.
        if (loadedCount === FRAME_COUNT) {
          setLoaded(true);
        }
      };
      imagesRef.current.push(img);
    }
  }, []);

  return (
    <div 
      className={`relative cursor-crosshair ${className}`}
      onClick={() => setIsZoomed(!isZoomed)}
    >
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="text-[#E63946] animate-pulse font-label-sm tracking-widest uppercase">
            Loading Sequence...
          </div>
        </div>
      )}
      <img
        ref={imgRef}
        src={`${import.meta.env.BASE_URL}3d_frames/ezgif-frame-001.jpg`}
        alt="Interactive 3D Avatar"
        className={`w-full h-full object-contain mix-blend-lighten transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] will-change-transform select-none ${
          isZoomed ? 'scale-[2.5] -translate-y-[15%]' : 'scale-100 translate-y-0'
        }`}
        draggable="false"
      />
    </div>
  );
});

export default AvatarSequence;
