'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { VaultCard } from './vault-card';
import { InvestVaultModal } from './invest-vault-modal';

// Vault type definition
type Vault = {
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
	performance: {
		'1D': number;
		'7D': number;
		'30D': number;
		'1Y': number;
	};
	deposits: Record<string, number>;
	allocation: Record<string, number>;
	supportedTokens: string[];
	minimumDeposit: number;
	maximumDeposit: number;
	lockPeriod: number;
	withdrawalFee: number;
	managementFee: number;
	performanceFee: number;
	status: string;
	createdAt: string;
	lastRebalance: string;
};

// Mock vault data
const MOCK_VAULTS: Vault[] = [
	{
		id: '1',
		name: 'DeFi Yield Vault',
		description: 'High-yield DeFi strategies with automated rebalancing',
		blockchain: 'Ethereum',
		chainId: 1,
		contractAddress: '0x8fDE7A649c782c96e7f4D9D88490a7C5031F51a9',
		apy: 22.8,
		tvl: 2500000,
		riskLevel: 'Medium',
		strategy: 'Multi-Protocol Yield Farming',
		performance: {
			'1D': 0.8,
			'7D': 5.2,
			'30D': 18.5,
			'1Y': 156.3,
		},
		deposits: {
			'Money Markets': 60,
			'Stable Pools': 25,
			Bonds: 15,
		},
		allocation: {
			Compound: 30,
			Aave: 25,
			Yearn: 20,
			Curve: 15,
			Other: 10,
		},
		supportedTokens: ['USDC', 'USDT', 'DAI'],
		minimumDeposit: 100,
		maximumDeposit: 1000000,
		lockPeriod: 0,
		withdrawalFee: 0.1,
		managementFee: 0.5,
		performanceFee: 10,
		status: 'active',
		createdAt: '2024-01-15',
		lastRebalance: '2024-01-20',
	},
	{
		id: '2',
		name: 'Stable Yield Vault',
		description: 'Conservative stablecoin strategies for steady returns',
		blockchain: 'Ethereum',
		chainId: 1,
		contractAddress: '0x9aBcDeF123456789012345678901234567890abcd',
		apy: 8.2,
		tvl: 1800000,
		riskLevel: 'Low',
		strategy: 'Stablecoin Lending & Farming',
		performance: {
			'1D': 0.2,
			'7D': 1.8,
			'30D': 7.8,
			'1Y': 89.4,
		},
		deposits: {
			'Stable Lending': 70,
			'LP Farming': 20,
			Bonds: 10,
		},
		allocation: {
			Aave: 40,
			Compound: 30,
			Curve: 20,
			Other: 10,
		},
		supportedTokens: ['USDC', 'USDT', 'DAI', 'FRAX'],
		minimumDeposit: 50,
		maximumDeposit: 500000,
		lockPeriod: 0,
		withdrawalFee: 0.05,
		managementFee: 0.3,
		performanceFee: 5,
		status: 'active',
		createdAt: '2024-01-10',
		lastRebalance: '2024-01-19',
	},
	{
		id: '3',
		name: 'Meme Token Vault',
		description: 'High-risk, high-reward meme token strategies',
		blockchain: 'Ethereum',
		chainId: 1,
		contractAddress: '0xBeF123456789012345678901234567890abcdef',
		apy: 45.2,
		tvl: 850000,
		riskLevel: 'High',
		strategy: 'Meme Token Trading & Farming',
		performance: {
			'1D': 2.5,
			'7D': 18.7,
			'30D': 38.7,
			'1Y': 423.1,
		},
		deposits: {
			'Meme Trading': 70,
			'Liquidity Provision': 20,
			Staking: 10,
		},
		allocation: {
			Uniswap: 35,
			SushiSwap: 25,
			PancakeSwap: 20,
			'Other DEX': 20,
		},
		supportedTokens: ['DOGEMOON', 'PEPE', 'SHIB2', 'WETH'],
		minimumDeposit: 25,
		maximumDeposit: 250000,
		lockPeriod: 7,
		withdrawalFee: 0.5,
		managementFee: 1.0,
		performanceFee: 15,
		status: 'active',
		createdAt: '2024-01-05',
		lastRebalance: '2024-01-18',
	},
	{
		id: '4',
		name: 'AI Trading Vault',
		description: 'AI-powered algorithmic trading strategies',
		blockchain: 'Ethereum',
		chainId: 1,
		contractAddress: '0xCaFe123456789012345678901234567890cafe',
		apy: 32.1,
		tvl: 1200000,
		riskLevel: 'Medium-High',
		strategy: 'Algorithmic Trading & Arbitrage',
		performance: {
			'1D': 1.2,
			'7D': 8.9,
			'30D': 28.3,
			'1Y': 298.7,
		},
		deposits: {
			'Algorithmic Trading': 50,
			'Market Making': 30,
			Arbitrage: 20,
		},
		allocation: {
			Uniswap: 30,
			Binance: 25,
			Coinbase: 20,
			Other: 25,
		},
		supportedTokens: ['USDC', 'WETH', 'WBTC', 'FLOW'],
		minimumDeposit: 200,
		maximumDeposit: 750000,
		lockPeriod: 14,
		withdrawalFee: 0.2,
		managementFee: 0.8,
		performanceFee: 12,
		status: 'active',
		createdAt: '2024-01-12',
		lastRebalance: '2024-01-20',
	},
	{
		id: '5',
		name: 'DAO Treasury Vault',
		description: 'Community-governed treasury management',
		blockchain: 'Ethereum',
		chainId: 1,
		contractAddress: '0xDao123456789012345678901234567890dao',
		apy: 15.7,
		tvl: 3200000,
		riskLevel: 'Medium',
		strategy: 'Treasury Management & Governance',
		performance: {
			'1D': 0.4,
			'7D': 3.1,
			'30D': 12.8,
			'1Y': 142.6,
		},
		deposits: {
			Governance: 40,
			Liquidity: 35,
			Staking: 25,
		},
		allocation: {
			Uniswap: 30,
			Compound: 25,
			Aave: 20,
			Other: 25,
		},
		supportedTokens: ['USDC', 'USDT', 'WETH', 'DAO'],
		minimumDeposit: 100,
		maximumDeposit: 1000000,
		lockPeriod: 30,
		withdrawalFee: 0.1,
		managementFee: 0.2,
		performanceFee: 8,
		status: 'active',
		createdAt: '2024-01-08',
		lastRebalance: '2024-01-17',
	},
];

