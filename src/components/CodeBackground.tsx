"use client";

import React, { useRef, useEffect, useState } from "react";

import rawCodeSnippets from "@data/codeSnippets.json" with { type: "json" };

type CodeSnippet = {
  language: string;
  lines: string[];
};

const CodeBackground: React.FC = () => {
  const codeBackgroundRef = useRef<HTMLDivElement>(null);
  const dummyRef = useRef<HTMLDivElement>(null);
  const [currentLines, setCurrentLines] = useState<string[]>([]);
  const [currentSnippet, setCurrentSnippet] = useState<CodeSnippet | null>(
    null,
  );
  const [currentLine, setCurrentLine] = useState<string>("");
  const [currentLineIndex, setCurrentLineIndex] = useState<number>(0);
  const [currentCharacterIndex, setCurrentCharacterIndex] = useState<number>(0);
  const [maxLines, setMaxLines] = useState<number>(10);

  const pickRandomSnippet = (): CodeSnippet => {
    const snippetIndex = Math.floor(Math.random() * rawCodeSnippets.length);
    const rawSnippet = rawCodeSnippets[snippetIndex];
    return {
      language: rawSnippet.language,
      lines: rawSnippet.snippet.split("\n"),
    } as CodeSnippet;
  };

  const addLine = (line: string) => {
    setCurrentLines((prevLines) => {
      const newLines = [...prevLines, line];
      if (newLines.length > maxLines) {
        newLines.shift();
      }
      return newLines;
    });
  };

  const calculateMaxLines = () => {
    if (dummyRef.current && codeBackgroundRef.current) {
      const lineHeight = dummyRef.current.clientHeight;
      const viewportHeight = codeBackgroundRef.current.clientHeight;
      const extraPadding = 20;
      setMaxLines(Math.floor(viewportHeight / lineHeight) + extraPadding);
    }
  };

  useEffect(() => {
    calculateMaxLines();
    window.addEventListener("resize", calculateMaxLines);
    return () => window.removeEventListener("resize", calculateMaxLines);
  }, []);

  // randomly pick a snippet if there isn't a current one
  useEffect(() => {
    if (!currentSnippet) {
      setCurrentSnippet(pickRandomSnippet());
    }
  }, [currentSnippet]);

  // main typing effect logic
  useEffect(() => {
    if (!currentSnippet) return;

    const typingIntervalId = setInterval(() => {
      if (currentLineIndex < currentSnippet.lines.length) {
        const line = currentSnippet.lines[currentLineIndex];
        if (currentCharacterIndex < line.length) {
          const character = line[currentCharacterIndex];
          setCurrentLine((prevLine) => prevLine + character);
          setCurrentCharacterIndex((prevIndex) => prevIndex + 1);
        } else {
          addLine(currentLine);
          setCurrentLine("");
          setCurrentLineIndex((prevIndex) => prevIndex + 1);
          setCurrentCharacterIndex(0);
        }
      } else {
        setCurrentSnippet(pickRandomSnippet());
        setCurrentLine("");
        setCurrentLineIndex(0);
        setCurrentCharacterIndex(0);
      }
    }, 10);

    return () => clearInterval(typingIntervalId);
  }, [currentSnippet, currentLine, currentLineIndex, currentCharacterIndex]);

  // this bows the div using a clip path to make it look more like a CRT screen
  useEffect(() => {
    const updateClipPath = () => {
      if (codeBackgroundRef.current) {
        const width = codeBackgroundRef.current.clientWidth;
        const height = codeBackgroundRef.current.clientHeight;
        const clipPath = `path('M 30 130 Q 30 30 130 30 Q ${width / 2} 0 ${width - 130} 30 Q ${width - 30} 30 ${width - 30} 130 Q ${width} ${height / 2} ${width - 30} ${height - 130} Q ${width - 30} ${height - 30} ${width - 130} ${height - 30} Q ${width / 2} ${height} 130 ${height - 30} Q 30 ${height - 30} 30 ${height - 130} Q 0 ${height / 2} 30 130')`;
        codeBackgroundRef.current.style.clipPath = clipPath;
      }
    };

    window.addEventListener("resize", updateClipPath);
    updateClipPath();

    return () => window.removeEventListener("resize", updateClipPath);
  }, []);

  const flickerAnimations = `
    @keyframes flicker {
      0%, 19.999%, 22%, 62.999%, 64%, 64.999%, 70%, 100% {
        opacity: 1;
      }
      20%, 21.999%, 63%, 63.999%, 65%, 69.999% {
        opacity: 0.5;
      }
    }

    @keyframes flicker-fast {
      0%, 19.999%, 22%, 62.999%, 64%, 64.999%, 70%, 100% {
        opacity: 1;
      }
      20%, 21.999%, 63%, 63.999%, 65%, 69.999% {
        opacity: 0.5;
      }
    }
  `;

  const scanlinesAnimations = `
    @keyframes scanlines {
      0% { background-position: 0 0; }
      100% { background-position: 0 100%; }
    }

    .scanlines {
      background: linear-gradient(
        rgba(255, 255, 255, 0.05) 50%, 
        rgba(0, 0, 0, 0.05) 50%
      );
      background-size: 100% 10px;
      animation: scanlines 10s linear infinite;
    }
  `;

  return (
    <div
      className="fixed bg-retro-tan w-full h-full blur-sm"
      style={{
        boxShadow:
          "0 0 20px rgba(0, 0, 0, 0.5), inset 0 0 500px rgba(0, 0, 0, 0.5)",
      }}
    >
      <style>{flickerAnimations}</style>
      <style>{scanlinesAnimations}</style>
      <div
        ref={codeBackgroundRef}
        className="fixed inset-0 bg-retro-brown text-retro-tan overflow-hidden whitespace-pre select-none"
        style={{
          boxShadow:
            "0 0 20px rgba(0, 0, 0, 0.5), inset 0 0 1000px rgba(0, 0, 0, 0.5)",
          border: "10px, solid, rgba(255, 255, 255, 0.1)",
        }}
      >
        <div
          className="fixed inset-0"
          style={{
            animation: `${Math.random() > 0.5 ? "flicker" : "flicker-fast"} 0.1s infinite`,
          }}
        >
          <div className="fixed inset-0 scanlines">
            <div className="absolute bottom-0 w-full flex flex-col items-start justify-start pl-16 pb-8">
              {currentLines.map((line, index) => (
                <div key={index} className="text-sm font-mono">
                  {line}
                </div>
              ))}
              <div className="text-sm font-mono">{currentLine}</div>
              <div ref={dummyRef} className="text-sm font-mono invisible">
                Dummy line
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeBackground;
