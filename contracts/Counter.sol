// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Counter {
    // Mapping from address to count value
    mapping(address => uint256) private counts;
    
    // Event to emit when count is updated
    event CountUpdated(address indexed user, uint256 newCount);
    
    // Get count for the caller's address
    function getCount() public view returns (uint256) {
        return counts[msg.sender];
    }
    
    // Increment count for caller's address
    function increment() public {
        counts[msg.sender] += 1;
        emit CountUpdated(msg.sender, counts[msg.sender]);
    }
    
    // Decrement count for caller's address
    function decrement() public {
        require(counts[msg.sender] > 0, "Count cannot be negative");
        counts[msg.sender] -= 1;
        emit CountUpdated(msg.sender, counts[msg.sender]);
    }
}