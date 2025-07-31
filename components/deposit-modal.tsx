'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { DepositSuccess } from './deposit-success';

interface VaultData {
	id: string;
	name: string;
	blockchain: string;
	chainId: number;
	contractAddress: string;
	supportedTokens: string[];
}

interface DepositModalProps {
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
	vault: VaultData | null;
	goToFaucet: () => void;
}

export function DepositModal({
	isOpen,
	onOpenChange,
	vault,
	goToFaucet,
}: DepositModalProps) {
	const [selectedToken, setSelectedToken] = useState<string>('');
	const [amount, setAmount] = useState<string>('');
	const [showSuccess, setShowSuccess] = useState(false);
	const [depositData, setDepositData] = useState<{
		tokenName: string;
		amount: string;
		usdValue: string;
		vaultName: string;
	} | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	// Mock token balances for demo
	const mockBalances = {
		USDC: '5000.00',
		USDT: '2500.00',
		DAI: '1500.00',
		WETH: '25.00',
		WBTC: '2.50',
		FLOW: '10000.00',
		DOGEMOON: '1250000.00',
		PEPE: '50000.00',
		SHIB2: '200000.00',
		CAT: '8333.00',
		BANANA: '16667.00',
		ROCKET: '62500.00',
		DIAMOND: '50000.00',
		LAMBO: '250000.00',
		DAO: '5000.00',
	};

	const getAllowedTokens = () => {
		return Object.keys(mockBalances);
	};

	const getBlockchainName = (blockchain: string | undefined) => {
		switch (blockchain) {
			case 'Flow Testnet':
				return '🌊 Flow Testnet';
			case 'Rootstock Testnet':
				return '₿ Rootstock Testnet';
			default:
				return blockchain;
		}
	};

	const getBlockchainColor = (blockchain: string) => {
		switch (blockchain) {
			case 'Flow Testnet':
				return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
			case 'Rootstock Testnet':
				return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
			default:
				return 'bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-300';
		}
	};

	const getApproximateUSDValue = (token: string, amount: string) => {
		const tokenPrices: { [key: string]: number } = {
			USDC: 1.0,
			USDT: 1.0,
			DAI: 1.0,
			WETH: 3000.0,
			WBTC: 45000.0,
			FLOW: 0.5,
			DOGEMOON: 0.001,
			PEPE: 0.002,
			SHIB2: 0.0005,
			CAT: 0.003,
			BANANA: 0.0015,
			ROCKET: 0.0008,
			DIAMOND: 0.002,
			LAMBO: 0.0003,
			DAO: 1.5,
		};

		const price = tokenPrices[token] || 0;
		return (parseFloat(amount) * price).toFixed(2);
	};

	const handleDeposit = async () => {
		if (!selectedToken || !amount || !vault) return;

		setIsLoading(true);

		// Simulate deposit transaction
		await new Promise((resolve) => setTimeout(resolve, 2000));

		setDepositData({
			tokenName: selectedToken,
			amount,
			usdValue: getApproximateUSDValue(selectedToken, amount),
			vaultName: vault.name,
		});

		setShowSuccess(true);
		setIsLoading(false);
	};

	const handleClose = () => {
		onOpenChange(false);
		setShowSuccess(false);
		setDepositData(null);
		setAmount('');
		setSelectedToken('');
	};

	if (showSuccess && depositData) {
		return (
			<DepositSuccess
				isOpen={showSuccess}
				onOpenChange={handleClose}
				data={depositData}
			/>
		);
	}

	return (
		<Dialog open={isOpen} onOpenChange={onOpenChange}>
			<DialogContent className='sm:max-w-md'>
				<DialogHeader>
					<DialogTitle className='text-center text-xl font-bold'>
						Deposit to Vault
					</DialogTitle>
					<DialogDescription className='text-center text-slate-600 dark:text-slate-400'>
						Add liquidity to earn yield
					</DialogDescription>
				</DialogHeader>

				{vault && (
					<div className='space-y-4 py-4'>
						{/* Vault Info */}
						<div className='p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50'>
							<div className='flex items-center justify-between mb-2'>
								<h3 className='font-semibold text-slate-900 dark:text-white'>
									{vault.name}
								</h3>
								<Badge className={getBlockchainColor(vault.blockchain)}>
									{getBlockchainName(vault.blockchain)}
								</Badge>
							</div>
							<p className='text-sm text-slate-600 dark:text-slate-400'>
								Contract: {vault.contractAddress.slice(0, 6)}...
								{vault.contractAddress.slice(-4)}
							</p>
						</div>

						{/* Token Selection */}
						<div className='space-y-2'>
							<Label htmlFor='token'>Select Token</Label>
							<select
								id='token'
								value={selectedToken}
								onChange={(e) => setSelectedToken(e.target.value)}
								className='w-full p-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white'
							>
								<option value=''>Choose a token</option>
								{getAllowedTokens().map((token) => (
									<option key={token} value={token}>
										{token} - Balance:{' '}
										{mockBalances[token as keyof typeof mockBalances] || '0.00'}
									</option>
								))}
							</select>
						</div>

						{/* Amount Input */}
						<div className='space-y-2'>
							<Label htmlFor='amount'>Amount</Label>
							<Input
								id='amount'
								type='number'
								placeholder='0.00'
								value={amount}
								onChange={(e) => setAmount(e.target.value)}
								className='text-right'
							/>
							{selectedToken && amount && (
								<div className='text-sm text-slate-500 dark:text-slate-400'>
									≈ ${getApproximateUSDValue(selectedToken, amount)} USD
								</div>
							)}
						</div>

						{/* Demo Notice */}
						<Alert>
							<AlertDescription>
								This is a demo version. No real transactions will be made.
							</AlertDescription>
						</Alert>

						{/* Action Buttons */}
						<div className='flex gap-3 pt-4'>
							<Button onClick={goToFaucet} variant='neutral' className='flex-1'>
								Get Test Tokens
							</Button>
							<Button
								onClick={handleDeposit}
								disabled={!selectedToken || !amount || isLoading}
								className='flex-1'
							>
								{isLoading ? 'Processing...' : 'Deposit'}
							</Button>
						</div>
					</div>
				)}
			</DialogContent>
		</Dialog>
	);
}
