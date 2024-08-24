"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@headlessui/react";

import BaseWindow from "@components/BaseWindow";

interface WindowHandlerProps {
  getMarkdown: (path: string) => Promise<React.ReactNode>;
}

const WindowHandler: React.FC<WindowHandlerProps> = ({ getMarkdown }) => {
  const [windowChildren, setWindowChildren] = useState<
    Record<string, React.ReactNode>
  >({});
  const [disabledButtons, setDisabledButtons] = useState<
    Record<string, boolean>
  >({});

  const handleButtonClick = async (key: string, path: string) => {
    if (disabledButtons[key]) return;
    setDisabledButtons({ ...disabledButtons, [key]: true });
    const data = await getMarkdown(path);
    setWindowChildren({ ...windowChildren, [key]: data });
  };

  return (
    <div>
      <div className="fixed w-full h-full flex flex-col items-center justify-center">
        <div>
          <span className="text-6xl font-bold text-retro-orange">Marco</span>
          <span className="text-6xl font-bold text-retro-yellow">/Tan</span>
        </div>
        <div className="mt-4 grid grid-cols-3 grid-rows-1 space-x-4">
          <Button
            className="font-mono min-w-24 bg-retro-tan text-retro-brown p-2 rounded-lg hover:bg-retro-red hover:text-retro-tan transition-colors ease-in-out disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-retro-tan disabled:hover:text-retro-brown"
            onClick={async () => handleButtonClick("about", "test.md")}
            disabled={disabledButtons["about"]}
          >
            About Me
          </Button>
          <Button
            className="font-mono min-w-24 bg-retro-tan text-retro-brown p-2 rounded-lg hover:bg-retro-red hover:text-retro-tan transition-colors ease-in-out disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-retro-tan disabled:hover:text-retro-brown"
            onClick={async () => handleButtonClick("projects", "test.md")}
            disabled={disabledButtons["projects"]}
          >
            Projects
          </Button>
          <Button
            className="font-mono min-w-24 bg-retro-tan text-retro-brown p-2 rounded-lg hover:bg-retro-red hover:text-retro-tan transition-colors ease-in-out disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-retro-tan disabled:hover:text-retro-brown"
            onClick={async () => handleButtonClick("contact", "test.md")}
            disabled={disabledButtons["contact"]}
          >
            Contact
          </Button>
        </div>
      </div>
      <div id="windows">
        {Object.keys(windowChildren).map((key) => {
          return (
            <BaseWindow
              key={key}
              id={key}
              title={key}
              closeCallback={() => {
                const newWindowChildren = { ...windowChildren };
                delete newWindowChildren[key];
                setWindowChildren(newWindowChildren);
                setDisabledButtons({ ...disabledButtons, [key]: false });
              }}
            >
              {windowChildren[key]}
            </BaseWindow>
          );
        })}
      </div>
    </div>
  );
};

export default WindowHandler;
