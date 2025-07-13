'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

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
	participants?: number;
	createdDate: Date;
	rules?: string[];
	aiAnalysis?: {
		sentiment: 'bullish' | 'bearish' | 'neutral';
		factors: string[];
		riskLevel: 'low' | 'medium' | 'high';
	};
}

interface Trade {
	id: string;
	user: string;
	type: 'yes' | 'no';
	amount: number;
	price: number;
	timestamp: Date;
}

interface SinglePredictionMarketProps {
	marketAddress: string;
	onBack?: () => void;
}

// Mock detailed market data
const DETAILED_MARKET: PredictionMarket = {
	id: '1',
	title: 'ETH will reach $5,000 by end of 2025',
	description:
		"Will Ethereum's price reach or exceed $5,000 USD by December 31, 2025? This market resolves to YES if ETH closes above $5,000 on any major exchange (Coinbase, Binance, Kraken) during the specified timeframe.",
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
	participants: 1247,
	createdDate: new Date('2025-01-01'),
	rules: [
		'Market resolves based on ETH/USD price on major exchanges',
		'Price must be sustained for at least 1 hour',
		'Market closes at 11:59 PM UTC on December 31, 2025',
		'In case of technical issues, Chainlink price feeds will be used as backup',
	],
	aiAnalysis: {
		sentiment: 'bullish',
		factors: [
			'Ethereum 2.0 adoption increasing',
			'Institutional DeFi adoption growing',
			'ETF approval momentum building',
			'Layer 2 scaling solutions maturing',
		],
		riskLevel: 'medium',
	},
};

const MOCK_TRADES: Trade[] = [
	{
		id: '1',
		user: '0x1234...5678',
		type: 'yes',
		amount: 500,
		price: 0.65,
		timestamp: new Date('2025-01-10T14:30:00'),
	},
	{
		id: '2',
		user: '0x9876...5432',
		type: 'no',
		amount: 300,
		price: 0.35,
		timestamp: new Date('2025-01-10T14:25:00'),
	},
	{
		id: '3',
		user: '0x5555...9999',
		type: 'yes',
		amount: 750,
		price: 0.64,
		timestamp: new Date('2025-01-10T14:20:00'),
	},
	{
		id: '4',
		user: '0x1111...2222',
		type: 'yes',
		amount: 1000,
		price: 0.66,
		timestamp: new Date('2025-01-10T14:15:00'),
	},
	{
		id: '5',
		user: '0x3333...4444',
		type: 'no',
		amount: 250,
		price: 0.34,
		timestamp: new Date('2025-01-10T14:10:00'),
	},
];

