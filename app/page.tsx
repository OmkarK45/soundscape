'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Play, Pause, RotateCcw, Clock, Timer } from 'lucide-react'
import { SoundCard } from '@/components/SoundCard'
import { useAudioManager } from '@/lib/hooks/useAudioManager'
import { useTimer } from '@/lib/hooks/useTimer'
import { useClock } from '@/lib/hooks/useClock'
import { SOUNDS, TIMER_OPTIONS } from '@/lib/sounds'

export default function Home() {
	const audioManager = useAudioManager(SOUNDS)
	const clock = useClock()
	const [allPlaying, setAllPlaying] = useState(false)
	const [selectedTimer, setSelectedTimer] = useState<string>('')

	const timer = useTimer({
		onComplete: async () => {
			// Fade out all sounds over 2 seconds
			await audioManager.fadeOut(2000)
			setAllPlaying(false)
		},
	})

	// Check if all sounds are playing
	useEffect(() => {
		const playingCount = SOUNDS.filter((sound) => {
			const state = audioManager.getState(sound.id)
			return state?.isPlaying
		}).length

		// Use setTimeout to avoid synchronous setState in effect
		setTimeout(() => {
			setAllPlaying(playingCount === SOUNDS.length)
		}, 0)
	}, [audioManager])

	const handlePlayAll = () => {
		if (allPlaying) {
			audioManager.pauseAll()
			setAllPlaying(false)
		} else {
			audioManager.playAll()
			setAllPlaying(true)
		}
	}

	const handleReset = () => {
		audioManager.stopAll()
		timer.reset()
		setAllPlaying(false)
		setSelectedTimer('')
	}

	const handleTimerChange = (value: string) => {
		setSelectedTimer(value)
		timer.reset()

		if (value === 'infinite') {
			// No timer set
			return
		}

		const duration = parseInt(value)
		if (duration > 0) {
			timer.start(duration)
		}
	}

	return (
		<div className="min-h-screen bg-background text-foreground font-lexend-deca">
			{/* Header */}
			<header className="border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
				<div className="container mx-auto px-4 py-4">
					<div className="flex items-center justify-between">
						<div>
							<h1 className="text-2xl font-bold text-foreground">
								Sound Palette
							</h1>
							<p className="text-sm text-muted-foreground">
								Ambient sound mixer
							</p>
						</div>
						<div className="text-right">
							<div className="flex items-center space-x-2 text-lg font-medium">
								<Clock className="w-5 h-5" />
								<span>{clock.time}</span>
							</div>
							<div className="text-sm text-muted-foreground">{clock.date}</div>
						</div>
					</div>
				</div>
			</header>

			{/* Main Content */}
			<main className="container mx-auto px-4 py-8">
				{/* Sound Grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
					{SOUNDS.map((sound) => (
						<SoundCard
							key={sound.id}
							sound={sound}
							audioManager={audioManager}
						/>
					))}
				</div>

				{/* Footer Controls */}
				<Card className="p-6">
					<div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
						{/* Global Controls */}
						<div className="flex items-center space-x-4">
							<Button
								onClick={handlePlayAll}
								variant={allPlaying ? 'default' : 'outline'}
								size="lg"
								className="min-w-[140px]"
							>
								{allPlaying ? (
									<>
										<Pause className="w-4 h-4 mr-2" />
										Pause All
									</>
								) : (
									<>
										<Play className="w-4 h-4 mr-2" />
										Play All
									</>
								)}
							</Button>

							<Button onClick={handleReset} variant="outline" size="lg">
								<RotateCcw className="w-4 h-4 mr-2" />
								Reset
							</Button>
						</div>

						<Separator
							orientation="vertical"
							className="hidden sm:block h-12"
						/>

						{/* Timer Controls */}
						<div className="flex items-center space-x-4">
							<div className="flex items-center space-x-2">
								<Timer className="w-5 h-5 text-muted-foreground" />
								<span className="text-sm font-medium">Sleep Timer:</span>
							</div>

							<Select value={selectedTimer} onValueChange={handleTimerChange}>
								<SelectTrigger className="w-[180px]">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{TIMER_OPTIONS.map((option) => (
										<SelectItem
											key={option.value || 'infinite'}
											value={
												option.value ? option.value.toString() : 'infinite'
											}
										>
											{option.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>

							{timer.state.isRunning && (
								<div className="text-sm font-mono text-muted-foreground">
									{timer.formatTime(timer.state.remainingTime)} remaining
								</div>
							)}
						</div>
					</div>
				</Card>
			</main>
		</div>
	)
}
