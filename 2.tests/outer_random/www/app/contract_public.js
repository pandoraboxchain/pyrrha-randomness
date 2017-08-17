//web3 for public data
var RandomPublic = {
    suggestedSeeds : [],
    requestedRandoms : [],
    suggestsPull: function (providerNum) {
        var contract = Contracts.provider[providerNum];

        var html = '';
        var suggests_count = contract.suggestsCount().toString();

        html += '<h3 style="padding-top:10px;">Suggests : ' + suggests_count + '</h3>';

        RandomPublic.suggestedSeeds = [];
        for (var j = 0; j < suggests_count; j++) {
            html += '<div class="row" id="suggest_row_' + providerNum + '_' + j + '">' + this._suggestUpdate(providerNum, j) + '</div>';
        }

        $('#suggests_pull_' + providerNum).html(html);

        $('#total_gas').html(Contracts.totalGasSpend);
    },

    suggestUpdate : function (providerNum, index) {
        $('#suggest_row_' + providerNum + '_' + index).html(this._suggestUpdate(providerNum, index));
    },


    _suggestUpdate: function (providerNum, index) {
        var contract = Contracts.provider[providerNum];
        var request = contract.getSuggest(index).toString().split(',');
        var seed = request[0];
        var free = request[1];
        var main_index = request[2];

        var free_html = '';
        console.log(contract.getSuggest(index).toString());

        if (free == 'true') {
            free_html = 'waiting';
            RandomPublic.suggestedSeeds.push({index : index, seed : seed, providerNum : providerNum});
        } else {
            free_html = '<span style="color:green">used</span>';
        }
        free_html += '=>' + main_index;

        var real_html = '?';
        if (typeof(RandomProvider.sentNumbers[seed]) == 'undefined') {
            real_html = 'error';
        } else {
            real_html = 'real:&nbsp;' + RandomProvider.sentNumbers[seed];
        }

        var html = '<div class="col-md-2">' +
            ' id: ' + index +
            '</div>' +
            '<div class="col-md-4">' +
            seed.substr(0, 10) + '...' +
            '</div>' +
            '<div class="col-md-2">' +
            free_html +
            '</div>' +
            '<div class="col-md-2">' +
            real_html +
            '</div>';
        return html;
    },

    requestsPull : function () {
        var html = '';
        var requests_count = Contracts.random.requestsCount().toString();

        html += '<h3 style="padding-top:10px;">Requests : ' + requests_count + '</h3>';

        RandomPublic.requestedRandoms = [];
        for(var j = 0; j< requests_count; j++) {
            html += '<div class="row" id="request_row_' + j + '">' + this._requestUpdate(j) + '</div>';
        }

        $('#requests_pull').html(html);

        $('#total_gas').html(Contracts.totalGasSpend);
    },

    requestUpdate : function (index) {
        $('#request_row_' + index).html(this._requestUpdate(index));
    },

    _requestUpdate : function (index) {
        var request = Contracts.random.getRequest(index).toString().split(',');
        var customer = request[0];
        var block = request[1];
        var seed = request[2];
        var result = request[3];

        var seed_html = '';
        if (seed && seed != '0x0000000000000000000000000000000000000000000000000000000000000000') {
            if (result) {
                seed_html = '<span style="color:green">' + result + '</span>';
            } else {
                seed_html = '<button class="btn btn-outline-success my-2 my-sm-0" onClick="RandomCustomer.setSeed(' + index + '); return false;">set seed [admin only!]</button>';
            }
        } else {
            seed_html = 'waiting';
            RandomPublic.requestedRandoms.push({index : index});
        }

        var html = '<div class="col-md-1">' +
            ' id: ' + index +
            '</div>' +
            '<div class="col-md-5">' +
            customer +
            '</div>' +
            '<div class="col-md-1">' +
            'block:&nbsp;' + block +
            '</div>' +
            '<div class="col-md-2">' +
            seed.substr(0, 10) + '...' +
            '</div>' +
            '<div class="col-md-3">' +
            seed_html +
            '</div>';
        return html;
    }
};