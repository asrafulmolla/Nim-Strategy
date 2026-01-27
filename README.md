# 🎮 Nim Strategy - Minimax AI

[![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)](https://www.python.org/downloads/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow.svg)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

A sophisticated implementation of the classic logic game **Nim**, featuring an unbeatable AI powered by the **Minimax Algorithm** with memoization. This project includes both a command-line interface and a modern, high-fidelity web interface.

> "The player who takes the last object wins."

---

## ✨ Features

*   **🧠 Unbeatable AI**: Uses a recursive Minimax algorithm to ensure the AI always makes the optimal move.
*   **💻 Interactive Web UI**: A beautiful, glassmorphic design built with vanilla HTML, CSS, and JS.
*   **🐍 Python CLI**: A clean command-line version for quick gameplay in the terminal.
*   **⚡ Optimized Performance**: Implementation of memoization to speed up AI decision-making.
*   **📱 Responsive Design**: Play seamlessly on desktop or mobile.

---

## 🕹️ How to Play

1.  The game starts with 3 piles of items (e.g., 3, 4, and 5).
2.  On your turn, you must remove **any number** of items (at least one) from **exactly one** pile.
3.  The player who takes the **very last item** from the board wins the game (Normal Play).

---

## 🚀 Getting Started

### Web Version (Recommended)
Simply open the `index.html` file in any modern web browser.
1. Download or clone this repository.
2. Navigate to the project folder.
3. Double-click `index.html`.

### Python Version
Run the game directly in your terminal:
```bash
python nim_game.py
```

---

## 🛠️ Tech Stack

*   **Frontend**: HTML5, CSS3 (Custom Variables, Animations), JavaScript (ES6 Modules).
*   **Backend/Logic**: Python 3 (NimGame Engine).
*   **Design**: Modern UI with glassmorphism effects and Google Fonts (Outfit).

---

## 🔬 Behind the Scenes: Minimax Algorithm

The AI evaluates every possible move by recursively simulating the entire game tree. 

1.  **Search**: It explores all potential future states.
2.  **Evaluation**: 
    *   Winning State: `+1`
    *   Losing State: `-1`
3.  **Memoization**: Stores results of computed states in a dictionary/map to avoid redundant calculations, ensuring instant AI moves even with larger piles.

---

## 📂 Project Structure

```text
├── index.html       # Main web structure
├── style.css        # Premium glassmorphic styling
├── script.js        # Game logic & AI (Web implementation)
├── nim_game.py      # Core game engine (Python implementation)
└── README.md        # Documentation
```

---

## 📜 License

This project is licensed under the MIT License - feel free to use and modify it!

---

Developed with ❤️ by [Asraful Molla](https://github.com/asrafulmolla)
