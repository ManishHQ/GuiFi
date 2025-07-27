'use client';

import {
	useAccount,
	useChainId,
	useReadContract,
	useWriteContract,
} from 'wagmi';
import { formatEther, parseEther } from 'viem';
import { getTokenLaunchpadFactoryAddressById } from '@/constants/contracts';

// Simplified ABIs for the launchpad contracts
const TOKEN_LAUNCHPAD_FACTORY_ABI = [
	{
		inputs: [
			{ internalType: 'string', name: '_name', type: 'string' },
			{ internalType: 'string', name: '_symbol', type: 'string' },
			{ internalType: 'string', name: '_description', type: 'string' },
			{ internalType: 'uint256', name: '_totalSupply', type: 'uint256' },
			{ internalType: 'uint256', name: '_liquidityTarget', type: 'uint256' },
			{ internalType: 'uint256', name: '_tokenPrice', type: 'uint256' },
			{ internalType: 'string', name: '_website', type: 'string' },
			{ internalType: 'string', name: '_twitter', type: 'string' },
			{ internalType: 'string', name: '_telegram', type: 'string' },
		],
		name: 'createTokenLaunch',
		outputs: [{ internalType: 'address', name: '', type: 'address' }],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [],
		name: 'getAllLaunches',
		outputs: [{ internalType: 'address[]', name: '', type: 'address[]' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [{ internalType: 'address', name: 'creator', type: 'address' }],
		name: 'getCreatorLaunches',
		outputs: [{ internalType: 'address[]', name: '', type: 'address[]' }],
		stateMutability: 'view',
		type: 'function',
	},
] as const;

const LAUNCHPAD_TOKEN_ABI = [
	{
		inputs: [],
		name: 'name',
		outputs: [{ internalType: 'string', name: '', type: 'string' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'symbol',
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
		name: 'creator',
		outputs: [{ internalType: 'address', name: '', type: 'address' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'liquidityTarget',
		outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'liquidityRaised',
		outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'tokenPrice',
		outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'totalTokenSupply',
		outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'isLive',
		outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'isCompleted',
		outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'isFailed',
		outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'website',
		outputs: [{ internalType: 'string', name: '', type: 'string' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'twitter',
		outputs: [{ internalType: 'string', name: '', type: 'string' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'telegram',
		outputs: [{ internalType: 'string', name: '', type: 'string' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'getContributorCount',
		outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'getProgress',
		outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'getMarketCap',
		outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [{ internalType: 'address', name: '', type: 'address' }],
		name: 'contributions',
		outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
		name: 'balanceOf',
		outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'buyTokens',
		outputs: [],
		stateMutability: 'payable',
		type: 'function',
	},
] as const;

export interface TokenLaunchData {
	address: string;
	name: string;
	symbol: string;
	description: string;
	creator: string;
	liquidityTarget: string;
	liquidityRaised: string;
	tokenPrice: string;
	totalSupply: string;
	isLive: boolean;
	isCompleted: boolean;
	isFailed: boolean;
	website: string;
	twitter: string;
	telegram: string;
	contributorCount: number;
	progress: number;
	marketCap: string;
	userContribution: string;
	userTokens: string;
}

export function useTokenLaunchpadFactory() {
	const chainId = useChainId();
	const { writeContract, isPending: isCreating } = useWriteContract();

	const factoryAddress = getTokenLaunchpadFactoryAddressById(chainId);

	// Get all launches
	const { data: launchAddresses, refetch: refetchLaunches } = useReadContract({
		address: factoryAddress as `0x${string}`,
		abi: TOKEN_LAUNCHPAD_FACTORY_ABI,
		functionName: 'getAllLaunches',
		query: {
			enabled: !!factoryAddress,
		},
	});

	// Create a new token launch
	const createTokenLaunch = async (
		name: string,
		symbol: string,
		description: string,
		totalSupply: number,
		liquidityTargetEth: number,
		tokenPriceEth: number,
		website: string,
		twitter: string,
		telegram: string
	) => {
		if (!factoryAddress) throw new Error('Factory not deployed on this chain');

		try {
			await writeContract({
				address: factoryAddress as `0x${string}`,
				abi: TOKEN_LAUNCHPAD_FACTORY_ABI,
				functionName: 'createTokenLaunch',
				args: [
					name,
					symbol,
					description,
					BigInt(totalSupply),
					parseEther(liquidityTargetEth.toString()),
					parseEther(tokenPriceEth.toString()),
					website,
					twitter,
					telegram,
				],
			});
		} catch (error) {
			console.error('Error creating token launch:', error);
			throw error;
		}
	};

	// Simple function to create launch data for UI (since we can't make multiple useTokenLaunch calls dynamically)
	const getLaunchesForUI = () => {
		if (!Array.isArray(launchAddresses)) return [];

		return launchAddresses.map((address, index) => ({
			id: address,
			name: `Token Launch ${index + 1}`,
			symbol: `TKN${index + 1}`,
			description: `A new token launch on the platform`,
			creator: '0x1234...5678',
			totalSupply: 1000000,
			currentPrice: 0.001 + index * 0.0005,
			marketCap: 1000000 * (0.001 + index * 0.0005),
			liquidityRaised: Math.random() * 50000,
			liquidityTarget: 100000,
			participantCount: Math.floor(Math.random() * 200) + 10,
			launchDate: new Date(),
			status: ['live', 'upcoming', 'completed'][
				Math.floor(Math.random() * 3)
			] as 'live' | 'upcoming' | 'completed',
			category: 'DeFi',
			website: '',
			twitter: '',
			telegram: '',
			logo: '/api/placeholder/64/64',
			priceChange24h: Math.random() * 20 - 10, // -10 to +10
			marketScore: Math.floor(Math.random() * 40) + 60, // 60-100
		}));
	};

	return {
		factoryAddress,
		launchAddresses: launchAddresses || [],
		launches: getLaunchesForUI(),
		createTokenLaunch,
		isCreating,
		refetchLaunches,
	};
}

export function useTokenLaunch(launchAddress: string) {
	const { address: userAddress } = useAccount();
	const { writeContract, isPending: isBuying } = useWriteContract();

	// Read basic token data
	const { data: name } = useReadContract({
		address: launchAddress as `0x${string}`,
		abi: LAUNCHPAD_TOKEN_ABI,
		functionName: 'name',
		query: { enabled: !!launchAddress },
	});

	const { data: symbol } = useReadContract({
		address: launchAddress as `0x${string}`,
		abi: LAUNCHPAD_TOKEN_ABI,
		functionName: 'symbol',
		query: { enabled: !!launchAddress },
	});

	const { data: description } = useReadContract({
		address: launchAddress as `0x${string}`,
		abi: LAUNCHPAD_TOKEN_ABI,
		functionName: 'description',
		query: { enabled: !!launchAddress },
	});

	const { data: creator } = useReadContract({
		address: launchAddress as `0x${string}`,
		abi: LAUNCHPAD_TOKEN_ABI,
		functionName: 'creator',
		query: { enabled: !!launchAddress },
	});

	const { data: liquidityTarget } = useReadContract({
		address: launchAddress as `0x${string}`,
		abi: LAUNCHPAD_TOKEN_ABI,
		functionName: 'liquidityTarget',
		query: { enabled: !!launchAddress },
	});

	const { data: liquidityRaised } = useReadContract({
		address: launchAddress as `0x${string}`,
		abi: LAUNCHPAD_TOKEN_ABI,
		functionName: 'liquidityRaised',
		query: { enabled: !!launchAddress },
	});

	const { data: tokenPrice } = useReadContract({
		address: launchAddress as `0x${string}`,
		abi: LAUNCHPAD_TOKEN_ABI,
		functionName: 'tokenPrice',
		query: { enabled: !!launchAddress },
	});

	const { data: totalSupply } = useReadContract({
		address: launchAddress as `0x${string}`,
		abi: LAUNCHPAD_TOKEN_ABI,
		functionName: 'totalTokenSupply',
		query: { enabled: !!launchAddress },
	});

	const { data: isLive } = useReadContract({
		address: launchAddress as `0x${string}`,
		abi: LAUNCHPAD_TOKEN_ABI,
		functionName: 'isLive',
		query: { enabled: !!launchAddress },
	});

	const { data: isCompleted } = useReadContract({
		address: launchAddress as `0x${string}`,
		abi: LAUNCHPAD_TOKEN_ABI,
		functionName: 'isCompleted',
		query: { enabled: !!launchAddress },
	});

	const { data: isFailed } = useReadContract({
		address: launchAddress as `0x${string}`,
		abi: LAUNCHPAD_TOKEN_ABI,
		functionName: 'isFailed',
		query: { enabled: !!launchAddress },
	});

	const { data: website } = useReadContract({
		address: launchAddress as `0x${string}`,
		abi: LAUNCHPAD_TOKEN_ABI,
		functionName: 'website',
		query: { enabled: !!launchAddress },
	});

	const { data: twitter } = useReadContract({
		address: launchAddress as `0x${string}`,
		abi: LAUNCHPAD_TOKEN_ABI,
		functionName: 'twitter',
		query: { enabled: !!launchAddress },
	});

	const { data: telegram } = useReadContract({
		address: launchAddress as `0x${string}`,
		abi: LAUNCHPAD_TOKEN_ABI,
		functionName: 'telegram',
		query: { enabled: !!launchAddress },
	});

	const { data: contributorCount } = useReadContract({
		address: launchAddress as `0x${string}`,
		abi: LAUNCHPAD_TOKEN_ABI,
		functionName: 'getContributorCount',
		query: { enabled: !!launchAddress },
	});

	const { data: progress } = useReadContract({
		address: launchAddress as `0x${string}`,
		abi: LAUNCHPAD_TOKEN_ABI,
		functionName: 'getProgress',
		query: { enabled: !!launchAddress },
	});

	const { data: marketCap } = useReadContract({
		address: launchAddress as `0x${string}`,
		abi: LAUNCHPAD_TOKEN_ABI,
		functionName: 'getMarketCap',
		query: { enabled: !!launchAddress },
	});

	const { data: userContribution } = useReadContract({
		address: launchAddress as `0x${string}`,
		abi: LAUNCHPAD_TOKEN_ABI,
		functionName: 'contributions',
		args: [userAddress as `0x${string}`],
		query: { enabled: !!launchAddress && !!userAddress },
	});

	const { data: userTokens } = useReadContract({
		address: launchAddress as `0x${string}`,
		abi: LAUNCHPAD_TOKEN_ABI,
		functionName: 'balanceOf',
		args: [userAddress as `0x${string}`],
		query: { enabled: !!launchAddress && !!userAddress },
	});

	// Buy tokens
	const buyTokens = async (amountEth: number) => {
		if (!launchAddress) throw new Error('Invalid launch address');

		try {
			await writeContract({
				address: launchAddress as `0x${string}`,
				abi: LAUNCHPAD_TOKEN_ABI,
				functionName: 'buyTokens',
				value: parseEther(amountEth.toString()),
			});
		} catch (error) {
			console.error('Error buying tokens:', error);
			throw error;
		}
	};

	// Combine all data
	const launchData: TokenLaunchData | null =
		name &&
		symbol &&
		description &&
		creator &&
		liquidityTarget &&
		liquidityRaised &&
		tokenPrice &&
		totalSupply
			? {
					address: launchAddress,
					name,
					symbol,
					description,
					creator,
					liquidityTarget: formatEther(liquidityTarget),
					liquidityRaised: formatEther(liquidityRaised),
					tokenPrice: formatEther(tokenPrice),
					totalSupply: formatEther(totalSupply),
					isLive: isLive || false,
					isCompleted: isCompleted || false,
					isFailed: isFailed || false,
					website: website || '',
					twitter: twitter || '',
					telegram: telegram || '',
					contributorCount: Number(contributorCount || 0),
					progress: Number(progress || 0),
					marketCap: formatEther(marketCap || BigInt(0)),
					userContribution: formatEther(userContribution || BigInt(0)),
					userTokens: formatEther(userTokens || BigInt(0)),
			  }
			: null;

	return {
		launchData,
		buyTokens,
		isBuying,
	};
}
