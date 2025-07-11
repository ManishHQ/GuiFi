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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { TradingChart } from './trading-chart';

interface TokenLaunch {
	id: string;
	name: string;
	symbol: string;
	description: string;
	creator: string;
	logo?: string;
	totalSupply: number;
	currentPrice: number;
	marketCap: number;
	liquidityRaised: number;
	liquidityTarget: number;
	participantCount: number;
	launchDate: Date;
	status: 'upcoming' | 'live' | 'completed' | 'failed';
	category: string;
	website?: string;
	twitter?: string;
	telegram?: string;
	aiScore?: number;
	priceChange24h?: number;
	volume24h?: number;
	holders?: number;
	contractAddress?: string;
	aiAnalysis?: {
		sentiment: 'bullish' | 'bearish' | 'neutral';
		factors: string[];
		riskLevel: 'low' | 'medium' | 'high';
		technicalIndicators: {
			rsi: number;
			macd: 'bullish' | 'bearish';
			support: number;
			resistance: number;
		};
	};
}

interface Transaction {
	id: string;
	user: string;
	type: 'buy' | 'sell';
	amount: number;
	price: number;
	timestamp: Date;
	txHash?: string;
}

interface SingleTokenPageProps {
	tokenId?: string;
	onBack?: () => void;
}

// Mock detailed token data
const DETAILED_TOKEN: TokenLaunch = {
	id: '1',
	name: 'AI Prediction Token',
	symbol: 'AIPRED',
	description:
		'Revolutionary AI-powered prediction market token with real-time sentiment analysis and automated market making. Built on cutting-edge blockchain technology to enable decentralized predictions with machine learning insights.',
	creator: '0x1234...5678',
	logo: '/api/placeholder/96/96',
	totalSupply: 1000000000,
	currentPrice: 0.0045,
	marketCap: 4500000,
	liquidityRaised: 750000,
	liquidityTarget: 1000000,
	participantCount: 1247,
	launchDate: new Date('2025-01-15'),
	status: 'live',
	category: 'AI',
	website: 'https://aipred.io',
	twitter: '@aipredtoken',
	telegram: 'aipredcommunity',
	aiScore: 92,
	priceChange24h: 15.7,
	volume24h: 234567,
	holders: 1247,
	contractAddress: '0x742d35Cc6634C0532925a3b8D697D5f9E65A51f0',
	aiAnalysis: {
		sentiment: 'bullish',
		factors: [
			'Strong community growth (+45% this week)',
			'Partnership with major prediction platforms',
			'AI model accuracy improvements',
			'Increased trading volume and liquidity',
		],
		riskLevel: 'medium',
		technicalIndicators: {
			rsi: 67.3,
			macd: 'bullish',
			support: 0.0041,
			resistance: 0.0052,
		},
	},
};

const MOCK_TRANSACTIONS: Transaction[] = [
	{
		id: '1',
		user: '0x1234...5678',
		type: 'buy',
		amount: 10000,
		price: 0.0045,
		timestamp: new Date('2025-01-11T14:30:00'),
		txHash: '0xabc123...',
	},
	{
		id: '2',
		user: '0x9876...5432',
		type: 'sell',
		amount: 5000,
		price: 0.0044,
		timestamp: new Date('2025-01-11T14:25:00'),
		txHash: '0xdef456...',
	},
	{
		id: '3',
		user: '0x5555...9999',
		type: 'buy',
		amount: 25000,
		price: 0.0046,
		timestamp: new Date('2025-01-11T14:20:00'),
		txHash: '0x789ghi...',
	},
	{
		id: '4',
		user: '0x1111...2222',
		type: 'buy',
		amount: 15000,
		price: 0.0045,
		timestamp: new Date('2025-01-11T14:15:00'),
		txHash: '0x012jkl...',
	},
	{
		id: '5',
		user: '0x3333...4444',
		type: 'sell',
		amount: 8000,
		price: 0.0043,
		timestamp: new Date('2025-01-11T14:10:00'),
		txHash: '0x345mno...',
	},
];

