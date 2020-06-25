# Conway's Game of Life

The Game of Life, also known as Life, was created by John H. Conway. This is known as a zero player game because each generation (or different phase) the game goes through is only determined by the initial state that the game starts at. Only the initial move is needed to determine what occurs in the remainder of that move throughout each set of generation.

# Rules

Conway's game consist of a grid of square 'cells' that can be either dead (grey cells) or alive (pink cells) depending on the following trasnsitions that occur:

1. Underpopultion: Any cell that is alive with fewer than two live neighbors dies.
2. Any cell that is alive with two or three neighbors, stays alive in the next generation.
3. Overpopulation: Any cell that is alive with more than three neighbors dies.
4. Reproduction: Any dead cell with exactly three live neighbors becomes alive.