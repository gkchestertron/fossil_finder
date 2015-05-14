window.ff = {
    Models: {},
    Collections: {},
    Views: {},
    initialize: function() {
        // create the things here
        this.templates = new this.Models.Templates();

        this.templates.fetch();
    }
};


$(document).ready(function() {
    ff.initialize();
    Backbone.history.start({ pushState: true });
    // $('#current-user').remove();
    // ff.admin = !!(ff.current_user && ff.current_user.admin);

    //handle links
    if (Backbone.history && Backbone.history._hasPushState) {
        $(document).delegate("a", "click", function(event) {
            var href     = $(this).attr("href"),
                protocol = this.protocol + "//";

            if (href[0] === "#") {
                return false;
            }

            if (href.slice(0, protocol.length) !== protocol) {
                event.preventDefault();
                Backbone.history.navigate(href, true);
            } 
            else {
                $(this).prop('target', '_blank');
            }
        });
    }
});
