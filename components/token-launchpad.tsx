'use client';

import { useState } from 'react';
import { toast } from 'sonner';
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { SingleTokenPage } from './single-token-page';
import {
	useTokenLaunchpadFactory,
	useTokenLaunch,
} from '@/hooks/use-token-launchpad';
import { useAutoSwitchChain } from '@/hooks/use-auto-switch-chain';
import { useChainId } from 'wagmi';

interface CreateTokenForm {
	name: string;
	symbol: string;
	description: string;
	totalSupply: string;
	liquidityTarget: string;
	tokenPrice: string;
	website: string;
	twitter: string;
	telegram: string;
}

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
	marketScore?: number;
	priceChange24h?: number;
}

const MOCK_LAUNCHES: TokenLaunch[] = [
	{
		id: '1',
		name: 'AI Prediction Token',
		symbol: 'AIPRED',
		description:
			'Revolutionary AI-powered prediction market token with real-time sentiment analysis and automated market making.',
		creator: '0x1234...5678',
		logo: '/api/placeholder/64/64',
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
		marketScore: 92,
		priceChange24h: 15.7,
	},
	{
		id: '2',
		name: 'DeFi Nexus',
		symbol: 'DNEX',
		description:
			'Next-generation DeFi protocol enabling cross-chain yield farming with AI-optimized strategies.',
		creator: '0x9876...5432',
		totalSupply: 500000000,
		currentPrice: 0.012,
		marketCap: 6000000,
		liquidityRaised: 450000,
		liquidityTarget: 800000,
		participantCount: 892,
		launchDate: new Date('2025-01-20'),
		status: 'live',
		category: 'DeFi',
		website: 'https://definexus.fi',
		twitter: '@definexus',
		marketScore: 88,
		priceChange24h: -3.2,
	},
	{
		id: '3',
		name: 'GameFi Revolution',
		symbol: 'GREV',
		description:
			'Play-to-earn gaming ecosystem with NFT integration and cross-game asset portability.',
		creator: '0x5555...9999',
		totalSupply: 2000000000,
		currentPrice: 0.0008,
		marketCap: 1600000,
		liquidityRaised: 125000,
		liquidityTarget: 500000,
		participantCount: 356,
		launchDate: new Date('2025-01-25'),
		status: 'upcoming',
		category: 'Gaming',
		website: 'https://gamefirev.com',
		telegram: 'gamefirevolution',
		marketScore: 76,
	},
	{
		id: '4',
		name: 'Green Energy Coin',
		symbol: 'GEC',
		description:
			'Sustainable blockchain solution for carbon credit trading and renewable energy financing.',
		creator: '0x1111...2222',
		totalSupply: 1500000000,
		currentPrice: 0.025,
		marketCap: 37500000,
		liquidityRaised: 1200000,
		liquidityTarget: 1200000,
		participantCount: 2156,
		launchDate: new Date('2024-12-15'),
		status: 'completed',
		category: 'Green Tech',
		website: 'https://greenenergycoin.org',
		twitter: '@greenenergycoin',
		marketScore: 94,
		priceChange24h: 8.4,
	},
];

