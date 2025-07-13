'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { TransactionHistory } from '@/components/transaction-history';
import { NavBar } from '@/components/nav-bar';
import { UserPositions } from '@/components/user-positions';
import { PredictionMarket } from '@/components/prediction-market';
import { TokenLaunchpad } from '@/components/token-launchpad';
import { FeatureShowcase } from '@/components/feature-showcase';
import { ComingSoon } from '@/components/coming-soon';
import { getVaultAddress } from '@/constants/contracts';
import { useChainId } from 'wagmi';

interface VaultData {
	id: string;
	name: string;
	description: string;
	blockchain: string;
	chainId: number;
	contractAddress: string;
	apy: number;
	tvl: number;
	riskLevel: string;
	strategy: string;
	performance: number;
	deposits: number;
	allocation: Record<string, number>;
	supportedTokens: string[];
}

// Real vault data based on deployed contracts
const REAL_VAULTS: VaultData[] = [
	{
		id: 'flow-testnet-multi-token-vault',
		name: 'Flow Testnet Multi-Token Vault',
		description: 'Optimized yield strategies for USDC on Flow Testnet',
		blockchain: 'Flow Testnet',
		chainId: 545,
		contractAddress:
			getVaultAddress('flowTestnet', 'MultiTokenVault') ||
			'0x7C65F77a4EbEa3D56368A73A12234bB4384ACB28',
		apy: 16.5,
		tvl: 450000,
		riskLevel: 'High',
		strategy: 'USDC Yield Optimization',
		performance: 13.2,
		deposits: 320000,
		allocation: {
			'USDC Strategies': 100,
		},
		supportedTokens: ['MockUSDC'],
	},
	{
		id: 'rootstock-testnet-vault',
		name: 'Rootstock Testnet Vault',
		description:
			'USDC vault on Rootstock Testnet with Bitcoin DeFi integration',
		blockchain: 'Rootstock Testnet',
		chainId: 31,
		contractAddress:
			getVaultAddress('rootstockTestnet', 'Vault') ||
			'0x8fDE7A649c782c96e7f4D9D88490a7C5031F51a9',
		apy: 18.2,
		tvl: 750000,
		riskLevel: 'Medium',
		strategy: 'Bitcoin-backed USDC Yield Optimization',
		performance: 15.1,
		deposits: 580000,
		allocation: {
			'USDC Lending': 100,
		},
		supportedTokens: ['MockUSDC'],
	},
];

