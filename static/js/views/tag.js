ff.Views.Tag = ff.Views.Base.extend({
    events: {
        'mousedown .resizer': 'resize',
        'mousedown': 'move',
        'click': 'setActive'
    },

    initialize: function (options) {
        this.parent = options.parent;
        this.setElement($('<div class="tag"></div>'));
        this.listenTo(this.model, 'destroy', this.remove);
        $('#current-image-wrapper').append(this.$el);
    },

    move: function (event) {
        // TODO: add boundaries
        var self        = this,
            offset      = self.getElementPosition(self.$el),
            offsetStart = { top: event.pageY, left: event.pageX };

        $('#fossil-finder').on('mousemove', function (event) {
            var offsetDrag = { top: event.pageY, left: event.pageX },
                diff       = self.getOffsetDiff(offsetStart, offsetDrag),
                props      = {
                    top: offset.top + diff.top,
                    left: offset.left + diff.left
                };

            self.$el.css(props);
        });

        $('#fossil-finder').one('mouseup', function (event) {
            var offsetEnd = { top: event.pageY, left: event.pageX },
                diff      = self.getOffsetDiff(offsetStart, offsetEnd),
                props     = {
                    top: offset.top + diff.top,
                    left: offset.left + diff.left
                };

            if (Math.abs(diff.top) > 3 && Math.abs(diff.left) > 3) {
                self.$el.css(props);
                self.model.set({
                    top: props.top / self.parent.scale,
                    left: props.left / self.parent.scale
                });
                self.model.save();
            }
            $('#fossil-finder').off('mousemove');
        });       
    },

    render: function () {
        this.$el.html(_.template(ff.templates.get('tag'))({ tag: this.model }));
        this.scale();
        if (this.model.active) {
            this.$el.addClass('active');
        } else {
            this.$el.removeClass('active');
        }
    },

    resize: function (event) {
        var self = this,
            offsetStart = {
                top: event.pageY,
                left: event.pageX
            },
            positionStart = this.getElementPosition(this.$el);

        event.stopPropagation();

        $(window).on('mousemove', function (event) {
            var offsetDrag = {
                    top: event.pageY,
                    left: event.pageX
                },
                diff = self.getOffsetDiff(offsetStart, offsetDrag);

            self.$el.css({
                width: positionStart.width + diff.left,
                height: positionStart.height + diff.top
            });
        });

        $(window).one('mouseup', function (event) {
            var offsetEnd = {
                    top: event.pageY,
                    left: event.pageX
                },
                diff = self.getOffsetDiff(offsetStart, offsetEnd);

            self.$el.css({
                width: positionStart.width + diff.left,
                height: positionStart.height + diff.top
            });

            self.model.set(self.getElementPosition(self.$el, self.parent.scale));
            self.model.save();
            $(window).off('mousemove');
        });
    },

    scale: function () {
        this.$el.css({
            top:    this.model.get('top')    * this.parent.scale,
            left:   this.model.get('left')   * this.parent.scale,
            width:  this.model.get('width')  * this.parent.scale,
            height: this.model.get('height') * this.parent.scale
        });
    },

    setActive: function () {
        this.model.active = true;
        this.model.trigger('active-tag-set', this.model.cid);
    }
});
