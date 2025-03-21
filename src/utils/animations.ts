
import { useEffect, useState } from "react";

// Used to create staggered animations
export const useStaggeredChildren = () => {
  return (element: HTMLElement, delay = 50) => {
    if (!element) return;
    
    const children = Array.from(element.children) as HTMLElement[];
    
    children.forEach((child, index) => {
      child.style.opacity = "0";
      child.style.transform = "translateY(20px)";
      
      setTimeout(() => {
        child.style.transition = "opacity 0.5s ease, transform 0.5s ease";
        child.style.opacity = "1";
        child.style.transform = "translateY(0)";
      }, index * delay);
    });
  };
};

// Custom hook for animations when element enters viewport
export const useInView = (threshold = 0.1) => {
  const [inView, setInView] = useState(false);
  const [ref, setRef] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (!ref) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
      },
      { threshold }
    );
    
    observer.observe(ref);
    
    return () => {
      observer.disconnect();
    };
  }, [ref, threshold]);

  return { ref: setRef, inView };
};

// Animation class utility
export const animations = {
  fadeIn: "animate-fade-in",
  slideUp: "animate-slide-up",
  scale: "animate-scale",
  pulse: "animate-pulse-subtle",
};

// Staggered animation classes
export const staggered = {
  first: "opacity-0 animate-fade-in",
  second: "opacity-0 animate-fade-in stagger-1",
  third: "opacity-0 animate-fade-in stagger-2",
  fourth: "opacity-0 animate-fade-in stagger-3",
};
