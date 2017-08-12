#DaoCasino



##Клиент подписывается на рендом, сервер отдает, контракт проверяет

https://github.com/DaoCasino/DiceGame

###Клиент

```javascript
function makeid() {
    var str = "0x";
    var possible = "abcdef0123456789";

    for (var i = 0; i < 64; i++) {
        if (getTimer() % 2 == 0) {
            str += possible.charAt(Math.floor(Math.random() * possible.length));
        } else {
            str += possible.charAt(Math.floor(Math.random() * (possible.length - 1)));
        }
    }
    str = numToHex(str);
    return "0x" + web3_sha3(str);
}

var seed = makeid();
Casino.getFastRandom('dice_v2', addressDice, seed, function (number) {
    //updateRow(seed, number);
})

game = true;
if (nonceTx != "") {
    nonceTx = numToHex(hexToNum(nonceTx) + 1);
    responseTransaction("roll", nonceTx, seed);
} else {
    infura.sendRequest("roll", openkey, _callback, seed);
}
```

###Реализация конкретной подписки

```javascript
key: "getFastRandom", value: function (seed, callback) {
	var _this15 = this;
	if (this.RTC_game) {
		var game_code = this.game_code, contract_address = this.contract_address;
        console.log("game_code", game_code);
        var subscribe_name = !1, listenRand = function listenRand(data) {
          data && data.seed && data.user_id && data.random && data.seed == seed && (_this15.RTC_game.unsubscribe(contract_address, listenRand, subscribe_name), _this15.checkSIG(seed, data.random, data.user_id) || console.error("invalid sig..."), callback(data))
        };
        try {
			subscribe_name = this.RTC_game.subscribe(contract_address, listenRand), this.RTC_game.send({
				action: "get_random",
				game_code: game_code,
				address: contract_address,
				seed: seed
			}, function (delivered) {
        	})
		} catch (e) {
		}
	}
}
```

##Серверное приложение
     
https://github.com/DaoCasino/BankRollerApp

```javascript
sendRandom2Server(game_code, address, seed){
		if (skip_games.indexOf(game_code) > -1 ) {
			return
		}
		if (!_config.games[game_code] || (_config.games[game_code] && _config.games[game_code].channels)) {
			return
		}

		if (!_seeds_list[seed]) {
			_seeds_list[seed] = {
				contract:address,
			}

			DB.data.get('seeds_list').get(seed).put(_seeds_list[seed])
		}

		if (_seeds_list[seed] && _seeds_list[seed].confirm_sended_server) {
			return
		}


		this.checkPending(game_code, address, seed, ()=>{
			this.getConfirmNumber(game_code, seed, (confirm, PwDerivedKey)=>{

				if (this.RTC) {
					this.RTC.send({
						action:    'send_random',
						game_code: game_code,
						address:   address,
						seed:      seed,
						random:    confirm,
					})
				}

				Api.sendConfirm(address, seed, confirm).then(()=>{ })

				_seeds_list[seed].confirm_server_time   = new Date().getTime()
				_seeds_list[seed].confirm               = confirm
				_seeds_list[seed].confirm_server        = confirm
				_seeds_list[seed].confirm_sended_server = true

				DB.data.get('seeds_list').get(seed).put(_seeds_list[seed])
				/* gunjs bugfix =) */ DB.data.get('seeds_list').map().on( (a,b)=>{ })
			})
		})
	}
```


##Собственно в контракте подтверждается выигрыш

```javascript
	key: "sendSeed", value: function (address, seed, confirm) {
                return this.request({
                    a: "confirm",
                    address: address,
                    vconcat: seed,
                    result: confirm
                }, "proxy.php").then(function (response) {
                    return response.text()
                })
    }
```
  
```javascript
function confirm(bytes32 random_id, uint8 _v, bytes32 _r,bytes32 _s) {
		if (listGames[random_id].state == GameState.PlayerWon ||
		listGames[random_id].state == GameState.PlayerLose) {
			throw;
		}

		if (ecrecover(random_id, _v, _r, _s) == owner) { // owner
			Game game = listGames[random_id];
			uint payout = game.bet * (65536 - 1310) / game.chance;
			uint rnd = uint256(sha3(_s)) % 65536;
			game.rnd = rnd;

			if (game.state != GameState.NoBank) {
				countRolls++;
				totalEthPaid += game.bet;
				if (rnd > game.chance) {
					listGames[random_id].state = GameState.PlayerLose;
				} else {
					listGames[random_id].state = GameState.PlayerWon;
					erc.transfer(game.player, payout);
					totalEthSended += payout;
				}
			}
			serviceReward(game.player, game.bet);
		}
	}
```

