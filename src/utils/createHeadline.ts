export function createHeadline(gameState: string | null) {
	if (!gameState) return 'Tic Tac Toe'
	if (gameState === 'won' || gameState === 'lost') return `You ${gameState}!`

	return 'Game started!'
}
