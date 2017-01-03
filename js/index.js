'use strict';
longer.require(['config', 'ua', 'query', 'Loading'], function(config, ua, query, Loading) {
	function load() {
		var loader = new Loading(),prograssS = query.class('prograss')[0].children[0].style;
		loader.init({
			searchBgs: true,
			enterCallback:function(){
				prograssS.webkitTransform = 'translateX('+(this.count/this.length*100-100).toFixed(0)+'%)';
			},
			callback: function() {
				requestAnimationFrame(function() {
					init();
				});
			}
		});
	}
	
	function init() {
		loadMask.hidden = true;
		//main[0].hidden = false;
		//main[0].classList.add('active');
	}

	var loadMask = query.class('loadMask')[0],
	main = query.tag('main');
	var loader1 = new Loading();
	// 先处理了预加载页动画的资源加载
	loader1.init({
		searchImgs: {
			dom: loadMask
		},
		callback: function() {
			requestAnimationFrame(function() {
				load();		//再开始处理其他图片资源的加载
			});
		}
	});
	
	// 禁止默认触屏滑动
	(function(bol) {
		if (bol) {
			if (bol === 'false' || bol === '0') {
				document.addEventListener('touchmove', function(e) {
					e.preventDefault();
				});
			}
		}
	})(document.body.dataset.move);
	// 参数，从body的data-里获取，为false时，传进来禁止滑动
	
	// 音乐自动播放，通过微信浏览器的网络状态回调来触发
	var audio = new Audio();
	audio.src = 'audios/1.mp3';
	audio.loop = true;
	audio.autoPlay();
	
});