export function SinglePredictionMarket({
	onBack,
}: SinglePredictionMarketProps) {
	const [market] = useState<PredictionMarket>(DETAILED_MARKET);
	const [trades] = useState<Trade[]>(MOCK_TRADES);
	const [betAmount, setBetAmount] = useState('');
	const [selectedSide, setSelectedSide] = useState<'yes' | 'no' | null>(null);
	const [isBetModalOpen, setIsBetModalOpen] = useState(false);

	const formatTimeRemaining = (endDate: Date) => {
		const now = new Date();
		const diff = endDate.getTime() - now.getTime();
		const days = Math.floor(diff / (1000 * 60 * 60 * 24));
		const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

		if (days > 0) return `${days}d ${hours}h`;
		if (hours > 0) return `${hours}h`;
		return 'Ended';
	};

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

	const getSentimentColor = (sentiment: string) => {
		switch (sentiment) {
			case 'bullish':
				return 'text-green-600 dark:text-green-400';
			case 'bearish':
				return 'text-red-600 dark:text-red-400';
			default:
				return 'text-slate-600 dark:text-slate-400';
		}
	};

	const getRiskColor = (risk: string) => {
		switch (risk) {
			case 'low':
				return 'text-green-600 dark:text-green-400';
			case 'medium':
				return 'text-yellow-600 dark:text-yellow-400';
			case 'high':
				return 'text-red-600 dark:text-red-400';
			default:
				return 'text-slate-600 dark:text-slate-400';
		}
	};

	const handlePlaceBet = () => {
		if (!betAmount || !selectedSide) return;

		// Mock bet placement
		console.log(`Placing bet: ${betAmount} on ${selectedSide}`);
		setIsBetModalOpen(false);
		setBetAmount('');
		setSelectedSide(null);
	};

	return (
		<div className='space-y-6'>
			{/* Header with Back Button */}
			<div className='flex items-center gap-4'>
				{onBack && (
					<Button variant='neutral' size='sm' onClick={onBack}>
						← Back to Markets
					</Button>
				)}
				<div>
					<h1 className='text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white'>
						Prediction Market Details
					</h1>
					<p className='text-slate-600 dark:text-slate-400'>
						Detailed view and trading interface
					</p>
				</div>
			</div>

			{/* Market Header Card */}
			<Card className='bg-white/95 dark:bg-slate-950/95 backdrop-blur-sm border-slate-200/60 dark:border-slate-800/60'>
				<CardHeader>
					<div className='flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4'>
						<div className='flex-1'>
							<div className='flex items-center gap-3 mb-2'>
								<Badge className={getStatusColor(market.status)}>
									{market.status}
								</Badge>
								<Badge variant='neutral'>📊 {market.category}</Badge>
								{market.aiConfidence && (
									<Badge className='bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'>
										🔮 {market.aiConfidence}% Confidence
									</Badge>
								)}
							</div>
							<CardTitle className='text-xl lg:text-2xl mb-2'>
								{market.title}
							</CardTitle>
							<p className='text-slate-600 dark:text-slate-400 mb-4'>
								{market.description}
							</p>
							<div className='flex flex-wrap gap-4 text-sm text-slate-500 dark:text-slate-400'>
								<span>👤 Created by {market.creator}</span>
								<span>
									📅 Created {market.createdDate.toLocaleDateString()}
								</span>
								<span>👥 {market.participants} participants</span>
								<span>⏰ Ends {formatTimeRemaining(market.endDate)}</span>
							</div>
						</div>

						{/* Price Display */}
						<div className='grid grid-cols-2 gap-3 min-w-[200px]'>
							<div className='p-4 bg-green-50 dark:bg-green-950/50 rounded-lg border border-green-200 dark:border-green-800 text-center'>
								<div className='text-xs text-green-600 dark:text-green-400 font-medium'>
									YES
								</div>
								<div className='text-2xl font-bold text-green-700 dark:text-green-300'>
									${market.yesPrice.toFixed(2)}
								</div>
								<div className='text-xs text-green-600 dark:text-green-400'>
									{((market.yesVolume / market.totalPool) * 100).toFixed(1)}%
								</div>
							</div>
							<div className='p-4 bg-red-50 dark:bg-red-950/50 rounded-lg border border-red-200 dark:border-red-800 text-center'>
								<div className='text-xs text-red-600 dark:text-red-400 font-medium'>
									NO
								</div>
								<div className='text-2xl font-bold text-red-700 dark:text-red-300'>
									${market.noPrice.toFixed(2)}
								</div>
								<div className='text-xs text-red-600 dark:text-red-400'>
									{((market.noVolume / market.totalPool) * 100).toFixed(1)}%
								</div>
							</div>
						</div>
					</div>
				</CardHeader>
			</Card>

			{/* Main Content - Tabs */}
			<Tabs defaultValue='trade' className='w-full'>
				<TabsList className='grid w-full grid-cols-4'>
					<TabsTrigger value='trade'>Trade</TabsTrigger>
					<TabsTrigger value='activity'>Activity</TabsTrigger>
					<TabsTrigger value='analysis'>Market Analysis</TabsTrigger>
					<TabsTrigger value='rules'>Rules</TabsTrigger>
				</TabsList>

				{/* Trading Tab */}
				<TabsContent value='trade' className='space-y-6'>
					<div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
						{/* Pool Stats */}
						<Card>
							<CardHeader>
								<CardTitle>Pool Statistics</CardTitle>
							</CardHeader>
							<CardContent className='space-y-4'>
								<div className='flex justify-between'>
									<span className='text-slate-600 dark:text-slate-400'>
										Total Pool
									</span>
									<span className='font-semibold'>
										${market.totalPool.toLocaleString()}
									</span>
								</div>
								<div className='flex justify-between'>
									<span className='text-slate-600 dark:text-slate-400'>
										YES Volume
									</span>
									<span className='font-semibold text-green-600'>
										${market.yesVolume.toLocaleString()}
									</span>
								</div>
								<div className='flex justify-between'>
									<span className='text-slate-600 dark:text-slate-400'>
										NO Volume
									</span>
									<span className='font-semibold text-red-600'>
										${market.noVolume.toLocaleString()}
									</span>
								</div>
								<div className='space-y-2'>
									<div className='flex justify-between text-sm'>
										<span>
											YES:{' '}
											{((market.yesVolume / market.totalPool) * 100).toFixed(1)}
											%
										</span>
										<span>
											NO:{' '}
											{((market.noVolume / market.totalPool) * 100).toFixed(1)}%
										</span>
									</div>
									<Progress
										value={(market.yesVolume / market.totalPool) * 100}
										className='h-3'
									/>
								</div>
							</CardContent>
						</Card>

						{/* Trading Interface */}
						<Card>
							<CardHeader>
								<CardTitle>Place Your Bet</CardTitle>
							</CardHeader>
							<CardContent className='space-y-4'>
								<div className='grid grid-cols-2 gap-3'>
									<Button
										variant={selectedSide === 'yes' ? 'default' : 'neutral'}
										className={`h-16 ${
											selectedSide === 'yes'
												? 'bg-green-600 hover:bg-green-700'
												: ''
										}`}
										onClick={() => setSelectedSide('yes')}
									>
										<div className='text-center'>
											<div className='font-bold'>YES</div>
											<div className='text-sm'>
												${market.yesPrice.toFixed(2)}
											</div>
										</div>
									</Button>
									<Button
										variant={selectedSide === 'no' ? 'default' : 'neutral'}
										className={`h-16 ${
											selectedSide === 'no' ? 'bg-red-600 hover:bg-red-700' : ''
										}`}
										onClick={() => setSelectedSide('no')}
									>
										<div className='text-center'>
											<div className='font-bold'>NO</div>
											<div className='text-sm'>
												${market.noPrice.toFixed(2)}
											</div>
										</div>
									</Button>
								</div>

								<div className='space-y-2'>
									<label className='text-sm font-medium'>Amount (USD)</label>
									<Input
										type='number'
										placeholder='Enter amount...'
										value={betAmount}
										onChange={(e) => setBetAmount(e.target.value)}
									/>
								</div>

								{selectedSide && betAmount && (
									<div className='p-3 bg-slate-50 dark:bg-slate-900 rounded-lg'>
										<div className='text-sm space-y-1'>
											<div className='flex justify-between'>
												<span>You&apos;re betting:</span>
												<span className='font-medium'>
													${betAmount} on {selectedSide.toUpperCase()}
												</span>
											</div>
											<div className='flex justify-between'>
												<span>Potential return:</span>
												<span className='font-medium text-green-600'>
													$
													{(
														parseFloat(betAmount) *
														(selectedSide === 'yes'
															? 1 / market.yesPrice
															: 1 / market.noPrice)
													).toFixed(2)}
												</span>
											</div>
										</div>
									</div>
								)}

								<Dialog open={isBetModalOpen} onOpenChange={setIsBetModalOpen}>
									<DialogTrigger asChild>
										<Button
											className='w-full'
											disabled={!selectedSide || !betAmount}
											onClick={() => setIsBetModalOpen(true)}
										>
											Place Bet
										</Button>
									</DialogTrigger>
									<DialogContent>
										<DialogHeader>
											<DialogTitle>Confirm Your Bet</DialogTitle>
										</DialogHeader>
										<div className='space-y-4'>
											<div className='p-4 bg-slate-50 dark:bg-slate-900 rounded-lg'>
												<div className='space-y-2'>
													<div className='flex justify-between'>
														<span>Market:</span>
														<span className='font-medium'>{market.title}</span>
													</div>
													<div className='flex justify-between'>
														<span>Side:</span>
														<span
															className={`font-medium ${
																selectedSide === 'yes'
																	? 'text-green-600'
																	: 'text-red-600'
															}`}
														>
															{selectedSide?.toUpperCase()}
														</span>
													</div>
													<div className='flex justify-between'>
														<span>Amount:</span>
														<span className='font-medium'>${betAmount}</span>
													</div>
													<div className='flex justify-between'>
														<span>Price:</span>
														<span className='font-medium'>
															$
															{selectedSide === 'yes'
																? market.yesPrice.toFixed(2)
																: market.noPrice.toFixed(2)}
														</span>
													</div>
												</div>
											</div>
											<Button onClick={handlePlaceBet} className='w-full'>
												Confirm Bet
											</Button>
										</div>
									</DialogContent>
								</Dialog>
							</CardContent>
						</Card>
					</div>
				</TabsContent>

				{/* Activity Tab */}
				<TabsContent value='activity' className='space-y-6'>
					<Card>
						<CardHeader>
							<CardTitle>Recent Activity</CardTitle>
						</CardHeader>
						<CardContent>
							<div className='space-y-3'>
								{trades.map((trade) => (
									<div
										key={trade.id}
										className='flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900 rounded-lg'
									>
										<div className='flex items-center gap-3'>
											<Avatar className='w-8 h-8'>
												<AvatarFallback className='text-xs'>
													{trade.user.slice(2, 6)}
												</AvatarFallback>
											</Avatar>
											<div>
												<div className='flex items-center gap-2'>
													<span className='font-medium'>{trade.user}</span>
													<Badge
														className={
															trade.type === 'yes'
																? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
																: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
														}
													>
														{trade.type.toUpperCase()}
													</Badge>
												</div>
												<div className='text-xs text-slate-500 dark:text-slate-400'>
													{trade.timestamp.toLocaleDateString()}{' '}
													{trade.timestamp.toLocaleTimeString()}
												</div>
											</div>
										</div>
										<div className='text-right'>
											<div className='font-medium'>${trade.amount}</div>
											<div className='text-xs text-slate-500 dark:text-slate-400'>
												@ ${trade.price.toFixed(2)}
											</div>
										</div>
									</div>
								))}
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				{/* Market Analysis Tab */}
				<TabsContent value='analysis' className='space-y-6'>
					<Card>
						<CardHeader>
							<CardTitle>🔮 Market Analysis</CardTitle>
						</CardHeader>
						<CardContent className='space-y-6'>
							<div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
								<div className='text-center p-4 bg-slate-50 dark:bg-slate-900 rounded-lg'>
									<div className='text-2xl font-bold'>
										{market.aiConfidence}%
									</div>
									<div className='text-sm text-slate-600 dark:text-slate-400'>
										AI Confidence
									</div>
								</div>
								<div className='text-center p-4 bg-slate-50 dark:bg-slate-900 rounded-lg'>
									<div
										className={`text-2xl font-bold capitalize ${getSentimentColor(
											market.aiAnalysis?.sentiment || 'neutral'
										)}`}
									>
										{market.aiAnalysis?.sentiment}
									</div>
									<div className='text-sm text-slate-600 dark:text-slate-400'>
										Market Sentiment
									</div>
								</div>
								<div className='text-center p-4 bg-slate-50 dark:bg-slate-900 rounded-lg'>
									<div
										className={`text-2xl font-bold capitalize ${getRiskColor(
											market.aiAnalysis?.riskLevel || 'medium'
										)}`}
									>
										{market.aiAnalysis?.riskLevel}
									</div>
									<div className='text-sm text-slate-600 dark:text-slate-400'>
										Risk Level
									</div>
								</div>
							</div>

							<div>
								<h4 className='font-semibold mb-3'>Key Factors</h4>
								<div className='space-y-2'>
									{market.aiAnalysis?.factors.map((factor, index) => (
										<div
											key={index}
											className='flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-900 rounded'
										>
											<span className='text-green-500'>✓</span>
											<span className='text-sm'>{factor}</span>
										</div>
									))}
								</div>
							</div>

							<Alert className='bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 border-purple-200 dark:border-purple-800'>
								<AlertDescription className='text-purple-700 dark:text-purple-300'>
									🔮 Market analysis is updated every 4 hours based on market
									sentiment, news, and technical indicators.
								</AlertDescription>
							</Alert>
						</CardContent>
					</Card>
				</TabsContent>

				{/* Rules Tab */}
				<TabsContent value='rules' className='space-y-6'>
					<Card>
						<CardHeader>
							<CardTitle>Market Rules & Resolution</CardTitle>
						</CardHeader>
						<CardContent className='space-y-4'>
							<div>
								<h4 className='font-semibold mb-3'>Resolution Criteria</h4>
								<div className='space-y-2'>
									{market.rules?.map((rule, index) => (
										<div
											key={index}
											className='flex items-start gap-2 p-3 bg-slate-50 dark:bg-slate-900 rounded-lg'
										>
											<span className='text-blue-500 mt-0.5'>{index + 1}.</span>
											<span className='text-sm'>{rule}</span>
										</div>
									))}
								</div>
							</div>

							<div className='p-4 bg-yellow-50 dark:bg-yellow-950/50 rounded-lg border border-yellow-200 dark:border-yellow-800'>
								<h4 className='font-semibold text-yellow-800 dark:text-yellow-200 mb-2'>
									Important Notes
								</h4>
								<ul className='text-sm text-yellow-700 dark:text-yellow-300 space-y-1'>
									<li>
										• Markets are resolved by trusted oracles and community
										consensus
									</li>
									<li>
										• Disputed resolutions go through a governance process
									</li>
									<li>
										• Winnings are automatically distributed upon resolution
									</li>
									<li>• Trading fees apply to all transactions</li>
								</ul>
							</div>
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	);
}
