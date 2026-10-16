# Using AI to help with Welcome page

## Main takeaways

* Used ChatGPT to help with non-test coding, especially in Tailwind CSS and some parts React syntax follow this class's AI usage policy.
* AI generated the static background image and AI also helped me with Tailwind CSS syntax (with the help of React and Tailwind CSS documents).
* Used ChatGPT to help with non-test coding, especially in Tailwind CSS and some parts React syntax follow this class's AI usage policy.
* AI helped me with Tailwind CSS syntax (with the help of React and Tailwind CSS documents)
* I could not use Map API because it not free and ChatGPT assisted me with a free demo API key (free)
* ChatGPT helped me with the APIProvider from @vis.gl/react-google-maps
* ChatGPT helped me to managing the component states and syntax to interact between them

## Resource Usage

Tool and Model(s) Used: ChatGPT (GPT 6)
Tokens Used & Dollar Equivalent: 
Exact token usage and dollar equivalent are not
available through the ChatGPT web interface.

## Chat log

User:
Wait, wait—give me the map image first. Remember, the map image should not include the background, okay?
User:
[Image attachment]
[Image attachment]
Now the box and button components below seem to have disappeared again.
Assistant:
The components have not disappeared. They have been pushed below the visible screen because the map is too tall.
Looking at the two screenshots:
Image 1: When the page first opens, you can only see the header and the top of the map.
Image 2: When you scroll down, both the Events Card and Explore Map button appear normally.
The reason is that last time we replaced max-w-7xl with max-w-none, which made the map wider. Because the image uses w-full and preserves its original aspect ratio, its height increased as well.
I think we should change it so that the Welcome Page fits within a single desktop screen, with the map filling the remaining space and the card and button always visible at the bottom.
1. Change the hero illustration
You currently have:
<div className="relative mt-6">
  <img
    src="/isometric-3d-map.png"
    alt="Illustrated campus map"
    className="block w-full select-none pointer-events-none"
    draggable={false}
  />
Replace it with:
<div className="relative mt-6 h-[calc(100svh-190px)] min-h-[480px] overflow-hidden">
  <img
    src="/isometric-3d-map.png"
    alt="Illustrated campus map"
    className="absolute inset-0 h-full w-full object-cover object-center select-none pointer-events-none"
    draggable={false}
  />
2. Keep the card and button inside the hero
For now, just keep this code inside <div className="relative ...">:
{/* Information card */}
<div className="absolute bottom-[6%] left-[4%] z-20 ...">
  ...
</div>

{/* Explore Map button */}
<button
  type="button"
  onClick={onGetStarted}
  className="absolute bottom-[9%] right-[4%] z-30 flex items-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 px-7 py-4 font-semibold text-white shadow-lg"
>
  Explore Map
  <ArrowRight className="h-5 w-5" />
</button>
The ... in the card means you should keep its existing classes and content, only changing bottom and left.
3. There is another option if you do not want the image cropped
If the goal is to preserve the map's original aspect ratio and precise pin positions, we could instead limit the map's width and use a lavender background that covers the full screen.
But given your original goal—a visually prominent map with components always visible without scrolling—I lean toward a hero with a fixed height relative to the viewport.
Try changing only the hero section first. If the image gets cropped too much or the pins shift, send me a screenshot and we can adjust it. There is no need to touch the global CSS yet.
User:
[Image attachment]
The background image looks too static now. Is there a way to make it cover the whole screen, including behind the header, to create more of a 3D feeling?
Assistant:
I think this is exactly the step that will make the Campus Pulze Welcome Page look more like a finished product.
Looking at your current screenshot, the problem is not that the map is unattractive; it is being presented as an image underneath the header instead of an isometric world covering the entire page.
I want to change it from:
Header → empty space → map image
to:
Map covers the full screen → Header, pins, card, and button float above it.
1. The layout we want
Two Point Campus
The map will also sit behind the header. The top of the image already has a sky, clouds, and lavender mountains, which is a good place for the Campus Pulze header without covering the buildings.
This is still a 2D image in an isometric style, but this composition will create a better sense of depth.
2. Change the JSX structure
Currently you have:
<main className="min-h-screen ...">
  <div className="mx-auto w-full ...">
    <header>...</header>

    <div className="relative mt-6">
      <img src="/isometric-3d-map.png" />
      {/* Pins, card, button */}
    </div>
  </div>
</main>
User:
I just have this for default page, I wonder how to switch states? can I use useState like this? or should i import another library?
import React, {useState} from 'react';
import WelcomePage from './pages/Welcomepage';

export default function App() {
  const [isStarted, setIsStarted] = useState(false);
  if (!isStarted) {
    return <WelcomePage onGetStarted = { () => setIsStarted(true)} />;

  }
  return (
    <div className="min-h-screen bg-[#F8F9FE] flex items-center justify-center">
      <h1 className = "text-2xl font-bold text-indigo-600">Loading...</h1>
    </div>
  );
}
Assistant:
You're using useState to switch pages, not React Router. Let's keep this approach for now; there's no need to install another library.
For now, write:
import React from 'react';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#F8F9FE] flex items-center justify-center">
      <h1 className="text-4xl font-bold text-[#6547DC]">
        Campus Pulze — Home
      </h1>
    </main>
  );
}
Add this import:
import HomePage from './pages/HomePage';
Then replace the entire contents of App.jsx with:
import React, { useState } from 'react';
import WelcomePage from './pages/Welcomepage';
import HomePage from './pages/HomePage';

export default function App() {
  const [isStarted, setIsStarted] = useState(false);

  if (!isStarted) {
    return (
      <WelcomePage
        onGetStarted={() => setIsStarted(true)}
      />
    );
  }

  return <HomePage />;
}
Then check whether the page changes to display the text “Campus Pulze — Home.”
If it does, navigation is working successfully!
We don't need React Router.