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

  // todo: prevent clicking button multiple times while window is open,
  // todo: because it'll pull from firebase regardless and that's not good

  return (
    <div>
      <div className="fixed w-full h-full flex flex-col items-center justify-center">
        <div>
          <span className="text-6xl font-bold text-retro-orange">Marco</span>
          <span className="text-6xl font-bold text-retro-yellow">/Tan</span>
        </div>
        <div className="mt-4 grid grid-cols-3 grid-rows-1 space-x-4">
          <Button
            className="font-mono min-w-24 bg-retro-tan text-retro-brown p-2 rounded-lg hover:bg-retro-red hover:text-retro-tan transition-colors ease-in-out"
            onClick={async () => {
              const data = await getMarkdown("test.md");
              setWindowChildren({
                ...windowChildren,
                about: data,
              });
            }}
          >
            About Me
          </Button>
          <Button className="font-mono min-w-24 bg-retro-tan text-retro-brown p-2 rounded-lg hover:bg-retro-red hover:text-retro-tan transition-colors ease-in-out">
            Projects
          </Button>
          <Button className="font-mono min-w-24 bg-retro-tan text-retro-brown p-2 rounded-lg hover:bg-retro-red hover:text-retro-tan transition-colors ease-in-out">
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
