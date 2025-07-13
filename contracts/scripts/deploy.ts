import { ethers } from 'hardhat';

async function main() {
	console.log('🚀 Starting Prediction Market deployment...\n');

	// Get the deployer account
	const [deployer] = await ethers.getSigners();
	console.log('Deploying contracts with account:', deployer.address);
	console.log(
		'Account balance:',
		ethers.formatEther(await ethers.provider.getBalance(deployer.address)),
		'ETH\n'
	);

	// Deploy PredictionMarketFactory
	console.log('📦 Deploying PredictionMarketFactory...');
	const PredictionMarketFactory = await ethers.getContractFactory(
		'PredictionMarketFactory'
	);

	// Deploy without constructor arguments (based on current contract)
	const factory = await PredictionMarketFactory.deploy();
	await factory.waitForDeployment();

	// Get the contract address
	const factoryAddress = await factory.getAddress();
	console.log('✅ PredictionMarketFactory deployed to:', factoryAddress);

	console.log('\n📋 Contract Details:');
	console.log('- Factory Address:', factoryAddress);
	console.log('- Contract deployed successfully');

	console.log('\n🎯 Deployment Summary:');
	console.log(
		'✅ PredictionMarketFactory is ready to create prediction markets!'
	);
	console.log(
		'✅ Use the factory to deploy individual PredictionMarket contracts'
	);
	console.log('✅ Frontend can now interact with factory at:', factoryAddress);

	// Save deployment info to a file for frontend integration
	const network = await ethers.provider.getNetwork();
	const deploymentInfo = {
		network: network.name,
		chainId: Number(network.chainId),
		factoryAddress: factoryAddress,
		deployer: deployer.address,
		deployedAt: new Date().toISOString(),
	};

	console.log('\n💾 Deployment info for frontend integration:');
	console.log(JSON.stringify(deploymentInfo, null, 2));
}

main()
	.then(() => process.exit(0))
	.catch((err) => {
		console.error('❌ Deployment failed:');
		console.error(err);
		process.exit(1);
	});
