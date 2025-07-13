// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract PredictionMarket {
    enum Outcome { Undecided, Yes, No }

    address public creator;
    string public title;
    string public description;
    string public category;
    uint256 public endTime;
    Outcome public resolvedOutcome;
    bool public resolved;
    bool public reversed;

    uint256 public totalYes;
    uint256 public totalNo;

    mapping(address => uint256) public yesBets;
    mapping(address => uint256) public noBets;

    uint256 public constant FEE_PERCENT = 25; // 2.5%

    constructor(
        string memory _title,
        string memory _description,
        string memory _category,
        uint256 _endTime,
        address _creator
    ) {
        creator = _creator;
        title = _title;
        description = _description;
        category = _category;
        endTime = _endTime;
        resolvedOutcome = Outcome.Undecided;
    }

    modifier onlyCreator() {
        require(msg.sender == creator, "Only creator allowed");
        _;
    }

    modifier onlyBeforeEnd() {
        require(block.timestamp < endTime, "Market closed");
        _;
    }

    function betYes() external payable onlyBeforeEnd {
        require(msg.value > 0, "Must send ETH");
        yesBets[msg.sender] += msg.value;
        totalYes += msg.value;
    }

    function betNo() external payable onlyBeforeEnd {
        require(msg.value > 0, "Must send ETH");
        noBets[msg.sender] += msg.value;
        totalNo += msg.value;
    }

    function resolveMarket(Outcome outcome) external onlyCreator {
        require(block.timestamp >= endTime, "Not ended");
        require(!resolved, "Already resolved");
        require(outcome == Outcome.Yes || outcome == Outcome.No, "Invalid outcome");

        resolved = true;
        resolvedOutcome = outcome;
    }

    function reverseResolution() external onlyCreator {
        require(resolved, "Not resolved");
        require(!reversed, "Already reversed");
        resolved = false;
        resolvedOutcome = Outcome.Undecided;
        reversed = true;
    }

    function claim() external {
        require(resolved, "Not resolved");
        uint256 payout;

        if (resolvedOutcome == Outcome.Yes) {
            uint256 share = yesBets[msg.sender];
            require(share > 0, "No winnings");
            yesBets[msg.sender] = 0;
            uint256 rewardPool = (totalYes + totalNo) * (1000 - FEE_PERCENT) / 1000;
            payout = rewardPool * share / totalYes;

        } else if (resolvedOutcome == Outcome.No) {
            uint256 share = noBets[msg.sender];
            require(share > 0, "No winnings");
            noBets[msg.sender] = 0;
            uint256 rewardPool = (totalYes + totalNo) * (1000 - FEE_PERCENT) / 1000;
            payout = rewardPool * share / totalNo;
        }

        require(payout > 0, "Nothing to claim");
        payable(msg.sender).transfer(payout);
    }

    function withdrawFees() external onlyCreator {
        require(resolved, "Not resolved");
        uint256 totalPool = totalYes + totalNo;
        uint256 fee = totalPool * FEE_PERCENT / 1000;
        payable(creator).transfer(fee);
    }
}
