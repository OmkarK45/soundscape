'use client'

import { useState, useEffect } from 'react'

export interface ClockState {
	time: string
	date: string
}

export function useClock(): ClockState {
	const [clock, setClock] = useState<ClockState>({
		time: '--:-- --',
		date: 'Loading...',
	})

	useEffect(() => {
		const updateClock = () => {
			const now = new Date()

			// Format time as HH:MM AM/PM
			const time = now.toLocaleTimeString('en-US', {
				hour: 'numeric',
				minute: '2-digit',
				hour12: true,
			})

			// Format date as Weekday, Month Day
			const date = now.toLocaleDateString('en-US', {
				weekday: 'long',
				month: 'long',
				day: 'numeric',
			})

			setClock({ time, date })
		}

		// Update immediately
		updateClock()

		// Update every second
		const interval = setInterval(updateClock, 1000)

		return () => clearInterval(interval)
	}, [])

	return clock
}
