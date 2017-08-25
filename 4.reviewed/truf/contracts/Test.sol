pragma solidity ^0.4.13;

contract Test {

	//max integer result
	uint8 public maxResult;

	function Test() {
		maxResult = 100;
	}

	function() {
		revert();
	}

	//to check hash in js and in solidity
	function getResultblockHash(bytes32 blockHash) constant returns (uint8 a)
	{
		bytes32 shaPlayer = sha3(blockHash);
		a = uint8(uint256(shaPlayer) % maxResult);
	}

	//to check sha3 in js and in solidity
	function getSha3(bytes32 blockHash) constant returns (uint256 a)
	{
		a = uint256(sha3(blockHash));
	}
}
