ff.Views.Finder = ff.Views.Base.extend({
    addTag: function (tagModel) {
        var tagView = new ff.Views.Tag({ model: tagModel, parent: this });

        this.tags.push(tagView);
        tagView.render();
    },

    moveImage: function (diff) {
        var $imageWrapper = $('#current-image-wrapper'),
            top = $imageWrapper.css('top'),
            left = $imageWrapper.css('left'),
            props = {
                top  :  parseInt(top.slice(0, top.length - 2))  - diff.top,
                left :  parseInt(left.slice(0, left.length - 2))  - diff.left
            };

        if (props.left > 0) props.left = 0;
        if (props.top > 0) props.top = 0;
        if ((props.left + this.currentImageWidth) < this.finderWidth) {
            props.left = this.finderWidth - this.currentImageWidth;
        }
        if ((props.top + this.currentImageHeight) < this.finderHeight) {
            props.top = this.finderHeight - this.currentImageHeight;
        }

        $imageWrapper.css(props);
    },

    drawNewTag: function (event) {
        var self        = this,
            offsetStart = this.getRelativeOffset(event, $('#current-image')),
            $div        = $('<div class="tag"></div>');

        $('#current-image-wrapper').append($div);
        this.$el.on('mousemove', function (event) {
            var offsetDrag = self.getRelativeOffset(event, $('#current-image-wrapper')),
                props      = self.getOffsetDiff(offsetStart, offsetDrag);

            $div.css(props);
        });

        $(window).one('mouseup', function (event) {
            var offsetEnd = self.getRelativeOffset(event, $('#current-image-wrapper')),
                props     = self.getOffsetDiff(offsetStart, offsetEnd, self.scale),
                tagModel  = new ff.Models.Tag(props);

            $div.remove();
            self.addTag(tagModel);
            self.$el.off('mousemove');
        });
    },

    drawTags: function () {
        for (var i in this.tags) {
            this.tags[i].resize();
        }
    },

    events: {
        'mousewheel #current-image-wrapper': 'zoom',
        'mousedown #current-image': 'drawNewTag'
    },

    initialize: function () {
        this.tags = [];
    },

    render: function () {
        var self = this;

        this.$el.html(_.template(ff.templates.get('finder'))(self.model.attributes));

        // get initial height for setting scale
        this.initialImageWidth  = $('#current-image').width();
        this.initialImageHeight = $('#current-image').height();

        // shrink to fit
        $('#current-image').css({ width: '100%' });
        
        // set finder area height to hide overflow when zooming
        this.finderWidth  = $('#current-image').width();
        this.finderHeight = $('#current-image').height();
        $('#fossil-finder').height(this.finderHeight);

        this.setScale();
        this.drawTags();
    },

    setScale: function () {
        this.currentImageWidth  = $('#current-image').width();
        this.currentImageHeight = $('#current-image').height();
        this.scale = this.currentImageWidth/this.initialImageWidth;
    },

    zoom: function (event) {
        var $imageWrapper = $(event.currentTarget),
            delta         = event.originalEvent.wheelDelta * -1,
            width         = $imageWrapper.width() + delta,
            offsetStart   = this.getRelativeOffset(event, $('#current-image-wrapper'), this.scale),
            offsetEnd, offsetDiff, diff;

        event.preventDefault();

        if (width > this.finderWidth && width < this.initialImageWidth) {
            $imageWrapper.width(width);
        }
        else if (width > this.initialImageWidth) {
            $imageWrapper.width(this.initialImageWidth);
        }
        else {
            $imageWrapper.width(this.finderWidth);
        }

        this.setScale();

        offsetEnd  = this.getRelativeOffset(event, $('#current-image-wrapper'), this.scale),

        diff = {
            top   : -(offsetEnd.top - offsetStart.top)  * this.scale,
            left  : -(offsetEnd.left - offsetStart.left)  * this.scale
        };

        this.moveImage(diff);
        this.drawTags();
    }
});
