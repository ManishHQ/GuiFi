'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useTokenLaunchpadFactory } from '@/hooks/use-token-launchpad';
import { CreateTokenModal } from './create-token-modal';
import { TokenDetailPage } from './token-detail-page';

export function TokenLaunchpad() {
	const [selectedStatus, setSelectedStatus] = useState('all');
	const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
	const [selectedTokenAddress, setSelectedTokenAddress] = useState<
		string | null
	>(null);
	const { launches, isLoading } = useTokenLaunchpadFactory();

	const getStatusColor = (isLive: boolean, isCompleted: boolean) => {
		if (isCompleted)
			return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
		if (isLive)
			return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
		return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
	};

	const getStatusText = (isLive: boolean, isCompleted: boolean) => {
		if (isCompleted) return 'Completed';
		if (isLive) return 'Live';
		return 'Upcoming';
	};

	const filteredLaunches = launches.filter((launch) => {
		if (selectedStatus === 'all') return true;
		if (selectedStatus === 'live') return launch.isLive;
		if (selectedStatus === 'completed') return launch.isCompleted;
		if (selectedStatus === 'upcoming')
			return !launch.isLive && !launch.isCompleted;
		return true;
	});

	// If a token is selected, show the token detail page
	if (selectedTokenAddress) {
		return (
			<TokenDetailPage
				tokenAddress={selectedTokenAddress}
				onBack={() => setSelectedTokenAddress(null)}
			/>
		);
	}

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
			{/* Header */}
			<div className='flex items-center justify-between'>
				<div>
					<h1 className='text-3xl font-bold text-slate-900 dark:text-white'>
						🚀 Memecoin Launchpad
					</h1>
					<p className='text-slate-600 dark:text-slate-400 mt-2'>
						Discover and launch the next viral memecoins
					</p>
				</div>
				<Button
					onClick={() => setIsCreateModalOpen(true)}
					className='bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700'
				>
					🚀 Launch Token
				</Button>
			</div>

			{/* Demo Notice */}
			<Alert>
				<AlertDescription>
					This is a demo version. All interactions are simulated for
					demonstration purposes.
				</AlertDescription>
			</Alert>

			{/* Stats Overview */}
			<div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
				<Card>
					<CardContent className='p-4'>
						<div className='text-2xl font-bold text-slate-900 dark:text-white'>
							{launches.length}
						</div>
						<div className='text-sm text-slate-600 dark:text-slate-400'>
							Total Tokens
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardContent className='p-4'>
						<div className='text-2xl font-bold text-green-600'>
							{launches.filter((l) => l.isLive).length}
						</div>
						<div className='text-sm text-slate-600 dark:text-slate-400'>
							Live Launches
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardContent className='p-4'>
						<div className='text-2xl font-bold text-blue-600'>
							{launches.filter((l) => l.isCompleted).length}
						</div>
						<div className='text-sm text-slate-600 dark:text-slate-400'>
							Completed
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardContent className='p-4'>
						<div className='text-2xl font-bold text-orange-600'>
							{launches.reduce((sum, l) => sum + l.contributorCount, 0)}
						</div>
						<div className='text-sm text-slate-600 dark:text-slate-400'>
							Total Contributors
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Status Filter */}
			<Tabs
				value={selectedStatus}
				onValueChange={setSelectedStatus}
				className='w-full'
			>
				<TabsList className='grid w-full grid-cols-4'>
					<TabsTrigger value='all'>All ({launches.length})</TabsTrigger>
					<TabsTrigger value='upcoming'>
						Upcoming (
						{launches.filter((l) => !l.isLive && !l.isCompleted).length})
					</TabsTrigger>
					<TabsTrigger value='live'>
						Live ({launches.filter((l) => l.isLive).length})
					</TabsTrigger>
					<TabsTrigger value='completed'>
						Completed ({launches.filter((l) => l.isCompleted).length})
					</TabsTrigger>
				</TabsList>

				<TabsContent value={selectedStatus} className='space-y-4'>
					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
						{filteredLaunches.map((launch) => (
							<Card
								key={launch.address}
								className='hover:shadow-lg transition-shadow cursor-pointer'
								onClick={() => setSelectedTokenAddress(launch.address)}
							>
								<CardHeader>
									<div className='flex items-center justify-between mb-2'>
										<div>
											<CardTitle className='text-lg'>{launch.symbol}</CardTitle>
											<p className='text-sm text-slate-600 dark:text-slate-400'>
												{launch.name}
											</p>
										</div>
										<Badge
											className={getStatusColor(
												launch.isLive,
												launch.isCompleted
											)}
										>
											{getStatusText(launch.isLive, launch.isCompleted)}
										</Badge>
									</div>

									<p className='text-sm text-slate-600 dark:text-slate-400 line-clamp-2'>
										{launch.description}
									</p>

									<div className='flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400'>
										<span>👥 {launch.contributorCount} contributors</span>
										<span>📊 {launch.progress}% funded</span>
										<span>💰 ${launch.marketCap} market cap</span>
									</div>
								</CardHeader>

								<CardContent className='space-y-4'>
									{/* Price and Market Cap */}
									<div className='grid grid-cols-2 gap-4'>
										<div>
											<div className='text-xs text-slate-600 dark:text-slate-400'>
												Token Price
											</div>
											<div className='text-lg font-bold'>
												{parseFloat(launch.tokenPrice).toFixed(4)} GUI
											</div>
										</div>
										<div>
											<div className='text-xs text-slate-600 dark:text-slate-400'>
												Market Cap
											</div>
											<div className='text-lg font-bold'>
												${launch.marketCap}
											</div>
										</div>
									</div>

									{/* Liquidity Progress */}
									{launch.isLive || !launch.isCompleted ? (
										<div className='space-y-2'>
											<div className='flex justify-between text-sm'>
												<span className='text-slate-600 dark:text-slate-400'>
													Liquidity Raised
												</span>
												<span className='font-semibold'>
													{launch.liquidityRaised} / {launch.liquidityTarget}{' '}
													GUI
												</span>
											</div>
											<Progress value={launch.progress} className='h-2' />
											<div className='text-xs text-slate-500 dark:text-slate-400 text-center'>
												{launch.progress.toFixed(1)}% completed
											</div>
										</div>
									) : (
										<div className='p-3 bg-slate-50 dark:bg-slate-900 rounded-lg'>
											<div className='text-sm font-medium text-slate-700 dark:text-slate-300'>
												Total Supply:{' '}
												{parseInt(launch.totalSupply).toLocaleString()}{' '}
												{launch.symbol}
											</div>
										</div>
									)}

									{/* Social Links */}
									{(launch.website || launch.twitter || launch.telegram) && (
										<div className='flex gap-2'>
											{launch.website && (
												<Button size='sm' variant='neutral' className='text-xs'>
													🌐 Website
												</Button>
											)}
											{launch.twitter && (
												<Button size='sm' variant='neutral' className='text-xs'>
													🐦 Twitter
												</Button>
											)}
											{launch.telegram && (
												<Button size='sm' variant='neutral' className='text-xs'>
													📱 Telegram
												</Button>
											)}
										</div>
									)}

									{/* Action Button */}
									<Button
										className='w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
										onClick={(e) => {
											e.stopPropagation();
											setSelectedTokenAddress(launch.address);
										}}
									>
										📊 View Details
									</Button>
								</CardContent>
							</Card>
						))}
					</div>

					{filteredLaunches.length === 0 && (
						<Card className='text-center py-12'>
							<div className='text-4xl mb-4'>🚀</div>
							<h3 className='text-lg font-semibold mb-2'>No tokens found</h3>
							<p className='text-slate-600 dark:text-slate-400 mb-4'>
								No tokens match the selected criteria.
							</p>
							<Button
								onClick={() => setIsCreateModalOpen(true)}
								className='bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700'
							>
								🚀 Launch Your First Token
							</Button>
						</Card>
					)}
				</TabsContent>
			</Tabs>

			{/* Create Token Modal */}
			<CreateTokenModal
				isOpen={isCreateModalOpen}
				onOpenChange={setIsCreateModalOpen}
				onTokenCreated={(tokenAddress) => {
					setSelectedTokenAddress(tokenAddress);
				}}
			/>
		</div>
	);
}
