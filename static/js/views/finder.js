ff.Views.Finder = ff.Views.Base.extend({
    addTag: function (tagModel) {
        var tagView = new ff.Views.Tag({ model: tagModel, parentEl: this.$el });
    },

    drawTag: function (event) {
        var self        = this,
            offsetStart = this.getRelativeOffset(event, $('#current-image')),
            $div        = $('<div class="tag"></div>');

        $('#current-image-wrapper').append($div);
        this.$el.on('mousemove', function (event) {
            var offsetDrag = self.getRelativeOffset(event, $('#current-image')),
                props      = self.getOffsetDiff(offsetStart, offsetDrag);

            $div.css(props);
        });

        $(window).one('mouseup', function (event) {
            var offsetEnd = self.getRelativeOffset(event, $('#current-image'));
            // self.addTag(offsetStart, offsetEnd);
            self.$el.off('mousemove');
        });
    },

    events: {
        // 'mousewheel #current-image': 'zoom',
        'mousedown #current-image': 'drawTag'
    },

    render: function () {
        var self = this;

        this.$el.html(_.template(ff.templates.get('finder'))(self.model.attributes));

        this.currentImageWidth = $('#current-image').width();
        $('#current-image-wrapper').width(this.currentImageWidth);
        $('#current-image-wrapper').height($('#current-image').height());

    },

    zoom: function (event) {
        var $image = $(event.currentTarget),
            delta  = event.originalEvent.wheelDelta * -1,
            width  = $image.width() + delta;

        if (width > this.currentImageWidth) {
            $image.width(width);
        }
        else {
            $image.width(this.currentImageWidth);
        }
    }
});
