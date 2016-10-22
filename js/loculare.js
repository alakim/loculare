var Loculare = (function($, $H, $D){
	
	function spawn(snap, pos){

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

		var size = 50;
		var path = [
			'M', pos.x, ',', pos.y,
			'L', pos.x+size, ',', pos.y,
			'L', pos.x+size, ',', pos.y+size,
			'L', pos.x+size/1.5, ',', pos.y+size/2,
			'L', pos.x+size/3, ',', pos.y+size/.5,
			'L', pos.x, ',', pos.y+size, 
			'Z'
		].join('');
		
		var protLoc;
		
		switch(Loculare.settings.view){
			case 'path': protLoc = snap.path(path);
				break;
			case 'rect': protLoc = snap.rect(pos.x, pos.y, 50, 50);
				break;
			case 'circle':
			default:
				protLoc = snap.circle(pos.x, pos.y, 50);
				break;
		}
		
		protLoc.attr({
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
		
	}
	
	return {
		settings:{
			divtime: 1500,   // время анимации деления
			view: 'circle' // вид отображения (circle, rect, path)
		},
		spawn: spawn
	};
})(jQuery, Html.version('4.1.0'), JDB.version('3.0.1'));

