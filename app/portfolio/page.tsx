import { UserPositions } from '@/components/user-positions';
import { TransactionHistory } from '@/components/transaction-history';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function PortfolioPage() {
	return (
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
	);
}
