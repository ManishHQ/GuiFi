'use client';

import { useState, useEffect } from 'react';

// Mock data for demonstration
const MOCK_LAUNCHES = [
	{
		address: '0x1234567890123456789012345678901234567890',
		name: 'DogeMoon',
		symbol: 'DOGEMOON',
		description: 'The next big meme coin to the moon! 🚀🐕',
		creator: '0xDemoCreator123456789012345678901234567890',
		liquidityTarget: '100',
		liquidityRaised: '75',
		tokenPrice: '0.001',
		totalSupply: '1000000',
		isLive: true,
		isCompleted: false,
		isFailed: false,
		website: 'https://dogemoon.com',
		twitter: 'https://twitter.com/dogemoon',
		telegram: 'https://t.me/dogemoon',
		contributorCount: 150,
		progress: 75,
		marketCap: '75000',
		userContribution: '0',
		userTokens: '0',
	},
	{
		address: '0x2345678901234567890123456789012345678901',
		name: 'PepeCoin',
		symbol: 'PEPE',
		description: 'The original Pepe meme token. Rare Pepe vibes only! 🐸',
		creator: '0xTestCreator123456789012345678901234567890',
		liquidityTarget: '50',
		liquidityRaised: '50',
		tokenPrice: '0.002',
		totalSupply: '500000',
		isLive: false,
		isCompleted: true,
		isFailed: false,
		website: 'https://pepecoin.com',
		twitter: 'https://twitter.com/pepecoin',
		telegram: 'https://t.me/pepecoin',
		contributorCount: 200,
		progress: 100,
		marketCap: '100000',
		userContribution: '0',
		userTokens: '0',
	},
	{
		address: '0x3456789012345678901234567890123456789012',
		name: 'ShibaInu2',
		symbol: 'SHIB2',
		description: 'The second coming of Shiba Inu! Woof woof! 🐕',
		creator: '0xShibaCreator123456789012345678901234567890',
		liquidityTarget: '200',
		liquidityRaised: '180',
		tokenPrice: '0.0005',
		totalSupply: '2000000',
		isLive: true,
		isCompleted: false,
		isFailed: false,
		website: 'https://shiba2.com',
		twitter: 'https://twitter.com/shiba2',
		telegram: 'https://t.me/shiba2',
		contributorCount: 300,
		progress: 90,
		marketCap: '90000',
		userContribution: '0',
		userTokens: '0',
	},
	{
		address: '0x4567890123456789012345678901234567890123',
		name: 'CatCoin',
		symbol: 'CAT',
		description: 'Meow! The purr-fect meme coin for cat lovers! 😺',
		creator: '0xCatLover123456789012345678901234567890',
		liquidityTarget: '75',
		liquidityRaised: '25',
		tokenPrice: '0.003',
		totalSupply: '750000',
		isLive: true,
		isCompleted: false,
		isFailed: false,
		website: 'https://catcoin.com',
		twitter: 'https://twitter.com/catcoin',
		telegram: 'https://t.me/catcoin',
		contributorCount: 80,
		progress: 33,
		marketCap: '25000',
		userContribution: '0',
		userTokens: '0',
	},
	{
		address: '0x5678901234567890123456789012345678901234',
		name: 'BananaToken',
		symbol: 'BANANA',
		description: 'Going bananas! The most ape-tastic token around! 🍌',
		creator: '0xApeTrader123456789012345678901234567890',
		liquidityTarget: '150',
		liquidityRaised: '120',
		tokenPrice: '0.0015',
		totalSupply: '1500000',
		isLive: true,
		isCompleted: false,
		isFailed: false,
		website: 'https://bananatoken.com',
		twitter: 'https://twitter.com/bananatoken',
		telegram: 'https://t.me/bananatoken',
		contributorCount: 250,
		progress: 80,
		marketCap: '180000',
		userContribution: '0',
		userTokens: '0',
	},
	{
		address: '0x6789012345678901234567890123456789012345',
		name: 'RocketMoon',
		symbol: 'ROCKET',
		description: 'To infinity and beyond! 🚀🌙',
		creator: '0xSpaceExplorer123456789012345678901234567890',
		liquidityTarget: '300',
		liquidityRaised: '50',
		tokenPrice: '0.0008',
		totalSupply: '3000000',
		isLive: true,
		isCompleted: false,
		isFailed: false,
		website: 'https://rocketmoon.com',
		twitter: 'https://twitter.com/rocketmoon',
		telegram: 'https://t.me/rocketmoon',
		contributorCount: 120,
		progress: 17,
		marketCap: '40000',
		userContribution: '0',
		userTokens: '0',
	},
	{
		address: '0x7890123456789012345678901234567890123456',
		name: 'DiamondHands',
		symbol: 'DIAMOND',
		description: '💎🙌 Diamond hands only! HODL forever!',
		creator: '0xDiamondHands123456789012345678901234567890',
		liquidityTarget: '100',
		liquidityRaised: '100',
		tokenPrice: '0.002',
		totalSupply: '1000000',
		isLive: false,
		isCompleted: true,
		isFailed: false,
		website: 'https://diamondhands.com',
		twitter: 'https://twitter.com/diamondhands',
		telegram: 'https://t.me/diamondhands',
		contributorCount: 180,
		progress: 100,
		marketCap: '200000',
		userContribution: '0',
		userTokens: '0',
	},
	{
		address: '0x8901234567890123456789012345678901234567',
		name: 'LamboToken',
		symbol: 'LAMBO',
		description: 'When Lambo? Now! 🏎️💨',
		creator: '0xLamboDreamer123456789012345678901234567890',
		liquidityTarget: '500',
		liquidityRaised: '75',
		tokenPrice: '0.0003',
		totalSupply: '5000000',
		isLive: true,
		isCompleted: false,
		isFailed: false,
		website: 'https://lambotoken.com',
		twitter: 'https://twitter.com/lambotoken',
		telegram: 'https://t.me/lambotoken',
		contributorCount: 400,
		progress: 15,
		marketCap: '75000',
		userContribution: '0',
		userTokens: '0',
	},
];

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
	const [launches, setLaunches] = useState<TokenLaunchData[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		// Simulate loading
		setTimeout(() => {
			setLaunches(MOCK_LAUNCHES);
			setIsLoading(false);
		}, 1000);
	}, []);

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
		try {
			// Simulate API call
			await new Promise((resolve) => setTimeout(resolve, 2000));

			const newLaunch: TokenLaunchData = {
				address: `0x${Math.random().toString(16).slice(2, 42)}`,
				name,
				symbol,
				description,
				creator: '0xDemoCreator123456789012345678901234567890',
				liquidityTarget: liquidityTargetEth.toString(),
				liquidityRaised: '0',
				tokenPrice: tokenPriceEth.toString(),
				totalSupply: totalSupply.toString(),
				isLive: true,
				isCompleted: false,
				isFailed: false,
				website,
				twitter,
				telegram,
				contributorCount: 0,
				progress: 0,
				marketCap: '0',
				userContribution: '0',
				userTokens: '0',
			};

			setLaunches((prev) => [newLaunch, ...prev]);
			return newLaunch.address;
		} catch (err) {
			setError('Failed to create token launch');
			throw err;
		}
	};

	const getLaunchesForUI = () => {
		return launches;
	};

	return {
		launches,
		isLoading,
		error,
		createTokenLaunch,
		getLaunchesForUI,
	};
}

