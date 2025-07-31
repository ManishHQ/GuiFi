'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useTokenLaunchpadFactory } from '@/hooks/use-token-launchpad';

interface CreateTokenModalProps {
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
	onTokenCreated?: (tokenAddress: string) => void;
}

interface TokenForm {
	name: string;
	symbol: string;
	description: string;
	totalSupply: string;
	liquidityTarget: string;
	tokenPrice: string;
	website: string;
	twitter: string;
	telegram: string;
}

export function CreateTokenModal({
	isOpen,
	onOpenChange,
	onTokenCreated,
}: CreateTokenModalProps) {
	const [form, setForm] = useState<TokenForm>({
		name: '',
		symbol: '',
		description: '',
		totalSupply: '',
		liquidityTarget: '',
		tokenPrice: '',
		website: '',
		twitter: '',
		telegram: '',
	});
	const [isCreating, setIsCreating] = useState(false);
	const { createTokenLaunch } = useTokenLaunchpadFactory();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (
			!form.name ||
			!form.symbol ||
			!form.totalSupply ||
			!form.liquidityTarget ||
			!form.tokenPrice
		) {
			alert('Please fill in all required fields');
			return;
		}

		setIsCreating(true);
		try {
			const tokenAddress = await createTokenLaunch(
				form.name,
				form.symbol.toUpperCase(),
				form.description,
				parseInt(form.totalSupply),
				parseFloat(form.liquidityTarget),
				parseFloat(form.tokenPrice),
				form.website,
				form.twitter,
				form.telegram
			);

			// Reset form
			setForm({
				name: '',
				symbol: '',
				description: '',
				totalSupply: '',
				liquidityTarget: '',
				tokenPrice: '',
				website: '',
				twitter: '',
				telegram: '',
			});

			onOpenChange(false);
			if (onTokenCreated) {
				onTokenCreated(tokenAddress);
			}
		} catch (error) {
			console.error('Error creating token:', error);
			alert('Failed to create token. Please try again.');
		} finally {
			setIsCreating(false);
		}
	};

	const updateForm = (field: keyof TokenForm, value: string) => {
		setForm((prev) => ({ ...prev, [field]: value }));
	};

	return (
		<Dialog open={isOpen} onOpenChange={onOpenChange}>
			<DialogContent className='max-w-2xl max-h-[90vh] overflow-y-auto'>
				<DialogHeader>
					<DialogTitle className='text-2xl font-bold text-center'>
						🚀 Launch Your Memecoin
					</DialogTitle>
				</DialogHeader>

				<Alert className='mb-6'>
					<AlertDescription>
						Create and launch your own memecoin! This is a demo version - all
						interactions are simulated.
					</AlertDescription>
				</Alert>

				<form onSubmit={handleSubmit} className='space-y-6'>
					{/* Basic Token Info */}
					<Card>
						<CardHeader>
							<CardTitle>Token Information</CardTitle>
						</CardHeader>
						<CardContent className='space-y-4'>
							<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
								<div>
									<label className='text-sm font-medium text-slate-700 dark:text-slate-300'>
										Token Name *
									</label>
									<Input
										placeholder='e.g., DogeMoon'
										value={form.name}
										onChange={(e) => updateForm('name', e.target.value)}
										required
									/>
								</div>
								<div>
									<label className='text-sm font-medium text-slate-700 dark:text-slate-300'>
										Token Symbol *
									</label>
									<Input
										placeholder='e.g., DOGEMOON'
										value={form.symbol}
										onChange={(e) =>
											updateForm('symbol', e.target.value.toUpperCase())
										}
										maxLength={10}
										required
									/>
								</div>
							</div>
							<div>
								<label className='text-sm font-medium text-slate-700 dark:text-slate-300'>
									Description
								</label>
								<Textarea
									placeholder='Describe your memecoin...'
									value={form.description}
									onChange={(e) => updateForm('description', e.target.value)}
									rows={3}
								/>
							</div>
						</CardContent>
					</Card>

					{/* Token Economics */}
					<Card>
						<CardHeader>
							<CardTitle>Token Economics</CardTitle>
						</CardHeader>
						<CardContent className='space-y-4'>
							<div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
								<div>
									<label className='text-sm font-medium text-slate-700 dark:text-slate-300'>
										Total Supply *
									</label>
									<Input
										type='number'
										placeholder='1000000'
										value={form.totalSupply}
										onChange={(e) => updateForm('totalSupply', e.target.value)}
										required
									/>
									<p className='text-xs text-slate-500 mt-1'>
										Total tokens to be created
									</p>
								</div>
								<div>
									<label className='text-sm font-medium text-slate-700 dark:text-slate-300'>
										Liquidity Target (GUI) *
									</label>
									<Input
										type='number'
										step='0.1'
										placeholder='100'
										value={form.liquidityTarget}
										onChange={(e) =>
											updateForm('liquidityTarget', e.target.value)
										}
										required
									/>
									<p className='text-xs text-slate-500 mt-1'>
										GUI needed for launch
									</p>
								</div>
								<div>
									<label className='text-sm font-medium text-slate-700 dark:text-slate-300'>
										Token Price (GUI) *
									</label>
									<Input
										type='number'
										step='0.000001'
										placeholder='0.001'
										value={form.tokenPrice}
										onChange={(e) => updateForm('tokenPrice', e.target.value)}
										required
									/>
									<p className='text-xs text-slate-500 mt-1'>
										Price per token in GUI
									</p>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Social Links */}
					<Card>
						<CardHeader>
							<CardTitle>Social Links (Optional)</CardTitle>
						</CardHeader>
						<CardContent className='space-y-4'>
							<div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
								<div>
									<label className='text-sm font-medium text-slate-700 dark:text-slate-300'>
										Website
									</label>
									<Input
										type='url'
										placeholder='https://yourwebsite.com'
										value={form.website}
										onChange={(e) => updateForm('website', e.target.value)}
									/>
								</div>
								<div>
									<label className='text-sm font-medium text-slate-700 dark:text-slate-300'>
										Twitter
									</label>
									<Input
										type='url'
										placeholder='https://twitter.com/yourhandle'
										value={form.twitter}
										onChange={(e) => updateForm('twitter', e.target.value)}
									/>
								</div>
								<div>
									<label className='text-sm font-medium text-slate-700 dark:text-slate-300'>
										Telegram
									</label>
									<Input
										type='url'
										placeholder='https://t.me/yourgroup'
										value={form.telegram}
										onChange={(e) => updateForm('telegram', e.target.value)}
									/>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Preview */}
					{form.name && form.symbol && (
						<Card>
							<CardHeader>
								<CardTitle>Token Preview</CardTitle>
							</CardHeader>
							<CardContent>
								<div className='p-4 bg-slate-50 dark:bg-slate-900 rounded-lg'>
									<div className='flex items-center gap-3 mb-2'>
										<div className='w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center text-white font-bold'>
											{form.symbol.slice(0, 2)}
										</div>
										<div>
											<div className='font-semibold'>{form.name}</div>
											<div className='text-sm text-slate-600 dark:text-slate-400'>
												{form.symbol}
											</div>
										</div>
									</div>
									{form.description && (
										<p className='text-sm text-slate-600 dark:text-slate-400 mb-2'>
											{form.description}
										</p>
									)}
									<div className='grid grid-cols-3 gap-4 text-sm'>
										<div>
											<div className='text-slate-500'>Supply</div>
											<div className='font-medium'>
												{form.totalSupply
													? parseInt(form.totalSupply).toLocaleString()
													: '0'}
											</div>
										</div>
										<div>
											<div className='text-slate-500'>Price</div>
											<div className='font-medium'>
												{form.tokenPrice
													? `${parseFloat(form.tokenPrice).toFixed(6)} GUI`
													: '0 GUI'}
											</div>
										</div>
										<div>
											<div className='text-slate-500'>Target</div>
											<div className='font-medium'>
												{form.liquidityTarget
													? `${form.liquidityTarget} GUI`
													: '0 GUI'}
											</div>
										</div>
									</div>
								</div>
							</CardContent>
						</Card>
					)}

					{/* Action Buttons */}
					<div className='flex gap-3 pt-4'>
						<Button
							type='button'
							variant='neutral'
							onClick={() => onOpenChange(false)}
							className='flex-1'
						>
							Cancel
						</Button>
						<Button
							type='submit'
							disabled={
								isCreating ||
								!form.name ||
								!form.symbol ||
								!form.totalSupply ||
								!form.liquidityTarget ||
								!form.tokenPrice
							}
							className='flex-1 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700'
						>
							{isCreating ? 'Launching...' : '🚀 Launch Token'}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}