export function TokenLaunchpad() {
	const chainId = useChainId();
	const { switchToUmiDevnet } = useAutoSwitchChain();
	const [selectedStatus, setSelectedStatus] = useState('all');
	const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
	const [selectedTokenId, setSelectedTokenId] = useState<string | null>(null);
	const [newToken, setNewToken] = useState<CreateTokenForm>({
		name: '',
		symbol: '',
		description: '',
		totalSupply: '',
		liquidityTarget: '',
		tokenPrice: '',
		website: '',
		twitter: '',
		telegram: '',
	});

	const {
		launches,
		isLoading: launchesLoading,
		createTokenLaunch,
		isCreating,
	} = useTokenLaunchpadFactory();

	// If a token is selected, show the single token view
	if (selectedTokenId) {
		return (
			<SingleTokenPage
				tokenAddress={selectedTokenId}
				onBack={() => setSelectedTokenId(null)}
			/>
		);
	}

	const statuses = ['all', 'upcoming', 'live', 'completed'];

	const filteredLaunches = Array.isArray(launches)
		? selectedStatus === 'all'
			? launches
			: launches.filter((launch) => launch.status === selectedStatus)
		: [];

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

	const formatNumber = (num: number) => {
		if (num >= 1e9) return (num / 1e9).toFixed(1) + 'B';
		if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M';
		if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K';
		return num.toString();
	};

	const handleCreateToken = async () => {
		try {
			// Validate form
			if (
				!newToken.name ||
				!newToken.symbol ||
				!newToken.totalSupply ||
				!newToken.liquidityTarget ||
				!newToken.tokenPrice
			) {
				toast.error('Please fill in all required fields');
				return;
			}

			// Switch to correct chain if needed
			if (chainId !== 42069) {
				await switchToUmiDevnet();
				return;
			}

			const result = await createTokenLaunch({
				name: newToken.name,
				symbol: newToken.symbol,
				totalSupply: BigInt(newToken.totalSupply),
				liquidityTarget: BigInt(newToken.liquidityTarget),
				tokenPrice: BigInt(newToken.tokenPrice),
				description: newToken.description,
				website: newToken.website,
				twitter: newToken.twitter,
				telegram: newToken.telegram,
			});

			if (result.success) {
				toast.success(
					`Token launch created successfully! Address: ${result.tokenAddress}`
				);
				setIsCreateModalOpen(false);
				setNewToken({
					name: '',
					symbol: '',
					description: '',
					totalSupply: '',
					liquidityTarget: '',
					tokenPrice: '',
					website: '',
					twitter: '',
					telegram: '',
				});
			} else {
				toast.error(result.error || 'Failed to create token launch');
			}
		} catch (error) {
			console.error('Error creating token:', error);
			toast.error('Failed to create token launch');
		}
	};

	return (
		<div className='space-y-6 relative pb-20'>
			{/* Header */}
			<div>
				<h2 className='text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white'>
					🚀 Token Launchpad
				</h2>
				<p className='text-slate-600 dark:text-slate-400'>
					Launch and discover the next generation of tokens
				</p>
			</div>

			{/* Floating Launch Token Button */}
			<Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
				<DialogTrigger asChild>
					<Button className='fixed bottom-6 right-6 z-50 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 shadow-lg text-white px-4 py-3 sm:px-6 rounded-full lg:bottom-8 lg:right-8'>
						<span className='hidden sm:inline'>🚀 Launch Token</span>
						<span className='sm:hidden'>🚀</span>
					</Button>
				</DialogTrigger>
				<DialogContent className='max-w-md max-h-[80vh] overflow-y-auto'>
					<DialogHeader>
						<DialogTitle>Launch New Token</DialogTitle>
					</DialogHeader>
					<div className='space-y-4'>
						<div className='grid grid-cols-2 gap-2'>
							<Input
								placeholder='Token Name'
								value={newToken.name}
								onChange={(e) =>
									setNewToken({ ...newToken, name: e.target.value })
								}
							/>
							<Input
								placeholder='Symbol'
								value={newToken.symbol}
								onChange={(e) =>
									setNewToken({
										...newToken,
										symbol: e.target.value.toUpperCase(),
									})
								}
							/>
						</div>
						<Textarea
							placeholder='Token description...'
							value={newToken.description}
							onChange={(e) =>
								setNewToken({ ...newToken, description: e.target.value })
							}
						/>
						<div className='grid grid-cols-2 gap-2'>
							<Input
								placeholder='Total Supply'
								type='number'
								value={newToken.totalSupply}
								onChange={(e) =>
									setNewToken({ ...newToken, totalSupply: e.target.value })
								}
							/>
							<Input
								placeholder='Liquidity Target ($)'
								type='number'
								value={newToken.liquidityTarget}
								onChange={(e) =>
									setNewToken({
										...newToken,
										liquidityTarget: e.target.value,
									})
								}
							/>
						</div>
						<Input
							placeholder='Token Price (in wei)'
							type='number'
							value={newToken.tokenPrice}
							onChange={(e) =>
								setNewToken({ ...newToken, tokenPrice: e.target.value })
							}
						/>
						<Input
							placeholder='Website (optional)'
							value={newToken.website}
							onChange={(e) =>
								setNewToken({ ...newToken, website: e.target.value })
							}
						/>
						<div className='grid grid-cols-2 gap-2'>
							<Input
								placeholder='Twitter'
								value={newToken.twitter}
								onChange={(e) =>
									setNewToken({ ...newToken, twitter: e.target.value })
								}
							/>
							<Input
								placeholder='Telegram'
								value={newToken.telegram}
								onChange={(e) =>
									setNewToken({ ...newToken, telegram: e.target.value })
								}
							/>
						</div>
						<Button
							onClick={handleCreateToken}
							className='w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700'
						>
							{isCreating ? 'Launching...' : 'Launch Token'}
						</Button>
					</div>
				</DialogContent>
			</Dialog>

			{/* AI Analytics Alert */}
			<Alert className='bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950 dark:to-red-950 border-orange-200 dark:border-orange-800'>
				<AlertDescription className='text-orange-700 dark:text-orange-300'>
					🤖 AI is analyzing token potential and providing risk assessments for
					all launches.
				</AlertDescription>
			</Alert>

			{/* Status Filter */}
			<div className='flex flex-wrap gap-2'>
				{statuses.map((status) => (
					<Button
						key={status}
						variant={selectedStatus === status ? 'default' : 'neutral'}
						size='sm'
						onClick={() => setSelectedStatus(status)}
						className='capitalize'
					>
						{status}
					</Button>
				))}
			</div>

			{/* Launches Grid */}
			<div className='grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6'>
				{filteredLaunches.map((launch) => (
					<Card
						key={launch.id}
						className='bg-white/95 dark:bg-slate-950/95 backdrop-blur-sm border-slate-200/60 dark:border-slate-800/60 hover:shadow-lg transition-all duration-200 cursor-pointer'
						onClick={() => setSelectedTokenId(launch.id)}
					>
						<CardHeader className='space-y-3'>
							<div className='flex items-start justify-between gap-3'>
								<div className='flex items-center gap-3'>
									<Avatar className='w-12 h-12'>
										<AvatarImage src={launch.logo} />
										<AvatarFallback className='bg-gradient-to-br from-orange-500 to-red-500 text-white font-bold'>
											{launch.symbol.slice(0, 2)}
										</AvatarFallback>
									</Avatar>
									<div>
										<CardTitle className='text-lg'>{launch.name}</CardTitle>
										<div className='flex items-center gap-2'>
											<span className='text-sm font-mono text-slate-600 dark:text-slate-400'>
												${launch.symbol}
											</span>
											{launch.priceChange24h && (
												<span
													className={`text-xs font-medium ${
														launch.priceChange24h > 0
															? 'text-green-600 dark:text-green-400'
															: 'text-red-600 dark:text-red-400'
													}`}
												>
													{launch.priceChange24h > 0 ? '+' : ''}
													{launch.priceChange24h.toFixed(1)}%
												</span>
											)}
										</div>
									</div>
								</div>
								<div className='text-right'>
									<Badge className={getStatusColor(launch.status)}>
										{launch.status}
									</Badge>
									{launch.marketScore && (
										<div className='text-xs text-orange-600 dark:text-orange-400 mt-1'>
											📊 Market Score: {launch.marketScore}/100
										</div>
									)}
								</div>
							</div>

							<p className='text-sm text-slate-600 dark:text-slate-400 line-clamp-2'>
								{launch.description}
							</p>

							<div className='flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400'>
								<span>📊 {launch.category}</span>
								<span>👥 {launch.participantCount} participants</span>
								<span>📅 {launch.launchDate.toLocaleDateString()}</span>
							</div>
						</CardHeader>

						<CardContent className='space-y-4'>
							{/* Price and Market Cap */}
							<div className='grid grid-cols-2 gap-4'>
								<div>
									<div className='text-xs text-slate-600 dark:text-slate-400'>
										Current Price
									</div>
									<div className='text-lg font-bold'>
										${launch.currentPrice.toFixed(4)}
									</div>
								</div>
								<div>
									<div className='text-xs text-slate-600 dark:text-slate-400'>
										Market Cap
									</div>
									<div className='text-lg font-bold'>
										${formatNumber(launch.marketCap)}
									</div>
								</div>
							</div>

							{/* Liquidity Progress */}
							{launch.status === 'live' || launch.status === 'upcoming' ? (
								<div className='space-y-2'>
									<div className='flex justify-between text-sm'>
										<span className='text-slate-600 dark:text-slate-400'>
											Liquidity Raised
										</span>
										<span className='font-semibold'>
											${launch.liquidityRaised.toLocaleString()} / $
											{launch.liquidityTarget.toLocaleString()}
										</span>
									</div>
									<Progress
										value={
											(launch.liquidityRaised / launch.liquidityTarget) * 100
										}
										className='h-2'
									/>
									<div className='text-xs text-slate-500 dark:text-slate-400 text-center'>
										{(
											(launch.liquidityRaised / launch.liquidityTarget) *
											100
										).toFixed(1)}
										% completed
									</div>
								</div>
							) : (
								<div className='p-3 bg-slate-50 dark:bg-slate-900 rounded-lg'>
									<div className='text-sm font-medium text-slate-700 dark:text-slate-300'>
										Total Supply: {formatNumber(launch.totalSupply)}{' '}
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
							{launch.status === 'live' && (
								<Button className='w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700'>
									🚀 Participate in Launch
								</Button>
							)}
							{launch.status === 'upcoming' && (
								<Button variant='neutral' className='w-full'>
									⏰ Notify Me
								</Button>
							)}
							{launch.status === 'completed' && (
								<Button variant='neutral' className='w-full'>
									📈 View on DEX
								</Button>
							)}
						</CardContent>
					</Card>
				))}
			</div>

			{/* Loading State */}
			{launchesLoading && (
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
					{[...Array(6)].map((_, i) => (
						<Card key={i} className='animate-pulse'>
							<CardHeader>
								<div className='flex items-center space-x-4'>
									<div className='w-12 h-12 bg-gray-300 rounded-full'></div>
									<div className='space-y-2 flex-1'>
										<div className='h-4 bg-gray-300 rounded w-3/4'></div>
										<div className='h-3 bg-gray-300 rounded w-1/2'></div>
									</div>
								</div>
							</CardHeader>
							<CardContent>
								<div className='space-y-3'>
									<div className='h-3 bg-gray-300 rounded'></div>
									<div className='h-3 bg-gray-300 rounded w-5/6'></div>
									<div className='h-8 bg-gray-300 rounded'></div>
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			)}

			{/* Empty State */}
			{!launchesLoading && filteredLaunches.length === 0 && (
				<div className='text-center py-12'>
					<div className='text-6xl mb-4'>🚀</div>
					<h3 className='text-xl font-semibold mb-2'>
						No token launches found
					</h3>
					<p className='text-slate-600 dark:text-slate-400 mb-6'>
						Be the first to launch a token on the platform!
					</p>
					<Button
						onClick={() => setIsCreateModalOpen(true)}
						className='bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700'
					>
						Launch Your Token
					</Button>
				</div>
			)}

			{/* Token Launches Grid */}
			{!launchesLoading && filteredLaunches.length > 0 && (
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
					{filteredLaunches.map((launch) => (
						<Card
							key={launch.id}
							className='hover:shadow-lg transition-all duration-200 cursor-pointer hover:scale-[1.02] group'
							onClick={() => setSelectedTokenId(launch.id)}
						>
							<CardHeader className='space-y-3'>
								<div className='flex items-start justify-between gap-3'>
									<div className='flex items-center gap-3'>
										<Avatar className='w-12 h-12'>
											<AvatarImage src={launch.logo} />
											<AvatarFallback className='bg-gradient-to-br from-orange-500 to-red-500 text-white font-bold'>
												{launch.symbol.slice(0, 2)}
											</AvatarFallback>
										</Avatar>
										<div>
											<CardTitle className='text-lg'>{launch.name}</CardTitle>
											<div className='flex items-center gap-2'>
												<span className='text-sm font-mono text-slate-600 dark:text-slate-400'>
													${launch.symbol}
												</span>
												{launch.priceChange24h && (
													<span
														className={`text-xs font-medium ${
															launch.priceChange24h > 0
																? 'text-green-600 dark:text-green-400'
																: 'text-red-600 dark:text-red-400'
														}`}
													>
														{launch.priceChange24h > 0 ? '+' : ''}
														{launch.priceChange24h.toFixed(1)}%
													</span>
												)}
											</div>
										</div>
									</div>
									<div className='text-right'>
										<Badge className={getStatusColor(launch.status)}>
											{launch.status}
										</Badge>
										{launch.marketScore && (
											<div className='text-xs text-orange-600 dark:text-orange-400 mt-1'>
												📊 Market Score: {launch.marketScore}/100
											</div>
										)}
									</div>
								</div>

								<p className='text-sm text-slate-600 dark:text-slate-400 line-clamp-2'>
									{launch.description}
								</p>

								<div className='flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400'>
									<span>📊 {launch.category}</span>
									<span>👥 {launch.participantCount} participants</span>
									<span>📅 {launch.launchDate.toLocaleDateString()}</span>
								</div>
							</CardHeader>

							<CardContent className='space-y-4'>
								{/* Price and Market Cap */}
								<div className='grid grid-cols-2 gap-4'>
									<div>
										<div className='text-xs text-slate-600 dark:text-slate-400'>
											Current Price
										</div>
										<div className='text-lg font-bold'>
											${launch.currentPrice.toFixed(4)}
										</div>
									</div>
									<div>
										<div className='text-xs text-slate-600 dark:text-slate-400'>
											Market Cap
										</div>
										<div className='text-lg font-bold'>
											${formatNumber(launch.marketCap)}
										</div>
									</div>
								</div>

								{/* Liquidity Progress */}
								{launch.status === 'live' || launch.status === 'upcoming' ? (
									<div className='space-y-2'>
										<div className='flex justify-between text-sm'>
											<span className='text-slate-600 dark:text-slate-400'>
												Liquidity Raised
											</span>
											<span className='font-semibold'>
												${launch.liquidityRaised.toLocaleString()} / $
												{launch.liquidityTarget.toLocaleString()}
											</span>
										</div>
										<Progress
											value={
												(launch.liquidityRaised / launch.liquidityTarget) * 100
											}
											className='h-2'
										/>
										<div className='text-xs text-slate-500 dark:text-slate-400 text-center'>
											{(
												(launch.liquidityRaised / launch.liquidityTarget) *
												100
											).toFixed(1)}
											% completed
										</div>
									</div>
								) : (
									<div className='p-3 bg-slate-50 dark:bg-slate-900 rounded-lg'>
										<div className='text-sm font-medium text-slate-700 dark:text-slate-300'>
											Total Supply: {formatNumber(launch.totalSupply)}{' '}
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
								{launch.status === 'live' && (
									<Button className='w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700'>
										🚀 Participate in Launch
									</Button>
								)}
								{launch.status === 'upcoming' && (
									<Button variant='neutral' className='w-full'>
										⏰ Notify Me
									</Button>
								)}
								{launch.status === 'completed' && (
									<Button variant='neutral' className='w-full'>
										📈 View on DEX
									</Button>
								)}
							</CardContent>
						</Card>
					))}
				</div>
			)}

			{/* Create Token Modal */}
		</div>
	);
}
