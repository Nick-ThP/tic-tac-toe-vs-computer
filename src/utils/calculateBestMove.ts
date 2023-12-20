export function calculateBestMove(playerMarks: number[], computerMarks: number[], withSelection: boolean) {
	const emptySpots = Array.from({ length: 9 }, (_, index) => index + 1).filter(
		(spot) => ![...playerMarks, ...computerMarks].includes(spot)
	)

	for (const computerMark of computerMarks) {
		const availableSpots = emptySpots.filter((spot) => spot !== computerMark && !playerMarks.includes(spot))

		for (const spot of availableSpots) {
			const tempComputerMarks = [...computerMarks.filter((mark) => mark !== computerMark), spot]
			if (checkWinning(tempComputerMarks)) {
				return withSelection ? { selectedSpot: computerMark, newSpot: spot } : spot
			}
		}

		for (const spot of availableSpots) {
			const tempPlayerMarks = [...playerMarks, spot]
			if (checkWinning(tempPlayerMarks)) {
				return withSelection ? { selectedSpot: computerMark, newSpot: spot } : spot
			}
		}
	}

	return withSelection ? { selectedSpot: computerMarks[0], newSpot: emptySpots[0] } : emptySpots[0]
}

export function checkWinning(marks: number[]) {
	const winningConditions = [
		[1, 2, 3],
		[4, 5, 6],
		[7, 8, 9],
		[1, 4, 7],
		[2, 5, 8],
		[3, 6, 9],
		[1, 5, 9],
		[3, 5, 7]
	]

	for (const condition of winningConditions) {
		if (condition.every((val) => marks.includes(val))) {
			return true
		}
	}

	return false
}
