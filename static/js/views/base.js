// base view class
ff.Views.Base = Backbone.View.extend({
    getBox: function (offset1, offset2, scale) {
        var result = {
            top    : ff.min([offset1.top,    offset2.top]),
            left   : ff.min([offset1.left,   offset2.left]),
            height : Math.abs(offset1.top  - offset2.top),
            width  : Math.abs(offset1.left - offset2.left)
        }

        if (scale) {
            for (var i in result) {
                result[i] = result[i]/scale;
            }
        }

        return result;
    },

    getElementPosition: function ($element, scale) {
        var top = $element.css('top'),
            left = $element.css('left'),
            result = {
                top:  parseInt(top.slice(0, top.length - 2)),
                left: parseInt(left.slice(0, left.length -2)),
                width: $element.width(),
                height: $element.height()
            };

        if (scale) {
            for (var i in result) {
                result[i] = result[i]/scale;
            }
        }

        return result;
    },
            

    getOffsetDiff: function (offsetStart, offsetEnd, scale) {
        var result = {
                top: offsetEnd.top - offsetStart.top,
                left: offsetEnd.left - offsetStart.left
            };

        if (scale) {
            for (var i in result) {
                result[i] = result[i]/scale;
            }
        }

        return result;
    },

    getRelativeOffset: function (event, $element, scale) {
        var offset = $element && $element.offset(),
            top    = event.pageY || offset.top/2,
            left   = event.pageX || offset.left/2;

        if (offset) {
            top  = top - offset.top;
            left = left - offset.left;
        }
        else {
            console.log('something went wrong')
        }

        if (scale) {
            top  = top/this.scale;
            left = left/this.scale;
        }

        return { top: top, left: left };
    },

    preventDefault: function (event) {
        event.preventDefault();
    }
});
