(function($) {

$.fn.serializeHash = function() {
    if (this.get(0).tagName.toLowerCase() != 'form') return null;

    var r = {}
    $(this.get(0)).find('input, select, textarea').each(function() {
        if(this.name) {
            r[this.name] = this.value
        }
    });
    return r;
}

})(jQuery);
