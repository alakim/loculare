var Skeleton = (function($, $H, $D, $V){
	function Skeleton(){ // скелет амебы
		Loculare.registerAnimated(this);
		//animatedItems.push(this);
	}

	
	

	$D.extend(Skeleton.prototype, {
		spawn: function(snap, pos){
			 Loculare.basicSpawn(snap, pos, this, skin);
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
				
				newPos = new $V()
					.SetPolar(
						curLength - dS,
						bound.data('angle'),
						false
					);

				if(viewTrace) console.log('newPos:', newPos);
				
				var newX = newPos.x + cx,
					newY = newPos.y + cy;
				
				nd.attr({cx: newX, cy: newY});
				bound.attr({x2:newX, y2:newY});
				
			}
		}
	});
	
	var skin;
	
	$(function(){
		skin = {
			node:{
				color:Loculare.skin=='tron'?'#080'
					:'#000'
			},
			center:{
				color: Loculare.skin=='tron'?'#840'
					:'#000',
				fill: '#000'
			},
			line:{
				color: Loculare.skin=='tron'?'#0000ff'
					:'#0000ff',
				width: Loculare.skin=='tron'? 1
					:3
			}
		};
	});
	
	return Skeleton;
})(jQuery, Html.version('4.1.0'), JDB.version('3.0.1'), Vector);