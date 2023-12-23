export function checkIfWinning(marks: number[]) {
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
