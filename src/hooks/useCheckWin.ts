import { useEffect, useState } from 'react'
import { checkWinning } from '../utils/calculateBestMove'

export function useCheckWin(playerMarks: number[], computerMarks: number[]) {
	const [isWin, setIsWin] = useState<'won' | 'lost' | null>(null)

	useEffect(() => {
		const playerWins = checkWinning(playerMarks)
		const computerWins = checkWinning(computerMarks)

		setIsWin((playerWins && 'won') || (computerWins && 'lost') || null)
	}, [playerMarks, computerMarks])

	return isWin
}
