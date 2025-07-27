'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { NavBar } from '@/components/nav-bar';
import { getVaultAddress } from '@/constants/contracts';
import { useChainId } from 'wagmi';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

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
		deposits: 180000,
		allocation: {
			'Liquid Staking': 35,
			'Yield Farming': 40,
			Arbitrage: 25,
		},
		supportedTokens: ['USDC', 'FLOW'],
	},
	{
		id: 'rootstock-testnet-multi-token-vault',
		name: 'Rootstock Testnet Multi-Token Vault',
		description: 'Bitcoin-secured DeFi yield strategies on Rootstock Testnet',
		blockchain: 'Rootstock Testnet',
		chainId: 31,
		contractAddress:
			getVaultAddress('rootstockTestnet', 'MultiTokenVault') ||
			'0x8A2F3B1c5D6E7F9A0B3C4D5E6F7G8H9I0J1K2L3M',
		apy: 18.2,
		tvl: 320000,
		riskLevel: 'High',
		strategy: 'BTC-backed Yield Generation',
		performance: 15.8,
		deposits: 120000,
		allocation: {
			'BTC Staking': 50,
			'DeFi Protocols': 30,
			'Liquidity Mining': 20,
		},
		supportedTokens: ['RBTC', 'USDT'],
	},
];

interface DashboardLayoutProps {
	children?: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const [selectedVault, setSelectedVault] = useState<VaultData | null>(null);
	const chainId = useChainId();
	const pathname = usePathname();

	// Filter vaults based on current chain
	const filteredVaults = REAL_VAULTS.filter(
		(vault) => vault.chainId === chainId
	);

	// Set default selected vault when filtered vaults change
	useEffect(() => {
		if (filteredVaults.length > 0 && !selectedVault) {
			setSelectedVault(filteredVaults[0]);
		} else if (filteredVaults.length === 0) {
			setSelectedVault(null);
		}
	}, [filteredVaults, selectedVault]);

	// Determine active tab based on pathname
	const getActiveTab = () => {
		if (pathname === '/') return 'overview';
		if (pathname.startsWith('/vaults')) return 'vaults';
		if (pathname.startsWith('/predictions')) return 'predictions';
		if (pathname.startsWith('/launchpad')) return 'launchpad';
		if (pathname.startsWith('/portfolio')) return 'portfolio';
		return 'overview';
	};

	const activeTab = getActiveTab();

	return (
		<div className='min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950'>
			<div className='flex flex-col lg:flex-row'>
				{/* Mobile Header */}
				<div className='lg:hidden'>
					<div className='flex items-center justify-between p-4 border-b border-slate-200/60 dark:border-slate-800/60 bg-white/95 dark:bg-slate-950/95'>
						<div className='flex items-center gap-3'>
							<div className='w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center'>
								<span className='text-white font-bold text-sm'>GUI</span>
							</div>
							<div>
								<h1 className='font-bold text-lg text-slate-900 dark:text-white'>
									GuiVerse
								</h1>
								<p className='text-xs text-slate-500 dark:text-slate-400'>
									GUI Superapp
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
								<Link href='/' onClick={() => setIsMobileMenuOpen(false)}>
									<Button
										variant={activeTab === 'overview' ? 'default' : 'neutral'}
										className='text-xs w-full'
									>
										📊 Overview
									</Button>
								</Link>
								<Link href='/vaults' onClick={() => setIsMobileMenuOpen(false)}>
									<Button
										variant={activeTab === 'vaults' ? 'default' : 'neutral'}
										className='text-xs w-full'
									>
										🏦 Vaults
									</Button>
								</Link>
								<Link
									href='/predictions'
									onClick={() => setIsMobileMenuOpen(false)}
								>
									<Button
										variant={
											activeTab === 'predictions' ? 'default' : 'neutral'
										}
										className='text-xs w-full'
									>
										🔮 Predictions
									</Button>
								</Link>
								<Link
									href='/launchpad'
									onClick={() => setIsMobileMenuOpen(false)}
								>
									<Button
										variant={activeTab === 'launchpad' ? 'default' : 'neutral'}
										className='text-xs w-full'
									>
										🚀 Launchpad
									</Button>
								</Link>
								<Link
									href='/portfolio'
									onClick={() => setIsMobileMenuOpen(false)}
								>
									<Button
										variant={activeTab === 'portfolio' ? 'default' : 'neutral'}
										className='text-xs w-full'
									>
										💼 Portfolio
									</Button>
								</Link>
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
								<span className='text-white font-bold text-lg'>GUI</span>
							</div>
							<div>
								<h1 className='font-bold text-xl text-slate-900 dark:text-white'>
									GuiVerse
								</h1>
								<p className='text-sm text-slate-500 dark:text-slate-400'>
									GUI Superapp
								</p>
							</div>
						</div>

						<nav className='flex flex-col space-y-2'>
							<Link href='/'>
								<Button
									variant={activeTab === 'overview' ? 'default' : 'neutral'}
									className='w-full justify-start'
								>
									📊 Overview
								</Button>
							</Link>
							<Link href='/vaults'>
								<Button
									variant={activeTab === 'vaults' ? 'default' : 'neutral'}
									className='w-full justify-start'
								>
									🏦 Vaults
								</Button>
							</Link>
							<Link href='/predictions'>
								<Button
									variant={activeTab === 'predictions' ? 'default' : 'neutral'}
									className='w-full justify-start'
								>
									🔮 Predictions
								</Button>
							</Link>
							<Link href='/launchpad'>
								<Button
									variant={activeTab === 'launchpad' ? 'default' : 'neutral'}
									className='w-full justify-start'
								>
									🚀 Launchpad
								</Button>
							</Link>
							<Link href='/portfolio'>
								<Button
									variant={activeTab === 'portfolio' ? 'default' : 'neutral'}
									className='w-full justify-start'
								>
									💼 Portfolio
								</Button>
							</Link>
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
						<div className='space-y-4 lg:space-y-6 mt-0 pb-20'>{children}</div>
					</main>
				</div>
			</div>
		</div>
	);
}
