try {
	/*
     geth --datadir "F:\Install\Ethereum" --syncmode "fast" --rpc --rpcapi db,eth,net,web3,personal --cache=1024  --rpcport 8546 --rpcaddr 127.0.0.1 --rpccorsdomain "*"
     https://etherscan.io/address/0x52d6c28d045aa33b4ca7b543d839c0477c754ba4 для сверки что локальный "рендом" равено тому что даст контракт на основной сети
	*/
    var url = "http://localhost:8545";
    var web3 = new Web3(new Web3.providers.HttpProvider(url));


    window.addEventListener('load', function () {
        UiAlerts.addSuccess('web3', 'loaded');
		ContractsInit.load();
    });
} catch (e) {
    UiAlerts.addError('web3', e.toString())
}

var ContractsInit = {
    load: function () {
        /*
        var address = '0x52d6c28d045aa33b4ca7b543d839c0477c754ba4';
        var tmpContract = web3.eth.contract(abi);
        Test.contract = tmpContract.at(address);
        */
        
		/*$.ajax({
            type: 'GET',
            cache: false,
            url: './no_cache.php?f=Test.json',
            //other settings
            success: function(json) {
                var tmpContract = web3.eth.contract(json.abi);
                Test.contract = tmpContract.new({
                        from: web3.eth.accounts[0],
                        data: json.unlinked_binary,
                        gas: 4100000
                    },
                    function (e, contract) {
                        if (e) {
                            UiAlerts.addError('deploy Test', e.toString());
                        } else {
                            if (contract.address) {
                                UiAlerts.addSuccess('deployed Test', contract.address);
                                ContractsInit.finish();
                            }
                        }
                    });
            }
        });
		*/
		
		ContractsInit.finish();

    },
    finish: function () {
        $('#loading_boxes').hide();
        $('#loaded_boxes').show();

        var divider = 100;
		ContractsInit.round(400000, 5000, divider);
    },
    round : function (min, to, divider) {
        var max = min + to;
        var array = [];
        var file = min + '_' + to;
        var html = '';
        for (var i = min; i < max; i++) {
            var hash = localStorage.getItem('hash_' + i);
            if (typeof(hash) == 'undefined' || hash == null) {
                var block = web3.eth.getBlock(i);
                hash = block.hash;
                localStorage.setItem('hash_' + i, hash);
            }
            var sha3_rand = Test.rand(hash, divider);
            /*
            var rand = localStorage.getItem('rand' + i);
            if (typeof(rand) == 'undefined' || rand == null) {
               rand = Test.contract.getResultblockHash.call(hash);
            }
            */
            array.push(sha3_rand);
            //html += ' ' + i + ' : ' + hash + ' ' + sha3_rand + '<br/>';

        }
        Test.save(file, array);
        //$('#result').html(html);
    }
};

var Test = {
    contract : false,

    rand : function (text, divider) {
        var result = web3.toBigNumber(web3.sha3(text, { encoding: 'hex' }));
        var real = result.dividedToIntegerBy(divider);
        real = real.times(divider);
        real = result.sub(real);
        return real.toNumber();
    },

    save : function(file, array) {
        $.ajax({
            type: 'POST',
            cache: false,
            url: './save_data.php',
            data : {'data' : array, 'file' : file},
            //other settings
            success: function(json) {
                alert('done');
            }
        });
    }
};

var abi = [
    {
        "constant": true,
        "inputs": [],
        "name": "maxResult",
        "outputs": [
            {
                "name": "",
                "type": "uint8"
            }
        ],
        "payable": false,
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "blockHash",
                "type": "bytes32"
            }
        ],
        "name": "getResultblockHash",
        "outputs": [
            {
                "name": "a",
                "type": "uint8"
            }
        ],
        "payable": false,
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "blockHash",
                "type": "bytes32"
            }
        ],
        "name": "getSha3",
        "outputs": [
            {
                "name": "a",
                "type": "uint256"
            }
        ],
        "payable": false,
        "type": "function"
    },
    {
        "inputs": [],
        "payable": false,
        "type": "constructor"
    },
    {
        "payable": false,
        "type": "fallback"
    }
];