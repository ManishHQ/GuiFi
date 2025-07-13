import { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';
import '@moved/hardhat-plugin';
import 'dotenv/config';

const config: HardhatUserConfig = {
	solidity: {
		version: '0.8.28',
		settings: {
			optimizer: {
				enabled: true,
				runs: 200,
			},
			viaIR: true,
		},
	},
	defaultNetwork: 'devnet',
	networks: {
		devnet: {
			url: 'https://devnet.uminetwork.com',
			accounts: [process.env.PRIVATE_KEY!],
		},
	},
};

export default config;
