var Vector2 = (function(){
	function add (v1, x2, y2){
		return [
			v1[0]+x2,
			v1[1]+y2
		];
	}

	function mul (v, a){
		return [
			v[0]*a,
			v[1]*a
		];
	}

	function length2 (x1, y1, x2, y2){
		return (x1-x2)*(x1-x2)+(y1-y2)*(y1-y2);
	}

	function polar(r, alphaRad){
		return [
			r * Math.cos(alphaRad),
			r * Math.sin(alphaRad)
		];
	}

	return {
		add:add,
		mul:mul,
		length2:length2,
		polar:polar
	};
})();
