# Amherst-Pulse


Notes for setting up backend:
- Make sure you have Node 22 installed.
- Run ``npm ci`` to install everything in the ``package-lock.json``.
- Copy ``.env.example`` to ``.env``, and fill in each field with the relevant info from Supabase.
- You can run it via ``npm run dev``; when it is running, visit localhost:3000/health to see if everything is running properly.

For frontend:
 - We are using React + tailwind css
 - for demo of ui - we are using a demo key from google map, don't forget to run ``npm install "@vis.gl/react-google-maps"
 - the demo key is in .env.local file
 - also don't forget to add ''import tailwindcss from "@tailwindcss/vite" '' in vite.config.js
 - run: using ``npm run dev``

