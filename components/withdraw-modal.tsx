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

interface VaultData {
	id: string;
	name: string;
	blockchain: string;
	chainId: number;
	contractAddress: string;
	supportedTokens: string[];
}

interface WithdrawModalProps {
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
	vault: VaultData | null;
}

export function WithdrawModal({
	isOpen,
	onOpenChange,
	vault,
}: WithdrawModalProps) {
	const [amount, setAmount] = useState<string>('');
	const [isLoading, setIsLoading] = useState(false);

	// Mock data
	const mockSharesBalance = '100.0';
	const mockMaxWithdraw = '50.0';

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

	const handleWithdraw = async () => {
		if (!amount || !vault) return;

		setIsLoading(true);

		// Simulate withdraw transaction
		await new Promise((resolve) => setTimeout(resolve, 2000));

		// Close modal and reset
		onOpenChange(false);
		setAmount('');
		setIsLoading(false);
	};

	const handleMaxWithdraw = () => {
		setAmount(mockMaxWithdraw);
	};

	return (
		<Dialog open={isOpen} onOpenChange={onOpenChange}>
			<DialogContent className='sm:max-w-md'>
				<DialogHeader>
					<DialogTitle className='text-center text-xl font-bold'>
						Withdraw from Vault
					</DialogTitle>
					<DialogDescription className='text-center text-slate-600 dark:text-slate-400'>
						Withdraw your liquidity and earned yield
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

						{/* Balance Info */}
						<div className='p-4 rounded-lg bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800'>
							<div className='space-y-2'>
								<div className='flex justify-between text-sm'>
									<span className='text-slate-600 dark:text-slate-400'>
										Your Shares:
									</span>
									<span className='font-medium'>{mockSharesBalance}</span>
								</div>
								<div className='flex justify-between text-sm'>
									<span className='text-slate-600 dark:text-slate-400'>
										Max Withdraw:
									</span>
									<span className='font-medium'>{mockMaxWithdraw}</span>
								</div>
							</div>
						</div>

						{/* Amount Input */}
						<div className='space-y-2'>
							<Label htmlFor='amount'>Withdraw Amount (Shares)</Label>
							<div className='flex gap-2'>
								<Input
									id='amount'
									type='number'
									placeholder='0.00'
									value={amount}
									onChange={(e) => setAmount(e.target.value)}
									className='flex-1 text-right'
								/>
								<Button onClick={handleMaxWithdraw} variant='neutral' size='sm'>
									Max
								</Button>
							</div>
						</div>

						{/* Demo Notice */}
						<Alert>
							<AlertDescription>
								This is a demo version. No real transactions will be made.
							</AlertDescription>
						</Alert>

						{/* Action Button */}
						<Button
							onClick={handleWithdraw}
							disabled={!amount || isLoading}
							className='w-full'
						>
							{isLoading ? 'Processing...' : 'Withdraw'}
						</Button>
					</div>
				)}
			</DialogContent>
		</Dialog>
	);
}
