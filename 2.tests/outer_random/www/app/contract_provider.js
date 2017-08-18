//provider api
var RandomProvider = {
    providerAccount : {},
    sentNumbers : {},
    providerSalts : {},

    setAdmin : function (adminAddress, providerNum) {
        var address  = RandomProvider.providerAccount[providerNum];
        var contract = Contracts.provider[providerNum];
        var params = {
            from: address
        };
        contract.setAdmin.estimateGas(
            adminAddress,
            params,
            function (e, gas) {
                if (e) {
                    UiAlerts.addError('setAdmin' + providerNum + ' Gas', e.toString().substr(0, 100));
                } else {
                    var params2 = params;
                    params2.gas = gas;
                    Contracts.totalGasSpend += gas;
                    contract.setAdmin(
                        adminAddress,
                        params2,
                        function (e, hash) {
                            if (e) {
                                UiAlerts.addError('setAdmin' + providerNum, e.toString().substr(0, 100));
                            } else {
                                UiAlerts.addSuccess('setAdmin' + providerNum, gas + ' tx:' + hash);
                            }
                        }
                    );
                }
            }
        );
    },
    placeSuggest : function (providerNum, update_pull) {
        if (typeof(RandomProvider.providerSalts[providerNum]) == 'undefined') {
            RandomProvider.providerSalts[providerNum] = 'a';
        }
        var address  = RandomProvider.providerAccount[providerNum];
        var contract = Contracts.provider[providerNum];
        var params = {
            from: address
        };

        var cryptoObj = window.crypto || window.msCrypto; // для IE 11
        var randomArray = new Uint32Array(1);
        cryptoObj.getRandomValues(randomArray);
        var random = randomArray[0] % 37;

        var salt = web3.fromAscii(RandomProvider.providerSalts[providerNum]);
        var seed = Contracts.random.getSeed(salt, random);
        RandomProvider.sentNumbers[seed] = random;

        contract.placeSuggest.estimateGas(
            seed,
            params,
            function (e, gas) {
                if (e) {
                    UiAlerts.addError('placeSuggest Gas', e.toString().substr(0, 100));
                } else {
                    var params2 = params;
                    params2.gas = gas;
                    Contracts.totalGasSpend += gas;
                    contract.placeSuggest(
                        seed,
                        params2,
                        function (e, hash) {
                            if (e) {
                                UiAlerts.addError('placeSuggest', e.toString().substr(0, 100));
                            } else {
                                UiAlerts.addSuccess('placeSuggest', gas + ' tx:' + hash);
                                if (update_pull) {
                                    RandomPublic.suggestsPull(providerNum);
                                }
                            }
                        }
                    );
                }
            }
        );
    },
    sendRequested : function (request, suggest) {
        if (typeof (RandomProvider.sentNumbers[suggest.seed]) == 'undefined') {
            UiAlerts.addError('no number for seed', suggest.seed);
            return false;
        }
        var address  = RandomProvider.providerAccount[suggest.providerNum];
        var params = {
            from: address
        };

        var salt = web3.fromAscii(RandomProvider.providerSalts[suggest.providerNum]);
        var random = RandomProvider.sentNumbers[suggest.seed];
        Contracts.random.updateRequestResult.estimateGas(
            request.index,
            salt,
            random,
            params,
            function (e, gas) {
                if (e) {
                    UiAlerts.addError('updateRequestResult Gas', e.toString().substr(0, 100));
                } else {
                    var params2 = params;
                    params2.gas = gas;
                    Contracts.totalGasSpend += gas;
                    Contracts.random.updateRequestResult(
                        request.index,
                        salt,
                        random,
                        params2,
                        function (e, hash) {
                            if (e) {
                                UiAlerts.addError('updateRequestResult', e.toString().substr(0, 100));
                            } else {
                                UiAlerts.addSuccess('updateRequestResult', gas + ' tx:' + hash);
                                RandomPublic.requestUpdate(request.index);
                                RandomPublic.suggestUpdate(suggest.providerNum, suggest.index);
                            }
                        }
                    );
                }
            }
        );
    }
}