'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

export interface TimerState {
	isRunning: boolean
	remainingTime: number
	duration: number | null
}

export interface TimerOptions {
	onComplete?: () => void
	onTick?: (remainingTime: number) => void
}

export function useTimer(options: TimerOptions = {}): {
	state: TimerState
	start: (durationMs: number) => void
	stop: () => void
	reset: () => void
	formatTime: (ms: number) => string
} {
	const [state, setState] = useState<TimerState>({
		isRunning: false,
		remainingTime: 0,
		duration: null,
	})

	const intervalRef = useRef<NodeJS.Timeout | null>(null)
	const { onComplete, onTick } = options

	const formatTime = useCallback((ms: number): string => {
		const totalSeconds = Math.ceil(ms / 1000)
		const hours = Math.floor(totalSeconds / 3600)
		const minutes = Math.floor((totalSeconds % 3600) / 60)
		const seconds = totalSeconds % 60

		if (hours > 0) {
			return `${hours.toString().padStart(2, '0')}:${minutes
				.toString()
				.padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
		}
		return `${minutes.toString().padStart(2, '0')}:${seconds
			.toString()
			.padStart(2, '0')}`
	}, [])

	const start = useCallback(
		(durationMs: number) => {
			// Clear any existing interval
			if (intervalRef.current) {
				clearInterval(intervalRef.current)
			}

			setState({
				isRunning: true,
				remainingTime: durationMs,
				duration: durationMs,
			})

			intervalRef.current = setInterval(() => {
				setState((prev) => {
					const newRemainingTime = Math.max(0, prev.remainingTime - 1000)

					if (onTick) {
						onTick(newRemainingTime)
					}

					if (newRemainingTime <= 0) {
						if (intervalRef.current) {
							clearInterval(intervalRef.current)
							intervalRef.current = null
						}

						if (onComplete) {
							onComplete()
						}

						return {
							isRunning: false,
							remainingTime: 0,
							duration: prev.duration,
						}
					}

					return {
						...prev,
						remainingTime: newRemainingTime,
					}
				})
			}, 1000)
		},
		[onComplete, onTick]
	)

	const stop = useCallback(() => {
		if (intervalRef.current) {
			clearInterval(intervalRef.current)
			intervalRef.current = null
		}

		setState((prev) => ({
			...prev,
			isRunning: false,
		}))
	}, [])

	const reset = useCallback(() => {
		if (intervalRef.current) {
			clearInterval(intervalRef.current)
			intervalRef.current = null
		}

		setState({
			isRunning: false,
			remainingTime: 0,
			duration: null,
		})
	}, [])

	// Cleanup on unmount
	useEffect(() => {
		return () => {
			if (intervalRef.current) {
				clearInterval(intervalRef.current)
			}
		}
	}, [])

	return {
		state,
		start,
		stop,
		reset,
		formatTime,
	}
}
