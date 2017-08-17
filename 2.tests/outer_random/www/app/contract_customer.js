//сustomer api
var RandomCustomer = {
    placeRequest : function (address, update_pull) {
        var params = {
            from: address
        };
        Contracts.random.placeRequest.estimateGas(
            params,
            function (e, gas) {
                if (e) {
                    UiAlerts.addError('placeRequest Gas', e.toString().substr(0, 100));
                } else {
                    var params2 = params;
                    params2.gas = gas;
                    Contracts.totalGasSpend += gas;
                    Contracts.random.placeRequest(
                        params2,
                        function (e, hash) {
                            if (e) {
                                UiAlerts.addError('placeRequest', e.toString().substr(0, 100));
                            } else {
                                UiAlerts.addSuccess('placeRequest', gas + ' tx:' + hash);
                                if (update_pull) {
                                    RandomPublic.requestsPull();
                                }
                            }
                        }
                    );
                }
            }
        );
    },
    getRandom : function (address, index) {
        var params = {
            from: address
        };
        Contracts.random.getRandomByRequest.estimateGas(
            index,
            params,
            function (e, gas) {
                if (e) {
                    UiAlerts.addError('getRandomByRequest Gas', e.toString().substr(0, 100));
                } else {
                    var params2 = params;
                    params2.gas = gas;
                    Contracts.totalGasSpend += gas;
                    Contracts.random.getRandomByRequest(
                        index,
                        params2,
                        function (e, hash) {
                            if (e) {
                                UiAlerts.addError('getRandomByRequest', e.toString().substr(0, 100));
                            } else {
                                UiAlerts.addSuccess('getRandomByRequest', gas + ' tx:' + hash);
                                RandomPublic.requestUpdate(index);
                            }
                        }
                    );
                }
            }
        );
    }
}