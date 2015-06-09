ff.Views.Tag = ff.Views.Base.extend({
    initialize: function (options) {
        this.parent = options.parent;
        this.setElement($('<div class="tag"></div>'));
        $('#current-image-wrapper').append(this.$el);
    },
    render: function () {
        this.$el.html(_.template(ff.templates.get('tag'))(this.model.attributes));
        this.resize();
    },
    resize: function () {
        this.$el.css({
            top:    this.model.get('top')    * this.parent.scale,
            left:   this.model.get('left')   * this.parent.scale,
            width:  this.model.get('width')  * this.parent.scale,
            height: this.model.get('height') * this.parent.scale
        });
    }
});