export function DashboardLayout() {
	const [activeTab, setActiveTab] = useState('overview');
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const [selectedVault, setSelectedVault] = useState<VaultData | null>(null);

	// Get current chain ID to filter vaults and faucet
	const currentChainId = useChainId();

	// Filter vaults by current chain
	const filteredVaults = REAL_VAULTS.filter(
		(vault) => vault.chainId === currentChainId
	);

	// Update selectedVault when filteredVaults changes
	useEffect(() => {
		if (
			filteredVaults.length > 0 &&
			(!selectedVault || !filteredVaults.find((v) => v.id === selectedVault.id))
		) {
			setSelectedVault(filteredVaults[0]);
		} else if (filteredVaults.length === 0) {
			setSelectedVault(null);
		}
	}, [filteredVaults, selectedVault]);

	return (
		<div className='min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950'>
			<div className='flex flex-col lg:flex-row'>
				{/* Mobile Header */}
				<div className='lg:hidden'>
					<div className='flex items-center justify-between p-4 border-b border-slate-200/60 dark:border-slate-800/60 bg-white/95 dark:bg-slate-950/95'>
						<div className='flex items-center gap-3'>
							<div className='w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center'>
								<span className='text-white font-bold text-sm'>UMI</span>
							</div>
							<div>
								<h1 className='font-bold text-lg text-slate-900 dark:text-white'>
									UmiFi
								</h1>
								<p className='text-xs text-slate-500 dark:text-slate-400'>
									Umi Superapp
								</p>
							</div>
						</div>
						<Button
							variant='neutral'
							size='sm'
							onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
							className='lg:hidden'
						>
							{isMobileMenuOpen ? '✕' : '☰'}
						</Button>
					</div>

					{/* Mobile Navigation */}
					{isMobileMenuOpen && (
						<div className='p-4 bg-white/95 dark:bg-slate-950/95 border-b border-slate-200/60 dark:border-slate-800/60'>
							<nav className='grid grid-cols-3 gap-2 mb-4'>
								<Button
									variant={activeTab === 'overview' ? 'default' : 'neutral'}
									className='text-xs'
									onClick={() => {
										setActiveTab('overview');
										setIsMobileMenuOpen(false);
									}}
								>
									📊 Overview
								</Button>
								<Button
									variant={activeTab === 'vaults' ? 'default' : 'neutral'}
									className='text-xs'
									onClick={() => {
										setActiveTab('vaults');
										setIsMobileMenuOpen(false);
									}}
								>
									🏦 Vaults
								</Button>
								<Button
									variant={activeTab === 'predictions' ? 'default' : 'neutral'}
									className='text-xs'
									onClick={() => {
										setActiveTab('predictions');
										setIsMobileMenuOpen(false);
									}}
								>
									🔮 Predictions
								</Button>
								<Button
									variant={activeTab === 'launchpad' ? 'default' : 'neutral'}
									className='text-xs'
									onClick={() => {
										setActiveTab('launchpad');
										setIsMobileMenuOpen(false);
									}}
								>
									🚀 Launchpad
								</Button>
								<Button
									variant={activeTab === 'portfolio' ? 'default' : 'neutral'}
									className='text-xs'
									onClick={() => {
										setActiveTab('portfolio');
										setIsMobileMenuOpen(false);
									}}
								>
									💼 Portfolio
								</Button>
							</nav>

							<div className='grid grid-cols-1 gap-2'>
								<Button
									size='sm'
									className='bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-xs'
									onClick={() => {
										setIsMobileMenuOpen(false);
									}}
								>
									🚀 Deploy New Vault
								</Button>
								<div className='grid grid-cols-2 gap-2'>
									<Button size='sm' variant='neutral' className='text-xs'>
										💰 Add Funds
									</Button>
									<Button size='sm' variant='neutral' className='text-xs'>
										📤 Withdraw
									</Button>
								</div>
							</div>
						</div>
					)}
				</div>

				{/* Desktop Sidebar */}
				<div className='hidden lg:block w-80 flex-shrink-0 border-r border-slate-200/60 dark:border-slate-800/60 bg-white/95 dark:bg-slate-950/95 backdrop-blur-sm fixed left-0 top-0 h-screen z-40'>
					<div className='p-6 h-full overflow-y-auto'>
						<div className='flex items-center gap-3 mb-8'>
							<div className='w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center'>
								<span className='text-white font-bold text-lg'>UMI</span>
							</div>
							<div>
								<h1 className='font-bold text-xl text-slate-900 dark:text-white'>
									UmiFi
								</h1>
								<p className='text-sm text-slate-500 dark:text-slate-400'>
									Umi Superapp
								</p>
							</div>
						</div>

						<nav className='space-y-2'>
							<Button
								variant={activeTab === 'overview' ? 'default' : 'neutral'}
								className='w-full justify-start'
								onClick={() => setActiveTab('overview')}
							>
								📊 Overview
							</Button>
							<Button
								variant={activeTab === 'vaults' ? 'default' : 'neutral'}
								className='w-full justify-start'
								onClick={() => setActiveTab('vaults')}
							>
								🏦 Vaults
							</Button>
							<Button
								variant={activeTab === 'predictions' ? 'default' : 'neutral'}
								className='w-full justify-start'
								onClick={() => setActiveTab('predictions')}
							>
								🔮 Predictions
							</Button>
							<Button
								variant={activeTab === 'launchpad' ? 'default' : 'neutral'}
								className='w-full justify-start'
								onClick={() => setActiveTab('launchpad')}
							>
								🚀 Launchpad
							</Button>
							<Button
								variant={activeTab === 'portfolio' ? 'default' : 'neutral'}
								className='w-full justify-start'
								onClick={() => setActiveTab('portfolio')}
							>
								💼 Portfolio
							</Button>
						</nav>

						<div className='mt-8'>
							<Alert className='bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-950 dark:to-green-950 border-emerald-200 dark:border-emerald-800'>
								<AlertDescription className='text-emerald-700 dark:text-emerald-300 text-sm'>
									🚀 Platform is actively optimizing your experience. New
									features coming soon!
								</AlertDescription>
							</Alert>
						</div>
					</div>
				</div>

				{/* Main Content */}
				<div className='flex-1 flex flex-col min-h-screen lg:ml-80'>
					{/* Global NavBar for floating wallet/network info */}
					<NavBar />

					<main className='flex-1 p-3 sm:p-4 lg:p-6 pt-16 lg:pt-20 pr-6 sm:pr-8 lg:pr-16'>
						<Tabs
							value={activeTab}
							onValueChange={setActiveTab}
							className='w-full h-full'
						>
							<TabsContent
								value='overview'
								className='space-y-4 lg:space-y-6 mt-0 pb-20'
							>
								<FeatureShowcase onNavigate={(tab) => setActiveTab(tab)} />
							</TabsContent>

							<TabsContent
								value='vaults'
								className='space-y-4 lg:space-y-6 mt-0 pb-20'
							>
								<ComingSoon
									title='🏦 Vaults & Pools'
									description='Advanced DeFi vaults and liquidity pools'
									icon='🏦'
									featureName='Vaults and Pools'
								/>
							</TabsContent>

							<TabsContent
								value='portfolio'
								className='space-y-4 lg:space-y-6 mt-0 pb-20'
							>
								<div className='grid grid-cols-1 xl:grid-cols-3 gap-4 lg:gap-6'>
									{/* User Positions - takes up 2 columns */}
									<div className='xl:col-span-2 space-y-4 lg:space-y-6'>
										<UserPositions />
										<TransactionHistory />
									</div>

									{/* Side panel - Portfolio summary */}
									<div className='space-y-4 lg:space-y-6'>
										<Card>
											<CardHeader>
												<CardTitle className='text-lg lg:text-xl'>
													Portfolio Summary
												</CardTitle>
											</CardHeader>
											<CardContent>
												<div className='space-y-4'>
													<div className='text-center py-8'>
														<div className='text-4xl mb-2'>📊</div>
														<p className='text-slate-600 dark:text-slate-400 text-sm'>
															Portfolio data coming soon
														</p>
													</div>
												</div>
											</CardContent>
										</Card>

										<Card>
											<CardHeader>
												<CardTitle className='text-lg lg:text-xl'>
													Performance Summary
												</CardTitle>
											</CardHeader>
											<CardContent className='space-y-4'>
												<div className='flex justify-between items-center'>
													<span className='text-sm text-slate-600 dark:text-slate-400'>
														Total PnL
													</span>
													<span className='font-medium text-green-600 dark:text-green-400'>
														+$12,450
													</span>
												</div>
												<div className='flex justify-between items-center'>
													<span className='text-sm text-slate-600 dark:text-slate-400'>
														24h Change
													</span>
													<span className='font-medium text-green-600 dark:text-green-400'>
														+2.1%
													</span>
												</div>
												<div className='flex justify-between items-center'>
													<span className='text-sm text-slate-600 dark:text-slate-400'>
														Best Performer
													</span>
													<span className='font-medium text-slate-900 dark:text-white'>
														Arbitrum
													</span>
												</div>
											</CardContent>
										</Card>
									</div>
								</div>
							</TabsContent>

							<TabsContent
								value='predictions'
								className='space-y-4 lg:space-y-6 mt-0 pb-20'
							>
								<PredictionMarket />
							</TabsContent>

							<TabsContent
								value='launchpad'
								className='space-y-4 lg:space-y-6 mt-0 pb-20'
							>
								<TokenLaunchpad />
							</TabsContent>
						</Tabs>
					</main>
				</div>
			</div>
		</div>
	);
}
