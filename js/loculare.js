var Loculare = (function($, $H, $D){

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
		
	}
	
	return {
		settings:{
			divtime: 1500   // время анимации деления
		},
		spawn: spawn
	};
})(jQuery, Html.version('4.1.0'), JDB.version('3.0.1'));

