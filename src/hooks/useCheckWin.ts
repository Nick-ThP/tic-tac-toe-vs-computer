import { useEffect, useState } from 'react'

export function useCheckWin(playerMarks: number[], computerMarks: number[]) {
	const [isWin, setIsWin] = useState<'Player Wins!' | 'Computer Wins!' | null>(null)

	useEffect(() => {
		const checkWin = (marks: number[]) => {
			const winConditions = [
				[0, 1, 2],
				[3, 4, 5],
				[6, 7, 8],
				[0, 3, 6],
				[1, 4, 7],
				[2, 5, 8],
				[0, 4, 8],
				[2, 4, 6]
			]

			for (const condition of winConditions) {
				const [a, b, c] = condition
				if (marks.includes(a) && marks.includes(b) && marks.includes(c)) {
					return true
				}
			}
			return false
		}

		const playerWins = checkWin(playerMarks)
		const computerWins = checkWin(computerMarks)

		setIsWin(playerWins ? 'Player Wins!' : null || computerWins ? 'Computer Wins!' : null)
	}, [playerMarks, computerMarks])

	return isWin
}
