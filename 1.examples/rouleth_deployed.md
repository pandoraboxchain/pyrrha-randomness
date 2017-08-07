#Rouleth random wheel

All listed contracts are deployed and contain real balances

##Rouleth (5,163 ETH)

https://etherscan.io/address/0x18a672e11d637fffadccc99b152f4895da069601#code

```javascript

uint8 wheelResult;

//Spin the wheel, 

bytes32 blockHash= block.blockhash(playerblock+blockDelay);

//security check that the Hash is not empty

if (blockHash==0) throw;

// generate the hash for RNG from the blockHash and the player's address

bytes32 shaPlayer = sha3(playerSpinned, blockHash);

// get the final wheel result

wheelResult = uint8(uint256(shaPlayer)%37);

//check result against bet and pay if win

checkBetResult(wheelResult, playerSpinned, blockHash, shaPlayer);


```



##Rouleth (294 ETH)

https://etherscan.io/address/0x90fc38eb9592940e6d5bae221313d749ee26369b#code

https://etherscan.io/address/0xdfc328c19c8de45ac0117f836646378c10e0cda3#code

```javascript

function getRandomNumber(address player, uint256 playerblock) private returns(uint8 wheelResult)
    {
        // block.blockhash - hash of the given block - only works for 256 most recent blocks excluding current
        bytes32 blockHash = block.blockhash(playerblock+BlockDelay);

        if (blockHash==0)
        {
          ErrorLog(msg.sender, "Cannot generate random number");
          wheelResult = 200;
        }
        else
        {
          bytes32 shaPlayer = sha3(player, blockHash);

          wheelResult = uint8(uint256(shaPlayer)%37);
        }
    }
    
```

##Rouleth+Token (102 ETH)

https://etherscan.io/address/0x91a57b2f6fa86b373bce5716eb26c81cbb004223
