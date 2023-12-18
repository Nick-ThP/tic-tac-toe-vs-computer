import { useEffect, useRef, useState } from 'react'
import { BsCircle, BsXLg } from 'react-icons/bs'
import './App.css'
import { useCheckWin } from './hooks/useCheckWin'

function App() {
	const [gameState, setGameState] = useState<'initialized' | 'won' | 'lost' | null>(null)
	const [playerMarks, setPlayerMarks] = useState<number[]>([])
	const [computerMarks, setComputerMarks] = useState<number[]>([])
	const [selectedMark, setSelectedMark] = useState<number | null>(null)
	const isWin = useCheckWin(playerMarks, computerMarks)
	const playerTurnRef = useRef<boolean>(false)

	function startGameHandler() {
		setGameState('initialized')
		setPlayerMarks([])
		setComputerMarks([])
	}

	function ticHandler(num: number) {
		// if (gameState !== 'initialized') {
		// 	startGameHandler()
		// }

		if (
			computerMarks.includes(num) ||
			playerTurnRef.current === true ||
			(playerMarks.length === 3 && !playerMarks.includes(num) && !selectedMark)
		)
			return

		if (playerMarks.length === 3 && playerMarks.includes(num)) {
			if (selectedMark === num) return setSelectedMark(null)
			return setSelectedMark(num)
		}

		if (selectedMark) {
			setPlayerMarks((prev) => [...prev.filter((existingNum) => existingNum !== selectedMark), num])
			setSelectedMark(null)
			playerTurnRef.current = true
		} else if (!selectedMark) {
			setPlayerMarks((prev) => [...prev, num])
			playerTurnRef.current = true
		}
	}

	useEffect(() => {
		if (playerTurnRef.current && gameState === 'initialized') {
			const existingMarks = [...playerMarks, ...computerMarks]
			const newMarkPossibilities = Array.from({ length: 9 }, (_, index) => index + 1).filter((mark) => !existingMarks.includes(mark))
			const newMarkIndex = Math.floor(Math.random() * newMarkPossibilities.length)

			if (playerMarks.length > computerMarks.length) {
				setTimeout(() => {
					setComputerMarks((prev) => [...prev, newMarkPossibilities[newMarkIndex]])
					playerTurnRef.current = false
				}, 500)
			} else if (playerMarks.length === computerMarks.length) {
				const selectionIndex = Math.floor(Math.random() * 3)

				setTimeout(() => {
					setSelectedMark(computerMarks[selectionIndex])
					return setTimeout(() => {
						setComputerMarks((prev) => [
							...prev.filter((existingNum) => existingNum !== computerMarks[selectionIndex]),
							newMarkPossibilities[newMarkIndex]
						])
						setSelectedMark(null)
						playerTurnRef.current = false
					}, 1000)
				}, 1000)
			}
		}
	}, [playerMarks, computerMarks])

	useEffect(() => {
		if (isWin) {
			setGameState(isWin)
		}
	}, [isWin])

	return (
		<div className='flex flex-col justify-center items-center gap-10'>
			<div className='grid gap-5 grid-cols-3 grid-rows-3 min-h-full min-w-full'>
				{Array.from({ length: 9 }, (_, index) => index + 1).map((num) => (
					<div
						className={`h-40 w-40 bg-slate-300 border-4 border-black flex justify-center items-center cursor-pointer text-7xl rounded-md text-black ${
							selectedMark === num && 'bg-red-400'
						}`}
						onClick={() => ticHandler(num)}
						key={num}
					>
						{(playerMarks.find((mark) => mark === num) && <BsCircle />) ||
							(computerMarks.find((mark) => mark === num) && <BsXLg />)}
					</div>
				))}
			</div>

			{gameState !== 'initialized' && (
				<>
					{(gameState === 'won' || gameState === 'lost') && <div className='text-black font-bold text-xl'>You {gameState}!</div>}
					<button onClick={startGameHandler}>{gameState === 'won' || gameState === 'lost' ? 'Play again' : 'Start game'}</button>
				</>
			)}
		</div>
	)
}

export default App
