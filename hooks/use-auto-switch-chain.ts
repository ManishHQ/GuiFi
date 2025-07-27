'use client';

import { useChainId, useSwitchChain, useAccount } from 'wagmi';
import { guiDevnet } from '@/app/wagmi';

export function useAutoSwitchChain() {
	const chainId = useChainId();
	const { switchChain } = useSwitchChain();
	const { isConnected } = useAccount();

	const switchToDevnet = async () => {
		if (!isConnected) return;

		try {
			await switchChain({ chainId: guiDevnet.id });
		} catch (error) {
			console.error('Failed to switch to devnet:', error);
		}
	};

	const isOnDevnet = chainId === guiDevnet.id;

	return {
		isOnDevnet,
		switchToDevnet,
		currentChainId: chainId,
		targetChainId: guiDevnet.id,
	};
}
