'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import { useAccount } from 'wagmi';
import { useTokenLaunchpadFactory } from '@/hooks/use-token-launchpad';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

// Mock portfolio data
const MOCK_PORTFOLIO = {
	tokens: [
		{
			symbol: 'DOGEMOON',
			name: 'DogeMoon',
			balance: '1250000',
			value: '1250.00',
			price: '0.001',
			change24h: 15.2,
			address: '0x1234567890123456789012345678901234567890',
		},
		{
			symbol: 'PEPE',
			name: 'PepeCoin',
			balance: '50000',
			value: '100.00',
			price: '0.002',
			change24h: -5.8,
			address: '0x2345678901234567890123456789012345678901',
		},
		{
			symbol: 'SHIB2',
			name: 'ShibaInu2',
			balance: '200000',
			value: '100.00',
			price: '0.0005',
			change24h: 8.3,
			address: '0x3456789012345678901234567890123456789012',
		},
		{
			symbol: 'CAT',
			name: 'CatCoin',
			balance: '8333',
			value: '25.00',
			price: '0.003',
			change24h: 22.1,
			address: '0x4567890123456789012345678901234567890123',
		},
		{
			symbol: 'BANANA',
			name: 'BananaToken',
			balance: '16667',
			value: '25.00',
			price: '0.0015',
			change24h: -2.4,
			address: '0x5678901234567890123456789012345678901234',
		},
	],
	predictions: [
		{
			title: 'Will Bitcoin reach $100k by end of 2024?',
			address: '0x1234567890123456789012345678901234567890',
			yesBets: '0.5',
			noBets: '0',
			totalBets: '0.5',
			endTime: Date.now() + 30 * 24 * 60 * 60 * 1000,
			resolved: false,
		},
		{
			title: 'Will Tesla stock reach $300 by Q2 2024?',
			address: '0x3456789012345678901234567890123456789012',
			yesBets: '0',
			noBets: '1.2',
			totalBets: '1.2',
			endTime: Date.now() + 45 * 24 * 60 * 60 * 1000,
			resolved: false,
		},
		{
			title: 'Will AI replace 50% of jobs by 2030?',
			address: '0x5678901234567890123456789012345678901234',
			yesBets: '0.8',
			noBets: '0.3',
			totalBets: '1.1',
			endTime: Date.now() + 90 * 24 * 60 * 60 * 1000,
			resolved: false,
		},
	],
	vaults: [
		{
			name: 'DeFi Yield Vault',
			address: '0x8fDE7A649c782c96e7f4D9D88490a7C5031F51a9',
			shares: '1500.00',
			value: '1500.00',
			apy: 22.8,
			earned: '45.60',
			performance: 18.5,
		},
		{
			name: 'Stable Yield Vault',
			address: '0x9aBcDeF123456789012345678901234567890abcd',
			shares: '5000.00',
			value: '5000.00',
			apy: 8.2,
			earned: '82.00',
			performance: 7.8,
		},
		{
			name: 'Meme Token Vault',
			address: '0xBeF123456789012345678901234567890abcdef',
			shares: '500.00',
			value: '500.00',
			apy: 45.2,
			earned: '226.00',
			performance: 38.7,
		},
	],
	stats: {
		totalValue: '8625.00',
		totalChange24h: 12.4,
		totalEarned: '353.60',
		totalPredictions: 3,
		totalVaults: 3,
		totalTokens: 5,
	},
};

