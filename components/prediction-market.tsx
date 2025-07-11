'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { SinglePredictionMarket } from '@/components/single-prediction-market';

interface PredictionMarket {
	id: string;
	title: string;
	description: string;
	category: string;
	creator: string;
	endDate: Date;
	totalPool: number;
	yesPrice: number;
	noPrice: number;
	yesVolume: number;
	noVolume: number;
	status: 'active' | 'resolved' | 'pending';
	result?: 'yes' | 'no';
	aiConfidence?: number;
}

const MOCK_MARKETS: PredictionMarket[] = [
	{
		id: '1',
		title: 'ETH will reach $5,000 by end of 2025',
		description:
			"Will Ethereum's price reach or exceed $5,000 USD by December 31, 2025?",
		category: 'Crypto',
		creator: '0x1234...5678',
		endDate: new Date('2025-12-31'),
		totalPool: 125000,
		yesPrice: 0.65,
		noPrice: 0.35,
		yesVolume: 81250,
		noVolume: 43750,
		status: 'active',
		aiConfidence: 72,
	},
	{
		id: '2',
		title: 'AI will achieve AGI breakthrough in 2025',
		description:
			'Will artificial general intelligence (AGI) be achieved by any major tech company in 2025?',
		category: 'Technology',
		creator: '0x9876...5432',
		endDate: new Date('2025-12-31'),
		totalPool: 89000,
		yesPrice: 0.28,
		noPrice: 0.72,
		yesVolume: 24920,
		noVolume: 64080,
		status: 'active',
		aiConfidence: 85,
	},
	{
		id: '3',
		title: 'Bitcoin ETF reaches $100B AUM',
		description:
			'Will any Bitcoin ETF reach $100 billion in assets under management by Q3 2025?',
		category: 'Finance',
		creator: '0x5555...9999',
		endDate: new Date('2025-09-30'),
		totalPool: 67500,
		yesPrice: 0.82,
		noPrice: 0.18,
		yesVolume: 55350,
		noVolume: 12150,
		status: 'active',
		aiConfidence: 91,
	},
	{
		id: '4',
		title: 'Tesla stock will hit $500',
		description:
			"Will Tesla's stock price reach $500 per share by end of Q2 2025?",
		category: 'Stocks',
		creator: '0x1111...2222',
		endDate: new Date('2025-06-30'),
		totalPool: 45000,
		yesPrice: 0.45,
		noPrice: 0.55,
		yesVolume: 20250,
		noVolume: 24750,
		status: 'resolved',
		result: 'no',
		aiConfidence: 78,
	},
];

