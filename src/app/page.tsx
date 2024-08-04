"use client";

import { Button } from "@headlessui/react";

export default function Home() {
  return (
    <main className="fixed w-full h-full flex flex-col items-center justify-center">
      <div>
        <span className="text-6xl font-bold text-retro-orange">Marco</span>
        <span className="text-6xl font-bold text-retro-yellow">/Tan</span>
      </div>
      <div className="mt-4 grid grid-cols-3 grid-rows-1 space-x-4">
        <Button className="font-mono min-w-16 bg-retro-tan text-retro-brown p-2 rounded-lg hover:bg-retro-red hover:text-retro-tan transition-colors ease-in-out">
          About Me
        </Button>
        <Button className="font-mono min-w-16 bg-retro-tan text-retro-brown p-2 rounded-lg hover:bg-retro-red hover:text-retro-tan transition-colors ease-in-out">
          Projects
        </Button>
        <Button className="font-mono min-w-16 bg-retro-tan text-retro-brown p-2 rounded-lg hover:bg-retro-red hover:text-retro-tan transition-colors ease-in-out">
          Contact
        </Button>
      </div>
    </main>
  );
}
