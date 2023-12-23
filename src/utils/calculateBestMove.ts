import { checkIfWinning } from './checkIfWinning'

export function calculateBestMove(playerMarks: number[], computerMarks: number[], withSelection: boolean) {
	const emptySpots = Array.from({ length: 9 }, (_, index) => index + 1).filter(
		(spot) => ![...playerMarks, ...computerMarks].includes(spot)
	)

	for (const computerMark of computerMarks) {
		const availableSpots = emptySpots.filter((spot) => spot !== computerMark && !playerMarks.includes(spot))

		for (const spot of availableSpots) {
			const tempComputerMarks = [...computerMarks.filter((mark) => mark !== computerMark), spot]
			if (checkIfWinning(tempComputerMarks)) {
				return withSelection ? { selectedSpot: computerMark, newSpot: spot } : spot
			}
		}

		for (const spot of availableSpots) {
			const tempPlayerMarks = [...playerMarks, spot]
			if (checkIfWinning(tempPlayerMarks)) {
				return withSelection ? { selectedSpot: computerMark, newSpot: spot } : spot
			}
		}
	}

	return withSelection ? { selectedSpot: computerMarks[0], newSpot: emptySpots[0] } : emptySpots[0]
}
