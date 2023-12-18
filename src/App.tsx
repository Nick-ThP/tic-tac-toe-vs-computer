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
		setSelectedMark(null)
	}

	function ticHandler(num: number) {
		if (gameState !== 'initialized') {
			startGameHandler()
			setPlayerMarks((prev) => [...prev.filter((existingNum) => existingNum !== selectedMark), num])
			playerTurnRef.current = true
		}

		const markingWithoutSelection = playerMarks.length === 3 && !playerMarks.includes(num) && !selectedMark
		const ableToSelect = playerMarks.length === 3 && playerMarks.includes(num)

		if (computerMarks.includes(num) || playerTurnRef.current === true || markingWithoutSelection) return

		if (ableToSelect) {
			return setSelectedMark((prev) => (prev === num ? null : num))
		}

		if (selectedMark) {
			setPlayerMarks((prev) => [...prev.filter((existingNum) => existingNum !== selectedMark), num])
			setSelectedMark(null)
			playerTurnRef.current = true
		} else {
			setPlayerMarks((prev) => [...prev, num])
			playerTurnRef.current = true
		}
	}

	useEffect(() => {
		if (playerTurnRef.current && !isWin) {
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
	}, [playerMarks, computerMarks, isWin])

	useEffect(() => {
		if (isWin) {
			setGameState(isWin)
		}
	}, [isWin])

	return (
		<div className='flex flex-col justify-center items-center gap-10'>
			<div className={`text-black font-bold text-5xl ${gameState === 'won' || gameState === 'lost' ? 'visible' : 'invisible'}`}>
				You {gameState}!
			</div>
			<div className='grid gap-5 grid-cols-3 grid-rows-3 min-h-full min-w-full'>
				{Array.from({ length: 9 }, (_, index) => index + 1).map((num) => (
					<div
						className={`h-40 w-40 bg-slate-300 border-4 border-black flex justify-center items-center cursor-pointer text-7xl rounded-md text-black ${
							selectedMark === num && 'bg-red-200'
						}`}
						onClick={() => ticHandler(num)}
						key={num}
					>
						{(playerMarks.find((mark) => mark === num) && <BsCircle />) ||
							(computerMarks.find((mark) => mark === num) && <BsXLg />)}
					</div>
				))}
			</div>
			<button
				onClick={startGameHandler}
				className={`border-black hover:bg-slate-400 hover:border-collapse ${gameState === 'initialized' ? 'invisible' : 'visible'}`}
			>
				{gameState === 'won' || gameState === 'lost' ? 'Play again' : 'Start game'}
			</button>
		</div>
	)
}

export default App
