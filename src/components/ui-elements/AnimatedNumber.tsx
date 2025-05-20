
import React, { useEffect, useState } from 'react';

interface AnimatedNumberProps {
  value: number;
  duration?: number;
  startAnimation?: boolean;
}

const AnimatedNumber: React.FC<AnimatedNumberProps> = ({
  value,
  duration = 1000,
  startAnimation = true,
}) => {
  const [currentValue, setCurrentValue] = useState(0);
  
  useEffect(() => {
    if (!startAnimation) {
      setCurrentValue(value);
      return;
    }
    
    let startTime: number | null = null;
    let animationFrameId: number;
    
    const updateNumber = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / duration, 1);
      
      // Easing function for smoother animation
      const easeOutCubic = (x: number) => 1 - Math.pow(1 - x, 3);
      const easedPercentage = easeOutCubic(percentage);
      
      setCurrentValue(Math.floor(easedPercentage * value));
      
      if (percentage < 1) {
        animationFrameId = requestAnimationFrame(updateNumber);
      } else {
        setCurrentValue(value);
      }
    };
    
    animationFrameId = requestAnimationFrame(updateNumber);
    
    return () => cancelAnimationFrame(animationFrameId);
  }, [value, duration, startAnimation]);
  
  return <span>{currentValue.toLocaleString()}</span>;
};

export default AnimatedNumber;
