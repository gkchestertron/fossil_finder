ff.Views.Finder = ff.Views.Base.extend({
    addTag: function (tagModel) {
        var tagView = new ff.Views.Tag({ model: tagModel, parent: this }),
            tagCollection = this.model.get('tags');

        tagModel.view = tagView;
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

            if (props.width > 3 && props.height > 3) {
                tagModel.save({ 
                    img_ref_id: self.model.id 
                }, {
                    success: function () {
                        self.addTag(tagModel);
                        tagModel.view.setActive();
                        tagModel.trigger('dropdown-open', tagModel.cid);
                    }
                });
            }

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
        'mousemove #current-image-wrapper' : 'zoomNav',
        'mouseenter .category-image': 'explodeCategoryImage'
    },

    explodeCategoryImage: function (event) {
        var $img = $(event.currentTarget);

        $img.animate({ height: '200px'}, 'slow');

        $img.one('mouseleave', function () {
            $img.animate({ height: '50px'}, 'slow');
        });
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

    nextImage: function () {
        var self = this;
        
        ff.refs.reset();
        ff.refs.fetch({
            success: function () {        
                self.model = ff.refs.first();
                self.render();
            },
            error: ff.error
        });
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

        this.imageLoaded = false;
        this.$el.html(_.template(ff.templates.get('finder'))(self.model.attributes));

        $('#current-image').one('load', function () {
            self.imageLoaded = true;
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

            self.inspector && self.inspector.remove();
            self.inspector = new ff.Views.Inspector({ 
                el: $('#inspector'),
                model: self.model,
                parent: self
            });

            self.addTags();
            self.drawTags();

            self.inspector.render();
        })
        .error(function () {
            self.model.save({ failed_to_load: true }, {
                success: self.nextImage.bind(self),
                error: ff.error
            });
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
        if (!this.imageLoaded) return;

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

        if (!this.imageLoaded) return;

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

        event.stopPropagation();
        model.destroy();
        this.render();
    },

    events: {
        'click [data-function=destroy]': 'destroy',
        'click [data-function=saveComplete]': 'saveComplete',
        'click [data-function=saveIncomplete]': 'saveIncomplete',
        'click .dropdown a': 'setCategory',
        'click tr': 'setActiveTag'
    },

    initialize: function (options) {
        this.parent = options.parent;
        this.listenTo(this.model.get('tags'), 'active-tag-set', this.setActiveTag);
        this.listenTo(this.model.get('tags'), 'dropdown-open', this.openDropdown);
    },

    openDropdown: function (cid) {
        var $tr = this.$('tr[data-tag-cid="' + cid  + '"]');
            
        $tr.find('.dropdown-toggle').dropdown('toggle')
    },

    render: function () {
        this.$el.html(_.template(ff.templates.get('inspector'))(this.model.attributes));
    },

    saveComplete: function (event) {
        // TODO: set user id
        this.model.save({
            // formats for mysql - don't worry there is a polyfill in monkey.js
            complete: true,
            last_accessed_date_time: (new Date()).toISOString().substring(0, 19).replace('T', ' ')
        }, {
            success: this.parent.nextImage.bind(this.parent)
        });
    },

    saveIncomplete: function (event) {
        this.model.save({
            // formats for mysql - don't worry there is a polyfill in monkey.js
            complete: false,
            last_accessed_date_time: (new Date()).toISOString().substring(0, 19).replace('T', ' ')
        }, {
            success: this.parent.nextImage.bind(this.parent)
        });
    },

    setActiveTag: function (event) {
        var $tr, cid, tags, tag;

        if (typeof event === 'object') {
            $tr  = $(event.currentTarget);
            cid  = $tr.data('tag-cid');
        }
        else {
            cid = event;
        }

        tags = this.model.get('tags');
        tag  = tags.get(cid);

        tags.each(function (model) { 
            model.active = false;
            model.view.render();
        });

        tag.active = true;
        tag.view.render();

        this.$('tr').removeClass('warning');

        if ($tr) {
            $tr.addClass('warning');
        }
        else {
            this.render();
        }
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
