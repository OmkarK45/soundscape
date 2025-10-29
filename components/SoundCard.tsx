'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Play, Pause } from 'lucide-react'
import { Sound } from '@/lib/sounds'
import { useAudioManager } from '@/lib/hooks/useAudioManager'
import { useState, useEffect } from 'react'

interface SoundCardProps {
	sound: Sound
	audioManager: ReturnType<typeof useAudioManager>
}

export function SoundCard({ sound, audioManager }: SoundCardProps) {
	const [isPlaying, setIsPlaying] = useState(false)
	const [volume, setVolume] = useState(0.6)
	const IconComponent = sound.icon

	// Sync with audio manager state
	useEffect(() => {
		const state = audioManager.getState(sound.id)
		if (state) {
			// Use setTimeout to avoid synchronous setState in effect
			setTimeout(() => {
				setIsPlaying(state.isPlaying)
				setVolume(state.volume)
			}, 0)
		}
	}, [audioManager, sound.id])

	const handleTogglePlay = () => {
		if (isPlaying) {
			audioManager.pause(sound.id)
		} else {
			audioManager.play(sound.id)
		}
	}

	const handleVolumeChange = (value: number | readonly number[]) => {
		const volumeArray = Array.isArray(value) ? value : [value]
		const newVolume = volumeArray[0] / 100 // Convert 0-100 to 0-1
		setVolume(newVolume)
		audioManager.setVolume(sound.id, newVolume)
	}

	return (
		<Card className="p-6 hover:scale-102 transition-transform duration-200 hover:shadow-lg">
			<div className="flex flex-col items-center space-y-4">
				{/* Icon */}
				<div className="p-4 rounded-full bg-sky-50 text-sky-500">
					<IconComponent size={32} />
				</div>

				{/* Label */}
				<h3 className="text-lg font-medium text-foreground">{sound.label}</h3>

				{/* Play/Pause Button */}
				<Button
					onClick={handleTogglePlay}
					variant={isPlaying ? 'default' : 'outline'}
					size="lg"
					className="w-full"
				>
					{isPlaying ? (
						<>
							<Pause className="w-4 h-4 mr-2" />
							Pause
						</>
					) : (
						<>
							<Play className="w-4 h-4 mr-2" />
							Play
						</>
					)}
				</Button>

				{/* Volume Slider */}
				<div className="w-full space-y-2">
					<label className="text-sm text-muted-foreground">
						Volume: {Math.round(volume * 100)}%
					</label>
					<Slider
						value={[volume * 100]}
						onValueChange={handleVolumeChange}
						max={100}
						step={1}
						className="w-full"
					/>
				</div>
			</div>
		</Card>
	)
}
