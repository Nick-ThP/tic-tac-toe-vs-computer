import { useEffect, useState } from 'react'
import { checkIfWinning } from '../utils/checkIfWinning'

export function useCheckWin(playerMarks: number[], computerMarks: number[]) {
	const [isWin, setIsWin] = useState<'won' | 'lost' | null>(null)

	useEffect(() => {
		const playerWins = checkIfWinning(playerMarks)
		const computerWins = checkIfWinning(computerMarks)

		setIsWin((playerWins && 'won') || (computerWins && 'lost') || null)
	}, [playerMarks, computerMarks])

	return isWin
}
