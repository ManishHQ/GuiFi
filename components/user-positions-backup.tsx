'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAccount } from 'wagmi';
import { useTokenLaunchpadFactory } from '@/hooks/use-token-launchpad';

interface VaultPosition {
	vaultId: string;
	vaultName: string;
	blockchain: string;
	chainId: number;
	contractAddress: string;
	shares: bigint;
	sharesFormatted: string;
	estimatedValue: string;
	performance: string;
	isPositive: boolean;
}

interface TokenPosition {
	tokenAddress: string;
	tokenName: string;
	tokenSymbol: string;
	balance: string;
	estimatedValue: string;
	performance: string;
	isPositive: boolean;
}

export function UserPositions() {
	const { address } = useAccount();
	const [isLoading, setIsLoading] = useState(true);
	const { launchAddresses } = useTokenLaunchpadFactory();

	useEffect(() => {
		if (!address) {
			setIsLoading(false);
			return;
		}

		// Simulate loading for better UX
		setTimeout(() => {
			setIsLoading(false);
		}, 1000);
	}, [address]);

	const getBlockchainColor = (blockchain: string) => {
		switch (blockchain) {
			case 'Flow Testnet':
				return 'from-green-400 to-emerald-500';
			case 'Rootstock Testnet':
				return 'from-orange-400 to-red-500';
			default:
				return 'from-gray-400 to-gray-500';
		}
	};

	const getBlockchainIcon = (blockchain: string) => {
		switch (blockchain) {
			case 'Flow Testnet':
				return '🌊';
			case 'Rootstock Testnet':
				return '₿';
			default:
				return '⚡';
		}
	};

	if (!address) {
		return (
			<Card className='relative overflow-hidden'>
				<div className='absolute inset-0 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-950 opacity-50' />
				<CardContent className='relative p-8 text-center'>
					<div className='mb-4'>
						<div className='w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mb-4'>
							<span className='text-2xl'>💼</span>
						</div>
						<h3 className='text-xl font-semibold text-slate-700 dark:text-slate-300 mb-2'>
							Connect Your Wallet
						</h3>
						<p className='text-slate-500 dark:text-slate-400 text-sm'>
							Connect your wallet to view your vault positions and track your
							investments
						</p>
					</div>
				</CardContent>
			</Card>
		);
	}

	if (isLoading) {
		return (
			<Card className='relative overflow-hidden'>
				<div className='absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 opacity-50' />
				<CardHeader className='relative'>
					<CardTitle className='flex items-center gap-3'>
						<div className='w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center'>
							<div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin' />
						</div>
						Loading Your Positions...
					</CardTitle>
				</CardHeader>
				<CardContent className='relative space-y-4'>
					{[1, 2].map((i) => (
						<div key={i} className='animate-pulse'>
							<div className='h-24 bg-slate-200 dark:bg-slate-700 rounded-lg' />
						</div>
					))}
				</CardContent>
			</Card>
		);
	}

	// Mock positions for demo (you'll replace this with real data)
	const mockPositions: VaultPosition[] = [
		{
			vaultId: 'flow-testnet-multi-token-vault',
			vaultName: 'Flow Testnet Multi-Token Vault',
			blockchain: 'Flow Testnet',
			chainId: 545,
			contractAddress: '0x7C65F77a4EbEa3D56368A73A12234bB4384ACB28',
			shares: BigInt('500000000000000000'), // 0.5 shares
			sharesFormatted: '0.5000',
			estimatedValue: '$523.45',
			performance: '+8.7%',
			isPositive: true,
		},
		{
			vaultId: 'rootstock-testnet-vault',
			vaultName: 'Rootstock Testnet Vault',
			blockchain: 'Rootstock Testnet',
			chainId: 31,
			contractAddress: '0x8fDE7A649c782c96e7f4D9D88490a7C5031F51a9',
			shares: BigInt('750000000000000000'), // 0.75 shares
			sharesFormatted: '0.7500',
			estimatedValue: '$892.16',
			performance: '+15.2%',
			isPositive: true,
		},
	];

	// Create mock token positions based on launched tokens
	const tokenPositions: TokenPosition[] = Array.isArray(launchAddresses)
		? launchAddresses.slice(0, 3).map((address, index) => ({
				tokenAddress: address,
				tokenName: `Token ${index + 1}`,
				tokenSymbol: `TKN${index + 1}`,
				balance: `${(Math.random() * 1000).toFixed(2)}`,
				estimatedValue: `$${(Math.random() * 500 + 100).toFixed(2)}`,
				performance: `${Math.random() > 0.5 ? '+' : '-'}${(
					Math.random() * 20
				).toFixed(1)}%`,
				isPositive: Math.random() > 0.5,
		  }))
		: [];

	const totalTokenValue = tokenPositions.reduce((sum, pos) => {
		const value = parseFloat(pos.estimatedValue.replace(/[$,]/g, ''));
		return sum + value;
	}, 0);

	const totalVaultValue = mockPositions.reduce((sum, pos) => {
		const value = parseFloat(pos.estimatedValue.replace(/[$,]/g, ''));
		return sum + value;
	}, 0);

	const totalPortfolioValue = totalVaultValue + totalTokenValue;

	const hasPositions = mockPositions.length > 0 || tokenPositions.length > 0;

	if (!hasPositions) {
		return (
			<Card className='relative overflow-hidden'>
				<div className='absolute inset-0 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950 dark:to-orange-950 opacity-50' />
				<CardContent className='relative p-8 text-center'>
					<div className='mb-4'>
						<div className='w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center mb-4'>
							<span className='text-2xl'>🌱</span>
						</div>
						<h3 className='text-xl font-semibold text-slate-700 dark:text-slate-300 mb-2'>
							Start Your DeFi Journey
						</h3>
						<p className='text-slate-500 dark:text-slate-400 text-sm mb-4'>
							You don&apos;t have any vault positions or token holdings yet.
							Make your first investment to start earning!
						</p>
						<div className='flex gap-2 justify-center'>
							<Button className='bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white'>
								Explore Vaults
							</Button>
							<Button className='border-orange-500 text-orange-600 hover:bg-orange-50'>
								Launch Token
							</Button>
						</div>
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<div className='space-y-6'>
			{/* Portfolio Overview */}
			<Card className='relative overflow-hidden'>
				<div className='absolute inset-0 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950 dark:to-teal-950 opacity-50' />
				<CardHeader className='relative'>
					<CardTitle className='flex items-center justify-between'>
						<div className='flex items-center gap-3'>
							<div className='w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center'>
								<span className='text-white font-bold'>💎</span>
							</div>
							<div>
								<h3 className='text-xl font-bold'>Your Portfolio</h3>
								<p className='text-sm text-slate-500 dark:text-slate-400'>
									{mockPositions.length + tokenPositions.length} active position
									{mockPositions.length + tokenPositions.length !== 1
										? 's'
										: ''}
								</p>
							</div>
						</div>
						<div className='text-right'>
							<div className='text-2xl font-bold text-emerald-600 dark:text-emerald-400'>
								$
								{totalPortfolioValue.toLocaleString('en-US', {
									minimumFractionDigits: 2,
									maximumFractionDigits: 2,
								})}
							</div>
							<div className='text-sm text-emerald-600 dark:text-emerald-400 font-medium'>
								Total Value
							</div>
						</div>
					</CardTitle>
				</CardHeader>
			</Card>

			{/* Tabbed Interface */}
			<Tabs defaultValue='vaults' className='w-full'>
				<TabsList className='grid w-full grid-cols-2'>
					<TabsTrigger value='vaults' className='flex items-center gap-2'>
						🏦 Vault Positions ({mockPositions.length})
					</TabsTrigger>
					<TabsTrigger value='tokens' className='flex items-center gap-2'>
						🪙 Token Holdings ({tokenPositions.length})
					</TabsTrigger>
				</TabsList>

				<TabsContent value='vaults' className='space-y-4'>
					<h3 className='text-lg font-semibold text-slate-700 dark:text-slate-300'>
						Vault Positions
					</h3>
					{mockPositions.map((position) => (
						<Card
							key={position.vaultId}
							className='relative overflow-hidden hover:shadow-lg transition-all duration-200'
						>
							<div
								className={`absolute inset-0 bg-gradient-to-br ${getBlockchainColor(
									position.blockchain
								)} opacity-5`}
							/>
							<CardContent className='relative p-6'>
								<div className='flex items-center justify-between'>
									<div className='flex items-center gap-4'>
										<div
											className={`w-12 h-12 rounded-lg bg-gradient-to-br ${getBlockchainColor(
												position.blockchain
											)} flex items-center justify-center text-white text-xl`}
										>
											{getBlockchainIcon(position.blockchain)}
										</div>
										<div>
											<h4 className='font-semibold text-slate-800 dark:text-slate-200'>
												{position.vaultName}
											</h4>
											<p className='text-sm text-slate-500 dark:text-slate-400'>
												{position.blockchain} • {position.sharesFormatted}{' '}
												shares
											</p>
											<p className='text-xs text-slate-400 dark:text-slate-500 font-mono'>
												{position.contractAddress.slice(0, 8)}...
												{position.contractAddress.slice(-6)}
											</p>
										</div>
									</div>
									<div className='text-right'>
										<div className='text-lg font-bold text-slate-800 dark:text-slate-200'>
											{position.estimatedValue}
										</div>
										<div
											className={`text-sm font-medium ${
												position.isPositive
													? 'text-green-600 dark:text-green-400'
													: 'text-red-600 dark:text-red-400'
											}`}
										>
											{position.performance}
										</div>
									</div>
								</div>
							</CardContent>
						</Card>
					))}
				</TabsContent>

				<TabsContent value='tokens' className='space-y-4'>
					<h3 className='text-lg font-semibold text-slate-700 dark:text-slate-300'>
						Token Holdings
					</h3>
					{tokenPositions.length === 0 ? (
						<Card className='relative overflow-hidden'>
							<CardContent className='p-8 text-center'>
								<div className='text-4xl mb-4'>🪙</div>
								<h4 className='text-lg font-semibold mb-2'>
									No Token Holdings
								</h4>
								<p className='text-slate-500 dark:text-slate-400 text-sm mb-4'>
									You don&apos;t own any launchpad tokens yet. Participate in
									token launches to start building your token portfolio.
								</p>
								<Button className='bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white'>
									Explore Launchpad
								</Button>
							</CardContent>
						</Card>
					) : (
						tokenPositions.map((position) => (
							<Card
								key={position.tokenAddress}
								className='relative overflow-hidden hover:shadow-lg transition-all duration-200'
							>
								<div className='absolute inset-0 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950 dark:to-red-950 opacity-50' />
								<CardContent className='relative p-6'>
									<div className='flex items-center justify-between'>
										<div className='flex items-center gap-4'>
											<div className='w-12 h-12 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white text-xl font-bold'>
												{position.tokenSymbol.slice(0, 2)}
											</div>
											<div>
												<h4 className='font-semibold text-slate-800 dark:text-slate-200'>
													{position.tokenName}
												</h4>
												<p className='text-sm text-slate-500 dark:text-slate-400'>
													{position.tokenSymbol} • {position.balance} tokens
												</p>
												<p className='text-xs text-slate-400 dark:text-slate-500 font-mono'>
													{position.tokenAddress.slice(0, 8)}...
													{position.tokenAddress.slice(-6)}
												</p>
											</div>
										</div>
										<div className='text-right'>
											<div className='text-lg font-bold text-slate-800 dark:text-slate-200'>
												{position.estimatedValue}
											</div>
											<div
												className={`text-sm font-medium ${
													position.isPositive
														? 'text-green-600 dark:text-green-400'
														: 'text-red-600 dark:text-red-400'
												}`}
											>
												{position.performance}
											</div>
										</div>
									</div>
								</CardContent>
							</Card>
						))
					)}
				</TabsContent>
			</Tabs>
		</div>
	);
}
