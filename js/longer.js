'use strict';
(function() {
	window.URL = window.URL || window.webkitURL;
	window.AudioContext = window.AudioContext || window.webkitAudioContext;

	document.exitFullscreen = document.exitFullscreen || document.webkitExitFullscreen || document.mozExitFullscreen;

	navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
	
	if (! function() {}.bind) {
		Function.prototype.bind = function(context) {
			var self = this,
				args = Array.prototype.slice.call(arguments);

			return function() {
				return self.apply(context, args.slice(1));
			}
		};
	}
	
	if (!Date.now) {
		Date.now = function() {
			return new Date().getTime();
		};
	}
	/**       
	 * 对Date的扩展，将 Date 转化为指定格式的String       
	 * 月(M)、日(d)、12小时(h)、24小时(H)、分(m)、秒(s)、周(E)、季度(q) 可以用 1-2 个占位符       
	 * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)       
	 * eg:       
	 * (new Date()).format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423       
	 * (new Date()).format("yyyy-MM-dd E HH:mm:ss") ==> 2009-03-10 二 20:09:04       
	 * (new Date()).format("yyyy-MM-dd EE hh:mm:ss") ==> 2009-03-10 周二 08:09:04       
	 * (new Date()).format("yyyy-MM-dd EEE hh:mm:ss") ==> 2009-03-10 星期二 08:09:04       
	 * (new Date()).format("yyyy-M-d h:m:s.S") ==> 2006-7-2 8:9:4.18       
	 */
	Date.prototype.format = function(fmt) {
		var o = {
			"M+": this.getMonth() + 1, //月份           
			"d+": this.getDate(), //日           
			"h+": this.getHours() % 12 == 0 ? 12 : this.getHours() % 12, //小时           
			"H+": this.getHours(), //小时           
			"m+": this.getMinutes(), //分           
			"s+": this.getSeconds(), //秒           
			"q+": Math.floor((this.getMonth() + 3) / 3), //季度           
			"S": this.getMilliseconds() //毫秒           
		};
		var week = {
			"0": "日",
			"1": "一",
			"2": "二",
			"3": "三",
			"4": "四",
			"5": "五",
			"6": "六"
		};
		if (/(y+)/.test(fmt)) {
			fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
		}
		if (/(E+)/.test(fmt)) {
			fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "星期" : "周") : "") + week[this.getDay() + ""]);
		}
		for (var k in o) {
			if (new RegExp("(" + k + ")").test(fmt)) {
				fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
			}
		}
		return fmt;
	}

	if (window.Element) {
		Element.prototype.requestFullscreen = Element.prototype.requestFullscreen || Element.prototype.webkitRequestFullScreen || Element.prototype.mozRequestFullScreen;
		Element.prototype.on = Element.prototype.addEventListener;
		Element.prototype.off = Element.prototype.removeEventListener;
	}
	if(window.Audio){
		Audio.prototype.autoPlay = function(callback){
			var audio = this;
			audio.play();
			if(audio.paused){
				var ev = function() {
					document.removeEventListener('touchstart', ev, true);
					audio.play();
					callback && callback();
				}
				if (/MicroMessenger/i.test(navigator.userAgent)) {
					if (window.WeixinJSBridge) {
						WeixinJSBridge.invoke('getNetworkType', {}, function(e) {
							audio.play();
							callback && callback();
						});
					} else {
						document.addEventListener("WeixinJSBridgeReady", function() {
							WeixinJSBridge.invoke('getNetworkType', {}, function(e) {
								audio.play();
								callback && callback();
							});
						}, false);
					}
				} else {
					document.addEventListener('touchstart', ev, true);
				}
			}else{
				callback && callback();
			}
		}
	}
	
	(function() {
		var vendors = ['webkit', 'moz'];
		for (var i = 0; i < vendors.length && !window.requestAnimationFrame; ++i) {
			var vp = vendors[i];
			window.requestAnimationFrame = window[vp + 'RequestAnimationFrame'];
			window.cancelAnimationFrame = (window[vp + 'CancelAnimationFrame'] || window[vp + 'CancelRequestAnimationFrame']);
		}
		if (/iP(ad|hone|od).*OS 6/.test(window.navigator.userAgent) // iOS6 is buggy
			|| !window.requestAnimationFrame || !window.cancelAnimationFrame) {
			var lastTime = 0;
			window.requestAnimationFrame = function(callback) {
				var now = Date.now();
				var nextTime = Math.max(lastTime + 16, now);
				return setTimeout(function() {
						callback(lastTime = nextTime);
					},
					nextTime - now);
			};
			window.cancelAnimationFrame = clearTimeout;
		}
	}());

	if (!window.localStorage) {
		alert('请关闭无痕模式');
	}
})();

var longer = window.longer || {};

