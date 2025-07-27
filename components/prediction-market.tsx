'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
import {
	usePredictionMarketFactory,
	usePredictionMarket,
} from '@/hooks/use-prediction-market';
import { useAutoSwitchChain } from '@/hooks/use-auto-switch-chain';
import { useChainId } from 'wagmi';

interface CreateMarketForm {
	title: string;
	description: string;
	category: string;
	endDate: string;
}

export function PredictionMarket() {
	const [activeCategory, setActiveCategory] = useState('All');
	const [selectedMarket, setSelectedMarket] = useState<string | null>(null);
	const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
	const [formData, setFormData] = useState<CreateMarketForm>({
		title: '',
		description: '',
		category: 'Crypto',
		endDate: '',
	});

	const chainId = useChainId();
	const { switchToDevnet } = useAutoSwitchChain();
	const {
		factoryAddress,
		marketAddresses,
		createMarket,
		isCreating,
		refetchMarkets,
		marketsError,
		marketsLoading,
	} = usePredictionMarketFactory();

	const categories = [
		'All',
		'Crypto',
		'Technology',
		'Finance',
		'Stocks',
		'Sports',
		'Politics',
	];

	const handleCreateMarket = async () => {
		if (!formData.title || !formData.description || !formData.endDate) {
			toast.error('Please fill in all required fields');
			return;
		}

		try {
			toast.loading('Creating prediction market...', { id: 'create-market' });

			await createMarket(
				formData.title,
				formData.description,
				formData.category,
				new Date(formData.endDate)
			);

			toast.success('Prediction market created successfully!', {
				id: 'create-market',
			});

			// Refetch markets to update the list
			setTimeout(() => {
				refetchMarkets();
			}, 2000); // Wait 2 seconds for transaction to be confirmed

			setIsCreateModalOpen(false);
			setFormData({
				title: '',
				description: '',
				category: 'Crypto',
				endDate: '',
			});
		} catch (error) {
			console.error('Error creating market:', error);
			toast.error('Failed to create prediction market. Please try again.', {
				id: 'create-market',
			});
		}
	};

	if (selectedMarket) {
		return (
			<SinglePredictionMarket
				marketAddress={selectedMarket}
				onBack={() => setSelectedMarket(null)}
			/>
		);
	}

	// Show empty state if factory not deployed on this chain
	if (!factoryAddress) {
		return (
			<div className='space-y-4 lg:space-y-6'>
				<div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
					<div>
						<h1 className='text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white'>
							🔮 Prediction Markets
						</h1>
						<p className='text-slate-600 dark:text-slate-400 mt-1'>
							Decentralized prediction markets powered by blockchain
						</p>
					</div>
				</div>

				<Alert className='bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800'>
					<AlertDescription className='text-yellow-700 dark:text-yellow-300 space-y-3'>
						<div>
							⚠️ Prediction markets are not yet deployed on this network (Chain
							ID: {chainId}). Switch to devnet (Chain ID: 42069) to interact
							with prediction markets.
						</div>
						<Button
							onClick={switchToDevnet}
							className='bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white'
						>
							Switch to GUI Devnet
						</Button>
					</AlertDescription>
				</Alert>
			</div>
		);
	}

	return (
		<div className='space-y-4 lg:space-y-6'>
			<div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
				<div>
					<h1 className='text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white'>
						🔮 Prediction Markets
					</h1>
					<p className='text-slate-600 dark:text-slate-400 mt-1'>
						Decentralized prediction markets powered by blockchain
					</p>
				</div>

				<div className='flex gap-2'>
					<Button onClick={() => refetchMarkets()} variant='neutral' size='sm'>
						🔄 Refresh Markets
					</Button>
					<Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
						<DialogTrigger asChild>
							<Button className='bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700'>
								Create Market
							</Button>
						</DialogTrigger>
						<DialogContent className='max-w-md'>
							<DialogHeader>
								<DialogTitle>Create New Prediction Market</DialogTitle>
							</DialogHeader>
							<div className='space-y-4'>
								<div>
									<label className='text-sm font-medium text-slate-700 dark:text-slate-300'>
										Title *
									</label>
									<Input
										placeholder='Will ETH reach $5,000 by 2025?'
										value={formData.title}
										onChange={(e) =>
											setFormData({ ...formData, title: e.target.value })
										}
									/>
								</div>
								<div>
									<label className='text-sm font-medium text-slate-700 dark:text-slate-300'>
										Description *
									</label>
									<Textarea
										placeholder='Detailed description of the prediction market...'
										value={formData.description}
										onChange={(e) =>
											setFormData({ ...formData, description: e.target.value })
										}
									/>
								</div>
								<div>
									<label className='text-sm font-medium text-slate-700 dark:text-slate-300'>
										Category
									</label>
									<select
										className='w-full p-2 border rounded-md bg-white dark:bg-slate-900'
										value={formData.category}
										onChange={(e) =>
											setFormData({ ...formData, category: e.target.value })
										}
									>
										{categories
											.filter((cat) => cat !== 'All')
											.map((cat) => (
												<option key={cat} value={cat}>
													{cat}
												</option>
											))}
									</select>
								</div>
								<div>
									<label className='text-sm font-medium text-slate-700 dark:text-slate-300'>
										End Date *
									</label>
									<Input
										type='datetime-local'
										value={formData.endDate}
										onChange={(e) =>
											setFormData({ ...formData, endDate: e.target.value })
										}
									/>
								</div>
								<div className='flex gap-2 pt-4'>
									<Button
										onClick={handleCreateMarket}
										disabled={isCreating}
										className='flex-1'
									>
										{isCreating ? 'Creating...' : 'Create Market'}
									</Button>
									<Button
										variant='neutral'
										onClick={() => setIsCreateModalOpen(false)}
									>
										Cancel
									</Button>
								</div>
							</div>
						</DialogContent>
					</Dialog>
				</div>
			</div>

			{/* Category Filter */}
			<div className='flex flex-wrap gap-2'>
				{categories.map((category) => (
					<Button
						key={category}
						variant={activeCategory === category ? 'default' : 'neutral'}
						size='sm'
						onClick={() => setActiveCategory(category)}
					>
						{category}
					</Button>
				))}
			</div>

			{/* Factory Info */}
			<Alert className='bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800'>
				<AlertDescription className='text-blue-700 dark:text-blue-300 space-y-2'>
					<div>
						📍 Factory Address:
						<button
							onClick={() => {
								navigator.clipboard.writeText(factoryAddress || '');
								toast.success('Factory address copied to clipboard!');
							}}
							className='ml-2 font-mono hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer'
						>
							{factoryAddress}
						</button>
					</div>
					<div>📊 Total Markets: {marketAddresses.length}</div>
									<div>🌐 Network: GUI Devnet (Chain ID: {chainId})</div>
				<div>🔗 RPC: https://devnet.uminetwork.com</div>
					{marketsLoading && <div>🔄 Loading markets...</div>}
					{marketsError && (
						<div className='text-red-600 dark:text-red-400 space-y-1'>
							<div>❌ Error loading markets:</div>
							<div className='text-xs font-mono bg-red-50 dark:bg-red-950 p-2 rounded'>
								{marketsError.message}
							</div>
							<div className='text-xs'>
								💡 This might indicate:
								<ul className='ml-4 mt-1'>
									<li>• RPC endpoint is down or unreachable</li>
									<li>• Contract not deployed at this address</li>
									<li>• Network connectivity issues</li>
								</ul>
							</div>
						</div>
					)}
					{marketAddresses.length > 0 && (
						<div>
							📋 Market Addresses:
							<ul className='ml-4 mt-1 space-y-1 text-xs'>
								{marketAddresses.map((address, index) => (
									<li key={address} className='font-mono'>
										{index + 1}. {address}
									</li>
								))}
							</ul>
						</div>
					)}
				</AlertDescription>
			</Alert>

			{/* Markets Grid */}
			<div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6'>
				{marketAddresses.length === 0 ? (
					<div className='col-span-full text-center py-12'>
						<div className='text-6xl mb-4'>🎯</div>
						<h3 className='text-xl font-semibold text-slate-900 dark:text-white mb-2'>
							No Markets Yet
						</h3>
						<p className='text-slate-600 dark:text-slate-400 mb-4'>
							Be the first to create a prediction market!
						</p>
						<Button
							onClick={() => setIsCreateModalOpen(true)}
							className='bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700'
						>
							Create First Market
						</Button>
					</div>
				) : (
					marketAddresses.map((marketAddress) => (
						<MarketCard
							key={marketAddress}
							marketAddress={marketAddress}
							onClick={() => setSelectedMarket(marketAddress)}
						/>
					))
				)}
			</div>
		</div>
	);
}

