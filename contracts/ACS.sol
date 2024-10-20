// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import { IACIRegistry } from "./IACIRegistry.sol";
import { IACS, Status, Thread } from './IACS.sol';
import { ACIRegistry } from "./ACIRegistry.sol";

contract ACS is IACS {
    error InvalidRegistry();
    error UnknownThreadUID();

    // The global ACI registry.
    IACIRegistry private immutable _aciRegistry;

    mapping(bytes32 threadUID => Thread thread) private _threads;

    bytes32 _defaultCoordinator;


    constructor(IACIRegistry registry) {
        if (address(registry) == address(0)) {
            revert InvalidRegistry();
        }

        _aciRegistry = registry;
    }

    function request(
        bytes32 parentThreadUID, 
        bytes32 threadUID,
        bytes32 aciUID,
        string calldata requestRef
    ) external returns (bytes32) {

        if(threadUID == bytes32(0)) {
            // If no thread provided, create a new thread
            bytes32 tUID = _getThreadUID(msg.sender, requestRef);
            Thread memory thread = Thread({
                threadUID: tUID,
                parentThreadUID: parentThreadUID != bytes32(0) && _threads[parentThreadUID].threadUID != bytes32(0) ? parentThreadUID : bytes32(0),
                agentUID: aciUID == bytes32(0) ? _defaultCoordinator : aciUID,
                requester: msg.sender,
                totalBudget: 0,
                remainingBudget: 0,
                status: Status.Active
            });
            _threads[tUID] = thread;
            emit Requested(aciUID, thread.parentThreadUID, thread.threadUID, msg.sender, requestRef);
            return thread.threadUID;
        } else {
            // If the threadUID doesn't have a corresponding valid thread revert
            if(_threads[threadUID].threadUID == bytes32(0)) {
                revert UnknownThreadUID();
            }
            // Thread exists and has been validly requested
            emit Requested(aciUID, parentThreadUID, threadUID, msg.sender, requestRef);
            return threadUID;
        }

    }

    function getThread(
        bytes32 threadUID
    ) external view returns (Thread memory) {
        return _threads[threadUID];
    }

    function _getThreadUID(address requester, string calldata requestRef) private view returns (bytes32) {
        return keccak256(abi.encodePacked(requester, requestRef, block.number));
    }
}