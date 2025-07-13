// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./PredictionMarket.sol";

contract PredictionMarketFactory {
    address[] public allMarkets;

    event MarketCreated(address market, address creator, string title, string category);

    function createMarket(
        string memory _title,
        string memory _description,
        string memory _category,
        uint256 _endTime
    ) external {
        PredictionMarket market = new PredictionMarket(_title, _description, _category, _endTime, msg.sender);
        allMarkets.push(address(market));
        emit MarketCreated(address(market), msg.sender, _title, _category);
    }

    function getMarkets() external view returns (address[] memory) {
        return allMarkets;
    }
}
