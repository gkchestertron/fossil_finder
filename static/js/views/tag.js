ff.Views.Tag = ff.Views.Base.extend({
    events: {
        'mousedown': 'move'
    },

    initialize: function (options) {
        this.parent = options.parent;
        this.setElement($('<div class="tag"></div>'));
        $('#current-image-wrapper').append(this.$el);
    },

    move: function (event) {
        var self        = this,
            offset      = self.getElementPosition(self.$el),
            offsetStart = { top: event.pageY, left: event.pageX };

        event.preventDefault();
        this.parent.$el.on('mousemove', function (event) {
            var offsetDrag = { top: event.pageY, left: event.pageX },
                diff       = self.getOffsetDiff(offsetStart, offsetDrag),
                props      = {
                    top: offset.top + diff.top,
                    left: offset.left + diff.left
                };

            self.$el.css(props);
        });

        $(window).one('mouseup', function (event) {
            var offsetEnd = { top: event.pageY, left: event.pageX },
                diff      = self.getOffsetDiff(offsetStart, offsetEnd),
                props     = {
                    top: offset.top + diff.top,
                    left: offset.left + diff.left
                };

            self.$el.css(props);
 
            self.model.set(self.getElementPosition(self.$el, self.parent.scale));
            self.parent.$el.off('mousemove');
        });       
    },

    render: function () {
        this.$el.html(_.template(ff.templates.get('tag'))(this.model.attributes));
        this.scale();
    },

    scale: function () {
        this.$el.css({
            top:    this.model.get('top')    * this.parent.scale,
            left:   this.model.get('left')   * this.parent.scale,
            width:  this.model.get('width')  * this.parent.scale,
            height: this.model.get('height') * this.parent.scale
        });
    }
});
