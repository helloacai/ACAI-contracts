// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

/// @notice Enum representing the work upon which the total cost is calculated (ie. per Token, per Job, etc.)
enum CostPer {
    Token,
    Job
}

enum Status {
    Active,
    Inactive,
    Ignored
}

/// @notice A struct representing a registered ACI
struct ACIRecord {
    bytes32 uid;
    address executor;
    address owner;
    uint32 cost;
    CostPer costPer;
    string metadataURI;
    string apiurl;
    Status status;
    
}

interface IACIRegistry {
    event Registered(bytes32 indexed uid, address indexed executor, ACIRecord aci);

    function register(
        address executor,
        uint32 cost,
        CostPer costPer,
        string calldata metadataURI,
        string calldata apiurl
    ) external returns (bytes32);

    function getACI(bytes32 uid) external view returns (ACIRecord memory);
}
