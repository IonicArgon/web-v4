"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@headlessui/react";
import { Volume2Icon, VolumeXIcon } from "lucide-react";

import CodeBackground from "@components/CodeBackground";

const BackgroundAudioToggle = () => {
  const audio = document.getElementById(
    "background-typing",
  ) as HTMLAudioElement;
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  const toggleAudio = () => {
    if (audio.paused) {
      audio.play();
      audio.volume = 0.25;
      setIsAudioPlaying(true);
    } else {
      audio.pause();
      setIsAudioPlaying(false);
    }
  };

  return (
    <Button
      onClick={toggleAudio}
      className="fixed bottom-4 right-4 p-2 bg-retro-tan text-retro-brown rounded-lg hover:bg-retro-red hover:text-retro-tan transition-colors ease-in-out"
    >
      {isAudioPlaying ? <Volume2Icon size={24} /> : <VolumeXIcon size={24} />}
    </Button>
  );
};

const Loading = () => {
  const [loadingText, setLoadingText] = useState("Loading");

  useEffect(() => {
    const intervalId = setInterval(() => {
      setLoadingText((prev) => (prev === "Loading..." ? "Loading" : prev + "."));
    }, 250);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <div className="fixed w-full h-full flex flex-col items-center justify-center bg-retro-tan">
      <div className="text-3xl text-retro-brown font-mono">{loadingText}</div>
    </div>
  );
};

const ClientSide: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(true);

  useEffect(() => {
    // simulate loading time for now
    const timerId = setTimeout(() => {
      setIsLoaded(true);
    }, 1000);

    return () => {
      clearTimeout(timerId);
    };
  }, []);

  useEffect(() => {
    if (isLoaded) {
      const transitionTimerId = setTimeout(() => {
        setIsTransitioning(false);
      }, 500);

      return () => {
        clearTimeout(transitionTimerId);
      };
    }
  }, [isLoaded]);

  const fadeInAnimation = `
    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }

    .fadeIn {
      opacity: 0;
      animation: fadeIn 0.5s ease-in-out forwards;  
    }
  `;

  const fadeOutAnimation = `
    @keyframes fadeOut {
      from {
        opacity: 1;
      }
      to {
        opacity: 0;
      }
    }

    .fadeOut {
      opacity: 1;
      animation: fadeOut 0.5s ease-in-out forwards;
    }
  `;

  return (
    <html lang="en">
      <body>
        <audio id="background-typing" src="/typing.mp3" loop></audio>

        <style>{fadeInAnimation}</style>
        <style>{fadeOutAnimation}</style>
        {isTransitioning ? (
          <div className={isLoaded ? 'fadeOut' : ''}>
            <Loading />
          </div>
        ) : (
          <div className="fadeIn">
            <CodeBackground />
            {children}
            <BackgroundAudioToggle />
          </div>
        )}
      </body>
    </html>
  );
};

export default ClientSide;
