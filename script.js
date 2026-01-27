/**
 * Nim Game - Minimax AI Implementation
 * Translated and enhanced for Web from nim_game.py
 */

class NimGame {
    constructor() {
        this.piles = [3, 4, 5];
        this.memo = new Map();
        this.isHumanTurn = true;
        this.gameActive = true;

        // DOM Elements
        this.boardElement = document.getElementById('game-board');
        this.statusElement = document.getElementById('game-status');
        this.turnText = document.getElementById('turn-text');
        this.turnIndicator = document.getElementById('turn-indicator');
        this.resetBtn = document.getElementById('reset-btn');
        this.overlay = document.getElementById('game-over-overlay');
        this.winnerBtn = document.getElementById('play-again-btn');
        this.winnerText = document.getElementById('winner-text');
        this.finalStateText = document.getElementById('final-state-text');

        this.init();
    }

    init() {
        this.renderBoard();
        this.resetBtn.addEventListener('click', () => this.resetGame());
        this.winnerBtn.addEventListener('click', () => this.resetGame());
        this.updateTurnUI();
    }

    resetGame() {
        this.piles = [3, 4, 5];
        this.memo.clear();
        this.isHumanTurn = true;
        this.gameActive = true;
        this.overlay.classList.add('hidden');
        this.renderBoard();
        this.updateTurnUI();
        this.statusElement.textContent = "Select an item to start!";
    }

    isGameOver(state) {
        return state.reduce((a, b) => a + b, 0) === 0;
    }

    getPossibleMoves(state) {
        const moves = [];
        state.forEach((count, i) => {
            for (let amount = 1; amount <= count; amount++) {
                moves.push({ pileIdx: i, amount });
            }
        });
        return moves;
    }

    applyMove(state, move) {
        const newState = [...state];
        newState[move.pileIdx] -= move.amount;
        return newState;
    }

    // Minimax with memoization
    minimax(state, isMaximizing) {
        const stateKey = state.join(',') + '|' + isMaximizing;
        if (this.memo.has(stateKey)) return this.memo.get(stateKey);

        if (this.isGameOver(state)) {
            // Normal play: if it's your turn and no objects left, you lose.
            return isMaximizing ? -1 : 1;
        }

        const moves = this.getPossibleMoves(state);

        if (isMaximizing) {
            let bestVal = -Infinity;
            for (const move of moves) {
                const res = this.minimax(this.applyMove(state, move), false);
                bestVal = Math.max(bestVal, res);
                if (bestVal === 1) break; // Alpha pruning for win/loss
            }
            this.memo.set(stateKey, bestVal);
            return bestVal;
        } else {
            let bestVal = Infinity;
            for (const move of moves) {
                const res = this.minimax(this.applyMove(state, move), true);
                bestVal = Math.min(bestVal, res);
                if (bestVal === -1) break;
            }
            this.memo.set(stateKey, bestVal);
            return bestVal;
        }
    }

    getBestMove(state) {
        let bestMove = null;
        let bestVal = -Infinity;
        const moves = this.getPossibleMoves(state);

        for (const move of moves) {
            const val = this.minimax(this.applyMove(state, move), false);
            if (val > bestVal) {
                bestVal = val;
                bestMove = move;
            }
            if (bestVal === 1) break;
        }
        return bestMove;
    }

    handleHumanMove(pileIdx, amount) {
        if (!this.gameActive || !this.isHumanTurn) return;

        this.piles[pileIdx] -= amount;
        this.renderBoard();

        if (this.isGameOver(this.piles)) {
            this.endGame("CONGRATULATIONS! You won!");
            return;
        }

        this.isHumanTurn = false;
        this.updateTurnUI();
        this.statusElement.textContent = `AI is thinking...`;

        setTimeout(() => this.aiMove(), 800);
    }

    aiMove() {
        const move = this.getBestMove(this.piles);
        if (move) {
            this.piles[move.pileIdx] -= move.amount;
            this.renderBoard();
            this.statusElement.textContent = `AI removed ${move.amount} from Pile ${move.pileIdx + 1}`;
        }

        if (this.isGameOver(this.piles)) {
            this.endGame("GAME OVER! AI Wins!");
            return;
        }

        this.isHumanTurn = true;
        this.updateTurnUI();
    }

    updateTurnUI() {
        if (this.isHumanTurn) {
            this.turnText.textContent = "Your Turn";
            this.turnIndicator.classList.add('active');
        } else {
            this.turnText.textContent = "AI's Turn";
            this.turnIndicator.classList.remove('active');
        }
        // Re-render to update the 'disabled' state of items
        this.renderBoard();
    }

    renderBoard() {
        // Clear board but keep reference to avoid layout thrashing if possible
        this.boardElement.innerHTML = '';
        this.piles.forEach((count, i) => {
            const pileDiv = document.createElement('div');
            pileDiv.className = 'pile';

            for (let j = 0; j < count; j++) {
                const item = document.createElement('div');
                item.className = 'item';
                // Only disable if it's not human turn OR game is over
                if (!this.isHumanTurn || !this.gameActive) {
                    item.classList.add('disabled');
                }

                item.addEventListener('mouseover', () => this.highlightPotentialMove(i, j));
                item.addEventListener('mouseout', () => this.clearHighlights());
                item.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.handleHumanMove(i, j + 1);
                });

                pileDiv.appendChild(item);
            }

            const label = document.createElement('div');
            label.className = 'pile-label';
            label.textContent = `Pile ${i + 1}`;
            pileDiv.appendChild(label);

            this.boardElement.appendChild(pileDiv);
        });
    }

    highlightPotentialMove(pileIdx, itemIdx) {
        if (!this.isHumanTurn) return;
        const piles = this.boardElement.querySelectorAll('.pile');
        const items = piles[pileIdx].querySelectorAll('.item');
        for (let k = 0; k <= itemIdx; k++) {
            items[k].classList.add('selected');
        }
    }

    clearHighlights() {
        const allItems = this.boardElement.querySelectorAll('.item');
        allItems.forEach(item => item.classList.remove('selected'));
    }

    endGame(message) {
        this.gameActive = false;
        this.winnerText.textContent = message;
        this.finalStateText.textContent = `Final Piles: ${this.piles.join(', ')}`;
        this.overlay.classList.remove('hidden');
    }
}

// Start the game
window.addEventListener('DOMContentLoaded', () => {
    new NimGame();
});
