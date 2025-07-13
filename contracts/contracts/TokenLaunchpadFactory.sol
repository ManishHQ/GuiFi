// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./LaunchpadToken.sol";

contract TokenLaunchpadFactory {
    address[] public allLaunches;
    mapping(address => address[]) public creatorLaunches;
    
    event LaunchCreated(
        address indexed tokenAddress,
        address indexed creator,
        string name,
        string symbol,
        uint256 totalSupply,
        uint256 liquidityTarget,
        uint256 tokenPrice
    );
    
    function createTokenLaunch(
        string memory _name,
        string memory _symbol,
        string memory _description,
        uint256 _totalSupply,
        uint256 _liquidityTarget,
        uint256 _tokenPrice,
        string memory _website,
        string memory _twitter,
        string memory _telegram
    ) external returns (address) {
        require(_totalSupply > 0, "Invalid total supply");
        require(_liquidityTarget > 0, "Invalid liquidity target");
        require(_tokenPrice > 0, "Invalid token price");
        
        LaunchpadToken newToken = new LaunchpadToken(
            _name,
            _symbol,
            _description,
            _totalSupply,
            _liquidityTarget,
            _tokenPrice,
            msg.sender,
            _website,
            _twitter,
            _telegram
        );
        
        address tokenAddress = address(newToken);
        allLaunches.push(tokenAddress);
        creatorLaunches[msg.sender].push(tokenAddress);
        
        emit LaunchCreated(
            tokenAddress,
            msg.sender,
            _name,
            _symbol,
            _totalSupply,
            _liquidityTarget,
            _tokenPrice
        );
        
        return tokenAddress;
    }
    
    function getAllLaunches() external view returns (address[] memory) {
        return allLaunches;
    }
    
    function getCreatorLaunches(address creator) external view returns (address[] memory) {
        return creatorLaunches[creator];
    }
    
    function getLaunchCount() external view returns (uint256) {
        return allLaunches.length;
    }
}
