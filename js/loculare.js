var Loculare = (function($, $H, $D, $V){
	
	var enableTrace = false,
		maxAnimationSteps = -100,
		roundCoordinates = false;
	
	var Settings = {
		m: 1,	// масса узла
		k: 1e-4		// коэффициент упругости связи
	};

	function division(c, s){
		var r0 = c.attr("r");
		var cd = c.clone();
		cd.drag();
		cd.click(function(ev){
			if(ev.ctrlKey){
				division(cd,s);
			}
		});
		c.animate({
			r:r0/2,
			cx:+c.attr("cx")-r0/2
		}, Loculare.settings.divtime);
		cd.animate({
			r:r0/2,
			cx:+c.attr("cx")+r0/2
		}, Loculare.settings.divtime);
	}

	var requestAnimFrame = window.requestAnimationFrame ||
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		window.oRequestAnimationFrame ||
		window.msRequestAnimationFrame ||
		function (callback) {setTimeout(callback, 16);};



	function collision(x1, y1, r1, x2, y2, r2){
		// return $V.length2(x1, y1, x2, y2) <=(r1 + r2)(r1 + r2);
		return new $V(x1-x2, y1-y2).getLength() <= (r1 + r2)(r1 + r2);
	}

	var animatedItems = [];
	


	
	function animationStep(frameNumber, t0){
		if(enableTrace) console.log('*********** Animation step '+frameNumber+' **********');
		var curT = (new Date).getTime();
		var dT = curT - t0;
		
		for(var i=0; i<animatedItems.length; i++){
			animatedItems[i].animate(dT);
		}
		
		if(maxAnimationSteps>0 && frameNumber>maxAnimationSteps) return;
		
		requestAnimFrame(function(){
			animationStep(frameNumber+1, curT);
		});
	}
	animationStep(0, (new Date).getTime());

	return {
		settings:{
			divtime: 1500   // время анимации деления
		},
		registerAnimated: function(item){
			animatedItems.push(item);
		},
		roundCoordinates: roundCoordinates,
		enableTrace: enableTrace,
		Settings:Settings
	};
})(jQuery, Html.version('4.1.0'), JDB.version('3.0.1'), Vector);
