import { useCallback, useEffect, useRef, useState } from 'react'
import { BsCircle, BsXLg } from 'react-icons/bs'
import './App.css'
import { useCheckWin } from './hooks/useCheckWin'
import { calculateBestMove } from './utils/calculateBestMove'
import { createHeadline } from './utils/createHeadline'

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
	const clickHintArray =
		playerTurnRef.current === false && gameState === 'initialized'
			? !selectedMark && playerMarks.length === 3
				? playerMarks
				: Array.from({ length: 9 }, (_, index) => index + 1).filter((num) => ![...playerMarks, ...computerMarks].includes(num))
			: []

	function startGameHandler() {
		setPlayerMarks([])
		setComputerMarks([])
		setSelectedMark(null)
		setTimeout(() => {
			setGameState('initialized')
		}, 0)
	}

	function markingHandler(num: number) {
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
		// Turn with under three marks
		if (playerMarks.length > computerMarks.length) {
			underThreeMarksTurnRef.current = setTimeout(() => {
				const moveResult = calculateBestMove(playerMarks, computerMarks, false)
				if (typeof moveResult === 'number') {
					setComputerMarks((prev) => [...prev, moveResult])
					playerTurnRef.current = false
				}
			}, COMPUTER_MARK_TIMER)
		}

		// Turn with three marks
		if (playerMarks.length === computerMarks.length) {
			threeMarksTurnRef.current = setTimeout(() => {
				const moveResult = calculateBestMove(playerMarks, computerMarks, true)
				if (typeof moveResult !== 'number') {
					const { selectedSpot, newSpot } = moveResult
					setSelectedMark(selectedSpot)
					setTimeout(() => {
						setComputerMarks((prev) => [...prev.filter((existingNum) => existingNum !== selectedSpot), newSpot])
						setSelectedMark(null)
						playerTurnRef.current = false
					}, COMPUTER_MARK_TIMER)
				}
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
			<div className={`text-black font-bold text-5xl`}>{createHeadline(gameState)}</div>
			<div className='grid gap-5 grid-cols-3 grid-rows-3'>
				{Array.from({ length: 9 }, (_, index) => index + 1).map((num) => (
					<div
						className={`h-24 w-24 md:h-40 md:w-40 border-4 border-black flex justify-center items-center cursor-pointer text-5xl md:text-7xl rounded-md transform ${
							clickHintArray.includes(num) ? 'hover:scale-105' : null
						} ${selectedMark === num ? 'bg-red-300' : 'bg-slate-300'} ${isWin ? 'text-darkgray' : 'text-black'}`}
						onClick={gameState === 'initialized' ? () => markingHandler(num) : undefined}
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