export function SingleTokenPage({ onBack }: SingleTokenPageProps) {
	const [token] = useState<TokenLaunch>(DETAILED_TOKEN);
	const [transactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);
	const [buyAmount, setBuyAmount] = useState('');
	const [sellAmount, setSellAmount] = useState('');
	const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);
	const [isSellModalOpen, setIsSellModalOpen] = useState(false);

	const formatLargeNumber = (num: number) => {
		if (num >= 1000000000) return (num / 1000000000).toFixed(1) + 'B';
		if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
		if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
		return num.toString();
	};

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'live':
				return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
			case 'completed':
				return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
			case 'upcoming':
				return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
			case 'failed':
				return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
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

	const handleBuy = () => {
		if (!buyAmount) return;
		console.log(
			`Buying ${buyAmount} ${token.symbol} at $${token.currentPrice}`
		);
		setIsBuyModalOpen(false);
		setBuyAmount('');
	};

	const handleSell = () => {
		if (!sellAmount) return;
		console.log(
			`Selling ${sellAmount} ${token.symbol} at $${token.currentPrice}`
		);
		setIsSellModalOpen(false);
		setSellAmount('');
	};

	return (
		<div className='space-y-6'>
			{/* Header with Back Button */}
			<div className='flex items-center gap-4'>
				{onBack && (
					<Button variant='neutral' size='sm' onClick={onBack}>
						← Back to Launchpad
					</Button>
				)}
				<div>
					<h1 className='text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white'>
						Token Details
					</h1>
					<p className='text-slate-600 dark:text-slate-400'>
						Complete token information and trading interface
					</p>
				</div>
			</div>

			{/* Token Header Card */}
			<Card className='bg-white/95 dark:bg-slate-950/95 backdrop-blur-sm border-slate-200/60 dark:border-slate-800/60'>
				<CardHeader>
					<div className='flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6'>
						<div className='flex items-center gap-4'>
							<Avatar className='w-20 h-20'>
								<AvatarImage src={token.logo} />
								<AvatarFallback className='bg-gradient-to-br from-orange-500 to-red-500 text-white font-bold text-xl'>
									{token.symbol.slice(0, 2)}
								</AvatarFallback>
							</Avatar>
							<div>
								<div className='flex items-center gap-3 mb-2'>
									<CardTitle className='text-2xl lg:text-3xl'>
										{token.name}
									</CardTitle>
									<Badge className={getStatusColor(token.status)}>
										{token.status}
									</Badge>
								</div>
								<div className='flex items-center gap-3 mb-2'>
									<span className='text-lg font-mono text-slate-600 dark:text-slate-400'>
										${token.symbol}
									</span>
									<Badge variant='neutral'>📊 {token.category}</Badge>
									{token.aiScore && (
										<Badge className='bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'>
											🤖 AI Score: {token.aiScore}/100
										</Badge>
									)}
								</div>
								<p className='text-slate-600 dark:text-slate-400 max-w-2xl'>
									{token.description}
								</p>
							</div>
						</div>

						{/* Price and Quick Stats */}
						<div className='grid grid-cols-2 lg:grid-cols-1 gap-4 lg:text-right'>
							<div>
								<div className='text-3xl font-bold'>
									${token.currentPrice.toFixed(4)}
								</div>
								<div
									className={`text-lg font-medium ${
										token.priceChange24h && token.priceChange24h > 0
											? 'text-green-600 dark:text-green-400'
											: 'text-red-600 dark:text-red-400'
									}`}
								>
									{token.priceChange24h && token.priceChange24h > 0 ? '+' : ''}
									{token.priceChange24h?.toFixed(2)}% (24h)
								</div>
							</div>
							<div className='space-y-1 text-sm'>
								<div className='flex lg:justify-end justify-between'>
									<span className='text-slate-600 dark:text-slate-400'>
										Market Cap:
									</span>
									<span className='font-semibold'>
										${formatLargeNumber(token.marketCap)}
									</span>
								</div>
								<div className='flex lg:justify-end justify-between'>
									<span className='text-slate-600 dark:text-slate-400'>
										24h Volume:
									</span>
									<span className='font-semibold'>
										${formatLargeNumber(token.volume24h || 0)}
									</span>
								</div>
								<div className='flex lg:justify-end justify-between'>
									<span className='text-slate-600 dark:text-slate-400'>
										Holders:
									</span>
									<span className='font-semibold'>
										{token.holders?.toLocaleString()}
									</span>
								</div>
							</div>
						</div>
					</div>
				</CardHeader>
			</Card>

			{/* Main Content - Chart and Trading */}
			<div className='grid grid-cols-1 xl:grid-cols-4 gap-6'>
				{/* Chart Section */}
				<div className='xl:col-span-3'>
					<Card className='bg-white/95 dark:bg-slate-950/95 backdrop-blur-sm border-slate-200/60 dark:border-slate-800/60'>
						<CardHeader>
							<CardTitle className='flex items-center gap-2'>
								📈 {token.symbol} Price Chart
								<span className='text-sm font-normal text-slate-600 dark:text-slate-400'>
									TradingView Style
								</span>
							</CardTitle>
						</CardHeader>
						<CardContent>
							<TradingChart symbol={token.symbol} />
						</CardContent>
					</Card>
				</div>

				{/* Trading Panel */}
				<div className='xl:col-span-1 space-y-4'>
					{/* Quick Trading */}
					<Card>
						<CardHeader>
							<CardTitle className='text-lg'>Quick Trade</CardTitle>
						</CardHeader>
						<CardContent className='space-y-4'>
							<div className='grid grid-cols-2 gap-2'>
								<Dialog open={isBuyModalOpen} onOpenChange={setIsBuyModalOpen}>
									<DialogTrigger asChild>
										<Button className='bg-green-600 hover:bg-green-700'>
											Buy
										</Button>
									</DialogTrigger>
									<DialogContent>
										<DialogHeader>
											<DialogTitle>Buy {token.symbol}</DialogTitle>
										</DialogHeader>
										<div className='space-y-4'>
											<div>
												<label className='text-sm font-medium'>Amount</label>
												<Input
													type='number'
													placeholder='Enter amount...'
													value={buyAmount}
													onChange={(e) => setBuyAmount(e.target.value)}
												/>
											</div>
											<div className='p-3 bg-slate-50 dark:bg-slate-900 rounded-lg'>
												<div className='flex justify-between text-sm'>
													<span>Price:</span>
													<span>${token.currentPrice.toFixed(4)}</span>
												</div>
												{buyAmount && (
													<div className='flex justify-between text-sm'>
														<span>Total:</span>
														<span>
															$
															{(
																parseFloat(buyAmount) * token.currentPrice
															).toFixed(2)}
														</span>
													</div>
												)}
											</div>
											<Button
												onClick={handleBuy}
												className='w-full bg-green-600 hover:bg-green-700'
											>
												Confirm Buy
											</Button>
										</div>
									</DialogContent>
								</Dialog>

								<Dialog
									open={isSellModalOpen}
									onOpenChange={setIsSellModalOpen}
								>
									<DialogTrigger asChild>
										<Button
											variant='neutral'
											className='border-red-200 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-950'
										>
											Sell
										</Button>
									</DialogTrigger>
									<DialogContent>
										<DialogHeader>
											<DialogTitle>Sell {token.symbol}</DialogTitle>
										</DialogHeader>
										<div className='space-y-4'>
											<div>
												<label className='text-sm font-medium'>Amount</label>
												<Input
													type='number'
													placeholder='Enter amount...'
													value={sellAmount}
													onChange={(e) => setSellAmount(e.target.value)}
												/>
											</div>
											<div className='p-3 bg-slate-50 dark:bg-slate-900 rounded-lg'>
												<div className='flex justify-between text-sm'>
													<span>Price:</span>
													<span>${token.currentPrice.toFixed(4)}</span>
												</div>
												{sellAmount && (
													<div className='flex justify-between text-sm'>
														<span>Total:</span>
														<span>
															$
															{(
																parseFloat(sellAmount) * token.currentPrice
															).toFixed(2)}
														</span>
													</div>
												)}
											</div>
											<Button
												onClick={handleSell}
												className='w-full bg-red-600 hover:bg-red-700'
											>
												Confirm Sell
											</Button>
										</div>
									</DialogContent>
								</Dialog>
							</div>

							<div className='text-xs text-slate-600 dark:text-slate-400 text-center'>
								Current price: ${token.currentPrice.toFixed(4)}
							</div>
						</CardContent>
					</Card>

					{/* Token Stats */}
					<Card>
						<CardHeader>
							<CardTitle className='text-lg'>Token Stats</CardTitle>
						</CardHeader>
						<CardContent className='space-y-3'>
							<div className='flex justify-between text-sm'>
								<span className='text-slate-600 dark:text-slate-400'>
									Total Supply
								</span>
								<span className='font-semibold'>
									{formatLargeNumber(token.totalSupply)}
								</span>
							</div>
							<div className='flex justify-between text-sm'>
								<span className='text-slate-600 dark:text-slate-400'>
									Circulating
								</span>
								<span className='font-semibold'>
									{formatLargeNumber(token.totalSupply * 0.7)}
								</span>
							</div>
							<div className='flex justify-between text-sm'>
								<span className='text-slate-600 dark:text-slate-400'>
									Contract
								</span>
								<span className='font-mono text-xs'>
									{token.contractAddress?.slice(0, 10)}...
								</span>
							</div>
							<div className='flex justify-between text-sm'>
								<span className='text-slate-600 dark:text-slate-400'>
									Launch Date
								</span>
								<span className='font-semibold'>
									{token.launchDate.toLocaleDateString()}
								</span>
							</div>
						</CardContent>
					</Card>

					{/* Liquidity Progress (if applicable) */}
					{token.status === 'live' && (
						<Card>
							<CardHeader>
								<CardTitle className='text-lg'>Liquidity Progress</CardTitle>
							</CardHeader>
							<CardContent className='space-y-3'>
								<div className='flex justify-between text-sm'>
									<span className='text-slate-600 dark:text-slate-400'>
										Raised
									</span>
									<span className='font-semibold'>
										${token.liquidityRaised.toLocaleString()} / $
										{token.liquidityTarget.toLocaleString()}
									</span>
								</div>
								<Progress
									value={(token.liquidityRaised / token.liquidityTarget) * 100}
									className='h-2'
								/>
								<div className='text-xs text-slate-500 dark:text-slate-400 text-center'>
									{(
										(token.liquidityRaised / token.liquidityTarget) *
										100
									).toFixed(1)}
									% completed
								</div>
							</CardContent>
						</Card>
					)}
				</div>
			</div>

			{/* Detailed Information Tabs */}
			<Tabs defaultValue='transactions' className='w-full'>
				<TabsList className='grid w-full grid-cols-4'>
					<TabsTrigger value='transactions'>Transactions</TabsTrigger>
					<TabsTrigger value='analysis'>AI Analysis</TabsTrigger>
					<TabsTrigger value='tokenomics'>Tokenomics</TabsTrigger>
					<TabsTrigger value='community'>Community</TabsTrigger>
				</TabsList>

				{/* Transactions Tab */}
				<TabsContent value='transactions' className='space-y-4'>
					<Card>
						<CardHeader>
							<CardTitle>Recent Transactions</CardTitle>
						</CardHeader>
						<CardContent>
							<div className='space-y-3'>
								{transactions.map((tx) => (
									<div
										key={tx.id}
										className='flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900 rounded-lg'
									>
										<div className='flex items-center gap-3'>
											<Badge
												className={
													tx.type === 'buy'
														? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
														: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
												}
											>
												{tx.type.toUpperCase()}
											</Badge>
											<div>
												<div className='font-medium'>{tx.user}</div>
												<div className='text-xs text-slate-500 dark:text-slate-400'>
													{tx.timestamp.toLocaleString()}
												</div>
											</div>
										</div>
										<div className='text-right'>
											<div className='font-medium'>
												{formatLargeNumber(tx.amount)} {token.symbol}
											</div>
											<div className='text-xs text-slate-500 dark:text-slate-400'>
												@ ${tx.price.toFixed(4)}
											</div>
										</div>
									</div>
								))}
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				{/* AI Analysis Tab */}
				<TabsContent value='analysis' className='space-y-4'>
					<Card>
						<CardHeader>
							<CardTitle>🤖 AI Token Analysis</CardTitle>
						</CardHeader>
						<CardContent className='space-y-6'>
							<div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
								<div className='text-center p-4 bg-slate-50 dark:bg-slate-900 rounded-lg'>
									<div className='text-2xl font-bold'>{token.aiScore}%</div>
									<div className='text-sm text-slate-600 dark:text-slate-400'>
										AI Score
									</div>
								</div>
								<div className='text-center p-4 bg-slate-50 dark:bg-slate-900 rounded-lg'>
									<div
										className={`text-2xl font-bold capitalize ${getSentimentColor(
											token.aiAnalysis?.sentiment || 'neutral'
										)}`}
									>
										{token.aiAnalysis?.sentiment}
									</div>
									<div className='text-sm text-slate-600 dark:text-slate-400'>
										Sentiment
									</div>
								</div>
								<div className='text-center p-4 bg-slate-50 dark:bg-slate-900 rounded-lg'>
									<div
										className={`text-2xl font-bold capitalize ${getRiskColor(
											token.aiAnalysis?.riskLevel || 'medium'
										)}`}
									>
										{token.aiAnalysis?.riskLevel}
									</div>
									<div className='text-sm text-slate-600 dark:text-slate-400'>
										Risk Level
									</div>
								</div>
								<div className='text-center p-4 bg-slate-50 dark:bg-slate-900 rounded-lg'>
									<div className='text-2xl font-bold'>
										{token.aiAnalysis?.technicalIndicators.rsi.toFixed(1)}
									</div>
									<div className='text-sm text-slate-600 dark:text-slate-400'>
										RSI
									</div>
								</div>
							</div>

							<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
								<div>
									<h4 className='font-semibold mb-3'>Key Factors</h4>
									<div className='space-y-2'>
										{token.aiAnalysis?.factors.map((factor, index) => (
											<div
												key={index}
												className='flex items-start gap-2 p-2 bg-slate-50 dark:bg-slate-900 rounded'
											>
												<span className='text-green-500 mt-0.5'>✓</span>
												<span className='text-sm'>{factor}</span>
											</div>
										))}
									</div>
								</div>

								<div>
									<h4 className='font-semibold mb-3'>Technical Indicators</h4>
									<div className='space-y-3'>
										<div className='flex justify-between items-center p-2 bg-slate-50 dark:bg-slate-900 rounded'>
											<span className='text-sm'>MACD Signal</span>
											<Badge
												className={
													token.aiAnalysis?.technicalIndicators.macd ===
													'bullish'
														? 'bg-green-100 text-green-800'
														: 'bg-red-100 text-red-800'
												}
											>
												{token.aiAnalysis?.technicalIndicators.macd}
											</Badge>
										</div>
										<div className='flex justify-between items-center p-2 bg-slate-50 dark:bg-slate-900 rounded'>
											<span className='text-sm'>Support Level</span>
											<span className='font-semibold'>
												$
												{token.aiAnalysis?.technicalIndicators.support.toFixed(
													4
												)}
											</span>
										</div>
										<div className='flex justify-between items-center p-2 bg-slate-50 dark:bg-slate-900 rounded'>
											<span className='text-sm'>Resistance Level</span>
											<span className='font-semibold'>
												$
												{token.aiAnalysis?.technicalIndicators.resistance.toFixed(
													4
												)}
											</span>
										</div>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				{/* Tokenomics Tab */}
				<TabsContent value='tokenomics' className='space-y-4'>
					<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
						<Card>
							<CardHeader>
								<CardTitle>Token Distribution</CardTitle>
							</CardHeader>
							<CardContent className='space-y-4'>
								<div className='space-y-3'>
									<div className='flex justify-between items-center'>
										<span className='text-sm'>Public Sale</span>
										<span className='font-semibold'>60%</span>
									</div>
									<Progress value={60} className='h-2' />

									<div className='flex justify-between items-center'>
										<span className='text-sm'>Team & Advisors</span>
										<span className='font-semibold'>20%</span>
									</div>
									<Progress value={20} className='h-2' />

									<div className='flex justify-between items-center'>
										<span className='text-sm'>Development</span>
										<span className='font-semibold'>15%</span>
									</div>
									<Progress value={15} className='h-2' />

									<div className='flex justify-between items-center'>
										<span className='text-sm'>Marketing</span>
										<span className='font-semibold'>5%</span>
									</div>
									<Progress value={5} className='h-2' />
								</div>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle>Token Metrics</CardTitle>
							</CardHeader>
							<CardContent className='space-y-4'>
								<div className='grid grid-cols-2 gap-4'>
									<div className='text-center p-3 bg-slate-50 dark:bg-slate-900 rounded-lg'>
										<div className='text-lg font-bold'>
											{formatLargeNumber(token.totalSupply)}
										</div>
										<div className='text-xs text-slate-600 dark:text-slate-400'>
											Total Supply
										</div>
									</div>
									<div className='text-center p-3 bg-slate-50 dark:bg-slate-900 rounded-lg'>
										<div className='text-lg font-bold'>
											{formatLargeNumber(token.totalSupply * 0.7)}
										</div>
										<div className='text-xs text-slate-600 dark:text-slate-400'>
											Circulating
										</div>
									</div>
									<div className='text-center p-3 bg-slate-50 dark:bg-slate-900 rounded-lg'>
										<div className='text-lg font-bold'>2%</div>
										<div className='text-xs text-slate-600 dark:text-slate-400'>
											Max Inflation
										</div>
									</div>
									<div className='text-center p-3 bg-slate-50 dark:bg-slate-900 rounded-lg'>
										<div className='text-lg font-bold'>24 mo</div>
										<div className='text-xs text-slate-600 dark:text-slate-400'>
											Vesting
										</div>
									</div>
								</div>
							</CardContent>
						</Card>
					</div>
				</TabsContent>

				{/* Community Tab */}
				<TabsContent value='community' className='space-y-4'>
					<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
						<Card>
							<CardHeader>
								<CardTitle>Social Links</CardTitle>
							</CardHeader>
							<CardContent className='space-y-3'>
								{token.website && (
									<Button
										variant='neutral'
										className='w-full justify-start'
										asChild
									>
										<a
											href={token.website}
											target='_blank'
											rel='noopener noreferrer'
										>
											🌐 Website
										</a>
									</Button>
								)}
								{token.twitter && (
									<Button
										variant='neutral'
										className='w-full justify-start'
										asChild
									>
										<a
											href={`https://twitter.com/${token.twitter}`}
											target='_blank'
											rel='noopener noreferrer'
										>
											🐦 Twitter {token.twitter}
										</a>
									</Button>
								)}
								{token.telegram && (
									<Button
										variant='neutral'
										className='w-full justify-start'
										asChild
									>
										<a
											href={`https://t.me/${token.telegram}`}
											target='_blank'
											rel='noopener noreferrer'
										>
											📱 Telegram @{token.telegram}
										</a>
									</Button>
								)}
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle>Community Stats</CardTitle>
							</CardHeader>
							<CardContent className='space-y-4'>
								<div className='flex justify-between items-center'>
									<span className='text-slate-600 dark:text-slate-400'>
										Total Holders
									</span>
									<span className='font-semibold'>
										{token.holders?.toLocaleString()}
									</span>
								</div>
								<div className='flex justify-between items-center'>
									<span className='text-slate-600 dark:text-slate-400'>
										Active Traders (24h)
									</span>
									<span className='font-semibold'>247</span>
								</div>
								<div className='flex justify-between items-center'>
									<span className='text-slate-600 dark:text-slate-400'>
										Community Score
									</span>
									<span className='font-semibold text-green-600'>8.5/10</span>
								</div>
								<div className='flex justify-between items-center'>
									<span className='text-slate-600 dark:text-slate-400'>
										Developer Activity
									</span>
									<Badge className='bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'>
										High
									</Badge>
								</div>
							</CardContent>
						</Card>
					</div>
				</TabsContent>
			</Tabs>
		</div>
	);
}
