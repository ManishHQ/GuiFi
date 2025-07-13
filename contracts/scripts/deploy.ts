import { ethers } from 'hardhat';

async function main() {
	console.log(
		'🚀 Starting Prediction Market & Token Launchpad deployment...\n'
	);

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
	const predictionFactory = await PredictionMarketFactory.deploy();
	await predictionFactory.waitForDeployment();

	// Get the contract address
	const predictionFactoryAddress = await predictionFactory.getAddress();
	console.log(
		'✅ PredictionMarketFactory deployed to:',
		predictionFactoryAddress
	);

	// Deploy TokenLaunchpadFactory
	console.log('\n📦 Deploying TokenLaunchpadFactory...');
	const TokenLaunchpadFactory = await ethers.getContractFactory(
		'TokenLaunchpadFactory'
	);

	const launchpadFactory = await TokenLaunchpadFactory.deploy();
	await launchpadFactory.waitForDeployment();

	const launchpadFactoryAddress = await launchpadFactory.getAddress();
	console.log('✅ TokenLaunchpadFactory deployed to:', launchpadFactoryAddress);

	console.log('\n📋 Contract Details:');
	console.log('- PredictionMarketFactory Address:', predictionFactoryAddress);
	console.log('- TokenLaunchpadFactory Address:', launchpadFactoryAddress);
	console.log('- Contracts deployed successfully');

	console.log('\n🎯 Deployment Summary:');
	console.log(
		'✅ PredictionMarketFactory is ready to create prediction markets!'
	);
	console.log('✅ TokenLaunchpadFactory is ready to create token launches!');
	console.log('✅ Use the factories to deploy individual contracts');
	console.log('✅ Frontend can now interact with factories');

	// Save deployment info to a file for frontend integration
	const network = await ethers.provider.getNetwork();
	const deploymentInfo = {
		network: network.name,
		chainId: Number(network.chainId),
		predictionFactoryAddress: predictionFactoryAddress,
		launchpadFactoryAddress: launchpadFactoryAddress,
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
