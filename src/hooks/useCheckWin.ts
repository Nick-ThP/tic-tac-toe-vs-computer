import { useEffect, useState } from 'react'

export function useCheckWin(playerMarks: number[], computerMarks: number[]) {
	const [isWin, setIsWin] = useState<'won' | 'lost' | null>(null)

	useEffect(() => {
		const checkWin = (marks: number[]) => {
			const winConditions = [
				[1, 2, 3],
				[4, 5, 6],
				[7, 8, 9],
				[1, 4, 7],
				[2, 5, 8],
				[3, 6, 9],
				[1, 5, 9],
				[3, 5, 7]
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

		setIsWin(playerWins ? 'won' : null || computerWins ? 'lost' : null)
	}, [playerMarks, computerMarks])

	return isWin
}