export function useTokenLaunch(launchAddress: string) {
	const [launch, setLaunch] = useState<TokenLaunchData | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		// Simulate loading
		setTimeout(() => {
			const foundLaunch = MOCK_LAUNCHES.find(
				(l) => l.address === launchAddress
			);
			if (foundLaunch) {
				setLaunch(foundLaunch);
			} else {
				setError('Launch not found');
			}
			setIsLoading(false);
		}, 1000);
	}, [launchAddress]);

	const buyTokens = async (amountEth: number) => {
		if (!launch) throw new Error('Launch not found');

		try {
			// Simulate transaction
			await new Promise((resolve) => setTimeout(resolve, 2000));

			// Update the launch data
			const updatedLaunch = {
				...launch,
				liquidityRaised: (
					parseFloat(launch.liquidityRaised) + amountEth
				).toString(),
				contributorCount: launch.contributorCount + 1,
				progress: Math.min(
					100,
					((parseFloat(launch.liquidityRaised) + amountEth) /
						parseFloat(launch.liquidityTarget)) *
						100
				),
				userContribution: (
					parseFloat(launch.userContribution) + amountEth
				).toString(),
				userTokens: (
					parseFloat(launch.userTokens) +
					amountEth / parseFloat(launch.tokenPrice)
				).toString(),
			};

			setLaunch(updatedLaunch);
			return true;
		} catch (err) {
			setError('Failed to buy tokens');
			throw err;
		}
	};

	const getLaunchDetails = () => {
		return launch;
	};

	return {
		launch,
		isLoading,
		error,
		buyTokens,
		getLaunchDetails,
	};
}
