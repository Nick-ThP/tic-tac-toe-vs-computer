import { useEffect, useState } from 'react'
import './App.css'
import { useCheckWin } from './hooks/useCheckWin'

function App() {
	const [gameState, setGameState] = useState<'initialized' | 'won' | 'lost' | null>(null)
	const [playerMarks, setPlayerMarks] = useState<number[]>([])
	const [computerMarks, setComputerMarks] = useState<number[]>([])
	const isWin = useCheckWin(playerMarks, computerMarks)

	function clickHandler(num: number) {
		if (gameState !== 'initialized') {
			setGameState('initialized')
		}

		setPlayerMarks((prev) => [...prev, num])
	}

	useEffect(() => {
		if (playerMarks > computerMarks) {
			const existingMarks = [...playerMarks, ...computerMarks]
			const newMarkPossibilities = Array.from({ length: 9 }, (_, index) => index + 1).filter((mark) =>
				existingMarks.find((existingMark) => existingMark !== mark)
			)
			const newMarkIndex = Math.floor(Math.random() * newMarkPossibilities.length)

			setComputerMarks((prev) => [...prev, newMarkPossibilities[newMarkIndex]])
		}
	}, [playerMarks, computerMarks])

	return (
		<>
			{Array.from({ length: 9 }, (_, index) => index + 1).map((num) => (
				<div onClick={() => clickHandler(num)}></div>
			))}
		</>
	)
}

export default App
