
import React from 'react';
import { cn } from "@/lib/utils";

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  alt: string;
}

const Image: React.FC<ImageProps> = ({ className, alt, ...props }) => {
  return (
    <img 
      alt={alt} 
      className={cn("object-contain", className)}
      {...props} 
    />
  );
};

export default Image;
