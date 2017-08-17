//web3 for public data
var RandomPublic = {
    delay : false,
    current : 0,
    requestsPull : function () {
        if (!this.delay) {
            this.delay = Contracts.random.blockDelay();
        }

        this.current = web3.eth.blockNumber;

        var html = '';
        var requests_count = Contracts.random.requestsCount().toString();

        html += '<h3 style="padding-top:10px;">Requests : ' + requests_count + '</h3>';

        for(var j = 0; j< requests_count; j++) {
            html += '<div class="row" id="request_row_' + j + '">' + this._requestUpdate(j) + '</div>';
        }

        $('#requests_pull').html(html);

        $('#requests_gas').html(Contracts.totalGasSpend);
    },
    requestUpdate : function (index) {
        this.current = web3.eth.blockNumber;
        $('#request_row_' + index).html(this._requestUpdate(index));
    },
    _requestUpdate : function (index) {
        var request = Contracts.random.getRequest(index).toString().split(',');
        var customer = request[0];
        var block = request[1];
        var done = request[2];
        var result = request[3];

        var done_html = '';
        var ago = (this.current - block);
        if (done == 'true') {
            done_html = '<span style="color:green">' + result + '</span>';
        } else if (ago > this.delay) {
            done_html = '<button class="btn btn-outline-success my-2 my-sm-0" onClick="RandomCustomer.getRandom(customerAccount, ' + index + '); return false;">get</button>';
        } else {
            done_html = '<button class="btn btn-outline-success my-2 my-sm-0" onClick="RandomPublic.requestUpdate(' + index + '); return false;">reload</button>';
        }

        var html = '<div class="col-md-1">' +
            ' id: ' + index +
            '</div>' +
            '<div class="col-md-7">' +
            customer +
            '</div>' +
            '<div class="col-md-2">' +
            ago + ' blocks ago' +
            '</div>' +
            '<div class="col-md-2">' +
            done_html +
            '</div>';
        return html;
    }
};