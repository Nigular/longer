'use strict';
var longer = window.longer || {};
longer.GoTop = function() {

}
longer.GoTop.prototype = {
	constructor: longer.GoTop,
	init: function(obj) {
		var self = this;
		self.curtime=0;
		self.duration = obj.duration !== undefined ? obj.duration : 50;
		console.log(document.documentElement.scrollTop);
		self.topvalue = document.body.scrollTop?document.body.scrollTop:document.documentElement.scrollTop;
		self.enter();
	},
	Quad: {		//定义了三种缓动类型(tweenjs抄的)
        easeIn: function(t, b, c, d) {
            return c * (t /= d) * t + b;
        },
        easeOut: function(t, b, c, d) {
            return -c *(t /= d)*(t-2) + b;
        },
        easeInOut: function(t, b, c, d) {
            if ((t /= d / 2) < 1) return c / 2 * t * t + b;
            return -c / 2 * ((--t) * (t-2) - 1) + b;
        }
    },
	enter:function(){
		var self = this;
		var value = self.Quad.easeOut(self.curtime,self.topvalue,-self.topvalue,self.duration);
		if(document.body.scrollTop){
			document.body.scrollTop = value;
		}else{
			document.documentElement.scrollTop=value;
		}
		self.curtime++;
		if (self.curtime <= self.duration) {
	         // 继续运动
	         requestAnimationFrame(function(){
	         	self.enter();
	         });
	    } else {
	        // 动画结束
	    }
	}
}