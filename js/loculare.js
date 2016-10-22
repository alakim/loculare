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
				prepareView(protLoc);
				break;
			case 'rect': protLoc = snap.rect(pos.x, pos.y, 50, 50);
				prepareView(protLoc);
				break;
			
			case 'svg': Snap.load("js/svg/amoeba.svg", function (amoeba) {
					var g = snap.group();
					g.append(amoeba);
					g.drag();
					animateMembrane();
					// var PthMembrane = snap.path("m 420,225.5 c 0,22.63117 -3.68462,44.39094 -10.47956,64.6978 -8.24459,24.63914 -21.06817,47.13931 -37.44491,66.46175 -21.1408,24.94343 -48.20269,44.5914 -78.97884,56.70933 C 270.74218,422.17085 246.42805,427 221,427 178.68961,427 139.46326,413.62978 107.217,390.83432 77.966272,370.15646 54.459032,341.72316 39.603287,308.47897 28.295276,283.17389 22,255.08135 22,225.5 22,172.25013 42.399327,123.82463 75.716752,87.798728 93.999901,68.029283 116.17312,51.993771 141.00015,40.943987 165.48147,30.048072 192.54319,24 221,24 271.937,24 318.40416,43.378111 353.60343,75.250894 394.35218,112.1487 420,165.79154 420,225.5 zloculare.js:65:4");
					// PthMembrane.animate({ d: "m 440,225.5 c 0,22.63117 -2.68462,44.39094 -11.47956,64.6978 -8.24459,24.63914 -21.06817,47.13931 -37.44491,66.46175 -21.1408,24.94343 -48.20269,44.5914 -78.97884,56.70933 C 270.74218,422.17085 246.42805,427 221,427 178.68961,427 139.46326,413.62978 107.217,390.83432 77.966272,370.15646 54.459032,371.72316 39.603287,308.47897 28.295276,283.17389 22,255.08135 22,225.5 22,172.25013 42.399327,123.82463 75.716752,87.798728 93.999901,68.029283 116.17312,51.993771 141.00015,40.943987 165.48147,30.048072 192.54319,24 221,24 271.937,24 318.40416,43.378111 353.60343,75.250894 394.35218,112.1487 420,165.79154 420,225.5 zloculare.js:65:4" }, 1000, mina.bounce);
					
		                });
				break;
				
				case 'circle':
			default:
				protLoc = snap.circle(pos.x, pos.y, 50);
				prepareView(protLoc);
				break;
		}
		
		function animateMembrane(){
			var membrane = Snap.select('#membrane');
			
			var srcPath = membrane.attr('path');
			var srcPathArray = Snap.parsePathString(srcPath);
			// console.log(srcPathArray);
			
			for(var i=0; i<srcPathArray.length; i++){
				var el = srcPathArray[i];
				if(el instanceof Array){
					for(var j=0; j<el.length; j++){
						var x = el[j];
						if(typeof(x)=='number'){
							srcPathArray[i][j] += (Math.random() - .5)*Loculare.settings.deformRate;
						}
					}
				}
			}
			
			membrane.animate({
				// path:'M100 100 L 200 100 L 150 250 Z'
				path: srcPathArray
			}, 1000);
		}
		
		function prepareView(protLoc){
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
		
	}
	
	return {
		settings:{
			divtime: 1500,   // время анимации деления
			deformRate: 100, // коэффициент изменения формы
			view: 'circle' // вид отображения (circle, rect, path)
		},
		spawn: spawn
	};
})(jQuery, Html.version('4.1.0'), JDB.version('3.0.1'));

