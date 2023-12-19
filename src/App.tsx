import { useCallback, useEffect, useRef, useState } from 'react'
import { BsCircle, BsXLg } from 'react-icons/bs'
import './App.css'
import { useCheckWin } from './hooks/useCheckWin'

export function App() {
	const [gameState, setGameState] = useState<'initialized' | 'won' | 'lost' | null>(null)
	const [playerMarks, setPlayerMarks] = useState<number[]>([])
	const [computerMarks, setComputerMarks] = useState<number[]>([])
	const [selectedMark, setSelectedMark] = useState<number | null>(null)
	const isWin = useCheckWin(playerMarks, computerMarks)

	const playerTurnRef = useRef<boolean>(false)
	const underThreeMarksTurnRef = useRef<number | null>(null)
	const threeMarksTurnRef = useRef<number | null>(null)

	const COMPUTER_MARK_TIMER = 600
	const COMPUTER_SELECT_TIMER = 300

	function startGameHandler() {
		setPlayerMarks([])
		setComputerMarks([])
		setSelectedMark(null)
		setTimeout(() => {
			setGameState('initialized')
		}, 0)
	}

	function markingHandler(num: number) {
		if (gameState !== 'initialized') {
			startGameHandler()
			setPlayerMarks([num])
			playerTurnRef.current = true
		}

		const markingWithoutSelection = playerMarks.length === 3 && !playerMarks.includes(num) && !selectedMark
		const ableToSelect = playerMarks.length === 3 && playerMarks.includes(num)

		// Checks if player is clicking unavailable spots
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

	const computerTurn = useCallback(() => {
		const existingMarks = [...playerMarks, ...computerMarks]
		const newMarkPossibilities = Array.from({ length: 9 }, (_, index) => index + 1).filter((mark) => !existingMarks.includes(mark))
		const newMarkIndex = Math.floor(Math.random() * newMarkPossibilities.length)
		const selectionIndex = Math.floor(Math.random() * 3)

		if (playerMarks.length > computerMarks.length) {
			underThreeMarksTurnRef.current = setTimeout(() => {
				setComputerMarks((prev) => [...prev, newMarkPossibilities[newMarkIndex]])
				playerTurnRef.current = false
			}, COMPUTER_MARK_TIMER)
		}

		if (playerMarks.length === computerMarks.length) {
			threeMarksTurnRef.current = setTimeout(() => {
				setSelectedMark(computerMarks[selectionIndex])
				setTimeout(() => {
					setComputerMarks((prev) => [
						...prev.filter((existingNum) => existingNum !== computerMarks[selectionIndex]),
						newMarkPossibilities[newMarkIndex]
					])
					setSelectedMark(null)
					playerTurnRef.current = false
				}, COMPUTER_MARK_TIMER)
			}, COMPUTER_SELECT_TIMER)
		}
	}, [computerMarks, playerMarks])

	useEffect(() => {
		if (isWin) {
			setGameState(isWin)
			playerTurnRef.current = false
			if (underThreeMarksTurnRef.current) clearTimeout(underThreeMarksTurnRef.current)
			if (threeMarksTurnRef.current) clearTimeout(threeMarksTurnRef.current)
		}

		if (playerTurnRef.current) {
			computerTurn()
		}
	}, [isWin, computerTurn])

	return (
		<div className='flex flex-col justify-center items-center gap-10'>
			<div className={`text-black font-bold text-5xl ${gameState === 'won' || gameState === 'lost' ? 'visible' : 'invisible'}`}>
				You {gameState}!
			</div>
			<div className='grid gap-5 grid-cols-3 grid-rows-3 min-h-full min-w-full'>
				{Array.from({ length: 9 }, (_, index) => index + 1).map((num) => (
					<div
						className={`h-40 w-40 border-4 border-black flex justify-center items-center cursor-pointer text-7xl rounded-md text-black transform hover:scale-105 ${
							selectedMark === num ? 'bg-red-300' : 'bg-slate-300'
						}`}
						onClick={() => markingHandler(num)}
						key={num}
					>
						{(playerMarks.find((mark) => mark === num) && <BsCircle />) ||
							(computerMarks.find((mark) => mark === num) && <BsXLg />)}
					</div>
				))}
			</div>
			<button
				onClick={startGameHandler}
				className={`pl-6 pr-6 border-black border-2 hover:bg-slate-300 hover:border-black hover:text-black ${
					gameState === 'initialized' ? 'invisible' : 'visible'
				}`}
			>
				{gameState === 'won' || gameState === 'lost' ? 'Play again' : 'Start game'}
			</button>
		</div>
	)
}
