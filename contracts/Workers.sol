pragma solidity ^0.4.17;

// Copyright 2018 OpenST Ltd.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
// ----------------------------------------------------------------------------
// Utility chain: Workers
//
// http://www.simpletoken.org/
//
// ----------------------------------------------------------------------------

import "./OpsManaged.sol";
import "./SafeMath.sol";


/// A set of authorised workers
contract Workers is OpsManaged {
    using SafeMath for uint256;

    /*
     *  Storage
     */
    /// workers are active up unto the deactivation height
    mapping(address => uint256 /* deactivation height */) public workers;

    /*
     * Events
     */
    ///Event for worker set
    event WorkerSet(
        address indexed _worker,
        uint256 indexed _deactivationHeight,
        uint256 _remainingHeight);

    ///Event for worker removed
    event WorkerRemoved(
        address indexed _worker,
        bool _existed);

    /// @dev    Constructor;
    ///         public method;    
    function Workers()
        public
        OpsManaged()
    {
    }

    /// @dev    Takes _worker, _deactivationHeight;
    ///         Sets worker and its deactivation height; 
    ///         external method;
    /// @param _worker worker
    /// @param _deactivationHeight deactivationHeight
    /// @return (remainingHeight)    
    function setWorker(
        address _worker,
        uint256 _deactivationHeight)
        external
        onlyOps
        returns (uint256 /* remaining activation length */)
    {
        require(_worker != address(0));
        require(_deactivationHeight >= block.number);

        workers[_worker] = _deactivationHeight;
        uint256 remainingHeight = _deactivationHeight - block.number;
        //Event for worker set
        WorkerSet(_worker, _deactivationHeight, remainingHeight);

        return (remainingHeight);
    }

    /// @dev    Takes _worker;
    ///         removes the worker; 
    ///         external method;
    /// @param _worker worker
    /// @return (existed)    
    function removeWorker(
        address _worker)
        external
        onlyOps
        returns (bool existed)
    {
        existed = (workers[_worker] > 0);

        delete workers[_worker];
        //Event for worker removed
        WorkerRemoved(_worker, existed);

        return existed;
    }
    
    /// @dev    Clean up or collectively revoke all workers;
    ///         external method;
    ///         only called by ops or admin;    
    function remove()
        external
        onlyAdminOrOps
    {
        selfdestruct(msg.sender);
    }

    /// @dev    Takes _worker;
    ///         checks if the worker is valid; 
    ///         external method;
    /// @param _worker worker
    /// @return (isValid)    
    function isWorker(
        address _worker)
        external
        view
        returns (bool /* is active worker */)
    {
        return (workers[_worker] >= block.number);
    }

}