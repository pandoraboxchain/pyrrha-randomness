try {
    var url = "http://localhost:8545";
    var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
    var adminAccount = web3.eth.accounts[0];
    var customerAccount = web3.eth.accounts[1];
    var customerAccount2 = web3.eth.accounts[2];

    window.addEventListener('load', function () {
        //deploy contract, not needed in real mode
        UiAlerts.addSuccess('web3', 'loaded')
        ContractsInit.deployRandom();
    });
} catch (e) {
    UiAlerts.addError('web3', e.toString())
}


var ContractsInit = {
    deployRandom: function () {
        $.ajax({
            type: 'GET',
            cache: false,
            url: './no_cache.php?f=Random.json',
            //other settings
            success: function(json) {
                var tmpContract = web3.eth.contract(json.abi);
                Contracts.random = tmpContract.new({
                        from: adminAccount,
                        data: json.unlinked_binary,
                        gas: 4100000
                    },
                    function (e, contract) {
                        if (e) {
                            UiAlerts.addError('deploy Contract', e.toString());
                        } else {
                            if (contract.address) {
                                UiAlerts.addSuccess('deployed Contract', contract.address);
                                ContractsInit.finish();
                            }
                        }
                    });
            }
        });
    },
    finish: function () {
        $('#loading_boxes').hide();
        $('#loaded_boxes').show();
        ContractsInit.timer = setInterval(ContractsInit.runStep, 1000)
    },
    step : 0,
    timer : false,
    runStep : function () {
        RandomCustomer.placeRequest(customerAccount);
        RandomCustomer.placeRequest(customerAccount2, true);
        ContractsInit.step++;
        if (ContractsInit.step > 10000) {
            clearInterval(ContractsInit.timer);
            RandomPublic.save();
        }
    }
};

var Contracts = {
    random: false,
    totalGasSpend : 0
};