export function UserPositions() {
	const address = '0xDemoUser123456789012345678901234567890';
	const [isLoading, setIsLoading] = useState(true);
	const { launches } = useTokenLaunchpadFactory();

	useEffect(() => {
		// Simulate loading
		setTimeout(() => {
			setIsLoading(false);
		}, 1000);
	}, []);

	const formatAddress = (address: string) => {
		return `${address.slice(0, 6)}...${address.slice(-4)}`;
	};

	const formatDate = (timestamp: number) => {
		return new Date(timestamp).toLocaleDateString();
	};

	if (isLoading) {
		return (
			<div className='space-y-4'>
				<div className='h-8 bg-slate-200 dark:bg-slate-700 rounded animate-pulse'></div>
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
					{[...Array(6)].map((_, i) => (
						<Card key={i} className='animate-pulse'>
							<CardHeader>
								<div className='h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4'></div>
								<div className='h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2'></div>
							</CardHeader>
							<CardContent>
								<div className='h-3 bg-slate-200 dark:bg-slate-700 rounded w-full mb-2'></div>
								<div className='h-3 bg-slate-200 dark:bg-slate-700 rounded w-2/3'></div>
							</CardContent>
						</Card>
					))}
				</div>
			</div>
		);
	}

	return (
		<div className='space-y-6'>
			{/* Portfolio Overview */}
			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
				<Card>
					<CardHeader className='pb-2'>
						<CardTitle className='text-sm font-medium text-slate-600 dark:text-slate-400'>
							Total Portfolio Value
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold text-slate-900 dark:text-white'>
							${MOCK_PORTFOLIO.stats.totalValue}
						</div>
						<div
							className={`text-sm ${
								MOCK_PORTFOLIO.stats.totalChange24h >= 0
									? 'text-green-600'
									: 'text-red-600'
							}`}
						>
							{MOCK_PORTFOLIO.stats.totalChange24h >= 0 ? '+' : ''}
							{MOCK_PORTFOLIO.stats.totalChange24h}% (24h)
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className='pb-2'>
						<CardTitle className='text-sm font-medium text-slate-600 dark:text-slate-400'>
							Total Earned
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold text-green-600'>
							${MOCK_PORTFOLIO.stats.totalEarned}
						</div>
						<div className='text-sm text-slate-500 dark:text-slate-400'>
							From vaults & predictions
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className='pb-2'>
						<CardTitle className='text-sm font-medium text-slate-600 dark:text-slate-400'>
							Active Positions
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold text-slate-900 dark:text-white'>
							{MOCK_PORTFOLIO.stats.totalTokens +
								MOCK_PORTFOLIO.stats.totalVaults +
								MOCK_PORTFOLIO.stats.totalPredictions}
						</div>
						<div className='text-sm text-slate-500 dark:text-slate-400'>
							Tokens, vaults & predictions
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className='pb-2'>
						<CardTitle className='text-sm font-medium text-slate-600 dark:text-slate-400'>
							Wallet Address
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className='text-sm font-mono text-slate-900 dark:text-white'>
							{formatAddress(address)}
						</div>
						<div className='text-sm text-slate-500 dark:text-slate-400'>
							Demo Mode
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Portfolio Tabs */}
			<Tabs defaultValue='tokens' className='space-y-4'>
				<TabsList className='grid w-full grid-cols-4'>
					<TabsTrigger value='tokens'>
						Tokens ({MOCK_PORTFOLIO.tokens.length})
					</TabsTrigger>
					<TabsTrigger value='vaults'>
						Vaults ({MOCK_PORTFOLIO.vaults.length})
					</TabsTrigger>
					<TabsTrigger value='predictions'>
						Predictions ({MOCK_PORTFOLIO.predictions.length})
					</TabsTrigger>
					<TabsTrigger value='launches'>
						Launches ({launches.length})
					</TabsTrigger>
				</TabsList>

				{/* Tokens Tab */}
				<TabsContent value='tokens' className='space-y-4'>
					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
						{MOCK_PORTFOLIO.tokens.map((token) => (
							<Card
								key={token.symbol}
								className='hover:shadow-lg transition-shadow'
							>
								<CardHeader>
									<div className='flex items-center justify-between'>
										<div>
											<CardTitle className='text-lg'>{token.symbol}</CardTitle>
											<p className='text-sm text-slate-600 dark:text-slate-400'>
												{token.name}
											</p>
										</div>
										<Badge
											variant={token.change24h >= 0 ? 'default' : 'neutral'}
										>
											{token.change24h >= 0 ? '+' : ''}
											{token.change24h}%
										</Badge>
									</div>
								</CardHeader>
								<CardContent>
									<div className='space-y-2'>
										<div className='flex justify-between text-sm'>
											<span className='text-slate-600 dark:text-slate-400'>
												Balance:
											</span>
											<span className='font-medium'>
												{parseFloat(token.balance).toLocaleString()}{' '}
												{token.symbol}
											</span>
										</div>
										<div className='flex justify-between text-sm'>
											<span className='text-slate-600 dark:text-slate-400'>
												Value:
											</span>
											<span className='font-medium'>${token.value}</span>
										</div>
										<div className='flex justify-between text-sm'>
											<span className='text-slate-600 dark:text-slate-400'>
												Price:
											</span>
											<span className='font-medium'>${token.price}</span>
										</div>
									</div>
								</CardContent>
							</Card>
						))}
					</div>
				</TabsContent>

				{/* Vaults Tab */}
				<TabsContent value='vaults' className='space-y-4'>
					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
						{MOCK_PORTFOLIO.vaults.map((vault) => (
							<Card
								key={vault.address}
								className='hover:shadow-lg transition-shadow'
							>
								<CardHeader>
									<div className='flex items-center justify-between'>
										<CardTitle className='text-lg'>{vault.name}</CardTitle>
										<Badge className='bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'>
											{vault.apy}% APY
										</Badge>
									</div>
								</CardHeader>
								<CardContent>
									<div className='space-y-2'>
										<div className='flex justify-between text-sm'>
											<span className='text-slate-600 dark:text-slate-400'>
												Shares:
											</span>
											<span className='font-medium'>{vault.shares}</span>
										</div>
										<div className='flex justify-between text-sm'>
											<span className='text-slate-600 dark:text-slate-400'>
												Value:
											</span>
											<span className='font-medium'>${vault.value}</span>
										</div>
										<div className='flex justify-between text-sm'>
											<span className='text-slate-600 dark:text-slate-400'>
												Earned:
											</span>
											<span className='font-medium text-green-600'>
												${vault.earned}
											</span>
										</div>
										<div className='flex justify-between text-sm'>
											<span className='text-slate-600 dark:text-slate-400'>
												Performance:
											</span>
											<span className='font-medium'>{vault.performance}%</span>
										</div>
									</div>
								</CardContent>
							</Card>
						))}
					</div>
				</TabsContent>

				{/* Predictions Tab */}
				<TabsContent value='predictions' className='space-y-4'>
					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
						{MOCK_PORTFOLIO.predictions.map((prediction) => (
							<Card
								key={prediction.address}
								className='hover:shadow-lg transition-shadow'
							>
								<CardHeader>
									<CardTitle className='text-lg line-clamp-2'>
										{prediction.title}
									</CardTitle>
								</CardHeader>
								<CardContent>
									<div className='space-y-2'>
										<div className='flex justify-between text-sm'>
											<span className='text-slate-600 dark:text-slate-400'>
												Yes Bets:
											</span>
											<span className='font-medium'>
												{prediction.yesBets} ETH
											</span>
										</div>
										<div className='flex justify-between text-sm'>
											<span className='text-slate-600 dark:text-slate-400'>
												No Bets:
											</span>
											<span className='font-medium'>
												{prediction.noBets} ETH
											</span>
										</div>
										<div className='flex justify-between text-sm'>
											<span className='text-slate-600 dark:text-slate-400'>
												Total:
											</span>
											<span className='font-medium'>
												{prediction.totalBets} ETH
											</span>
										</div>
										<div className='flex justify-between text-sm'>
											<span className='text-slate-600 dark:text-slate-400'>
												Ends:
											</span>
											<span className='font-medium'>
												{formatDate(prediction.endTime)}
											</span>
										</div>
										<Badge
											variant={prediction.resolved ? 'default' : 'neutral'}
										>
											{prediction.resolved ? 'Resolved' : 'Active'}
										</Badge>
									</div>
								</CardContent>
							</Card>
						))}
					</div>
				</TabsContent>

				{/* Launches Tab */}
				<TabsContent value='launches' className='space-y-4'>
					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
						{launches.map((launch) => (
							<Card
								key={launch.address}
								className='hover:shadow-lg transition-shadow'
							>
								<CardHeader>
									<div className='flex items-center justify-between'>
										<CardTitle className='text-lg'>{launch.symbol}</CardTitle>
										<Badge
											variant={
												launch.isLive
													? 'default'
													: launch.isCompleted
													? 'default'
													: 'neutral'
											}
										>
											{launch.isLive
												? 'Live'
												: launch.isCompleted
												? 'Completed'
												: 'Failed'}
										</Badge>
									</div>
									<p className='text-sm text-slate-600 dark:text-slate-400'>
										{launch.name}
									</p>
								</CardHeader>
								<CardContent>
									<div className='space-y-2'>
										<div className='flex justify-between text-sm'>
											<span className='text-slate-600 dark:text-slate-400'>
												Progress:
											</span>
											<span className='font-medium'>{launch.progress}%</span>
										</div>
										<Progress value={launch.progress} className='h-2' />
										<div className='flex justify-between text-sm'>
											<span className='text-slate-600 dark:text-slate-400'>
												Raised:
											</span>
											<span className='font-medium'>
												{launch.liquidityRaised} / {launch.liquidityTarget} ETH
											</span>
										</div>
										<div className='flex justify-between text-sm'>
											<span className='text-slate-600 dark:text-slate-400'>
												Price:
											</span>
											<span className='font-medium'>
												{launch.tokenPrice} ETH
											</span>
										</div>
										<div className='flex justify-between text-sm'>
											<span className='text-slate-600 dark:text-slate-400'>
												Contributors:
											</span>
											<span className='font-medium'>
												{launch.contributorCount}
											</span>
										</div>
									</div>
								</CardContent>
							</Card>
						))}
					</div>
				</TabsContent>
			</Tabs>
		</div>
	);
}
