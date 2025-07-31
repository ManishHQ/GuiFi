'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';

interface FeatureCardProps {
	title: string;
	description: string;
	icon: string;
	gradientFrom: string;
	gradientTo: string;
	onClick: () => void;
}

function FeatureCard({
	title,
	description,
	icon,
	gradientFrom,
	gradientTo,
	onClick,
}: FeatureCardProps) {
	return (
		<Card
			className='bg-white/95 dark:bg-slate-950/95 backdrop-blur-sm border-slate-200/60 dark:border-slate-800/60 hover:shadow-lg transition-all duration-200 cursor-pointer'
			onClick={onClick}
		>
			<CardHeader className='text-center pb-4'>
				<div
					className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-br ${gradientFrom} ${gradientTo} flex items-center justify-center text-2xl mb-4`}
				>
					{icon}
				</div>
				<CardTitle className='text-xl'>{title}</CardTitle>
			</CardHeader>
			<CardContent className='text-center'>
				<p className='text-slate-600 dark:text-slate-400 mb-4'>{description}</p>
				<Button
					className={`w-full bg-gradient-to-r ${gradientFrom} ${gradientTo} hover:opacity-90 transition-opacity`}
				>
					Explore {title}
				</Button>
			</CardContent>
		</Card>
	);
}

interface FeatureShowcaseProps {
	onNavigate: (tab: string) => void;
}

export function FeatureShowcase({ onNavigate }: FeatureShowcaseProps) {
	const features = [
		{
			title: 'Vaults',
			description:
				'Deploy and manage AI-powered DeFi vaults with automated yield optimization strategies.',
			icon: '🏦',
			gradientFrom: 'from-blue-600',
			gradientTo: 'to-indigo-600',
			tab: 'vaults',
		},
		{
			title: 'Prediction Markets',
			description:
				'Create and participate in AI-enhanced prediction markets for crypto, tech, and world events.',
			icon: '🔮',
			gradientFrom: 'from-purple-600',
			gradientTo: 'to-pink-600',
			tab: 'predictions',
		},
		{
			title: 'Token Launchpad',
			description:
				'Launch new tokens with AI scoring, liquidity bootstrapping, and community building tools.',
			icon: '🚀',
			gradientFrom: 'from-orange-600',
			gradientTo: 'to-red-600',
			tab: 'launchpad',
		},
		{
			title: 'Portfolio Analytics',
			description:
				'Track your positions across vaults, predictions, and token launches with AI insights.',
			icon: '💼',
			gradientFrom: 'from-emerald-600',
			gradientTo: 'to-green-600',
			tab: 'portfolio',
		},
	];

	return (
		<div className='space-y-8'>
			{/* Hero Section */}
			<div className='text-center space-y-4'>
				<div className='w-24 h-24 mx-auto rounded-2xl bg-gradient-to-br flex items-center justify-center mb-6'>
					<Image src='/logo.png' alt='GuiVerse Logo' width={80} height={80} />
				</div>
				<h1 className='text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white'>
					Welcome to GuiVerse
				</h1>
				<p className='text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto'>
					The super app, powered by GUI Chain. Trade, predict, and launch with
					confidence.
				</p>
			</div>

			{/* Stats Bar */}
			<div className='grid grid-cols-2 lg:grid-cols-4 gap-4'>
				<div className='text-center p-4 bg-white/50 dark:bg-slate-950/50 rounded-lg backdrop-blur-sm'>
					<div className='text-2xl font-bold text-slate-900 dark:text-white'>
						$2.8M
					</div>
					<div className='text-sm text-slate-600 dark:text-slate-400'>
						Total Value Locked
					</div>
				</div>
				<div className='text-center p-4 bg-white/50 dark:bg-slate-950/50 rounded-lg backdrop-blur-sm'>
					<div className='text-2xl font-bold text-slate-900 dark:text-white'>
						47
					</div>
					<div className='text-sm text-slate-600 dark:text-slate-400'>
						Active Markets
					</div>
				</div>
				<div className='text-center p-4 bg-white/50 dark:bg-slate-950/50 rounded-lg backdrop-blur-sm'>
					<div className='text-2xl font-bold text-slate-900 dark:text-white'>
						1,284
					</div>
					<div className='text-sm text-slate-600 dark:text-slate-400'>
						Users
					</div>
				</div>
				<div className='text-center p-4 bg-white/50 dark:bg-slate-950/50 rounded-lg backdrop-blur-sm'>
					<div className='text-2xl font-bold text-slate-900 dark:text-white'>
						96%
					</div>
					<div className='text-sm text-slate-600 dark:text-slate-400'>
						AI Accuracy
					</div>
				</div>
			</div>

			{/* Features Grid */}
			<div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
				{features.map((feature) => (
					<FeatureCard
						key={feature.title}
						title={feature.title}
						description={feature.description}
						icon={feature.icon}
						gradientFrom={feature.gradientFrom}
						gradientTo={feature.gradientTo}
						onClick={() => onNavigate(feature.tab)}
					/>
				))}
			</div>
		</div>
	);
}