export function PredictionMarket() {
	const [markets, setMarkets] = useState<PredictionMarket[]>(MOCK_MARKETS);
	const [selectedCategory, setSelectedCategory] = useState('all');
	const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
	const [selectedMarketId, setSelectedMarketId] = useState<string | null>(null);
	const [newMarket, setNewMarket] = useState({
		title: '',
		description: '',
		category: 'Crypto',
		endDate: '',
	});

	// If a market is selected, show the single market view
	if (selectedMarketId) {
		return <SinglePredictionMarket onBack={() => setSelectedMarketId(null)} />;
	}

	const categories = [
		'all',
		'Crypto',
		'Technology',
		'Finance',
		'Stocks',
		'Sports',
		'Politics',
	];

	const filteredMarkets =
		selectedCategory === 'all'
			? markets
			: markets.filter((market) => market.category === selectedCategory);

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'active':
				return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
			case 'resolved':
				return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
			case 'pending':
				return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
			default:
				return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
		}
	};

	const formatTimeRemaining = (endDate: Date) => {
		const now = new Date();
		const diff = endDate.getTime() - now.getTime();
		const days = Math.floor(diff / (1000 * 60 * 60 * 24));
		const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

		if (days > 0) return `${days}d ${hours}h`;
		if (hours > 0) return `${hours}h`;
		return 'Ended';
	};

	const handleCreateMarket = () => {
		if (!newMarket.title || !newMarket.description || !newMarket.endDate)
			return;

		const market: PredictionMarket = {
			id: Date.now().toString(),
			title: newMarket.title,
			description: newMarket.description,
			category: newMarket.category,
			creator: '0x1234...5678', // Mock user address
			endDate: new Date(newMarket.endDate),
			totalPool: 0,
			yesPrice: 0.5,
			noPrice: 0.5,
			yesVolume: 0,
			noVolume: 0,
			status: 'active',
			aiConfidence: Math.floor(Math.random() * 40) + 60,
		};

		setMarkets([market, ...markets]);
		setNewMarket({
			title: '',
			description: '',
			category: 'Crypto',
			endDate: '',
		});
		setIsCreateModalOpen(false);
	};

	return (
		<div className='space-y-6 relative pb-20'>
			{/* Header */}
			<div>
				<h2 className='text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white'>
					🔮 Prediction Markets
				</h2>
				<p className='text-slate-600 dark:text-slate-400'>
					AI-powered prediction markets with real-time insights
				</p>
			</div>

			{/* Floating Create Market Button */}
			<Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
				<DialogTrigger asChild>
					<Button className='fixed bottom-6 right-6 z-50 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg text-white px-4 py-3 sm:px-6 rounded-full lg:bottom-8 lg:right-8'>
						<span className='hidden sm:inline'>🚀 Create Market</span>
						<span className='sm:hidden'>🚀</span>
					</Button>
				</DialogTrigger>
				<DialogContent className='max-w-md'>
					<DialogHeader>
						<DialogTitle>Create Prediction Market</DialogTitle>
					</DialogHeader>
					<div className='space-y-4'>
						<Input
							placeholder='Market title...'
							value={newMarket.title}
							onChange={(e) =>
								setNewMarket({ ...newMarket, title: e.target.value })
							}
						/>
						<Textarea
							placeholder='Market description...'
							value={newMarket.description}
							onChange={(e) =>
								setNewMarket({ ...newMarket, description: e.target.value })
							}
						/>
						<select
							className='w-full p-2 border rounded-md bg-background'
							value={newMarket.category}
							onChange={(e) =>
								setNewMarket({ ...newMarket, category: e.target.value })
							}
						>
							{categories
								.filter((cat) => cat !== 'all')
								.map((category) => (
									<option key={category} value={category}>
										{category}
									</option>
								))}
						</select>
						<Input
							type='datetime-local'
							value={newMarket.endDate}
							onChange={(e) =>
								setNewMarket({ ...newMarket, endDate: e.target.value })
							}
						/>
						<Button
							onClick={handleCreateMarket}
							className='w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
						>
							Create Market{' '}
						</Button>
					</div>
				</DialogContent>
			</Dialog>

			{/* AI Insights Alert */}
			<Alert className='bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 border-purple-200 dark:border-purple-800'>
				<AlertDescription className='text-purple-700 dark:text-purple-300'>
					🤖 AI is analyzing market sentiment and providing confidence scores
					for all active predictions.
				</AlertDescription>
			</Alert>

			{/* Category Filter */}
			<div className='flex flex-wrap gap-2'>
				{categories.map((category) => (
					<Button
						key={category}
						variant={selectedCategory === category ? 'default' : 'neutral'}
						size='sm'
						onClick={() => setSelectedCategory(category)}
						className='capitalize'
					>
						{category}
					</Button>
				))}
			</div>

			{/* Markets Grid */}
			<div className='grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6'>
				{filteredMarkets.map((market) => (
					<Card
						key={market.id}
						className='bg-white/95 dark:bg-slate-950/95 backdrop-blur-sm border-slate-200/60 dark:border-slate-800/60 hover:shadow-lg transition-all duration-200 cursor-pointer'
						onClick={() => setSelectedMarketId(market.id)}
					>
						<CardHeader className='space-y-3'>
							<div className='flex items-start justify-between gap-3'>
								<div className='flex-1'>
									<CardTitle className='text-lg leading-tight'>
										{market.title}
									</CardTitle>
									<p className='text-sm text-slate-600 dark:text-slate-400 mt-1'>
										{market.description}
									</p>
								</div>
								<Badge className={getStatusColor(market.status)}>
									{market.status}
								</Badge>
							</div>

							<div className='flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400'>
								<span>📊 {market.category}</span>
								<span>⏰ {formatTimeRemaining(market.endDate)}</span>
								{market.aiConfidence && (
									<span className='text-purple-600 dark:text-purple-400'>
										🤖 {market.aiConfidence}% confidence
									</span>
								)}
							</div>
						</CardHeader>

						<CardContent className='space-y-4'>
							{/* Pool Info */}
							<div className='flex items-center justify-between text-sm'>
								<span className='text-slate-600 dark:text-slate-400'>
									Total Pool
								</span>
								<span className='font-semibold'>
									${market.totalPool.toLocaleString()}
								</span>
							</div>

							{/* Price Display */}
							<div className='grid grid-cols-2 gap-3'>
								<div className='p-3 bg-green-50 dark:bg-green-950/50 rounded-lg border border-green-200 dark:border-green-800'>
									<div className='text-xs text-green-600 dark:text-green-400 font-medium'>
										YES
									</div>
									<div className='text-lg font-bold text-green-700 dark:text-green-300'>
										${market.yesPrice.toFixed(2)}
									</div>
									<div className='text-xs text-green-600 dark:text-green-400'>
										${market.yesVolume.toLocaleString()} vol
									</div>
								</div>
								<div className='p-3 bg-red-50 dark:bg-red-950/50 rounded-lg border border-red-200 dark:border-red-800'>
									<div className='text-xs text-red-600 dark:text-red-400 font-medium'>
										NO
									</div>
									<div className='text-lg font-bold text-red-700 dark:text-red-300'>
										${market.noPrice.toFixed(2)}
									</div>
									<div className='text-xs text-red-600 dark:text-red-400'>
										${market.noVolume.toLocaleString()} vol
									</div>
								</div>
							</div>

							{/* Volume Progress */}
							<div className='space-y-2'>
								<div className='flex justify-between text-xs text-slate-600 dark:text-slate-400'>
									<span>
										YES:{' '}
										{((market.yesVolume / market.totalPool) * 100).toFixed(1)}%
									</span>
									<span>
										NO:{' '}
										{((market.noVolume / market.totalPool) * 100).toFixed(1)}%
									</span>
								</div>
								<Progress
									value={(market.yesVolume / market.totalPool) * 100}
									className='h-2'
								/>
							</div>

							{/* Action Buttons */}
							{market.status === 'active' && (
								<div className='space-y-2'>
									<div className='grid grid-cols-2 gap-2'>
										<Button
											size='sm'
											className='bg-green-600 hover:bg-green-700'
											onClick={(e) => {
												e.stopPropagation();
												// Handle buy YES logic
											}}
										>
											Buy YES
										</Button>
										<Button
											size='sm'
											variant='neutral'
											className='border-red-200 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-950'
											onClick={(e) => {
												e.stopPropagation();
												// Handle buy NO logic
											}}
										>
											Buy NO
										</Button>
									</div>
									<Button
										size='sm'
										variant='neutral'
										className='w-full'
										onClick={(e) => {
											e.stopPropagation();
											setSelectedMarketId(market.id);
										}}
									>
										📊 View Details
									</Button>
								</div>
							)}

							{market.status === 'resolved' && market.result && (
								<div
									className={`p-2 rounded-lg text-center text-sm font-medium ${
										market.result === 'yes'
											? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
											: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
									}`}
								>
									Resolved: {market.result.toUpperCase()}
								</div>
							)}
						</CardContent>
					</Card>
				))}
			</div>

			{filteredMarkets.length === 0 && (
				<div className='text-center py-12'>
					<div className='text-6xl mb-4'>🔮</div>
					<h3 className='text-xl font-semibold text-slate-600 dark:text-slate-400 mb-2'>
						No markets found
					</h3>
					<p className='text-slate-500 dark:text-slate-500'>
						Try selecting a different category or create a new market
					</p>
				</div>
			)}
		</div>
	);
}
