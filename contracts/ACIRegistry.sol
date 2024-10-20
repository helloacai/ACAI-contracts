// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

import { IACIRegistry } from "./IACIRegistry.sol";
import {CostPer, ACIRecord, Status} from './IACIRegistry.sol';

contract ACIRegistry is IACIRegistry {
    error AlreadyExists();

    mapping(bytes32 uid => ACIRecord aciRecord) private _registry;


    function register(
        address executor,
        uint32 cost,
        CostPer costPer,
        string calldata metadataURI,
        string calldata apiurl
    ) external returns (bytes32) {
        ACIRecord memory aciRecord = ACIRecord({
            uid: bytes32(0),
            executor: executor,
            owner: msg.sender,
            cost: cost,
            costPer: costPer,
            metadataURI: metadataURI,
            apiurl: apiurl,
            status: Status.Active
        });

        bytes32 uid = _getUID(aciRecord);
        if (_registry[uid].uid != bytes32(0)) {
            revert AlreadyExists();
        }

        aciRecord.uid = uid;
        _registry[uid] = aciRecord;

        emit Registered(uid, msg.sender, aciRecord);

        return uid;
    }

    function getACI(
        bytes32 uid
    ) external view returns (ACIRecord memory) {
        return _registry[uid];
    }

    function _getUID(ACIRecord memory aciRecord) private pure returns (bytes32) {
        return keccak256(abi.encodePacked(aciRecord.apiurl, aciRecord.metadataURI));
    }
}
