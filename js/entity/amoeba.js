var Amoeba = (function($, $H, $D, $V){
	
	function Amoeba(){
		Loculare.registerAnimated(this);
	}
	
	

	$D.extend(Amoeba.prototype, {
		spawn: function(snap, pos){
			Skeleton.prototype.spawn.apply(this, [snap, pos]);
		},
		animate: function(dT){
		
			var bounds = this.center.data('cBounds');
			var center = this.center;
			var nodes = this.nodes;
			
			// координаты центра
			var cx = parseInt(center.attr('cx')),
				cy = parseInt(center.attr('cy'));
				
			if(Loculare.roundCoordinates){
				cx = Math.floor(cx);
				cy = Math.floor(cy);
			}
			
			
			for(var i=0; i<nodes.length; i++){
				var nd = nodes[i];
				var v0 = nd.data('velocity');
				
				var viewTrace = Loculare.enableTrace && i==1;
				
				if(viewTrace) console.log('---- node '+i+' ----');
				
				// координаты узла
				var x = parseInt(nd.attr('cx')),
					y = parseInt(nd.attr('cy'));
					
				if(Loculare.roundCoordinates){
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
				
				var dS = v0*dT + (dL*Loculare.Settings.k* dT*dT)/Loculare.Settings.m; // линейное перемещение

				var newPos;
				

				
				var vect0 = new $V(x-cx, y-cy); // исходное направление
				if(viewTrace) console.log('vect0: ', vect0);
				
				var vect0polar = vect0.getPolar();
				
				newPos = new $V()
					.SetPolar(
						vect0polar.mod - dS,
						vect0polar.angle,
						true
					);
						
				if(viewTrace) console.log('newPos:', newPos);
				
				var newX = newPos.x + cx,
					newY = newPos.y + cy;
				
				nd.attr({cx: newX, cy: newY});
				bound.attr({x2:newX, y2:newY});
				
			}
		}
	});
	
	return Amoeba;
})(jQuery, Html.version('4.1.0'), JDB.version('3.0.1'), Vector);