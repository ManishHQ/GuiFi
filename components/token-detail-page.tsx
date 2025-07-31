'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
	ArrowLeft,
	TrendingUp,
	Users,
	DollarSign,
	Activity,
} from 'lucide-react';
import { useTokenLaunch } from '@/hooks/use-token-launchpad';
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
	Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
	Filler
);

interface TokenDetailPageProps {
	tokenAddress: string;
	onBack: () => void;
}

// Mock price data for the chart
const generatePriceData = (days: number = 30) => {
	const data = [];
	let price = 0.001; // Starting price
	const now = Date.now();

	for (let i = days; i >= 0; i--) {
		const date = new Date(now - i * 24 * 60 * 60 * 1000);
		// Simulate price movement with some randomness
		const change = (Math.random() - 0.5) * 0.0002;
		price = Math.max(0.0001, price + change);

		data.push({
			time: date.getTime() / 1000,
			open: price,
			high: price + Math.random() * 0.0001,
			low: price - Math.random() * 0.0001,
			close: price + (Math.random() - 0.5) * 0.0001,
			volume: Math.random() * 1000000,
		});
	}

	return data;
};

// Real TradingView-like chart component using Chart.js
const CandlestickChart = ({
	data,
}: {
	data: Array<{
		time: number;
		open: number;
		high: number;
		low: number;
		close: number;
		volume: number;
	}>;
}) => {
	const [selectedTimeframe, setSelectedTimeframe] = useState('1D');
	const [latestPrice, setLatestPrice] = useState(0);

	const timeframes = ['1H', '4H', '1D', '1W', '1M'];

	// Filter data based on timeframe
	const getFilteredData = () => {
		let filteredData = [...data];

		switch (selectedTimeframe) {
			case '1H':
				filteredData = data.slice(-24); // Last 24 hours
				break;
			case '4H':
				filteredData = data.slice(-168); // Last week
				break;
			case '1D':
				filteredData = data.slice(-30); // Last 30 days
				break;
			case '1W':
				filteredData = data.slice(-210); // Last 30 weeks
				break;
			case '1M':
				filteredData = data; // All data
				break;
		}

		return filteredData;
	};

	const filteredData = getFilteredData();

	// Update latest price when data changes
	useEffect(() => {
		if (filteredData.length > 0) {
			setLatestPrice(filteredData[filteredData.length - 1].close);
		}
	}, [filteredData]);

	// Prepare chart data
	const chartData = {
		labels: filteredData.map((_, index) => {
			const date = new Date(filteredData[index].time * 1000);
			return date.toLocaleDateString();
		}),
		datasets: [
			{
				label: 'Price',
				data: filteredData.map((item) => item.close),
				borderColor: '#10b981',
				backgroundColor: 'rgba(16, 185, 129, 0.1)',
				borderWidth: 2,
				fill: true,
				tension: 0.4,
				pointRadius: 0,
				pointHoverRadius: 6,
				pointHoverBackgroundColor: '#10b981',
				pointHoverBorderColor: '#ffffff',
				pointHoverBorderWidth: 2,
			},
		],
	};

	const options = {
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			legend: {
				display: false,
			},
			tooltip: {
				mode: 'index' as const,
				intersect: false,
				backgroundColor: 'rgba(0, 0, 0, 0.8)',
				titleColor: '#ffffff',
				bodyColor: '#ffffff',
				borderColor: '#334155',
				borderWidth: 1,
				cornerRadius: 8,
				displayColors: false,
				callbacks: {
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					title: (context: any[]) => {
						return `Price: ${context[0].parsed.y.toFixed(6)} ETH`;
					},
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					label: (context: any) => {
						const index = context.dataIndex;
						const item = filteredData[index];
						return [
							`Open: ${item.open.toFixed(6)} ETH`,
							`High: ${item.high.toFixed(6)} ETH`,
							`Low: ${item.low.toFixed(6)} ETH`,
							`Close: ${item.close.toFixed(6)} ETH`,
						];
					},
				},
			},
		},
		scales: {
			x: {
				display: true,
				grid: {
					color: 'rgba(51, 65, 85, 0.2)',
				},
				ticks: {
					color: '#64748b',
					maxTicksLimit: 8,
				},
			},
			y: {
				display: true,
				grid: {
					color: 'rgba(51, 65, 85, 0.2)',
				},
				ticks: {
					color: '#64748b',
					callback: function (tickValue: string | number) {
						return `${Number(tickValue).toFixed(6)} ETH`;
					},
				},
			},
		},
		interaction: {
			mode: 'index' as const,
			intersect: false,
		},
		hover: {
			mode: 'index' as const,
			intersect: false,
		},
	};

	return (
		<Card className='w-full'>
			<CardHeader>
				<div className='flex items-center justify-between'>
					<CardTitle>Price Chart</CardTitle>
					<div className='flex gap-1'>
						{timeframes.map((tf) => (
							<Button
								key={tf}
								variant={selectedTimeframe === tf ? 'default' : 'neutral'}
								size='sm'
								onClick={() => setSelectedTimeframe(tf)}
								className='text-xs px-2 py-1'
							>
								{tf}
							</Button>
						))}
					</div>
				</div>
			</CardHeader>
			<CardContent>
				<div className='relative'>
					<div className='h-96 w-full'>
						<Line data={chartData} options={options} />
					</div>
					{/* Price overlay */}
					<div className='absolute top-4 right-4 bg-slate-900/80 backdrop-blur-sm rounded-lg p-2 text-white'>
						<div className='text-sm text-slate-300'>Latest Price</div>
						<div className='text-lg font-bold'>
							{latestPrice.toFixed(6)} ETH
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
};

