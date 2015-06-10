ff.Views.Finder = ff.Views.Base.extend({
    addTag: function (tagModel) {
        var tagView = new ff.Views.Tag({ model: tagModel, parent: this }),
            tagCollection = this.model.get('tags');

        tagCollection.add(tagModel);
        this.tags.push(tagView);
        tagView.render();
        this.inspector.render();
    },

    addTags: function () {
        var self = this,
            tags = this.model.get('tags');

        tags.each(function (tag) {
            self.addTag(tag);
        });
    },

    drawNewTag: function (event) {
        var self        = this,
            offsetStart = this.getRelativeOffset(event, $('#current-image')),
            $div        = $('<div class="tag"></div>');

        event.preventDefault();
        $('#current-image-wrapper').append($div);
        $div.css(offsetStart);
        this.$el.on('mousemove', function (event) {
            var offsetDrag = self.getRelativeOffset(event, $('#current-image-wrapper')),
                props      = self.getBox(offsetStart, offsetDrag);

            $div.css(props);
        });

        $(window).one('mouseup', function (event) {
            var offsetEnd = self.getRelativeOffset(event, $('#current-image-wrapper')),
                props     = self.getBox(offsetStart, offsetEnd, self.scale),
                tagModel  = new ff.Models.Tag(props);

            $div.remove();
            tagModel.save({ 
                img_ref_id: self.model.id 
            }, {
                success: function () {
                    self.addTag(tagModel);
                }
            });
            self.$el.off('mousemove', self.$el);
        });
    },

    drawTags: function () {
        for (var i in this.tags) {
            this.tags[i].scale();
        }
    },

    events: {
        'wheel #current-image-wrapper': 'zoom',
        'mousedown #current-image' : 'drawNewTag', // uses image so click events don't bubble up and make new tags inside tags
        'mousemove #current-image-wrapper' : 'zoomNav'
    },

    initialize: function () {
        this.listenTo(this.model.get('tags'), 'error', function () {
            alert('Something went wrong. Please try again. If the problem persists, please try again later.');
        });

        this.tags = [];

        $(window).on('resize', this.resize.bind(this));
    },

    moveElement: function (diff, $element, delta) {
        var top = $element.css('top'),
            left = $element.css('left'),
            props = diff;
            
        if (delta) {
            props = {
                top  :  parseInt(top.slice(0, top.length - 2))  - diff.top,
                left :  parseInt(left.slice(0, left.length - 2))  - diff.left
            };
        }

        if (props.left > 0) props.left = 0;
        if (props.top > 0) props.top = 0;
        if ((props.left + this.currentImageWidth) < this.finderWidth) {
            props.left = this.finderWidth - this.currentImageWidth;
        }
        if ((props.top + this.currentImageHeight) < this.finderHeight) {
            props.top = this.finderHeight - this.currentImageHeight;
        }
        if (this.currentImageHeight <= this.finderHeight) {
            props.top = 0;
        }


        $element.css(props);
    },

    remove: function () {
        this.inspector.remove();
        for (var i in this.tags) {
            this.tags[i].remove();
        }
        Backbone.View.prototype.remove.apply(this, arguments);
    },

    render: function () {
        var self = this;

        this.$el.html(_.template(ff.templates.get('finder'))(self.model.attributes));

        $('#current-image').one('load', function () {
            // get initial height for setting scale
            self.initialImageWidth  = $('#current-image').width();
            self.initialImageHeight = $('#current-image').height();

            // shrink to fit
            $('#current-image').css({ width: '100%' });
            
            // set finder area height to hide overflow when zooming
            $('#app').css({ 'margin-top': $('nav').height() });
            self.finderWidth  = $('#current-image').width();
            self.finderHeight = $(window).height() - $('nav').height();
            $('#fossil-finder').width(self.finderWidth);
            $('#fossil-finder').height(self.finderHeight);
            $('#inspector').height(self.finderHeight - 40);

            self.setScale();

            self.inspector = new ff.Views.Inspector({ 
                el: $('#inspector'),
                model: self.model,
                parent: self
            });

            self.addTags();
            self.drawTags();

            self.inspector.render();
        });
    },

    resize: function () {
        this.inspector.remove();
        for (var i in this.tags) {
            this.tags[i].remove();
        }
        this.render();
    },

    setScale: function () {
        this.currentImageWidth  = $('#current-image').width();
        this.currentImageHeight = $('#current-image').height();
        this.scale = this.currentImageWidth/this.initialImageWidth;
    },

    zoom: function (event) {
        var $imageWrapper = $(event.currentTarget),
            delta         = event.originalEvent.deltaY,
            width         = $imageWrapper.width() + delta,
            offsetStart   = this.getRelativeOffset(event.originalEvent, $('#current-image-wrapper'), this.scale),
            offsetEnd, offsetDiff, diff;

        event.preventDefault();

        if (width >= this.finderWidth && width <= this.initialImageWidth) {
            $imageWrapper.width(width);
        }
        else if (width >= this.initialImageWidth) {
            $imageWrapper.width(this.initialImageWidth);
        }
        else {
            $imageWrapper.width(this.finderWidth);
        }

        this.setScale();

        offsetEnd  = this.getRelativeOffset(event.originalEvent, $('#current-image-wrapper'), this.scale);

        diff = {
            top   : -(offsetEnd.top - offsetStart.top)  * this.scale,
            left  : -(offsetEnd.left - offsetStart.left)  * this.scale
        };

        this.moveElement(diff, $('#current-image-wrapper'), true);
        this.drawTags();
    },

    zoomNav: function (event) {
        var self   = this,
            offset = this.getRelativeOffset(event, $('#fossil-finder')),
            diff   = this.finderWidth/9,
            x      = 0, 
            y      = 0;

        if (offset.top < diff) y = -10;
        if (offset.top > (this.finderHeight - diff)) y = 10;
        if (offset.left < diff) x = -10;
        if (offset.left > (this.finderWidth - diff)) x = 10;
        
        if (x === 0 && y === 0) {
            clearInterval(this.interval);
            delete this.interval;
        } 
        else {
            this.intervalCallback = function () {
                self.moveElement({ top: y, left: x }, $('#current-image-wrapper'), true);
            }
            this.interval = this.interval || setInterval(function () {
                self.intervalCallback();
            }, 9);
        }

        $('#fossil-finder').one('mouseleave', function () {
            clearInterval(self.interval);
            delete self.interval;
        });
    }
});

ff.Views.Inspector = ff.Views.Base.extend({
    destroy: function (event) {
        var $button = $(event.currentTarget),
            cid     = $button.data('cid'),
            model   = this.model.get('tags').get(cid);

        model.destroy();
        this.render();
    },

    events: {
        'click [data-function=destroy]': 'destroy',
        'click [data-function=save]': 'save',
        'click .dropdown a': 'setCategory'
    },

    render: function () {
        this.$el.html(_.template(ff.templates.get('inspector'))(this.model.attributes));
    },

    save: function (event) {
        var $button = $(event.currentTarget),
            cid     = $button.data('cid'),
            model   = this.model.get('tags').get(cid);

        model.save();
    },

    setCategory: function (event) {
        var self        = this,
            $a          = $(event.currentTarget),
            categoryId  = $a.data('category-id'),
            tagId       = $a.data('tag-id'),
            tag         = this.model.get('tags').get(tagId);

        tag.save({ 
            img_tag_category_id: categoryId
        }, {
            success: self.render.bind(self)
        });

    }
});
