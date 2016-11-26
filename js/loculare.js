var Loculare = (function($, $H, $D, $V){

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
		return $V.length2(x1, y1, x2, y2) <=(r1 + r2)(r1 + r2);
	}

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

		skeleton(snap, pos);


		var testPoint = snap.circle(50, 50, 10).attr({fill:'#00ff00', stroke:'#000022'});
		var velocity = .1;
		function animationStep(frameNumber, t0){
			var curT = (new Date).getTime();
			var dT = curT - t0;
			var curVel = velocity + (frameNumber-10)*(frameNumber-10)/100;
			var dX = dT * curVel;
			var x0 = +testPoint.attr('cx');
			testPoint.attr({cx:x0 + dX});
			requestAnimFrame(function(){
				animationStep(frameNumber+1, curT);
			});
		}
		animationStep(0, (new Date).getTime());

	}

	function skeleton(snap, pos){ // скелет амебы
		var nodeCountRange = {min:4, max:6}; // ограничение на количество узлов
		var nodeCount = Math.round(
			Math.random()*
			(nodeCountRange.max-nodeCountRange.min) + nodeCountRange.min
		);

		var alphaRad = (Math.PI*2.0)/nodeCount; // угол между узлами

		var r0 = 80;
		var nodes = []; // массив координат узлов
		for(var i=0; i<nodeCount; i++){
			nodes.push($V.polar(r0, alphaRad*i));
		}

		var ndCenter = snap.circle(pos.x, pos.y, 8);
		ndCenter.drag();
		$D.each(nodes, function(nd){
			var x = nd[0]+pos.x,
				y = nd[1]+pos.y;
			var ndView = snap.circle(x, y, 8);
			var bound = snap.line(pos.x, pos.y, x, y).attr({stroke:'#0000ff', 'stroke-width':3});
			ndView.drag();
		});

	}

	return {
		settings:{
			divtime: 1500   // время анимации деления
		},
		spawn: spawn
	};
})(jQuery, Html.version('4.1.0'), JDB.version('3.0.1'), Vector2);
