'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { SinglePredictionMarket } from './single-prediction-market';
import {
	usePredictionMarketFactory,
	MarketData,
} from '@/hooks/use-prediction-market';

interface CreateMarketForm {
	title: string;
	description: string;
	category: string;
	endDate: string;
}

export function PredictionMarket() {
	const [selectedMarket, setSelectedMarket] = useState<string | null>(null);
	const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
	const [formData, setFormData] = useState<CreateMarketForm>({
		title: '',
		description: '',
		category: 'Crypto',
		endDate: '',
	});

	const {
		markets: factoryMarkets,
		createMarket,
		isLoading: marketsLoading,
		error: marketsError,
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

	return (
		<div className='space-y-4 lg:space-y-6'>
			<div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
				<div>
					<h1 className='text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white'>
						🔮 Prediction Markets
					</h1>
					<p className='text-slate-600 dark:text-slate-400 mt-1'>
						Decentralized prediction markets (Demo Mode)
					</p>
				</div>

				<div className='flex gap-2'>
					<Button variant='neutral' size='sm'>
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
											.map((category) => (
												<option key={category} value={category}>
													{category}
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
										variant='neutral'
										onClick={() => setIsCreateModalOpen(false)}
										className='flex-1'
									>
										Cancel
									</Button>
									<Button
										onClick={handleCreateMarket}
										disabled={marketsLoading}
										className='flex-1'
									>
										{marketsLoading ? 'Creating...' : 'Create Market'}
									</Button>
								</div>
							</div>
						</DialogContent>
					</Dialog>
				</div>
			</div>

			{/* Demo Notice */}
			<Alert>
				<AlertDescription>
					This is a demo version. All interactions are simulated for
					demonstration purposes.
				</AlertDescription>
			</Alert>

			{/* Markets Grid */}
			{marketsLoading ? (
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
			) : marketsError ? (
				<Alert className='border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950'>
					<AlertDescription className='text-red-700 dark:text-red-300'>
						Error loading markets: {marketsError}
					</AlertDescription>
				</Alert>
			) : factoryMarkets.length === 0 ? (
				<div className='text-center py-12'>
					<div className='text-6xl mb-4'>🔮</div>
					<h3 className='text-xl font-semibold text-slate-900 dark:text-white mb-2'>
						No prediction markets yet
					</h3>
					<p className='text-slate-600 dark:text-slate-400 mb-6'>
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
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
					{factoryMarkets.map((market: MarketData) => (
						<MarketCard
							key={market.address}
							market={market}
							onClick={() => setSelectedMarket(market.address)}
						/>
					))}
				</div>
			)}
		</div>
	);
}

function MarketCard({
	market,
	onClick,
}: {
	market: MarketData;
	onClick: () => void;
}) {
	const formatDate = (timestamp: number) => {
		return new Date(timestamp).toLocaleDateString();
	};

	return (
		<Card
			className='cursor-pointer hover:shadow-lg transition-shadow'
			onClick={onClick}
		>
			<CardHeader>
				<div className='flex items-start justify-between'>
					<CardTitle className='text-lg line-clamp-2'>{market.title}</CardTitle>
					<Badge variant='neutral'>{market.category}</Badge>
				</div>
			</CardHeader>
			<CardContent>
				<p className='text-slate-600 dark:text-slate-400 text-sm line-clamp-2 mb-4'>
					{market.description}
				</p>
				<div className='space-y-2 text-sm'>
					<div className='flex justify-between'>
						<span className='text-slate-500'>Ends:</span>
						<span className='font-medium'>{formatDate(market.endTime)}</span>
					</div>
					<div className='flex justify-between'>
						<span className='text-slate-500'>Status:</span>
						<span
							className={`font-medium ${
								market.resolved ? 'text-green-600' : 'text-blue-600'
							}`}
						>
							{market.resolved ? 'Resolved' : 'Active'}
						</span>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
