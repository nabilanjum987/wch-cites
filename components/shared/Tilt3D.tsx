'use client';

import { useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface Tilt3DProps {
  children: React.ReactNode;
  scale?: number;
  rotationStrength?: number;
  className?: string;
}

export function Tilt3D({
  children,
  scale = 1.02,
  rotationStrength = 15,
  className = '',
}: Tilt3DProps) {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const distX = mouseX - centerX;
    const distY = mouseY - centerY;

    const rotX = (distY / centerY) * rotationStrength;
    const rotY = -(distX / centerX) * rotationStrength;

    setRotateX(rotX);
    setRotateY(rotY);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setIsHovered(false);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      style={{
        transformStyle: 'preserve-3d',
      }}
      animate={{
        rotateX,
        rotateY,
        scale: isHovered ? scale : 1,
      }}
      transition={{
        type: 'spring',
        stiffness: 400,
        damping: 30,
      }}
      className={`${className}`}
    >
      <motion.div
        style={{
          transformStyle: 'preserve-3d',
        }}
        animate={{
          z: isHovered ? 50 : 0,
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

export default Tilt3D;
