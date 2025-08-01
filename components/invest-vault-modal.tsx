'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, Zap, TrendingUp, AlertTriangle } from 'lucide-react';

interface InvestVaultModalProps {
	vault: {
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
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
}

export function InvestVaultModal({
	vault,
	isOpen,
	onOpenChange,
}: InvestVaultModalProps) {
	const [selectedToken, setSelectedToken] = useState(vault.supportedTokens[0]);
	const [amount, setAmount] = useState('');
	const [isInvesting, setIsInvesting] = useState(false);

	// Mock token balances
	const mockBalances = {
		USDC: '5000.00',
		USDT: '2500.00',
		DAI: '1500.00',
		WETH: '25.00',
		WBTC: '2.50',
		DOGEMOON: '1250000.00',
		PEPE: '50000.00',
		SHIB2: '200000.00',
		FLOW: '10000.00',
		DAO: '5000.00',
		FRAX: '3000.00',
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

	const formatTVL = (tvl: number) => {
		if (tvl >= 1000000) {
			return `$${(tvl / 1000000).toFixed(1)}M`;
		} else if (tvl >= 1000) {
			return `$${(tvl / 1000).toFixed(1)}K`;
		}
		return `$${tvl.toLocaleString()}`;
	};

	const calculateExpectedReturn = () => {
		const numAmount = parseFloat(amount) || 0;
		const annualReturn = (numAmount * vault.apy) / 100;
		return {
			daily: annualReturn / 365,
			weekly: annualReturn / 52,
			monthly: annualReturn / 12,
			yearly: annualReturn,
		};
	};

	const handleInvest = async () => {
		if (!amount || parseFloat(amount) < vault.minimumDeposit) {
			alert(`Minimum deposit is $${vault.minimumDeposit.toLocaleString()}`);
			return;
		}

		setIsInvesting(true);
		try {
			// Simulate investment transaction
			await new Promise((resolve) => setTimeout(resolve, 2000));
			alert(
				'Investment successful! Your funds have been deposited into the vault.'
			);
			setAmount('');
			onOpenChange(false);
		} catch (error) {
			console.error('Error investing:', error);
			alert('Investment failed. Please try again.');
		} finally {
			setIsInvesting(false);
		}
	};

	const expectedReturns = calculateExpectedReturn();

	return (
		<Dialog open={isOpen} onOpenChange={onOpenChange}>
			<DialogContent className='max-w-4xl max-h-[90vh] overflow-y-auto'>
				<DialogHeader>
					<DialogTitle className='text-2xl font-bold text-center'>
						💰 Invest in {vault.name}
					</DialogTitle>
				</DialogHeader>

				<Alert className='mb-6'>
					<AlertDescription>
						This is a demo version. All investments are simulated for
						demonstration purposes.
					</AlertDescription>
				</Alert>

				<div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
					{/* Investment Form */}
					<div className='space-y-6'>
						<Card>
							<CardHeader>
								<CardTitle>Investment Details</CardTitle>
							</CardHeader>
							<CardContent className='space-y-4'>
								{/* Token Selection */}
								<div className='space-y-2'>
									<label className='text-sm font-medium text-slate-700 dark:text-slate-300'>
										Select Token
									</label>
									<select
										value={selectedToken}
										onChange={(e) => setSelectedToken(e.target.value)}
										className='w-full p-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white'
									>
										{vault.supportedTokens.map((token) => (
											<option key={token} value={token}>
												{token} - Balance:{' '}
												{mockBalances[token as keyof typeof mockBalances] ||
													'0.00'}
											</option>
										))}
									</select>
								</div>

								{/* Amount Input */}
								<div className='space-y-2'>
									<label className='text-sm font-medium text-slate-700 dark:text-slate-300'>
										Investment Amount
									</label>
									<Input
										type='number'
										placeholder='0.00'
										value={amount}
										onChange={(e) => setAmount(e.target.value)}
										className='text-right'
									/>
									<div className='text-xs text-slate-500 dark:text-slate-400'>
										Min: ${vault.minimumDeposit.toLocaleString()} | Max: $
										{vault.maximumDeposit.toLocaleString()}
									</div>
								</div>

								{/* Expected Returns */}
								{amount && parseFloat(amount) > 0 && (
									<div className='p-4 bg-green-50 dark:bg-green-950/50 rounded-lg'>
										<div className='text-sm font-medium text-green-800 dark:text-green-300 mb-2'>
											Expected Returns (at {vault.apy}% APY)
										</div>
										<div className='grid grid-cols-2 gap-2 text-xs'>
											<div>Daily: ${expectedReturns.daily.toFixed(2)}</div>
											<div>Weekly: ${expectedReturns.weekly.toFixed(2)}</div>
											<div>Monthly: ${expectedReturns.monthly.toFixed(2)}</div>
											<div>Yearly: ${expectedReturns.yearly.toFixed(2)}</div>
										</div>
									</div>
								)}

								{/* Invest Button */}
								<Button
									onClick={handleInvest}
									disabled={
										!amount ||
										isInvesting ||
										parseFloat(amount) < vault.minimumDeposit
									}
									className='w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700'
								>
									{isInvesting ? 'Investing...' : '💰 Invest Now'}
								</Button>
							</CardContent>
						</Card>

						{/* Risk Warning */}
						<Card>
							<CardHeader>
								<CardTitle className='flex items-center gap-2'>
									<AlertTriangle className='w-5 h-5 text-orange-500' />
									Risk Warning
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className='text-sm text-slate-600 dark:text-slate-400 space-y-2'>
									<p>• Past performance does not guarantee future returns</p>
									<p>• DeFi investments carry inherent risks</p>
									<p>• Only invest what you can afford to lose</p>
									<p>
										• Lock period:{' '}
										{vault.lockPeriod === 0
											? 'No lock'
											: `${vault.lockPeriod} days`}
									</p>
								</div>
							</CardContent>
						</Card>
					</div>

					{/* Vault Information */}
					<div className='space-y-6'>
						{/* Vault Overview */}
						<Card>
							<CardHeader>
								<CardTitle>Vault Overview</CardTitle>
							</CardHeader>
							<CardContent className='space-y-4'>
								<div className='flex items-center justify-between'>
									<span className='text-sm text-slate-600 dark:text-slate-400'>
										Risk Level
									</span>
									<Badge className={getRiskColor(vault.riskLevel)}>
										{getRiskIcon(vault.riskLevel)}
										<span className='ml-1'>{vault.riskLevel}</span>
									</Badge>
								</div>
								<div className='flex items-center justify-between'>
									<span className='text-sm text-slate-600 dark:text-slate-400'>
										APY
									</span>
									<span className='font-bold text-green-600'>{vault.apy}%</span>
								</div>
								<div className='flex items-center justify-between'>
									<span className='text-sm text-slate-600 dark:text-slate-400'>
										TVL
									</span>
									<span className='font-bold'>{formatTVL(vault.tvl)}</span>
								</div>
								<div className='flex items-center justify-between'>
									<span className='text-sm text-slate-600 dark:text-slate-400'>
										Strategy
									</span>
									<span className='font-medium'>{vault.strategy}</span>
								</div>
							</CardContent>
						</Card>

						{/* Performance */}
						<Card>
							<CardHeader>
								<CardTitle>Performance</CardTitle>
							</CardHeader>
							<CardContent>
								<div className='grid grid-cols-2 gap-4'>
									<div className='text-center'>
										<div
											className={`text-lg font-bold ${
												vault.performance['30D'] >= 0
													? 'text-green-600'
													: 'text-red-600'
											}`}
										>
											{vault.performance['30D'] >= 0 ? '+' : ''}
											{vault.performance['30D']}%
										</div>
										<div className='text-xs text-slate-500'>30 Days</div>
									</div>
									<div className='text-center'>
										<div
											className={`text-lg font-bold ${
												vault.performance['1Y'] >= 0
													? 'text-green-600'
													: 'text-red-600'
											}`}
										>
											{vault.performance['1Y'] >= 0 ? '+' : ''}
											{vault.performance['1Y']}%
										</div>
										<div className='text-xs text-slate-500'>1 Year</div>
									</div>
								</div>
							</CardContent>
						</Card>

						{/* Fees */}
						<Card>
							<CardHeader>
								<CardTitle>Fees</CardTitle>
							</CardHeader>
							<CardContent>
								<div className='space-y-3'>
									<div className='flex justify-between'>
										<span className='text-sm text-slate-600 dark:text-slate-400'>
											Withdrawal Fee
										</span>
										<span className='font-medium'>{vault.withdrawalFee}%</span>
									</div>
									<div className='flex justify-between'>
										<span className='text-sm text-slate-600 dark:text-slate-400'>
											Management Fee
										</span>
										<span className='font-medium'>{vault.managementFee}%</span>
									</div>
									<div className='flex justify-between'>
										<span className='text-sm text-slate-600 dark:text-slate-400'>
											Performance Fee
										</span>
										<span className='font-medium'>{vault.performanceFee}%</span>
									</div>
								</div>
							</CardContent>
						</Card>

						{/* Strategy Allocation */}
						<Card>
							<CardHeader>
								<CardTitle>Strategy Allocation</CardTitle>
							</CardHeader>
							<CardContent>
								<div className='space-y-3'>
									{Object.entries(vault.allocation).map(
										([protocol, percentage]) => (
											<div key={protocol} className='space-y-1'>
												<div className='flex justify-between text-sm'>
													<span className='text-slate-600 dark:text-slate-400'>
														{protocol}
													</span>
													<span className='font-medium'>{percentage}%</span>
												</div>
												<Progress value={percentage} className='h-2' />
											</div>
										)
									)}
								</div>
							</CardContent>
						</Card>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
