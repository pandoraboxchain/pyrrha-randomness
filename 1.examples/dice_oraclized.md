#Dice random with Oracle


##iDice 1492 eth

https://etherscan.io/address/0xe6517b766e6ee07f91b517435ed855926bcb1aae#code

##Etheroll 2699 eth

https://etherscan.io/address/0xece701c76bd00d1c3f96410a0c69ea8dfcf5f34e#code


```javascript

    function playerRollDice(uint rollUnder) public
        payable
        gameIsActive
        betIsValid(msg.value, rollUnder)
	{

        /*
        * assign partially encrypted query to oraclize
        * only the apiKey is encrypted
        * integer query is in plain text
        */
        bytes32 rngId = oraclize_query("nested", "[URL] ['json(https://api.random.org/json-rpc/1/invoke).result.random.data.0', '\\n{\"jsonrpc\":\"2.0\",\"method\":\"generateSignedIntegers\",\"params\":{\"apiKey\":${[decrypt] BDC819nTYbEiByr/iwndzNdSJ9JGJGRWwOTnFLhrFcxtWh53H7szcqHaC+Z/6UKH6T6N57RiPNmBWGeFSmqURHUqCSyN8vmUjVj9gEi7HmCoQlLSpx8QJTV9OxhFf43u8Vn7DugZcgyVcPEkEs2lTP1BXiAd},\"n\":1,\"min\":1,\"max\":100,\"replacement\":true,\"base\":10${[identity] \"}\"},\"id\":1${[identity] \"}\"}']", gasForOraclize);
        /* total number of bets (display purpose only) */
        totalBets += 1;
        /* map bet id to this oraclize query */
		playerBetId[rngId] = rngId;
        /* map player lucky number to this oraclize query */
		playerNumber[rngId] = rollUnder;
        /* map value of wager to this oraclize query */
        playerBetValue[rngId] = msg.value;
        /* map player address to this oraclize query */
        playerAddress[rngId] = msg.sender;
        /* safely map player reward to this oraclize query */
        playerProfit[rngId] = ((((msg.value * (100-(safeSub(rollUnder,1)))) / (safeSub(rollUnder,1))+msg.value))*houseEdge/houseEdgeDivisor)-msg.value;
        /* safely increase maxPendingPayouts liability - calc all pending payouts under assumption they win */
        maxPendingPayouts = safeAdd(maxPendingPayouts, playerProfit[rngId]);
        /* check contract can payout on win */
        if(maxPendingPayouts >= contractBalance) throw;
        /* provides accurate numbers for web3 and manual refunds in case of no oraclize __callback */
        LogBet(playerBetId[rngId], playerAddress[rngId], safeAdd(playerBetValue[rngId], playerProfit[rngId]), playerProfit[rngId], playerBetValue[rngId], playerNumber[rngId]);

    }


	function __callback(bytes32 myid, string result, bytes proof) public
    //function __callback(bytes32 myid, string result) public
		onlyOraclize
		payoutsAreActive
	{

        /* player address mapped to query id does not exist */
        if (playerAddress[myid]==0x0) throw;

	    /* map result to player */
        playerRandomResult[myid] = parseInt(result);

        /* provably-fair random integer for player bounded to 1-100 inclusive
        *  sha3 the result from random.org and proof (IPFS address of TLSNotary proof)
        */
        playerDieResult[myid] = uint(sha3(playerRandomResult[myid], proof)) % (100 - 1) + 1;

		//etc
    }
        
```

##Dice 933 eth

https://etherscan.io/address/0x4e646a576917a6a47d5b0896c3e207693870869d#code


```javascript

function bet()
        payable
        onlyIfNotStopped {

        uint oraclizeFee = OraclizeI(OAR.getAddress()).getPrice("URL", ORACLIZE_GAS_LIMIT + safeGas);
        if (oraclizeFee >= msg.value) throw;
        uint betValue = msg.value - oraclizeFee;
        if ((((betValue * ((10000 - edge) - pwin)) / pwin ) <= (maxWin * getBankroll()) / 10000) && (betValue >= minBet)) {
            LOG_NewBet(msg.sender, betValue);
            bytes32 myid =
                oraclize_query(
                    "nested",
                    "[URL] ['json(https://api.random.org/json-rpc/1/invoke).result.random.data.0', '\\n{\"jsonrpc\":\"2.0\",\"method\":\"generateSignedIntegers\",\"params\":{\"apiKey\":${[decrypt] BIm/tGMbfbvgqpywDDC201Jxob7/6+sSkRBtfCXN94GO0C7uD4eQ+aF+9xNJOigntWu8QHXU6XovJqRMEGHhnEnoaVqVWSqH1U1UFyE6WySavcbOb/h8hOfXv+jYBRuhkQr+tHXYrt1wx0P0dRdeCxbLp1nDuq8=},\"n\":1,\"min\":1,\"max\":10000${[identity] \"}\"},\"id\":1${[identity] \"}\"}']",
                    ORACLIZE_GAS_LIMIT + safeGas
                );
            bets[myid] = Bet(msg.sender, betValue, 0);
            betsKeys.push(myid);
        }
        else {
            throw;
        }
    }

    function __callback(bytes32 myid, string result, bytes proof)
        onlyOraclize
        onlyIfBetExist(myid)
        onlyIfNotProcessed(myid)
        onlyIfValidRoll(myid, result)
        onlyIfBetSizeIsStillCorrect(myid)  {

        uint numberRolled = parseInt(result);
        bets[myid].numberRolled = numberRolled;
        isWinningBet(bets[myid], numberRolled);
        isLosingBet(bets[myid], numberRolled);
        delete profitDistributed;
    }
    
```