export function TokenDetailPage({
	tokenAddress,
	onBack,
}: TokenDetailPageProps) {
	const { launch, isLoading, error } = useTokenLaunch(tokenAddress);
	const [priceData] = useState(() => generatePriceData(30));
	const [buyAmount, setBuyAmount] = useState('');
	const [isBuying, setIsBuying] = useState(false);

	useEffect(() => {
		if (launch) {
			// Update price data when token changes
			// In a real app, this would fetch live price data
		}
	}, [launch]);

	if (isLoading) {
		return (
			<div className='space-y-4'>
				<div className='h-8 bg-slate-200 dark:bg-slate-700 rounded animate-pulse'></div>
				<div className='grid grid-cols-1 lg:grid-cols-3 gap-4'>
					<div className='lg:col-span-2'>
						<Card className='animate-pulse'>
							<CardHeader>
								<div className='h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/3'></div>
							</CardHeader>
							<CardContent>
								<div className='h-64 bg-slate-200 dark:bg-slate-700 rounded'></div>
							</CardContent>
						</Card>
					</div>
					<div>
						<Card className='animate-pulse'>
							<CardHeader>
								<div className='h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2'></div>
							</CardHeader>
							<CardContent>
								<div className='space-y-2'>
									<div className='h-3 bg-slate-200 dark:bg-slate-700 rounded'></div>
									<div className='h-3 bg-slate-200 dark:bg-slate-700 rounded w-2/3'></div>
									<div className='h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2'></div>
								</div>
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		);
	}

	if (error || !launch) {
		return (
			<Card className='text-center py-12'>
				<div className='text-4xl mb-4'>❌</div>
				<h3 className='text-lg font-semibold mb-2'>Token not found</h3>
				<p className='text-slate-600 dark:text-slate-400 mb-4'>
					The token you&apos;re looking for doesn&apos;t exist.
				</p>
				<Button onClick={onBack}>Go Back</Button>
			</Card>
		);
	}

	const handleBuy = async () => {
		if (!buyAmount || parseFloat(buyAmount) <= 0) return;

		setIsBuying(true);
		try {
			// Simulate buying tokens
			await new Promise((resolve) => setTimeout(resolve, 2000));
			// In a real app, this would call the buyTokens function
			setBuyAmount('');
		} catch (error) {
			console.error('Error buying tokens:', error);
		} finally {
			setIsBuying(false);
		}
	};

	const currentPrice = parseFloat(launch.tokenPrice);
	const marketCap = parseFloat(launch.marketCap);
	const volume24h = Math.random() * 1000000; // Mock volume
	const priceChange24h = (Math.random() - 0.5) * 20; // Mock price change

	return (
		<div className='space-y-6'>
			{/* Header */}
			<div className='flex items-center gap-4'>
				<Button variant='neutral' onClick={onBack} size='sm'>
					<ArrowLeft className='w-4 h-4 mr-2' />
					Back
				</Button>
				<div>
					<h1 className='text-3xl font-bold text-slate-900 dark:text-white'>
						{launch.name} ({launch.symbol})
					</h1>
					<p className='text-slate-600 dark:text-slate-400'>
						{launch.description}
					</p>
				</div>
			</div>

			{/* Demo Notice */}
			<Alert>
				<AlertDescription>
					This is a demo version. All trading is simulated for demonstration
					purposes.
				</AlertDescription>
			</Alert>

			{/* Price Overview */}
			<div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
				<Card>
					<CardContent className='p-4'>
						<div className='flex items-center gap-2 mb-2'>
							<DollarSign className='w-4 h-4 text-slate-500' />
							<span className='text-sm text-slate-600 dark:text-slate-400'>
								Price
							</span>
						</div>
						<div className='text-2xl font-bold'>
							{currentPrice.toFixed(6)} GUI
						</div>
						<div
							className={`text-sm ${
								priceChange24h >= 0 ? 'text-green-600' : 'text-red-600'
							}`}
						>
							{priceChange24h >= 0 ? '+' : ''}
							{priceChange24h.toFixed(2)}% (24h)
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className='p-4'>
						<div className='flex items-center gap-2 mb-2'>
							<TrendingUp className='w-4 h-4 text-slate-500' />
							<span className='text-sm text-slate-600 dark:text-slate-400'>
								Market Cap
							</span>
						</div>
						<div className='text-2xl font-bold'>
							${marketCap.toLocaleString()}
						</div>
						<div className='text-sm text-slate-500'>USD</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className='p-4'>
						<div className='flex items-center gap-2 mb-2'>
							<Activity className='w-4 h-4 text-slate-500' />
							<span className='text-sm text-slate-600 dark:text-slate-400'>
								Volume (24h)
							</span>
						</div>
						<div className='text-2xl font-bold'>
							${volume24h.toLocaleString()}
						</div>
						<div className='text-sm text-slate-500'>USD</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className='p-4'>
						<div className='flex items-center gap-2 mb-2'>
							<Users className='w-4 h-4 text-slate-500' />
							<span className='text-sm text-slate-600 dark:text-slate-400'>
								Holders
							</span>
						</div>
						<div className='text-2xl font-bold'>{launch.contributorCount}</div>
						<div className='text-sm text-slate-500'>Addresses</div>
					</CardContent>
				</Card>
			</div>

			{/* Main Content */}
			<div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
				{/* Chart */}
				<div className='lg:col-span-2'>
					<CandlestickChart data={priceData} />
				</div>

				{/* Trading Panel */}
				<div className='space-y-4'>
					<Card>
						<CardHeader>
							<CardTitle>Trade {launch.symbol}</CardTitle>
						</CardHeader>
						<CardContent className='space-y-4'>
							<div>
								<label className='text-sm font-medium text-slate-700 dark:text-slate-300'>
									Amount (GUI)
								</label>
								<input
									type='number'
									value={buyAmount}
									onChange={(e) => setBuyAmount(e.target.value)}
									placeholder='0.0'
									className='w-full mt-1 p-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white'
								/>
								{buyAmount && (
									<div className='text-sm text-slate-500 mt-1'>
										You&apos;ll receive:{' '}
										{(parseFloat(buyAmount) / currentPrice).toFixed(2)}{' '}
										{launch.symbol}
									</div>
								)}
							</div>
							<Button
								onClick={handleBuy}
								disabled={!buyAmount || isBuying}
								className='w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700'
							>
								{isBuying ? 'Buying...' : `Buy ${launch.symbol}`}
							</Button>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Token Info</CardTitle>
						</CardHeader>
						<CardContent className='space-y-3'>
							<div className='flex justify-between'>
								<span className='text-sm text-slate-600 dark:text-slate-400'>
									Contract
								</span>
								<span className='text-sm font-mono'>
									{launch.address.slice(0, 6)}...{launch.address.slice(-4)}
								</span>
							</div>
							<div className='flex justify-between'>
								<span className='text-sm text-slate-600 dark:text-slate-400'>
									Total Supply
								</span>
								<span className='text-sm'>
									{parseInt(launch.totalSupply).toLocaleString()}
								</span>
							</div>
							<div className='flex justify-between'>
								<span className='text-sm text-slate-600 dark:text-slate-400'>
									Circulating
								</span>
								<span className='text-sm'>
									{parseInt(launch.totalSupply).toLocaleString()}
								</span>
							</div>
							<div className='flex justify-between'>
								<span className='text-sm text-slate-600 dark:text-slate-400'>
									Status
								</span>
								<Badge
									className={
										launch.isLive
											? 'bg-green-100 text-green-800'
											: 'bg-blue-100 text-blue-800'
									}
								>
									{launch.isLive ? 'Live' : 'Completed'}
								</Badge>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>

			{/* Token Details Tabs */}
			<Tabs defaultValue='overview' className='w-full'>
				<TabsList className='grid w-full grid-cols-3'>
					<TabsTrigger value='overview'>Overview</TabsTrigger>
					<TabsTrigger value='trading'>Trading</TabsTrigger>
					<TabsTrigger value='community'>Community</TabsTrigger>
				</TabsList>

				<TabsContent value='overview' className='space-y-4'>
					<Card>
						<CardHeader>
							<CardTitle>About {launch.name}</CardTitle>
						</CardHeader>
						<CardContent>
							<p className='text-slate-600 dark:text-slate-400'>
								{launch.description}
							</p>
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value='trading' className='space-y-4'>
					<Card>
						<CardHeader>
							<CardTitle>Trading Statistics</CardTitle>
						</CardHeader>
						<CardContent className='space-y-4'>
							<div className='grid grid-cols-2 gap-4'>
								<div>
									<div className='text-sm text-slate-600 dark:text-slate-400'>
										24h High
									</div>
									<div className='text-lg font-semibold'>
										{(currentPrice * 1.1).toFixed(6)} GUI
									</div>
								</div>
								<div>
									<div className='text-sm text-slate-600 dark:text-slate-400'>
										24h Low
									</div>
									<div className='text-lg font-semibold'>
										{(currentPrice * 0.9).toFixed(6)} GUI
									</div>
								</div>
								<div>
									<div className='text-sm text-slate-600 dark:text-slate-400'>
										All Time High
									</div>
									<div className='text-lg font-semibold'>
										{(currentPrice * 1.5).toFixed(6)} GUI
									</div>
								</div>
								<div>
									<div className='text-sm text-slate-600 dark:text-slate-400'>
										All Time Low
									</div>
									<div className='text-lg font-semibold'>
										{(currentPrice * 0.5).toFixed(6)} GUI
									</div>
								</div>
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value='community' className='space-y-4'>
					<Card>
						<CardHeader>
							<CardTitle>Community</CardTitle>
						</CardHeader>
						<CardContent className='space-y-4'>
							<div className='flex items-center justify-between'>
								<span className='text-sm text-slate-600 dark:text-slate-400'>
									Total Holders
								</span>
								<span className='font-semibold'>{launch.contributorCount}</span>
							</div>
							<div className='flex items-center justify-between'>
								<span className='text-sm text-slate-600 dark:text-slate-400'>
									Active Traders
								</span>
								<span className='font-semibold'>
									{Math.floor(launch.contributorCount * 0.3)}
								</span>
							</div>
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	);
}
