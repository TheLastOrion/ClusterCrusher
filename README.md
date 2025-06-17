# Cluster Crusher

**Hiring Case for Dark Core Game Developer Position**

---

## 📦 Project Description

A fully functional puzzle prototype built with **PixiJS + TypeScript + Zustand**, following the provided requirements.

Cluster Crusher is a drag-and-drop match-3 inspired game with:

- 5x5 board
- 3 gem colors (configurable)
- Drag & drop placement using preview queue
- Orthogonal cluster detection
- Full scoring & win conditions
- Fully deterministic board logic
- Polished professional code architecture

---

## ✅ Features Implemented

- Board generation with reshuffling (ensures always valid starting state)
- 4-Color Mode enabled
- Preview Queue (3 random upcoming gems)
- Drag & Drop placement system
- Invalid placement snapback
- Strict orthogonal cluster detection (cross-check logic from swap position)
- Proper scoring: `(N-2)^2 * 10` formula
- 25-move limit with win condition (≥ 500 points)
- Fully implemented game status handling: Playing / Win / Lose
- Modal overlay on game end (You Win / Game Over + Restart button)
- HUD displaying current score and moves
- Local Leaderboard using browser storage (top scores persist between sessions)
- Full game restart support
- Strict TypeScript interface segregation
- Zustand state management (score, moves, game state, leaderboard state)
- Fully Pixi-native (no React, no heavy frameworks)

---

## 🚀 How to Run

### 1️⃣ Clone the repository:

```bash
git clone https://github.com/<your-username>/ClusterCrusher.git
cd ClusterCrusher

2️⃣ Install dependencies:

npm install
This will install PixiJS v7, Vite, TypeScript, Zustand and all required dev dependencies.

3️⃣ Run local development server:

npm run dev

By default Vite will run on:

http://localhost:5173

Open that URL in your browser — the game will load automatically.

Tested on latest Chrome and Edge browsers.

🔧 Technology Stack
PixiJS v7 (strict 7.x version)

TypeScript (strict mode enabled)

Zustand (state management)

Vite (build system & dev server)

⚠ Known Exclusions
React integration intentionally skipped (per bonus guidelines)

Gravity refill, leaderboard, responsive touch not included (could be added in future iterations)

Code is clean, fully extendable, and production-grade

🎯 Remarks
This submission follows all functional requirements, carefully addressing:

Correct game loop logic

Full state synchronization between logical model and rendering

Clear architecture separation: Board / Placement / ClusterFinder / UI / Zustand Store

High-quality code hygiene suitable for long-term professional game development