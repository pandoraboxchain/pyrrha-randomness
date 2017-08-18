try {
    var url = "http://localhost:8545";
    var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
    var adminAccount = web3.eth.accounts[0];

    RandomProvider.providerAccount[0] = web3.eth.accounts[1];
    RandomProvider.providerAccount[1] = web3.eth.accounts[2];

    var customerAccount = web3.eth.accounts[3];
    var customerAccount2 = web3.eth.accounts[4];

    window.addEventListener('load', function () {
        //deploy contract, not needed in real mode
        UiAlerts.addSuccess('web3', 'loaded')
        ContractsInit.deployRandom();
    });
} catch (e) {
    UiAlerts.addError('web3', e.toString())
}


var ContractsInit = {
    deployedCount : 0,
    deployRandom: function () {
        $.ajax({
            type: 'GET',
            cache: false,
            url: './no_cache.php?f=OutRandom.json',
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
                            UiAlerts.addError('deploy OutRandom', e.toString());
                        } else {
                            if (contract.address) {
                                UiAlerts.addSuccess('deployed  OutRandom', contract.address);
                                ContractsInit.deployedCount++;
                                ContractsInit.finish();
                            }
                        }
                    });
            }
        });

        $.ajax({
            type: 'GET',
            cache: false,
            url: './no_cache.php?f=Provider.json',
            //other settings
            success: function(json) {
                var tmpContract = web3.eth.contract(json.abi);
                Contracts.provider[0] = tmpContract.new({
                        from: RandomProvider.providerAccount[0],
                        data: json.unlinked_binary,
                        gas: 4100000
                    },
                    function (e, contract) {
                        if (e) {
                            UiAlerts.addError('deploy Provider0', e.toString());
                        } else {
                            if (contract.address) {
                                UiAlerts.addSuccess('deployed Provider0', contract.address);
                                ContractsInit.deployedCount++;
                                setTimeout(function() {
                                    RandomProvider.setAdmin(adminAccount, 0);
                                }, 1000);
                                ContractsInit.finish();
                            }
                        }
                    });

                Contracts.provider[1] = tmpContract.new({
                        from: RandomProvider.providerAccount[1],
                        data: json.unlinked_binary,
                        gas: 4100000
                    },
                    function (e, contract) {
                        if (e) {
                            UiAlerts.addError('deploy Provider1', e.toString());
                        } else {
                            if (contract.address) {
                                UiAlerts.addSuccess('deployed Provider1', contract.address);
                                ContractsInit.deployedCount++;
                                setTimeout(function() {
                                    RandomProvider.setAdmin(adminAccount, 1);
                                }, 1000);

                                ContractsInit.finish();
                            }
                        }
                    });
            }
        });
    },
    finish: function () {
        if (ContractsInit.deployedCount < 3) return false;
        $('#loading_boxes').hide();
        $('#loaded_boxes').show();
        RandomProvider.placeSuggest(0, true);
        RandomProvider.placeSuggest(1, false);
        RandomProvider.placeSuggest(1, true);
        RandomCustomer.placeRequest(customerAccount, true);
    }
};

var Contracts = {
    random: false,
    provider : {},
    totalGasSpend : 0
};