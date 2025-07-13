import { http, createConfig } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { base, rootstock, rootstockTestnet, flowTestnet } from 'wagmi/chains';
import { defineChain } from 'viem';

// Define Umi Devnet chain
export const umiDevnet = defineChain({
	id: 42069,
	name: 'Umi Devnet',
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
			name: 'Umi Explorer',
			url: 'https://devnet.explorer.moved.network',
		},
	},
});

export const config = createConfig({
	chains: [umiDevnet, base, rootstock, rootstockTestnet, flowTestnet],
	connectors: [
		injected(), // Solo MetaMask/Injected wallets
	],
	transports: {
		[umiDevnet.id]: http(),
		[base.id]: http(),
		[rootstock.id]: http(),
		[rootstockTestnet.id]: http(),
		[flowTestnet.id]: http(),
	},
	ssr: true,
	// storage: undefined, // Comentado para permitir persistencia de wallet
});
