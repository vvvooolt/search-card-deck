import { useEffect, useRef } from 'react';
import p5 from 'p5';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
}

export const ParticleBackground = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sketchRef = useRef<p5 | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const sketch = (p: p5) => {
      let particles: Particle[] = [];
      const particleCount = 30;

      p.setup = () => {
        const canvas = p.createCanvas(p.windowWidth, p.windowHeight);
        canvas.parent(containerRef.current!);
        
        // Initialize particles
        for (let i = 0; i < particleCount; i++) {
          particles.push({
            x: p.random(p.width),
            y: p.random(p.height),
            vx: p.random(-0.3, 0.3),
            vy: p.random(-0.3, 0.3),
            size: p.random(2, 4),
            alpha: p.random(0.3, 0.6)
          });
        }
      };

      p.draw = () => {
        p.clear();
        
        // Update and draw particles
        particles.forEach((particle, i) => {
          // Move particle
          particle.x += particle.vx;
          particle.y += particle.vy;
          
          // Wrap around edges
          if (particle.x < 0) particle.x = p.width;
          if (particle.x > p.width) particle.x = 0;
          if (particle.y < 0) particle.y = p.height;
          if (particle.y > p.height) particle.y = 0;
          
          // Draw particle with primary color
          p.noStroke();
          p.fill(132, 204, 230, particle.alpha * 255); // hsl(199, 85%, 60%) converted to RGB
          p.circle(particle.x, particle.y, particle.size);
          
          // Draw connections between nearby particles
          for (let j = i + 1; j < particles.length; j++) {
            const other = particles[j];
            const d = p.dist(particle.x, particle.y, other.x, other.y);
            
            if (d < 120) {
              const alpha = p.map(d, 0, 120, 0.2, 0);
              p.stroke(132, 204, 230, alpha * 255);
              p.strokeWeight(0.5);
              p.line(particle.x, particle.y, other.x, other.y);
            }
          }
        });
      };

      p.windowResized = () => {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
      };
    };

    sketchRef.current = new p5(sketch);

    return () => {
      sketchRef.current?.remove();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
};
