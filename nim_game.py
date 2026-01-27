
import collections

class NimGame:
    """
    A class to represent and solve the Nim Game using MinMax algorithm.
    In this version (Normal Play), the player who takes the last object wins.
    """
    def __init__(self, initial_piles):
        self.piles = initial_piles
        # Memoization dictionary to store the results of already computed states
        # Key: (state, is_maximizing), Value: 1 (win) or -1 (loss)
        self.memo = {}

    def is_over(self, state):
        """Returns True if all piles are empty."""
        return sum(state) == 0

    def get_possible_moves(self, state):
        """Generates all possible moves from the current state."""
        moves = []
        for i, count in enumerate(state):
            for amount_to_remove in range(1, count + 1):
                moves.append((i, amount_to_remove))
        return moves

    def apply_move(self, state, move):
        """Returns a new state after applying a move."""
        new_state = list(state)
        pile_idx, amount = move
        new_state[pile_idx] -= amount
        return tuple(new_state)

    def minimax(self, state, is_maximizing):
        """
        MinMax algorithm with memoization.
        Returns 1 if the state is a winning state for the current player, -1 otherwise.
        """
        # Base case: if the game is over
        if self.is_over(state):
            # In normal play, if it's your turn and there are no objects left,
            # it means the previous player took the last one. So you lose.
            return -1 if is_maximizing else 1

        state_key = (state, is_maximizing)
        if state_key in self.memo:
            return self.memo[state_key]

        moves = self.get_possible_moves(state)

        if is_maximizing:
            # We want to find at least one move that leads to a win (1)
            best_val = -float('inf')
            for move in moves:
                res = self.minimax(self.apply_move(state, move), False)
                best_val = max(best_val, res)
                if best_val == 1: # Alpha-beta style pruning for win/loss
                    break
            self.memo[state_key] = best_val
            return best_val
        else:
            # Opponent wants to force us into a losing state (-1)
            best_val = float('inf')
            for move in moves:
                res = self.minimax(self.apply_move(state, move), True)
                best_val = min(best_val, res)
                if best_val == -1: # Opponent found a winning move for them
                    break
            self.memo[state_key] = best_val
            return best_val

    def get_best_move(self, state):
        """Determines the best move for the AI using Minimax."""
        best_move = None
        best_val = -float('inf')
        
        for move in self.get_possible_moves(state):
            # After AI makes a move, it becomes the opponent's (human) turn (is_maximizing=False)
            val = self.minimax(self.apply_move(state, move), False)
            if val > best_val:
                best_val = val
                best_move = move
            if best_val == 1: # Found a winning sequence
                break
                
        return best_move

def play_game():
    print("========================================")
    print("           NIM GAME - MINMAX AI         ")
    print("========================================")
    print("Instructions:")
    print("1. There are multiple piles of items.")
    print("2. On your turn, remove any number of items from ONE pile.")
    print("3. The player who takes the last item WINS (Normal Play).")
    print("========================================\n")

    # Initial setup: 3 piles with 3, 4, 5 items
    piles = [3, 4, 5]
    game_engine = NimGame(tuple(piles))
    current_state = tuple(piles)
    
    human_turn = True # Human goes first
    
    while not game_engine.is_over(current_state):
        print(f"Current Piles: {list(current_state)}")
        
        if human_turn:
            print("\n--- YOUR TURN ---")
            try:
                p_idx = int(input(f"Choose Pile index (0 - {len(current_state)-1}): "))
                amount = int(input(f"Amount to remove from Pile {p_idx}: "))
                
                if p_idx < 0 or p_idx >= len(current_state) or amount < 1 or amount > current_state[p_idx]:
                    print(">> Invalid move! Please try again.")
                    continue
                
                current_state = game_engine.apply_move(current_state, (p_idx, amount))
                human_turn = False
            except (ValueError, IndexError):
                print(">> Invalid input! Please enter numbers.")
        else:
            print("\n--- AI TURN (Minimax) ---")
            move = game_engine.get_best_move(current_state)
            if move:
                print(f"AI removed {move[1]} items from Pile {move[0]}")
                current_state = game_engine.apply_move(current_state, move)
            human_turn = True
            
    # Game Over
    print("\n========================================")
    print(f"FINAL STATE: {list(current_state)}")
    if not human_turn: # Meaning Human made the last move
        print("CONGRATULATIONS! You took the last item and won!")
    else:
        print("GAME OVER! The AI took the last item. Computer wins!")
    print("========================================")

if __name__ == "__main__":
    play_game()
