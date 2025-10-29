import {
	Flame,
	Waves,
	CloudRain,
	Trees,
	Wind,
	Bird,
	LucideIcon,
} from 'lucide-react'

export interface Sound {
	id: string
	label: string
	src: string
	icon: LucideIcon
}

export const SOUNDS: Sound[] = [
	{ id: 'fire', label: 'Fire', src: '/audio/fire.mp3', icon: Flame },
	{ id: 'ocean', label: 'Ocean', src: '/audio/ocean.mp3', icon: Waves },
	{ id: 'rain', label: 'Rain', src: '/audio/rain.mp3', icon: CloudRain },
	{ id: 'forest', label: 'Forest', src: '/audio/forest.mp3', icon: Trees },
	{ id: 'wind', label: 'Wind', src: '/audio/wind.mp3', icon: Wind },
	{ id: 'birds', label: 'Birds', src: '/audio/birds.mp3', icon: Bird },
]

export const TIMER_OPTIONS = [
	{ label: '15 minutes', value: 15 * 60 * 1000 },
	{ label: '30 minutes', value: 30 * 60 * 1000 },
	{ label: '60 minutes', value: 60 * 60 * 1000 },
	{ label: '90 minutes', value: 90 * 60 * 1000 },
	{ label: 'Infinite', value: null },
]
