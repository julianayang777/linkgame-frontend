# Link Game - Frontend

This is the frontend for **LinkGame**, a single-player or multiplayer game where the goal is to clear the board by matching pairs of identical tiles. Tiles can only be eliminated if they can be linked by a path with no more than **two 90-degree turns**.

This project is built with **React**, **Vite**, and **TypeScript**, and connects to a Scala-based backend.  
➡️ For more details on the backend, check out: [LinkGame Backend](https://github.com/julianayang777/linkgame)

## Prerequisites

To run this project locally, you'll need:

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/)
- The [LinkGame Backend](https://github.com/julianayang777/linkgame) running locally or accessible via API

## Getting Started

```bash
# Clone the repo
git clone https://github.com/julianayang777/linkgame-frontend.git
cd linkgame-frontend

# Install dependencies
npm install

# Run the app locally
npm run dev
```

**Note:** If your backend is hosted elsewhere or deployed online, update `VITE_API_PROTOCOL` and `VITE_API_BASE` in your `.env` file to match the backend's URL.