"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@headlessui/react";

interface BaseWindowProps {
  children: React.ReactNode;
  id: string;
  title: string;
  closeCallback: () => void;
}

const BaseWindow: React.FC<BaseWindowProps> = ({
  children,
  id,
  title,
  closeCallback,
}) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  useEffect(() => {
    const handleMouseUp = () => {
      setIsDragging(false);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setPosition({
          x: e.clientX - offset.x,
          y: e.clientY - offset.y,
        });
      }
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, offset]);

  return (
    <div className="fixed" style={{ left: position.x, top: position.y }} id={id}>
      <div className="min-w-96 min-h-96 bg-retro-tan border-2 border-gray-700 rounded-lg shadow-lg">
        <div
          className="flex border-b-2 border-b-gray-700 p-2"
          onMouseDown={handleMouseDown}
          style={{ cursor: isDragging ? "grabbing" : "grab" }}
        >
          <span className="font-mono text-xl text-retro-brown">{title}</span>
          <Button
            className="ml-auto text-white bg-retro-red hover:bg-retro-brown px-2 rounded-lg transition-colors ease-in-out"
            onClick={() => {
              closeCallback();
            }}
          >
            X
          </Button>
        </div>
        <div className="mt-2 p-2">{children}</div>
      </div>
    </div>
  );
};

export default BaseWindow;
