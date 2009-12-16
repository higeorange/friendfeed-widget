function log() {
    var l = "";
    for(var i = 0, len = arguments.length; i < len; i++) {
        l += i < len - 1 ? arguments[i] + ": ": arguments[i];
    }
    opera.postError(l);
}

function createHTML(text) {
    var text = text.replace(/&amp;/g, "&");
    return text.replace(
        /((https?|ftp)(:\/\/[-_.!~*\'a-zA-Z0-9;\/?:\@&=+\$,\%#]+))/g,
//            /(https?|ftp)(:\/\/[^\s\(\)]+)/g,
        function($0){
            // <, > が URL に含まれてしまう問題の解決。
            var tmp = $0.split(/(&gt;|&lt;)/);
            var url = tmp.shift();
            var aft = tmp.join("");

// security violation が出るので一時解除
//            if(url.indexOf('http://tinyurl.com/') == 0
//                || url.indexOf('http://z.la/') == 0
//                || url.indexOf('http://ff.im/') == 0) {
//                url = DecodeURI(resolveTinyUrl($0) || url);
//            }
            url = encodeURI(url);
            return '<a href="' + url + '">' + decodeURIComponent(url) +'</a>' + aft;
        }
    );
//    return text.replace(/^@(\w+)|\s@(\w+)/g, function($0, $1, $2) {
//        if($1) {
//            return '@<a href="http://twitter.com/' + $1 + '">' + $1 + '</a>'
//        } else if($2) {
//            return ' @<a href="http://twitter.com/' + $2 + '">' + $2 + '</a>'
//        }
//    });
};
// Tinyurl 展開: 1つに付き about 600ms
function resolveTinyUrl(url) {
    log(url);
    var exURL;
    var xhr = new XMLHttpRequest();
        xhr.open('HEAD', url, false);
        xhr.onreadystatechange = function() {
            if(xhr.readyState == 4) {
                exURL = xhr.getResponseHeader('Location');
            }
        }
        xhr.send(null);
    return exURL || url;
};

// 2つ以上のクラスがつく可能性がある場合
var appendClass = function(elm, _class) {
    elm.className += elm.className ? " " + _class : _class;
}

//Widget
var Widget = {}
    Widget.setValue = function(value, key) {
        var vals = ""
        switch(value.constructor) {
            case Array:
                vals = value.join(',');
                break;
            case String:
                vals = value;
            case Number:
                vals = value.toString();
            default:
                vals = value;
        }
        widget.setPreferenceForKey(vals, key);
        return this;
    };
    Widget.getValue = function(key, type) {
        var value = widget.preferenceForKey(key);
        if(typeof type != 'undefined') {
            switch(type) {
                case 'Number':
                    return parseInt(value);
                    break;
                case 'Array':
                    return value.split(',');
                    break;
				case 'Boolean':
					return value == 'true' ? true : false;
                default:
                    break;
            }
        } else {
            return value;
        }
    }

// Array
Array.prototype.map = function(callback, thisObject) {
    for(var i = 0, len = this.length, res = []; i < len; i++) {
        res[i] = callback.call(thisObject, this[i], i, this);
    }
    return res;
}

Array.prototype.indexOf = function(obj) {
    for(var i = 0, l = this.length; i < l; i++) {
        if(this[i] == obj) {
            return i;
        }
    }
    return -1;
}

Array.prototype.contains = function(obj) {
    for(var i = 0, len = this.length;i < len; i++) {
        if(this[i] == obj) {
            return true;
        }
    }
    return false;
}
Array.prototype.del = function(obj) {
    var len = this.length;
    var r = new Array(len - 1);
    for(var i = 0; i < len; i++) {
        if(this[i] != obj) {
            r.push(this[i]);
        }
    }
    return r;
}

function setCaretPosition(ctrl, pos) {
    if(ctrl.setSelectionRange) {
        ctrl.focus();
        ctrl.setSelectionRange(pos,pos);
    }
    else if (ctrl.createTextRange) {
        var range = ctrl.createTextRange();
        range.collapse(true);
        range.moveEnd('character', pos);
        range.moveStart('character', pos);
        range.select();
    }
}

//
// TransURI (UTF-8): transURI.js (Ver.041211)
//
// Copyright (C) http://nurucom-archives.hp.infoseek.co.jp/digital/
//

var DecodeURI=function(str){
	return str.replace(/%(E(0%[AB]|[1-CEF]%[89AB]|D%[89])[0-9A-F]|C[2-9A-F]|D[0-9A-F])%[89AB][0-9A-F]|%[0-7][0-9A-F]/ig,function(s){
		var c=parseInt(s.substring(1),16);
		return String.fromCharCode(c<128?c:c<224?(c&31)<<6|parseInt(s.substring(4),16)&63:((c&15)<<6|parseInt(s.substring(4),16)&63)<<6|parseInt(s.substring(7),16)&63)
	})
};

function strftime(date_string, format) {
    var datetime_regexp =  /(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})Z/;
    var match = date_string.match(datetime_regexp)
    var datetime = new Date(Date.UTC(match[1], match[2] - 1, match[3], match[4], match[5], match[6]));

    var zero = /%d|%i|%m|%H|%I|%M|%S/;
    var fullyear = datetime.getFullYear();
    var year = datetime.getYear();
    var month = datetime.getMonth();
    var date = datetime.getDate();
    var day = datetime.getDay();
    var hour = datetime.getHours();
    var minute = datetime.getMinutes();
    var second = datetime.getSeconds();
    var time = datetime.getTime();
    var datetime_symbol = {
        "%a" : (["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"])[day],
        "%A" : (["Sunday", "MOnday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"])[day],
        "%b" : (["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"])[month],
        "%B" : (["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"])[month],
        "%C" : fullyear.toString().slice(0, 2),
        "%d" : date,
        "%H" : hour,
        "%I" : (hour > 12) ? hour - 12 : hour,
        "%m" : month + 1,
        "%M" : minute,
        "%p" : (hour > 12) ? "PM" : "AM",
        "%P" : (hour > 12) ? "pm" : "am",
        "%s" : time,
        "%S" : second,
        "%u" : day + 1,
        "%w" : day,
        "%y" : year,
        "%Y" : fullyear,
        "%%" : "%%"
    }
    return format.replace(
        /(%[\w%])/g,
        function(e) {
            var replaced = datetime_symbol[e];
            if(e.match(zero)) {
                return (replaced < 10) ? "0" + replaced : replaced;
            } else {
                return replaced;
            }
        }
    );
    
}
