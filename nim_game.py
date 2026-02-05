import random

class NimGame:
    def __init__(self, initial_piles):
        self.piles = initial_piles
        self.memo = {}

    def is_over(self, state):
        return sum(state) == 0

    def get_possible_moves(self, state):
        moves = []
        for i, count in enumerate(state):
            for remove in range(1, count + 1):
                moves.append((i, remove))
        return moves

    def apply_move(self, state, move):
        new_state = list(state)
        pile, amount = move
        new_state[pile] -= amount
        return tuple(new_state)

    def minimax(self, state, is_maximizing):
        if self.is_over(state):
            return -1 if is_maximizing else 1

        key = (state, is_maximizing)
        if key in self.memo:
            return self.memo[key]

        moves = self.get_possible_moves(state)

        if is_maximizing:
            best = -1
            for move in moves:
                val = self.minimax(self.apply_move(state, move), False)
                best = max(best, val)
                if best == 1:
                    break
        else:
            best = 1
            for move in moves:
                val = self.minimax(self.apply_move(state, move), True)
                best = min(best, val)
                if best == -1:
                    break

        self.memo[key] = best
        return best

    def get_best_move(self, state):
        best_move = None
        best_val = -1
        for move in self.get_possible_moves(state):
            val = self.minimax(self.apply_move(state, move), False)
            if val > best_val:
                best_val = val
                best_move = move
            if best_val == 1:
                break
        return best_move


def ai_move(game, state):
    moves = game.get_possible_moves(state)

    # Balanced Strategy: 50% Optimal, 50% Random
    if random.random() < 0.5:
        return game.get_best_move(state)
    else:
        return random.choice(moves)


def play_game():
    print("===================================")
    print("      NIM GAME (Human vs AI)       ")
    print("===================================")

    piles = [3, 4, 5]
    game = NimGame(tuple(piles))
    state = tuple(piles)

    human_turn = True

    while not game.is_over(state):
        print(f"\nCurrent Piles: {list(state)}")

        if human_turn:
            print("--- YOUR TURN ---")
            try:
                p = int(input(f"Choose pile (0-{len(state)-1}): "))
                a = int(input("Amount to remove: "))

                if p < 0 or p >= len(state) or a < 1 or a > state[p]:
                    print("Invalid move!")
                    continue

                state = game.apply_move(state, (p, a))
                human_turn = False

            except ValueError:
                print("Enter valid numbers!")

        else:
            print("--- AI TURN ---")
            move = ai_move(game, state)
            print(f"AI removed {move[1]} from pile {move[0]}")
            state = game.apply_move(state, move)
            human_turn = True

    print("\n===================================")
    print("GAME OVER")
    if human_turn:
        print("AI took the last item. AI WINS!")
    else:
        print("You took the last item. YOU WIN!")
    print("===================================")


if __name__ == "__main__":
    play_game()
