var Loculare = (function($, $H, $D, $V){
	
	var enableTrace = false,
		maxAnimationSteps = -100,
		roundCoordinates = false,
		fixedAngles = false;
	
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
	
	function spawn(snap, pos){
		var protLoc = snap.circle(pos.x, pos.y, 50).attr({
			fill:"#f00",
			stroke:"#004",
			strokeWidth:5
		});
		protLoc.drag();
		protLoc.click(function(ev){
			// console.log(ev);
			if(ev.ctrlKey){
				//alert("Protoloculare");
				division(protLoc, snap);
			}
		});
		
		animatedItems.push(new Skeleton(snap, pos));



	}

	function Skeleton(snap, pos){ // скелет амебы
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
				
			var bound = snap.line(pos.x, pos.y, x, y).attr({stroke:'#0000ff', 'stroke-width':3});
			bound.data('length', podLength);
			bound.data('angle', alphaRad*i);
			var ndView = snap.circle(x, y, 8);
			ndView.drag(dragmove, dragstart, dragend);
			ndView.data('bound', bound);
			ndView.data('velocity', 0);
			
			cBounds.push(bound);
			nodes.push(ndView);
		}
		
		var ndCenter = snap.circle(pos.x, pos.y, 8);
		ndCenter.drag(dragmove, dragstart, dragend);
		ndCenter.data('cBounds', cBounds);
		ndCenter.data('velocity', 0);
		
		this.center = ndCenter;
		this.nodes = nodes;
		
		
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
	
	Skeleton.prototype.animate = function(dT){
		
		var bounds = this.center.data('cBounds');
		var center = this.center;
		var nodes = this.nodes;
		
		// координаты центра
		var cx = parseInt(center.attr('cx')),
			cy = parseInt(center.attr('cy'));
			
		if(roundCoordinates){
			cx = Math.floor(cx);
			cy = Math.floor(cy);
		}
		
		
		for(var i=0; i<nodes.length; i++){
			var nd = nodes[i];
			var v0 = nd.data('velocity');
			
			var viewTrace = enableTrace && i==1;
			
			if(viewTrace) console.log('---- node '+i+' ----');
			
			// координаты узла
			var x = parseInt(nd.attr('cx')),
				y = parseInt(nd.attr('cy'));
				
			if(roundCoordinates){
				x = Math.floor(x);
				y = Math.floor(y);
			}
				
			if(viewTrace) console.log('x: ', x, ', y: ', y, ', cx:', cx, ', cy:', cy);
			
			// текущая длина луча
			var curLength = Math.sqrt((cx-x)*(cx-x) + (cy-y)*(cy-y));
			
			var bound = nd.data('bound');
			var stdLength = bound.data('length');
			
			if(viewTrace) console.log('curLength: ', curLength, ' stdLength: ', stdLength);
			
			var dL = curLength - stdLength;
			
			var dS = v0*dT + (dL*Settings.k* dT*dT)/Settings.m; // линейное перемещение

			var newPos;
			
			if(fixedAngles){
				newPos = new $V()
					.SetPolar(
						curLength - dS,
						bound.data('angle'),
						false
					);
			}
			else{
			
				var vect0 = new $V(x-cx, y-cy); // исходное направление
				if(viewTrace) console.log('vect0: ', vect0);
				
				var vect0polar = vect0.getPolar();
				
				newPos = new $V()
					.SetPolar(
						vect0polar.mod - dS,
						vect0polar.angle,
						true
					);
			}
			if(viewTrace) console.log('newPos:', newPos);
			
			var newX = newPos.x + cx,
				newY = newPos.y + cy;
			
			nd.attr({cx: newX, cy: newY});
			bound.attr({x2:newX, y2:newY});
			
		}
	}
	
	
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
		spawn: spawn
	};
})(jQuery, Html.version('4.1.0'), JDB.version('3.0.1'), Vector);