export function VaultPage() {
	const [selectedVault, setSelectedVault] = useState<Vault | null>(null);
	const [isInvestModalOpen, setIsInvestModalOpen] = useState(false);
	const [selectedRiskLevel, setSelectedRiskLevel] = useState('all');

	const handleInvest = (vault: Vault) => {
		setSelectedVault(vault);
		setIsInvestModalOpen(true);
	};

	const filteredVaults = MOCK_VAULTS.filter((vault) => {
		if (selectedRiskLevel === 'all') return true;
		return vault.riskLevel
			.toLowerCase()
			.includes(selectedRiskLevel.toLowerCase());
	});

	const totalTVL = MOCK_VAULTS.reduce((sum, vault) => sum + vault.tvl, 0);
	const averageAPY =
		MOCK_VAULTS.reduce((sum, vault) => sum + vault.apy, 0) / MOCK_VAULTS.length;
	const activeVaults = MOCK_VAULTS.filter(
		(vault) => vault.status === 'active'
	).length;

	return (
		<div className='space-y-6'>
			{/* Header */}
			<div className='flex items-center justify-between'>
				<div>
					<h1 className='text-3xl font-bold text-slate-900 dark:text-white'>
						🏦 DeFi Vaults
					</h1>
					<p className='text-slate-600 dark:text-slate-400 mt-2'>
						Professional yield farming and automated strategies
					</p>
				</div>
			</div>

			{/* Demo Notice */}
			<Alert>
				<AlertDescription>
					This is a demo version. All vault interactions are simulated for
					demonstration purposes.
				</AlertDescription>
			</Alert>

			{/* Stats Overview */}
			<div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
				<Card>
					<CardContent className='p-4'>
						<div className='text-2xl font-bold text-slate-900 dark:text-white'>
							${(totalTVL / 1000000).toFixed(1)}M
						</div>
						<div className='text-sm text-slate-600 dark:text-slate-400'>
							Total Value Locked
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardContent className='p-4'>
						<div className='text-2xl font-bold text-green-600'>
							{averageAPY.toFixed(1)}%
						</div>
						<div className='text-sm text-slate-600 dark:text-slate-400'>
							Average APY
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardContent className='p-4'>
						<div className='text-2xl font-bold text-blue-600'>
							{activeVaults}
						</div>
						<div className='text-sm text-slate-600 dark:text-slate-400'>
							Active Vaults
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardContent className='p-4'>
						<div className='text-2xl font-bold text-orange-600'>
							{MOCK_VAULTS.length}
						</div>
						<div className='text-sm text-slate-600 dark:text-slate-400'>
							Total Strategies
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Risk Level Filter */}
			<Tabs
				value={selectedRiskLevel}
				onValueChange={setSelectedRiskLevel}
				className='w-full'
			>
				<TabsList className='grid w-full grid-cols-4'>
					<TabsTrigger value='all'>
						All Vaults ({MOCK_VAULTS.length})
					</TabsTrigger>
					<TabsTrigger value='low'>
						Low Risk ({MOCK_VAULTS.filter((v) => v.riskLevel === 'Low').length})
					</TabsTrigger>
					<TabsTrigger value='medium'>
						Medium Risk (
						{MOCK_VAULTS.filter((v) => v.riskLevel === 'Medium').length})
					</TabsTrigger>
					<TabsTrigger value='high'>
						High Risk (
						{MOCK_VAULTS.filter((v) => v.riskLevel === 'High').length})
					</TabsTrigger>
				</TabsList>

				<TabsContent value={selectedRiskLevel} className='space-y-4'>
					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
						{filteredVaults.map((vault) => (
							<VaultCard
								key={vault.id}
								vault={vault}
								onInvest={() => handleInvest(vault)}
							/>
						))}
					</div>

					{filteredVaults.length === 0 && (
						<Card className='text-center py-12'>
							<div className='text-4xl mb-4'>🏦</div>
							<h3 className='text-lg font-semibold mb-2'>No vaults found</h3>
							<p className='text-slate-600 dark:text-slate-400 mb-4'>
								No vaults match the selected risk level.
							</p>
						</Card>
					)}
				</TabsContent>
			</Tabs>

			{/* Invest Modal */}
			{selectedVault && (
				<InvestVaultModal
					vault={selectedVault}
					isOpen={isInvestModalOpen}
					onOpenChange={setIsInvestModalOpen}
				/>
			)}
		</div>
	);
}
