'use client'

import { useRef, useCallback, useEffect } from 'react'

import { LucideIcon } from 'lucide-react'

export interface Sound {
	id: string
	label: string
	src: string
	icon: LucideIcon
}

export interface AudioState {
	isPlaying: boolean
	volume: number
}

export interface AudioManager {
	play: (id: string) => void
	pause: (id: string) => void
	setVolume: (id: string, volume: number) => void
	playAll: () => void
	pauseAll: () => void
	stopAll: () => void
	getState: (id: string) => AudioState | null
	fadeOut: (duration: number) => Promise<void>
}

export function useAudioManager(sounds: Sound[]): AudioManager {
	const audios = useRef<Record<string, HTMLAudioElement>>({})
	const states = useRef<Record<string, AudioState>>({})
	const fadeIntervals = useRef<Record<string, NodeJS.Timeout>>({})

	// Initialize audio elements and states
	useEffect(() => {
		sounds.forEach((sound) => {
			if (!audios.current[sound.id]) {
				const audio = new Audio(sound.src)
				audio.loop = true
				audio.volume = 0.6 // Default volume as per PRD
				audios.current[sound.id] = audio
				states.current[sound.id] = {
					isPlaying: false,
					volume: 0.6,
				}
			}
		})

		// Cleanup on unmount
		return () => {
			const currentAudios = audios.current
			const currentIntervals = fadeIntervals.current

			Object.values(currentAudios).forEach((audio) => {
				audio.pause()
				audio.src = ''
			})
			Object.values(currentIntervals).forEach((interval) => {
				clearInterval(interval)
			})
		}
	}, [sounds])

	const play = useCallback((id: string) => {
		const audio = audios.current[id]
		if (audio) {
			audio.play().catch(console.error)
			states.current[id] = { ...states.current[id], isPlaying: true }
		}
	}, [])

	const pause = useCallback((id: string) => {
		const audio = audios.current[id]
		if (audio) {
			audio.pause()
			states.current[id] = { ...states.current[id], isPlaying: false }
		}
	}, [])

	const setVolume = useCallback((id: string, volume: number) => {
		const audio = audios.current[id]
		if (audio) {
			audio.volume = Math.max(0, Math.min(1, volume))
			states.current[id] = { ...states.current[id], volume }
		}
	}, [])

	const playAll = useCallback(() => {
		sounds.forEach((sound) => {
			if (!states.current[sound.id]?.isPlaying) {
				play(sound.id)
			}
		})
	}, [sounds, play])

	const pauseAll = useCallback(() => {
		sounds.forEach((sound) => {
			if (states.current[sound.id]?.isPlaying) {
				pause(sound.id)
			}
		})
	}, [sounds, pause])

	const stopAll = useCallback(() => {
		sounds.forEach((sound) => {
			const audio = audios.current[sound.id]
			if (audio) {
				audio.pause()
				audio.currentTime = 0
				states.current[sound.id] = { isPlaying: false, volume: 0.6 }
				setVolume(sound.id, 0.6)
			}
		})
	}, [sounds, setVolume])

	const getState = useCallback((id: string): AudioState | null => {
		return states.current[id] || null
	}, [])

	const fadeOut = useCallback(
		async (duration: number): Promise<void> => {
			const fadeStep = 0.1 // 100ms intervals
			const steps = Math.floor(duration / (fadeStep * 1000))
			const volumeStep = 1 / steps

			return new Promise((resolve) => {
				let currentStep = 0

				const fadeInterval = setInterval(() => {
					currentStep++
					const newVolume = Math.max(0, 1 - currentStep * volumeStep)

					sounds.forEach((sound) => {
						const audio = audios.current[sound.id]
						if (audio && states.current[sound.id]?.isPlaying) {
							audio.volume = newVolume * states.current[sound.id].volume
						}
					})

					if (currentStep >= steps) {
						clearInterval(fadeInterval)
						pauseAll()
						resolve()
					}
				}, fadeStep * 1000)
			})
		},
		[sounds, pauseAll]
	)

	return {
		play,
		pause,
		setVolume,
		playAll,
		pauseAll,
		stopAll,
		getState,
		fadeOut,
	}
}
