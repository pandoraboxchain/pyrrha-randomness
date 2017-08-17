$(document).ready(function() {
    $.ajaxSetup({ cache: false });
});


var UiAlerts = {
    div: $('#info_alerts'),
    messages: [],
    messagesCount: 0,

    show: function () {
        var html = '';
        var min_i = UiAlerts.messagesCount - 5;
        if (min_i < 0) min_i = 0;
        for (var i = UiAlerts.messagesCount - 1; i >= min_i; i--) {
            var message = UiAlerts.messages[i];
            html += '<div class="alert alert-' + message.class + '">' + message.text + '</div> ';
        }
        ;
        UiAlerts.div.html(html);
    },
    _add: function (css, title, message) {
        UiAlerts.messages.push({
            class: css, text: '<b>' + title + '</b> ' + message
        });
        UiAlerts.messagesCount++;
        UiAlerts.show();
        return false;
    },
    addInfo: function (title, message) {
        return UiAlerts._add('info', title, message);
    },
    addError: function (title, message) {
        return UiAlerts._add('danger', title, message);
    },
    addSuccess: function (title, message) {
        return UiAlerts._add('success', title, message);
    }
};

var UiMenu = {
    current_menu : '',
    current_div : '',

    show : function (menu_id, div_id) {
        if (this.current_menu == menu_id) return false;
        if (this.current_menu) {
            $('#' + this.current_menu).removeClass('active');
        }
        if (this.current_div) {
            $('#' + this.current_div).hide();
        }
        this.current_menu = menu_id;
        this.current_div = div_id;
        $('#' + this.current_menu).addClass('active');
        $('#' + this.current_div).show();
    }
}