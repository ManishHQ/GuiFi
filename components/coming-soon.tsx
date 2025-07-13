'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ComingSoonProps {
	title: string;
	description: string;
	icon?: string;
	featureName?: string;
}

export function ComingSoon({
	title,
	description,
	icon = '🚧',
	featureName = 'This feature',
}: ComingSoonProps) {
	return (
		<div className='space-y-6 relative pb-20'>
			<div>
				<h2 className='text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white'>
					{title}
				</h2>
				<p className='text-slate-600 dark:text-slate-400'>{description}</p>
			</div>

			<div className='flex items-center justify-center min-h-[400px]'>
				<Card className='bg-white/95 dark:bg-slate-950/95 backdrop-blur-sm border-slate-200/60 dark:border-slate-800/60 max-w-md w-full'>
					<CardContent className='p-8 text-center'>
						<div className='text-6xl mb-4'>{icon}</div>
						<h3 className='text-xl font-semibold text-slate-900 dark:text-white mb-2'>
							Coming Soon
						</h3>
						<p className='text-slate-600 dark:text-slate-400 mb-6'>
							{featureName} is currently under development. We&apos;re working
							hard to bring you the best experience possible.
						</p>
						<div className='space-y-3'>
							<div className='flex items-center justify-center gap-2 text-sm text-slate-500 dark:text-slate-400'>
								<div className='w-2 h-2 bg-blue-500 rounded-full animate-pulse'></div>
								<span>In Development</span>
							</div>
							<Button
								variant='neutral'
								size='sm'
								disabled
								className='cursor-not-allowed'
							>
								Notify When Ready
							</Button>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
