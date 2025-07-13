// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract LaunchpadToken is ERC20, Ownable {
    uint256 public immutable totalTokenSupply;
    uint256 public liquidityTarget;
    uint256 public liquidityRaised;
    uint256 public tokenPrice; // Price in wei per token
    address public creator;
    string public description;
    string public website;
    string public twitter;
    string public telegram;
    
    bool public isLive;
    bool public isCompleted;
    bool public isFailed;
    
    mapping(address => uint256) public contributions;
    address[] public contributors;
    
    event TokensPurchased(address indexed buyer, uint256 amount, uint256 tokenAmount);
    event LaunchCompleted(uint256 totalRaised);
    event LaunchFailed();
    event Withdrawal(address indexed contributor, uint256 amount);
    
    constructor(
        string memory _name,
        string memory _symbol,
        string memory _description,
        uint256 _totalSupply,
        uint256 _liquidityTarget,
        uint256 _tokenPrice,
        address _creator,
        string memory _website,
        string memory _twitter,
        string memory _telegram
    ) ERC20(_name, _symbol) Ownable(_creator) {
        totalTokenSupply = _totalSupply * 10**decimals();
        liquidityTarget = _liquidityTarget;
        tokenPrice = _tokenPrice;
        creator = _creator;
        description = _description;
        website = _website;
        twitter = _twitter;
        telegram = _telegram;
        isLive = true;
        
        // Mint total supply to this contract
        _mint(address(this), totalTokenSupply);
    }
    
    function buyTokens() external payable {
        require(isLive && !isCompleted && !isFailed, "Launch not active");
        require(msg.value > 0, "Must send ETH");
        require(liquidityRaised + msg.value <= liquidityTarget, "Exceeds target");
        
        uint256 tokenAmount = (msg.value * 10**decimals()) / tokenPrice;
        require(tokenAmount <= balanceOf(address(this)), "Insufficient tokens");
        
        if (contributions[msg.sender] == 0) {
            contributors.push(msg.sender);
        }
        
        contributions[msg.sender] += msg.value;
        liquidityRaised += msg.value;
        
        // Transfer tokens to buyer
        _transfer(address(this), msg.sender, tokenAmount);
        
        emit TokensPurchased(msg.sender, msg.value, tokenAmount);
        
        // Check if target reached
        if (liquidityRaised >= liquidityTarget) {
            isCompleted = true;
            isLive = false;
            emit LaunchCompleted(liquidityRaised);
        }
    }
    
    function completeLaunch() external onlyOwner {
        require(isLive, "Launch not active");
        require(liquidityRaised >= liquidityTarget * 80 / 100, "Minimum 80% target required");
        
        isCompleted = true;
        isLive = false;
        
        // Transfer raised funds to creator
        (bool success, ) = creator.call{value: liquidityRaised}("");
        require(success, "Transfer failed");
        
        emit LaunchCompleted(liquidityRaised);
    }
    
    function failLaunch() external onlyOwner {
        require(isLive, "Launch not active");
        
        isFailed = true;
        isLive = false;
        
        emit LaunchFailed();
    }
    
    function withdraw() external {
        require(isFailed, "Launch not failed");
        require(contributions[msg.sender] > 0, "No contribution found");
        
        uint256 amount = contributions[msg.sender];
        contributions[msg.sender] = 0;
        
        // Return tokens to contract
        uint256 tokenAmount = (amount * 10**decimals()) / tokenPrice;
        if (balanceOf(msg.sender) >= tokenAmount) {
            _transfer(msg.sender, address(this), tokenAmount);
        }
        
        // Refund ETH
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Refund failed");
        
        emit Withdrawal(msg.sender, amount);
    }
    
    function getContributorCount() external view returns (uint256) {
        return contributors.length;
    }
    
    function getProgress() external view returns (uint256) {
        if (liquidityTarget == 0) return 0;
        return (liquidityRaised * 100) / liquidityTarget;
    }
    
    function getCurrentPrice() external view returns (uint256) {
        return tokenPrice;
    }
    
    function getMarketCap() external view returns (uint256) {
        return (totalTokenSupply * tokenPrice) / 10**decimals();
    }
}