// Individual Market Card Component
function MarketCard({
	marketAddress,
	onClick,
}: {
	marketAddress: string;
	onClick: () => void;
}) {
	const { marketData } = usePredictionMarket(marketAddress);

	if (!marketData) {
		return (
			<Card className='cursor-pointer hover:shadow-lg transition-shadow'>
				<CardHeader>
					<div className='flex justify-between items-start'>
						<div className='flex-1'>
							<div className='h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse mb-2' />
							<div className='h-3 bg-slate-200 dark:bg-slate-700 rounded animate-pulse w-3/4' />
						</div>
					</div>
				</CardHeader>
				<CardContent>
					<div className='space-y-3'>
						<div className='h-3 bg-slate-200 dark:bg-slate-700 rounded animate-pulse' />
						<div className='h-3 bg-slate-200 dark:bg-slate-700 rounded animate-pulse w-1/2' />
					</div>
				</CardContent>
			</Card>
		);
	}

	const endDate = new Date(marketData.endTime * 1000);
	const isActive = !marketData.resolved && endDate > new Date();
	const totalUserBets =
		parseFloat(marketData.userYesBets) + parseFloat(marketData.userNoBets);

	return (
		<Card
			className='cursor-pointer hover:shadow-lg transition-shadow border-slate-200 dark:border-slate-800'
			onClick={onClick}
		>
			<CardHeader>
				<div className='flex justify-between items-start'>
					<div className='flex-1'>
						<CardTitle className='text-lg leading-tight mb-2'>
							{marketData.title}
						</CardTitle>
						<div className='flex items-center gap-2 text-sm'>
							<Badge variant='neutral'>{marketData.category}</Badge>
							<Badge variant={isActive ? 'default' : 'neutral'}>
								{marketData.resolved
									? marketData.resolvedOutcome === 1
										? 'YES Won'
										: 'NO Won'
									: isActive
									? 'Active'
									: 'Ended'}
							</Badge>
						</div>
					</div>
				</div>
			</CardHeader>

			<CardContent>
				<div className='space-y-4'>
					<p className='text-sm text-slate-600 dark:text-slate-400 line-clamp-2'>
						{marketData.description}
					</p>

					<div className='space-y-2'>
						<div className='flex justify-between text-sm'>
							<span className='text-slate-600 dark:text-slate-400'>
								Contract Address
							</span>
							<button
								onClick={(e) => {
									e.stopPropagation(); // Prevent card click
									navigator.clipboard.writeText(marketAddress);
									toast.success('Contract address copied to clipboard!');
								}}
								className='font-mono text-xs hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer'
								title='Click to copy full address'
							>
								{marketAddress.slice(0, 6)}...{marketAddress.slice(-4)}
							</button>
						</div>

						<div className='flex justify-between text-sm'>
							<span className='text-slate-600 dark:text-slate-400'>
								Your Bets
							</span>
							<span className='font-medium'>
								{totalUserBets > 0 ? `${totalUserBets.toFixed(4)} ETH` : 'None'}
							</span>
						</div>

						{totalUserBets > 0 && (
							<div className='text-xs text-slate-500 dark:text-slate-400'>
								YES: {parseFloat(marketData.userYesBets).toFixed(4)} ETH | NO:{' '}
								{parseFloat(marketData.userNoBets).toFixed(4)} ETH
							</div>
						)}
					</div>

					<div className='flex justify-between items-center text-sm'>
						<span className='text-slate-600 dark:text-slate-400'>
							Ends: {endDate.toLocaleDateString()}
						</span>
						<span className='text-slate-600 dark:text-slate-400'>
							Creator: {marketData.creator.slice(0, 6)}...
							{marketData.creator.slice(-4)}
						</span>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
