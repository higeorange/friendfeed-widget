FriendFeed = {
    version: '20090518-1',
    c_flag: false,
    config_input: $('#config_input'),
    feed_url : "http://friendfeed.com/api/feed/user/",
    feed_type: 'friend',
    callback: 'load_feed',
    cache_id: null,
};

FriendFeed.init = function() {
    $('#message').html(this.version);
    this.init_event();
    this.load_config();
}

FriendFeed.init_event = function() {
    var self = this;

    $('#reload').click(function() { self.reload(); });
    $('#config').click(function() {
        self.toggle_config();
    });
    $('#close').click(function() { window.close(); });
    $('#save').click(function() { self.save_config(); });
}

FriendFeed.load_config = function() {
    this.username = widget.preferenceForKey('username');
    $('#username').val(this.username);
    this.feed_type = widget.preferenceForKey('feed_type');
    $('option[value=' + this.feed_type + ']').attr('selected', 'selected');

    if(! this.username || ! this.feed_type) {
        this.toggle_config();
    } else {
        this.load_feed();
    }
}

FriendFeed.save_config = function(e, form) {
    this.username = $('#username').val();
    widget.setPreferenceForKey( this.username, 'username');
    this.feed_type = $('#feed_type').val();
    widget.setPreferenceForKey( this.feed_type, 'feed_type');

    this.toggle_config();
    this.load_config();
}

FriendFeed.reload = function() {
    this.load_feed();
}

//JSONP
FriendFeed.load_feed = function() {
    var url = this.feed_url + this.username;
    if(this.feed_type == 'friend') url += '/friends'
    url += '?callback=' + this.callback
    var script = $('<script type="text/javascript"></script>');
        script.attr('src', url);
    $('body').append(script);
    $('body').remove(script);
}

FriendFeed.load_html = function(data) {
    var self = this;
    var entries = data.entries;
    var feed_list = $('#feed_list');
        feed_list.empty();
    $.each(entries, function(i, entry) {
        var li = $('<li></li>');
            li.addClass('entry');
        li.html(self.load_entry(entry));
        feed_list.append(li);
    });
};

FriendFeed.load_entry = function(entry) {
    return this.replace_template(entry, this.template);
}

FriendFeed.replace_template = function(entry, template) {
    var self = this;
    return template.join('').replace(/#\{([\w\.]+)\}/g, function($0, $1) {
        switch($1) {
            case 'user.id':
                return entry.user.id.replace(/-/g, '');
            case 'published':
                return strftime(entry[$1], "%Y/%m/%d (%a) %H:%M");
            case 'thumbnails':
                if($.inArray(entry.service.id, self.thumbnails_services) >= 0) {
                    var picture = '';
                    $.each(entry.media, function(i, v) {
                        picture += self.load_thumbnail(v);
                    });
                    if(picture != "") {
                        return '<ul class="thumbnails">' + picture + '</ul>';
                    } else {
                        return ""
                    }
                } else {
                    return "";
                }
            case 'title':
                return createHTML(entry[$1]);
            default:
                var r = $1.split('.');
                if(r.length > 1) {
                    var e = entry;
                    $.each(r, function(i, v) {
                        e = e[this]
                    });
                    return e;
                } else {
                    return entry[$1];
                }
        }
    });
}

FriendFeed.template = [
    '<p>',
//        '<img class="service" src="http://i.friendfeed.com/p-#{user.id}-small-1" alt="#{user.nickname}">',
        '<span class="user"><a href="#{user.profileUrl}">#{user.name}</a></span>',
        ': ',
        '<span class="message">#{title}</span>',
    '</p>',
    '#{thumbnails}',
    '<ul class="meta">',
        '<li><a href="#{link}">#{published}</a></li>',
        '<li><img class="service" src="#{service.iconUrl}" alt="#{service.id}"> </li>',
    '</ul>'
];

FriendFeed.thumbnails_services = [
    'zooomr', 'flickr', 'tumblr'
];

FriendFeed.load_thumbnail = function(media) {
    var thumbnail = media.thumbnails[0];
    return [
        '<li class="thumbnail">',
            '<a href="'+media.link+'">',
                '<img src="'+thumbnail.url+'" alt="' + media.title + '">'
            '</a>'
        '</li>'
    ].join('');
};

FriendFeed.toggle_config = function() {
    if(this.c_flag) {
        this.config_input.hide();
        this.c_flag = false;
    } else {
        this.config_input.show();
        this.c_flag = true;
    }
};

function load_feed(data) {
    FriendFeed.load_html(data);
}

// load 
$(

function() {
    FriendFeed.init();
}

);
