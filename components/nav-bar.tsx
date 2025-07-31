import { useState, useEffect } from 'react';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export function NavBar() {
	const [showChainMenu, setShowChainMenu] = useState(false);

	// Close menu when clicking outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			const target = event.target as Element;
			if (!target.closest('.chain-menu-container')) {
				setShowChainMenu(false);
			}
		};

		if (showChainMenu) {
			document.addEventListener('click', handleClickOutside);
			return () => document.removeEventListener('click', handleClickOutside);
		}
	}, [showChainMenu]);

	return (
		<>
			{/* Floating Info */}
			<div className='fixed top-4 right-4 z-50 flex items-center gap-3'>
				{/* Demo User Info */}
				<div className='flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 rounded-lg bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 shadow-lg'>
					<Avatar className='w-6 h-6 sm:w-8 sm:h-8'>
						<AvatarFallback className='bg-gradient-to-br from-blue-500 to-indigo-500 text-white text-xs'>
							U
						</AvatarFallback>
					</Avatar>
					<div className='text-left'>
						<div className='text-sm font-medium text-slate-900 dark:text-white'>
							<span className='hidden sm:inline'>Demo User</span>
							<span className='sm:hidden'>Demo</span>
						</div>
						<div className='hidden sm:block text-xs text-slate-500 dark:text-slate-400 font-mono'>
							Demo Mode
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
