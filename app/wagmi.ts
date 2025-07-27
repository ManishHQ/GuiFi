import { http, createConfig } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { base, rootstock, rootstockTestnet, flowTestnet } from 'wagmi/chains';
import { defineChain } from 'viem';

// Define GUI Devnet chain
export const guiDevnet = defineChain({
	id: 42069,
	name: 'GUI Devnet',
	nativeCurrency: {
		decimals: 18,
		name: 'Ether',
		symbol: 'ETH',
	},
	rpcUrls: {
		default: {
			http: ['https://devnet.uminetwork.com'],
		},
	},
	blockExplorers: {
		default: {
			name: 'GUI Explorer',
			url: 'https://devnet.explorer.moved.network',
		},
	},
});

export const config = createConfig({
	chains: [guiDevnet, base, rootstock, rootstockTestnet, flowTestnet],
	connectors: [
		injected(), // Solo MetaMask/Injected wallets
	],
	transports: {
		[guiDevnet.id]: http(),
		[base.id]: http(),
		[rootstock.id]: http(),
		[rootstockTestnet.id]: http(),
		[flowTestnet.id]: http(),
	},
	ssr: true,
	// storage: undefined, // Comentado para permitir persistencia de wallet
});
