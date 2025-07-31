import { useState, useEffect } from 'react';

// Mock data for demonstration
const MOCK_MARKETS = [
	{
		address: '0x1234567890123456789012345678901234567890',
		title: 'Will Bitcoin reach $100k by end of 2024?',
		description:
			'A prediction market for Bitcoin price movement. Will BTC reach the $100,000 milestone before December 31, 2024?',
		category: 'Cryptocurrency',
		creator: '0xDemoCreator123456789012345678901234567890',
		endTime: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days from now
		resolved: false,
		resolvedOutcome: 0,
		userYesBets: '0',
		userNoBets: '0',
	},
	{
		address: '0x2345678901234567890123456789012345678901',
		title: 'Will Ethereum 2.0 launch successfully?',
		description:
			'Prediction on Ethereum upgrade success. Will the GUI 2.0 upgrade complete without major issues?',
		category: 'Technology',
		creator: '0xTestCreator123456789012345678901234567890',
		endTime: Date.now() + 15 * 24 * 60 * 60 * 1000, // 15 days from now
		resolved: false,
		resolvedOutcome: 0,
		userYesBets: '0',
		userNoBets: '0',
	},
	{
		address: '0x3456789012345678901234567890123456789012',
		title: 'Will Tesla stock reach $300 by Q2 2024?',
		description:
			'Tesla stock price prediction. Will TSLA reach $300 per share by the end of Q2 2024?',
		category: 'Stocks',
		creator: '0xStockTrader123456789012345678901234567890',
		endTime: Date.now() + 45 * 24 * 60 * 60 * 1000, // 45 days from now
		resolved: false,
		resolvedOutcome: 0,
		userYesBets: '0',
		userNoBets: '0',
	},
	{
		address: '0x4567890123456789012345678901234567890123',
		title: 'Will the Lakers win the NBA Championship?',
		description:
			'NBA Championship prediction. Will the Los Angeles Lakers win the 2024 NBA Championship?',
		category: 'Sports',
		creator: '0xSportsFan123456789012345678901234567890',
		endTime: Date.now() + 60 * 24 * 60 * 60 * 1000, // 60 days from now
		resolved: false,
		resolvedOutcome: 0,
		userYesBets: '0',
		userNoBets: '0',
	},
	{
		address: '0x5678901234567890123456789012345678901234',
		title: 'Will AI replace 50% of jobs by 2030?',
		description:
			'AI impact prediction. Will artificial intelligence replace at least 50% of current jobs by 2030?',
		category: 'Technology',
		creator: '0xTechGuru123456789012345678901234567890',
		endTime: Date.now() + 90 * 24 * 60 * 60 * 1000, // 90 days from now
		resolved: false,
		resolvedOutcome: 0,
		userYesBets: '0',
		userNoBets: '0',
	},
	{
		address: '0x6789012345678901234567890123456789012345',
		title: 'Will SpaceX land on Mars by 2026?',
		description:
			'Space exploration prediction. Will SpaceX successfully land a spacecraft on Mars by 2026?',
		category: 'Technology',
		creator: '0xSpaceExplorer123456789012345678901234567890',
		endTime: Date.now() + 120 * 24 * 60 * 60 * 1000, // 120 days from now
		resolved: false,
		resolvedOutcome: 0,
		userYesBets: '0',
		userNoBets: '0',
	},
	{
		address: '0x7890123456789012345678901234567890123456',
		title: 'Will the Fed raise interest rates in Q1 2024?',
		description:
			'Federal Reserve policy prediction. Will the Federal Reserve raise interest rates in Q1 2024?',
		category: 'Finance',
		creator: '0xFinanceExpert123456789012345678901234567890',
		endTime: Date.now() + 20 * 24 * 60 * 60 * 1000, // 20 days from now
		resolved: false,
		resolvedOutcome: 0,
		userYesBets: '0',
		userNoBets: '0',
	},
	{
		address: '0x8901234567890123456789012345678901234567',
		title: 'Will a new president be elected in 2024?',
		description:
			'Political prediction. Will there be a new president elected in the 2024 US election?',
		category: 'Politics',
		creator: '0xPoliticalAnalyst123456789012345678901234567890',
		endTime: Date.now() + 180 * 24 * 60 * 60 * 1000, // 180 days from now
		resolved: false,
		resolvedOutcome: 0,
		userYesBets: '0',
		userNoBets: '0',
	},
];

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
	const [markets, setMarkets] = useState<MarketData[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		// Simulate loading
		setTimeout(() => {
			setMarkets(MOCK_MARKETS);
			setIsLoading(false);
		}, 1000);
	}, []);

	const createMarket = async (
		title: string,
		description: string,
		category: string,
		endTime: Date
	) => {
		try {
			// Simulate API call
			await new Promise((resolve) => setTimeout(resolve, 2000));

			const newMarket: MarketData = {
				address: `0x${Math.random().toString(16).slice(2, 42)}`,
				title,
				description,
				category,
				creator: '0xDemoCreator123456789012345678901234567890',
				endTime: endTime.getTime(),
				resolved: false,
				resolvedOutcome: 0,
				userYesBets: '0',
				userNoBets: '0',
			};

			setMarkets((prev) => [newMarket, ...prev]);
			return newMarket.address;
		} catch (err) {
			setError('Failed to create prediction market');
			throw err;
		}
	};

	const getMarketsForUI = () => {
		return markets;
	};

	return {
		markets,
		isLoading,
		error,
		createMarket,
		getMarketsForUI,
	};
}

export function usePredictionMarket(marketAddress: string) {
	const [market, setMarket] = useState<MarketData | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		// Simulate loading
		setTimeout(() => {
			const foundMarket = MOCK_MARKETS.find((m) => m.address === marketAddress);
			if (foundMarket) {
				setMarket(foundMarket);
			} else {
				setError('Market not found');
			}
			setIsLoading(false);
		}, 1000);
	}, [marketAddress]);

	const placeBet = async (outcome: boolean, amount: string) => {
		if (!market) throw new Error('Market not found');

		try {
			// Simulate transaction
			await new Promise((resolve) => setTimeout(resolve, 2000));

			// Update the market data
			const updatedMarket = {
				...market,
				userYesBets: outcome
					? (parseFloat(market.userYesBets) + parseFloat(amount)).toString()
					: market.userYesBets,
				userNoBets: !outcome
					? (parseFloat(market.userNoBets) + parseFloat(amount)).toString()
					: market.userNoBets,
			};

			setMarket(updatedMarket);
			return true;
		} catch (err) {
			setError('Failed to place bet');
			throw err;
		}
	};

	const getMarketDetails = () => {
		return market;
	};

	return {
		market,
		isLoading,
		error,
		placeBet,
		getMarketDetails,
	};
}