var longer = {
	config: {
		designWidth: 750,		//设计稿宽度
		designHeight: 1100,		//设计稿高度(设定最小可视范围的高)
		wxShare: false,
		debug: false,
		windowWidth: 0,			//可视窗口宽度
		windowHeight: 0,		//可视窗口高度
		windowScale: 0,			
		aspectRatio: 0			//视窗的宽:视窗的高
	},
	ua: (function() {
		var ua = navigator.userAgent,
			obj = {
				name: ua,
				isAndroid: /android/i.test(ua),
				isIOS: /iphone os/i.test(ua),
				isIpad: /ipad/i.test(ua),
				isWM: /windows ce/i.test(ua) || /windows mobile/i.test(ua),
				isMidp: /midp/i.test(ua),
				isUc7: /rv:1.2.3.4/i.test(ua),
				isUc: /ucweb/i.test(ua) || /ucbrowser/i.test(ua),
				isWeiXin: /MicroMessenger/i.test(ua),
				isWebKit: /webkit/i.test(ua),
				isChrome: /Chrome/i.test(ua)
			}
		obj.isMobile = obj.isAndroid || obj.isIOS || obj.isIpad || obj.isWM || obj.isMidp || obj.isUc7 || obj.isUc;
		obj.isPC = !(typeof window.orientation === 'number');
		obj.isMac = /macintosh|mac os x/i.test(ua);
		if (ua.toLocaleLowerCase().indexOf('ucbrowser') > -1) {
			var control = navigator.control || {};
			if (control.gesture) {
				control.gesture(false);
			}
		}
		return obj;
	})(),
	query: {
		id: function(dom) {
			return document.getElementById(dom);
		},
		class: function(dom) {
			return document.getElementsByClassName(dom);
		},
		tag: function(dom) {
			return document.getElementsByTagName(dom);
		},
		one: function(dom) {
			return document.querySelector(dom);
		},
		all: function(dom) {
			return document.querySelectorAll(dom);
		},
		url: function(item) {
			var svalue = location.search.match(new RegExp("[\?\&]" + item + "=([^\&]*)(\&?)", "i"));
			return svalue ? svalue[1] : svalue;
		},
		urls: function() {
			var url = location.search;
			var theRequest = new Object(),
				strs;
			if (url.indexOf("?") != -1) {
				var str = url.substr(1);
				if (str.indexOf("&") != -1) {
					strs = str.split("&");
					for (var i = 0; i < strs.length; i++) {
						theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
					}
				} else {
					var key = str.substring(0, str.indexOf("="));
					var value = str.substr(str.indexOf("=") + 1);
					theRequest[key] = decodeURI(value);
				}
			}
			return theRequest;
		}
	},
	require: function() {
		var length = arguments.length,
			self = this;
		if (length === 2) {
			var values = [];
			arguments[0].forEach(function(v) {
				if (self[v]) {
					values.push(self[v]);
				}
			});
			arguments[1].apply(self, values);
		} else {
			arguments[0].apply(self);
		}
	}
};
Object.defineProperty(longer, 'require', {
	enumerable: false
});

longer.require(['config', 'ua', 'query'], function(config, ua, query) {
	document.write('<meta name="browsermode" content="application">' + '<meta name="x5-page-mode" content="app">');
	
	/** 这里设定页面的根字号，注意在引入该JS文件时先设定好config里的设计宽高 **/
	(function() {
		var scr = document.getElementsByTagName('script'),
			html = document.documentElement,
			body,
			config_width = config.designWidth || 0,
			config_height = config.designHeight || 0;
			var delay, setSize = function() {
				config.windowWidth = html.clientWidth || window.innerWidth || html.getBoundingClientRect().width;
				config.windowHeight = html.clientHeight || window.innerHeight || html.getBoundingClientRect().height;
				config.aspectRatio = config.windowWidth / config.windowHeight;
				if (!config_width || config.aspectRatio > config_width / config_height) {	//实际宽高比大于设计最低宽高比
					
					config.windowScale = config_height / config.windowHeight;
					html.style.cssText += 'font-size:' + config.windowHeight * 100 / config_height + 'px!important;';
				} else {	//实际宽高比小于设计最低宽高比
					
					config.windowScale = config_width / config.windowWidth;
					html.style.cssText += 'font-size:' + config.windowWidth * 100 / config_width + 'px!important;';
				}
				html.offsetWidth;
				if (ua.isAndroid && ua.isUc && !!body) {
					body.style.visibility = 'hidden';
					body.offsetHeight;
					body.style.visibility = 'visible';
				}
			}
		if (!config_height && !config_width) {	
			config_width = 640;		//如果没有设定，则默认宽度为640
		}
		setSize();
		window.addEventListener('resize', function() {
			cancelAnimationFrame(delay);
			delay = requestAnimationFrame(setSize);
		}, false);
		if (ua.isAndroid && ua.isUc) {
			document.addEventListener('DOMContentLoaded', function() {
				body = document.body;
				cancelAnimationFrame(delay);
				delay = requestAnimationFrame(setSize);
			}, false);
		}
	})();

	if (config.debug || query.url('debug')) {
		document.addEventListener('contextmenu',function(e){e.preventDefault()});
		document.write('<script src="js/debug.js" type="text/javascript" charset="utf-8"><\/script>');
	}
	
});