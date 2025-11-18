import { useEffect, useRef } from 'react';
import irisLogoNoEye from '../assets/iris-logo-no-eye.svg';

/**
 * AnimatedLogo - Iris flower logo with animated cursor-following eye
 * 
 * Features:
 * - Smooth velocity-based physics for natural eye movement
 * - Global cursor tracking (eye follows cursor anywhere on screen)
 * - Dead zone in center for natural resting state
 * - Constrained movement to stay within flower opening
 * - GPU-accelerated transforms for 60fps performance
 */

const CONFIG = {
  CENTER: 48,              // Center of 96x96 container
  EYE_RADIUS: 10,          // Eye pupil radius (20px diameter)
  MAX_DISTANCE: 12,        // Max distance eye can move from center
  SMOOTHING: 0.01,         // Acceleration rate (lower = slower, smoother)
  DAMPING: 0.90,           // Velocity damping (higher = less overshoot)
  MIN_DISTANCE: 8,         // Dead zone radius before eye starts moving
  SCALE_FACTOR: 0.045,     // Cursor distance to eye movement ratio
};

export function AnimatedLogo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const eyeRef = useRef<HTMLDivElement>(null);
  const currentPosRef = useRef({ x: CONFIG.CENTER, y: CONFIG.CENTER });
  const targetPosRef = useRef({ x: CONFIG.CENTER, y: CONFIG.CENTER });
  const velocityRef = useRef({ x: 0, y: 0 });
  const animationFrameRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const container = containerRef.current;
    const eye = eyeRef.current;
    if (!container || !eye) return;

    // Animation loop with smooth physics (like real eye movement)
    const animate = () => {
      const current = currentPosRef.current;
      const target = targetPosRef.current;
      const velocity = velocityRef.current;

      // Calculate distance to target
      const dx = target.x - current.x;
      const dy = target.y - current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Apply velocity-based physics (acceleration + friction)
      if (dist > 0.01) {
        // Gentle acceleration toward target
        velocity.x += dx * CONFIG.SMOOTHING;
        velocity.y += dy * CONFIG.SMOOTHING;

        // Apply strong damping (friction) for smooth, non-overshooting movement
        velocity.x *= CONFIG.DAMPING;
        velocity.y *= CONFIG.DAMPING;

        // Update position
        current.x += velocity.x;
        current.y += velocity.y;
      } else {
        // Gradually reduce velocity to zero when very close to target
        velocity.x *= 0.9;
        velocity.y *= 0.9;
      }

      // Update eye position directly via transform (GPU accelerated)
      eye.style.transform = `translate(${current.x - CONFIG.EYE_RADIUS}px, ${current.y - CONFIG.EYE_RADIUS}px)`;

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    // Start animation loop
    animationFrameRef.current = requestAnimationFrame(animate);

    // Mouse move handler - smooth, continuous tracking
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const centerX = rect.left + CONFIG.CENTER;
      const centerY = rect.top + CONFIG.CENTER;

      // Calculate direction from logo center to cursor
      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      // Dead zone: only move if cursor is far enough from logo center
      if (distance > CONFIG.MIN_DISTANCE) {
        // Normalize direction
        const dirX = deltaX / distance;
        const dirY = deltaY / distance;

        // Proportional movement (not 1:1) - creates gentle "watching" effect
        const scaledDist = Math.min(distance * CONFIG.SCALE_FACTOR, CONFIG.MAX_DISTANCE);
        
        targetPosRef.current = {
          x: CONFIG.CENTER + dirX * scaledDist,
          y: CONFIG.CENTER + dirY * scaledDist,
        };
      } else {
        // Cursor near logo center - eye returns to center
        targetPosRef.current = { x: CONFIG.CENTER, y: CONFIG.CENTER };
      }
    };

    // Attach to document for global cursor tracking
    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div ref={containerRef} className="w-24 h-24 relative">
      {/* Flower background */}
      <img
        src={irisLogoNoEye}
        alt="Iris Logo"
        className="w-full h-full absolute inset-0"
        draggable={false}
      />
      
      {/* Animated eye */}
      <div
        ref={eyeRef}
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 20,
          height: 20,
          backgroundColor: '#FFC413',
          left: 0,
          top: 0,
          willChange: 'transform',
        }}
      />
    </div>
  );
}
