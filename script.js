/**
 * Nim Game - Minimax AI Implementation
 * Ported and enhanced for Web from nim_game.py
 */

class NimGame {
    constructor() {
        this.piles = [3, 4, 5];
        this.memo = new Map();
        this.isHumanTurn = true;
        this.gameActive = true;
        this.difficulty = 'hard';

        // DOM Elements
        this.boardElement = document.getElementById('game-board');
        this.statusElement = document.getElementById('game-status');
        this.aiThoughtElement = document.getElementById('ai-thought');
        this.turnText = document.getElementById('turn-text');
        this.turnIndicator = document.getElementById('turn-indicator');
        this.resetBtn = document.getElementById('reset-btn');
        this.difficultySelect = document.getElementById('difficulty');
        this.overlay = document.getElementById('game-over-overlay');
        this.playAgainBtn = document.getElementById('play-again-btn');
        this.winnerText = document.getElementById('winner-text');
        this.finalStateText = document.getElementById('final-state-text');

        this.init();
    }

    init() {
        this.renderBoard();
        this.resetBtn.addEventListener('click', () => this.resetGame());
        this.playAgainBtn.addEventListener('click', () => this.resetGame());
        this.difficultySelect.addEventListener('change', (e) => {
            this.difficulty = e.target.value;
            this.resetGame();
        });
        this.updateTurnUI();
    }

    resetGame() {
        this.piles = [3, 4, 5];
        this.memo.clear();
        this.isHumanTurn = true;
        this.gameActive = true;
        this.overlay.classList.add('hidden');
        this.aiThoughtElement.classList.add('hidden');
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
            // Wait, Python says if human_turn is TRUE when game is over, AI won (because AI made the last move).
            // This means the last player to take an item wins.
            return isMaximizing ? -1 : 1;
        }

        const moves = this.getPossibleMoves(state);

        if (isMaximizing) {
            let bestVal = -Infinity;
            for (const move of moves) {
                const res = this.minimax(this.applyMove(state, move), false);
                bestVal = Math.max(bestVal, res);
                if (bestVal === 1) break;
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

    getRandomMove(state) {
        const moves = this.getPossibleMoves(state);
        return moves[Math.floor(Math.random() * moves.length)];
    }

    handleHumanMove(pileIdx, amount) {
        if (!this.gameActive || !this.isHumanTurn) return;

        this.piles[pileIdx] -= amount;
        this.renderBoard();

        if (this.isGameOver(this.piles)) {
            this.endGame("🎉 CONGRATULATIONS! You won!");
            return;
        }

        this.isHumanTurn = false;
        this.updateTurnUI();
        this.statusElement.textContent = `AI's Turn`;
        this.aiThoughtElement.classList.remove('hidden');

        // Delay for realism
        setTimeout(() => this.aiMove(), 1200);
    }

    aiMove() {
        if (!this.gameActive) return;

        let move;
        if (this.difficulty === 'easy') {
            move = this.getRandomMove(this.piles);
        } else if (this.difficulty === 'medium') {
            if (Math.random() < 0.5) {
                move = this.getBestMove(this.piles);
            } else {
                move = this.getRandomMove(this.piles);
            }
        } else { // hard
            move = this.getBestMove(this.piles);
        }

        if (move) {
            this.piles[move.pileIdx] -= move.amount;
            this.renderBoard();
            this.statusElement.textContent = `AI removed ${move.amount} from Pile ${move.pileIdx + 1}`;
        }

        this.aiThoughtElement.classList.add('hidden');

        if (this.isGameOver(this.piles)) {
            this.endGame("🤖 GAME OVER! AI Wins!");
            return;
        }

        this.isHumanTurn = true;
        this.updateTurnUI();
    }

    updateTurnUI() {
        if (this.isHumanTurn) {
            this.turnText.textContent = "Your Turn";
            this.turnIndicator.classList.add('active');
            this.turnIndicator.querySelector('.icon').textContent = '👤';
        } else {
            this.turnText.textContent = "AI's Turn";
            this.turnIndicator.classList.remove('active');
            this.turnIndicator.querySelector('.icon').textContent = '🤖';
        }
        this.renderBoard();
    }

    renderBoard() {
        this.boardElement.innerHTML = '';
        this.piles.forEach((count, i) => {
            const pileDiv = document.createElement('div');
            pileDiv.className = 'pile';

            for (let j = 0; j < count; j++) {
                const item = document.createElement('div');
                item.className = 'item';
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
        if (!this.isHumanTurn || !this.gameActive) return;
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
        this.finalStateText.textContent = `Final State: All items removed.`;
        this.overlay.classList.remove('hidden');
        this.statusElement.textContent = message;
    }
}

// Start the game
window.addEventListener('DOMContentLoaded', () => {
    new NimGame();
});
