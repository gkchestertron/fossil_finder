ff.Views.Finder = ff.Views.Base.extend({
    render: function () {
        var self = this;
        this.$el.html(_.template(ff.templates.get('finder'))(self.model.attributes));
    }
});
