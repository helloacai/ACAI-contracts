// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

enum Status {
    Active,
    Closed,
    Reviewed
}

/// @notice A struct representing a thread
struct Thread {
    bytes32 threadUID;
    bytes32 parentThreadUID;
    bytes32 agentUID;
    address requester;
    uint32 totalBudget;
    uint32 remainingBudget;
    Status status;
}

interface IACS {
    event Requested(bytes32 indexed aciUID, bytes32 indexed parentThreadUID, bytes32 indexed threadUID, address requester, string requestRef);
    event ThreadFunded(bytes32 indexed threadUID, uint32 fundingAmount, address funder);

    function request(
        bytes32 parentThreadUID, 
        bytes32 threadUID,
        bytes32 aciUID,
        string calldata requestRef
    ) external returns (bytes32);

    function getThread(
        bytes32 threadUID
    ) external returns (Thread memory);
}
