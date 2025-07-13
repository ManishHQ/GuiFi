'use client';

import { useChainId, useSwitchChain, useAccount } from 'wagmi';
import { umiDevnet } from '@/app/wagmi';

export function useAutoSwitchChain() {
	const chainId = useChainId();
	const { switchChain } = useSwitchChain();
	const { isConnected } = useAccount();

	const switchToDevnet = async () => {
		if (!isConnected) return;

		try {
			await switchChain({ chainId: umiDevnet.id });
		} catch (error) {
			console.error('Failed to switch to devnet:', error);
		}
	};

	const isOnDevnet = chainId === umiDevnet.id;

	return {
		isOnDevnet,
		switchToDevnet,
		currentChainId: chainId,
		targetChainId: umiDevnet.id,
	};
}
