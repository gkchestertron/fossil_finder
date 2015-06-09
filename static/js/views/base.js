// base view class
ff.Views.Base = Backbone.View.extend({
    getOffsetDiff: function (offset1, offset2, scale) {
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

    getRelativeOffset: function (event, $element, scale) {
        var offset = $element && $element.offset(),
            top    = event.pageY,
            left   = event.pageX;

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
    }
});
