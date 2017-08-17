//web3 for public data for generator
var RandomPublic = {
    delay : false,
    current : 0,
    loadedCount : -1,
    loadedResults : {},
    requestsPull : function () {
        if (!this.delay) {
            this.delay = Contracts.random.blockDelay();
        }

        this.current = web3.eth.blockNumber;

        var requests_count = Contracts.random.requestsCount().toString();

        for(var i = 0; i<requests_count; i++) {
            if (typeof(this.loadedResults[i]) !== 'undefined') continue;
            var request = Contracts.random.getRequest(i).toString().split(',');

            var block = request[1];
            var done = request[2];
            var result = request[3];

            var ago = (this.current - block);

            if (done == 'true') {
                this.loadedResults[i] = result;
            } else if (ago > this.delay) {
                RandomCustomer.getRandom(customerAccount, i)
            }

        }
        var html = '[step ' + ContractsInit.step + ']<br/>';
        $.each(this.loadedResults, function( key, value ) {
            html += key + ":" + value + ' ';
        });
        $('#requests_pull').html(html);
        $('#requests_gas').html(Contracts.totalGasSpend);
    },
    requestUpdate : function (index) {
        this.current = web3.eth.blockNumber;
        var request = Contracts.random.getRequest(index).toString().split(',');
        var done = request[2];
        var result = request[3];
        if (done == 'true') {
            this.loadedResults[index] = result;
        }
    },
    save : function () {
        $.ajax({
            type: 'POST',
            cache: false,
            url: './save_data.php',
            data : RandomPublic.loadedResults,
            //other settings
            success: function(json) {
                UiAlerts.addSuccess('Saved');
            }
        });

    }
};