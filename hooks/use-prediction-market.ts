import {
	useWriteContract,
	useReadContract,
	useAccount,
	useChainId,
} from 'wagmi';
import { parseEther, formatEther } from 'viem';
import { getPredictionMarketFactoryAddressById } from '@/constants/contracts';

// Simplified ABI for the current contracts
const PREDICTION_MARKET_FACTORY_ABI = [
	{
		inputs: [
			{ internalType: 'string', name: '_title', type: 'string' },
			{ internalType: 'string', name: '_description', type: 'string' },
			{ internalType: 'string', name: '_category', type: 'string' },
			{ internalType: 'uint256', name: '_endTime', type: 'uint256' },
		],
		name: 'createMarket',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [],
		name: 'getMarkets',
		outputs: [{ internalType: 'address[]', name: '', type: 'address[]' }],
		stateMutability: 'view',
		type: 'function',
	},
] as const;

const PREDICTION_MARKET_ABI = [
	{
		inputs: [],
		name: 'title',
		outputs: [{ internalType: 'string', name: '', type: 'string' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'description',
		outputs: [{ internalType: 'string', name: '', type: 'string' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'category',
		outputs: [{ internalType: 'string', name: '', type: 'string' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'creator',
		outputs: [{ internalType: 'address', name: '', type: 'address' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'endTime',
		outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'resolved',
		outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'resolvedOutcome',
		outputs: [{ internalType: 'uint8', name: '', type: 'uint8' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [{ internalType: 'bool', name: '_outcome', type: 'bool' }],
		name: 'placeBet',
		outputs: [],
		stateMutability: 'payable',
		type: 'function',
	},
	{
		inputs: [{ internalType: 'address', name: '', type: 'address' }],
		name: 'yesBets',
		outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [{ internalType: 'address', name: '', type: 'address' }],
		name: 'noBets',
		outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
		stateMutability: 'view',
		type: 'function',
	},
] as const;

export interface MarketData {
	address: string;
	title: string;
	description: string;
	category: string;
	creator: string;
	endTime: number;
	resolved: boolean;
	resolvedOutcome: number;
	userYesBets: string;
	userNoBets: string;
}

export function usePredictionMarketFactory() {
	const chainId = useChainId();
	const { writeContract, isPending: isCreating } = useWriteContract();

	const factoryAddress = getPredictionMarketFactoryAddressById(chainId);

	// Get all markets
	const {
		data: marketAddresses,
		refetch: refetchMarkets,
		error: marketsError,
		isLoading: marketsLoading,
	} = useReadContract({
		address: factoryAddress as `0x${string}`,
		abi: PREDICTION_MARKET_FACTORY_ABI,
		functionName: 'getMarkets',
		query: {
			enabled: !!factoryAddress,
		},
	});

	// Create a new market
	const createMarket = async (
		title: string,
		description: string,
		category: string,
		endTime: Date
	) => {
		if (!factoryAddress) throw new Error('Factory not deployed on this chain');

		try {
			const endTimeUnix = Math.floor(endTime.getTime() / 1000);

			await writeContract({
				address: factoryAddress as `0x${string}`,
				abi: PREDICTION_MARKET_FACTORY_ABI,
				functionName: 'createMarket',
				args: [title, description, category, BigInt(endTimeUnix)],
			});
		} catch (error) {
			console.error('Error creating market:', error);
			throw error;
		}
	};

	return {
		factoryAddress,
		marketAddresses: marketAddresses || [],
		createMarket,
		isCreating,
		refetchMarkets,
		marketsError,
		marketsLoading,
	};
}

export function usePredictionMarket(marketAddress: string) {
	const { address: userAddress } = useAccount();
	const { writeContract, isPending: isBetting } = useWriteContract();

	// Read market data
	const { data: title } = useReadContract({
		address: marketAddress as `0x${string}`,
		abi: PREDICTION_MARKET_ABI,
		functionName: 'title',
		query: { enabled: !!marketAddress },
	});

	const { data: description } = useReadContract({
		address: marketAddress as `0x${string}`,
		abi: PREDICTION_MARKET_ABI,
		functionName: 'description',
		query: { enabled: !!marketAddress },
	});

	const { data: category } = useReadContract({
		address: marketAddress as `0x${string}`,
		abi: PREDICTION_MARKET_ABI,
		functionName: 'category',
		query: { enabled: !!marketAddress },
	});

	const { data: creator } = useReadContract({
		address: marketAddress as `0x${string}`,
		abi: PREDICTION_MARKET_ABI,
		functionName: 'creator',
		query: { enabled: !!marketAddress },
	});

	const { data: endTime } = useReadContract({
		address: marketAddress as `0x${string}`,
		abi: PREDICTION_MARKET_ABI,
		functionName: 'endTime',
		query: { enabled: !!marketAddress },
	});

	const { data: resolved } = useReadContract({
		address: marketAddress as `0x${string}`,
		abi: PREDICTION_MARKET_ABI,
		functionName: 'resolved',
		query: { enabled: !!marketAddress },
	});

	const { data: resolvedOutcome } = useReadContract({
		address: marketAddress as `0x${string}`,
		abi: PREDICTION_MARKET_ABI,
		functionName: 'resolvedOutcome',
		query: { enabled: !!marketAddress },
	});

	const { data: userYesBets } = useReadContract({
		address: marketAddress as `0x${string}`,
		abi: PREDICTION_MARKET_ABI,
		functionName: 'yesBets',
		args: [userAddress as `0x${string}`],
		query: { enabled: !!marketAddress && !!userAddress },
	});

	const { data: userNoBets } = useReadContract({
		address: marketAddress as `0x${string}`,
		abi: PREDICTION_MARKET_ABI,
		functionName: 'noBets',
		args: [userAddress as `0x${string}`],
		query: { enabled: !!marketAddress && !!userAddress },
	});

	// Place a bet
	const placeBet = async (outcome: boolean, amount: string) => {
		if (!marketAddress) throw new Error('Market address not provided');

		try {
			await writeContract({
				address: marketAddress as `0x${string}`,
				abi: PREDICTION_MARKET_ABI,
				functionName: 'placeBet',
				args: [outcome],
				value: parseEther(amount),
			});
		} catch (error) {
			console.error('Error placing bet:', error);
			throw error;
		}
	};

	const marketData: MarketData | null =
		marketAddress && title
			? {
					address: marketAddress,
					title: title as string,
					description: (description as string) || '',
					category: (category as string) || '',
					creator: (creator as string) || '',
					endTime: Number(endTime || 0),
					resolved: Boolean(resolved),
					resolvedOutcome: Number(resolvedOutcome || 0),
					userYesBets: formatEther(userYesBets || BigInt(0)),
					userNoBets: formatEther(userNoBets || BigInt(0)),
			  }
			: null;

	return {
		marketData,
		placeBet,
		isBetting,
	};
}
