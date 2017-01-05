var Loculare = (function($, $H, $D, $V){
	
	var enableTrace = false,
		maxAnimationSteps = -100,
		roundCoordinates = false,
		maxAnimationTime = 500;
	
	var Settings = {
		divtime: 1500,   // время анимации деления
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
		}, Settings.divtime);
		cd.animate({
			r:r0/2,
			cx:+c.attr("cx")+r0/2
		}, Settings.divtime);
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
		
		if(dT<maxAnimationTime){		
			for(var i=0; i<animatedItems.length; i++){
				animatedItems[i].animate(dT);
			}
		}
		
		if(maxAnimationSteps>0 && frameNumber>maxAnimationSteps) return;
		
		requestAnimFrame(function(){
			animationStep(frameNumber+1, curT);
		});
	}
	animationStep(0, (new Date).getTime());
	
	
	function basicSpawn(snap, pos, item, skin){
		var nodeCountRange = {min:4, max:6}; // ограничение на количество узлов
		var nodeCount = Math.round(
			Math.random()*
			(nodeCountRange.max-nodeCountRange.min) + nodeCountRange.min
		);

		var alphaRad = (Math.PI*2.0)/nodeCount; // угол между узлами
		
		var r0 = 50;  // 80
		
		var nodes = []; // массив координат узлов
		var cBounds = [];
		
		for(var i=0; i<nodeCount; i++){
			var podLength = r0*(Math.random() + 0.5); // длинна части скелета
			
			var nodePos = new $V().SetPolar(podLength, alphaRad*i, false);
			
			var x = nodePos.x+pos.x,
				y = nodePos.y+pos.y;
				
			var bound = snap.line(pos.x, pos.y, x, y).attr({stroke:skin.line.color, 'stroke-width':skin.line.width});
			bound.data('length', podLength);
			bound.data('angle', alphaRad*i);
			var ndView = snap.circle(x, y, 8).attr({'stroke':skin.node.color, 'fill':skin.node.fill, cursor:'pointer'});
			ndView.drag(dragmove, dragstart, dragend);
			ndView.data('bound', bound);
			ndView.data('velocity', 0);
			
			cBounds.push(bound);
			nodes.push(ndView);
		}
		
		var ndCenter = snap.circle(pos.x, pos.y, 8).attr({stroke:skin.center.color, fill:skin.center.fill, cursor:'pointer'});
		ndCenter.drag(dragmove, dragstart, dragend);
		ndCenter.data('cBounds', cBounds);
		ndCenter.data('velocity', 0);
		
		item.center = ndCenter;
		item.nodes = nodes;
		
		
		function dragstart(x, y, e) {
			this.data("curPos", [
				+this.attr("cx"), 
				+this.attr("cy")
			]);
		}
		function dragmove(dx, dy, x, y, e) {
			var curP = this.data("curPos");
			var posX = dx + curP[0],
				posY = dy + curP[1];
			
			this.attr({cx:posX, cy:posY});
			
			var bound  = this.data('bound');
			if(bound) bound.attr({x2:posX, y2:posY});
			else{
				var cBounds = this.data('cBounds');
				for(var i=0; i<cBounds.length; i++){
					cBounds[i].attr({x1:posX, y1:posY});
				}
			}
		}
		function dragend(e) {}
	}
	
	
	$(function(){
		$('body').css({
			'background-color': Loculare.skin=='tron'?'#002'
				:Loculare.skin=='bio'?'#d7fff8'
				:'#fff'
		});
	});

	return {
		registerAnimated: function(item){
			animatedItems.push(item);
		},
		roundCoordinates: roundCoordinates,
		enableTrace: enableTrace,
		Settings:Settings,
		basicSpawn: basicSpawn,
		skin: 'classic' // available: 'tron', 'classic', 'bio'
	};
})(jQuery, Html.version('4.1.0'), JDB.version('3.0.1'), Vector);
