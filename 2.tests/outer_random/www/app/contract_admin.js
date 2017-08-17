//admin api
var RandomAdmin  = {
    matching: function () {
        var max = Math.min(RandomPublic.requestedRandoms.length, RandomPublic.suggestedSeeds.length);
        for(var i=0; i<max;i++) {
            var suggest = RandomPublic.suggestedSeeds[i];
            var request = RandomPublic.requestedRandoms[i];
            RandomAdmin.updateRequestSeed(adminAccount, request, suggest);
        }
    },
    updateRequestSeed : function (address, request, suggest) {
        var params = {
            from: address
        };
        Contracts.random.updateRequestSeed.estimateGas(
            request.index, suggest.seed,
            params,
            function (e, gas) {
                if (e) {
                    UiAlerts.addError('updateRequestSeed Gas', e.toString().substr(0, 100));
                } else {
                    var params2 = params;
                    params2.gas = gas;
                    Contracts.totalGasSpend += gas;
                    Contracts.random.updateRequestSeed(
                        request.index, suggest.seed,
                        params2,
                        function (e, hash) {
                            if (e) {
                                UiAlerts.addError('updateRequestSeed', e.toString().substr(0, 100));
                            } else {
                                UiAlerts.addSuccess('updateRequestSeed', gas + ' tx:' + hash);
                                RandomPublic.requestUpdate(request.index);
                                RandomAdmin.updateSuggestIndex(adminAccount, request, suggest);
                            }
                        }
                    );
                }
            }
        );
    },
    updateSuggestIndex : function (address, request, suggest) {
        var contract = Contracts.provider[suggest.providerNum];

        var params = {
            from: address
        };
        contract.updateSuggestIndex.estimateGas(
            suggest.index, request.index,
            params,
            function (e, gas) {
                if (e) {
                    UiAlerts.addError('updateSuggestIndex Gas', e.toString().substr(0, 100));
                } else {
                    var params2 = params;
                    params2.gas = gas;
                    Contracts.totalGasSpend += gas;
                    contract.updateSuggestIndex(
                        suggest.index, request.index,
                        params2,
                        function (e, hash) {
                            if (e) {
                                UiAlerts.addError('updateSuggestIndex' + suggest.providerNum, e.toString().substr(0, 100));
                            } else {
                                UiAlerts.addSuccess('updateSuggestIndex' + suggest.providerNum, gas + ' tx:' + hash);
                                RandomProvider.sendRequested(request, suggest);
                            }
                        }
                    );
                }
            }
        );
    }
}