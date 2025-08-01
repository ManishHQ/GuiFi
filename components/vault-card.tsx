'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Shield, Zap } from 'lucide-react';

interface VaultCardProps {
	vault: {
		id: string;
		name: string;
		description: string;
		blockchain: string;
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
		supportedTokens: string[];
		minimumDeposit: number;
		maximumDeposit: number;
		lockPeriod: number;
		withdrawalFee: number;
		managementFee: number;
		performanceFee: number;
		status: string;
	};
	onInvest: () => void;
}

export function VaultCard({ vault, onInvest }: VaultCardProps) {
	const getRiskColor = (riskLevel: string) => {
		switch (riskLevel.toLowerCase()) {
			case 'low':
				return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
			case 'medium':
				return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
			case 'high':
				return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
			default:
				return 'bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-300';
		}
	};

	const getRiskIcon = (riskLevel: string) => {
		switch (riskLevel.toLowerCase()) {
			case 'low':
				return <Shield className='w-4 h-4' />;
			case 'medium':
				return <Zap className='w-4 h-4' />;
			case 'high':
				return <TrendingUp className='w-4 h-4' />;
			default:
				return <Shield className='w-4 h-4' />;
		}
	};

	const formatTVL = (tvl: number) => {
		if (tvl >= 1000000) {
			return `$${(tvl / 1000000).toFixed(1)}M`;
		} else if (tvl >= 1000) {
			return `$${(tvl / 1000).toFixed(1)}K`;
		}
		return `$${tvl.toLocaleString()}`;
	};

	return (
		<Card className='hover:shadow-lg transition-shadow cursor-pointer'>
			<CardHeader>
				<div className='flex items-center justify-between mb-2'>
					<div className='flex items-center gap-3'>
						<div className='w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold'>
							{vault.name.charAt(0)}
						</div>
						<div>
							<CardTitle className='text-lg'>{vault.name}</CardTitle>
							<p className='text-sm text-slate-600 dark:text-slate-400'>
								{vault.blockchain}
							</p>
						</div>
					</div>
					<Badge className={getRiskColor(vault.riskLevel)}>
						{getRiskIcon(vault.riskLevel)}
						<span className='ml-1'>{vault.riskLevel}</span>
					</Badge>
				</div>

				<p className='text-sm text-slate-600 dark:text-slate-400 line-clamp-2'>
					{vault.description}
				</p>

				<div className='flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400'>
					<span>📊 {vault.strategy}</span>
					<span>
						🔒{' '}
						{vault.lockPeriod === 0 ? 'No Lock' : `${vault.lockPeriod}d Lock`}
					</span>
				</div>
			</CardHeader>

			<CardContent className='space-y-4'>
				{/* APY and TVL */}
				<div className='grid grid-cols-2 gap-4'>
					<div className='text-center p-3 bg-green-50 dark:bg-green-950/50 rounded-lg'>
						<div className='text-2xl font-bold text-green-600'>
							{vault.apy.toFixed(1)}%
						</div>
						<div className='text-xs text-slate-600 dark:text-slate-400'>
							APY
						</div>
					</div>
					<div className='text-center p-3 bg-blue-50 dark:bg-blue-950/50 rounded-lg'>
						<div className='text-lg font-bold text-blue-600'>
							{formatTVL(vault.tvl)}
						</div>
						<div className='text-xs text-slate-600 dark:text-slate-400'>
							TVL
						</div>
					</div>
				</div>

				{/* Performance */}
				<div className='space-y-2'>
					<div className='text-sm font-medium text-slate-700 dark:text-slate-300'>
						Performance
					</div>
					<div className='grid grid-cols-4 gap-2 text-xs'>
						<div className='text-center'>
							<div
								className={`font-semibold ${
									vault.performance['1D'] >= 0
										? 'text-green-600'
										: 'text-red-600'
								}`}
							>
								{vault.performance['1D'] >= 0 ? '+' : ''}
								{vault.performance['1D']}%
							</div>
							<div className='text-slate-500'>1D</div>
						</div>
						<div className='text-center'>
							<div
								className={`font-semibold ${
									vault.performance['7D'] >= 0
										? 'text-green-600'
										: 'text-red-600'
								}`}
							>
								{vault.performance['7D'] >= 0 ? '+' : ''}
								{vault.performance['7D']}%
							</div>
							<div className='text-slate-500'>7D</div>
						</div>
						<div className='text-center'>
							<div
								className={`font-semibold ${
									vault.performance['30D'] >= 0
										? 'text-green-600'
										: 'text-red-600'
								}`}
							>
								{vault.performance['30D'] >= 0 ? '+' : ''}
								{vault.performance['30D']}%
							</div>
							<div className='text-slate-500'>30D</div>
						</div>
						<div className='text-center'>
							<div
								className={`font-semibold ${
									vault.performance['1Y'] >= 0
										? 'text-green-600'
										: 'text-red-600'
								}`}
							>
								{vault.performance['1Y'] >= 0 ? '+' : ''}
								{vault.performance['1Y']}%
							</div>
							<div className='text-slate-500'>1Y</div>
						</div>
					</div>
				</div>

				{/* Supported Tokens */}
				<div className='space-y-2'>
					<div className='text-sm font-medium text-slate-700 dark:text-slate-300'>
						Supported Tokens
					</div>
					<div className='flex flex-wrap gap-1'>
						{vault.supportedTokens.slice(0, 3).map((token) => (
							<Badge key={token} variant='neutral' className='text-xs'>
								{token}
							</Badge>
						))}
						{vault.supportedTokens.length > 3 && (
							<Badge variant='neutral' className='text-xs'>
								+{vault.supportedTokens.length - 3} more
							</Badge>
						)}
					</div>
				</div>

				{/* Fees */}
				<div className='grid grid-cols-3 gap-2 text-xs'>
					<div className='text-center p-2 bg-slate-50 dark:bg-slate-900 rounded'>
						<div className='font-semibold'>{vault.withdrawalFee}%</div>
						<div className='text-slate-500'>Withdrawal</div>
					</div>
					<div className='text-center p-2 bg-slate-50 dark:bg-slate-900 rounded'>
						<div className='font-semibold'>{vault.managementFee}%</div>
						<div className='text-slate-500'>Management</div>
					</div>
					<div className='text-center p-2 bg-slate-50 dark:bg-slate-900 rounded'>
						<div className='font-semibold'>{vault.performanceFee}%</div>
						<div className='text-slate-500'>Performance</div>
					</div>
				</div>

				{/* Investment Range */}
				<div className='text-xs text-slate-600 dark:text-slate-400 text-center'>
					Min: ${vault.minimumDeposit.toLocaleString()} | Max: $
					{vault.maximumDeposit.toLocaleString()}
				</div>

				{/* Invest Button */}
				<Button
					onClick={onInvest}
					className='w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
				>
					💰 Invest Now
				</Button>
			</CardContent>
		</Card>
	);
}
