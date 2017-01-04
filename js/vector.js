function Vector(x, y){
	switch(arguments.length){
		case 2: this.x = x; this.y = y; break;
		case 1: if(x instanceof Array){this.x = x[0]; this.y = x[1];}
				else if(x instanceof Vector){this.x = x.x; this.y = x.y}
			break;
		default: this.x = 0; this.y = 0; break;
	}
	if(arguments.length==2){this.x = x; this.y = y;}
}
$.extend(Vector, {
	scalarProd: function(v1, v2){return v1.x*v2.x + v1.y*v2.y;}
});
$.extend(Vector.prototype, {
	Add: function(x, y){
		if(x instanceof Array){this.x+=x[0]; this.y+=x[1];}
		else if(x instanceof Vector){this.x+=x.x; this.y+=x.y;}
		else{this.x+=x; this.y+=y;}
		return this;
	},
	add: function(x, y){return (new Vector(this)).Add(x, y);},
	Mul: function(rate){
		if(rate instanceof Vector){
			this.x*=rate.x; this.y*=rate.y;
		}
		else {
			this.x*=rate;this.y*=rate;
		}
		return this;
	},
	mul: function(rate){return (new Vector(this)).Mul(rate);},
	Norm: function(){var _=this;
		var lng = Math.sqrt(_.x*_.x+_.y*_.y);
		return _.Mul(1/lng);
	},
	norm: function(){
		return (new Vector(this)).Norm();
	},
	getAngle: function(degreeMode){
		degreeMode = degreeMode==null?true:degreeMode;
		var angle = Math.atan2(this.y, this.x);
		return degreeMode?angle/Math.PI*180:angle;
	},
	getLength: function(){return Math.sqrt(this.x*this.x + this.y*this.y);},
	getPolar: function(degreeMode){
		degreeMode = degreeMode==null?true:degreeMode;
		return {
			mod:this.getLength(), 
			angle:this.getAngle(degreeMode)
		};
	},
	Set: function(x, y){
		if(arguments.length==1){
			if(x instanceof Array){this.x = x[0]; this.y = x[1];}
			else if(x instanceof Vector){this.x = x.x; this.y = x.y}
		}
		else{
			this.x = x; this.y = y;
		}
		return this;
	},
	SetPolar: function(mod, angle, degreeMode){
		degreeMode = degreeMode==null?true:degreeMode;
		if(degreeMode) angle = angle/180*Math.PI;
		this.x = Math.cos(angle)*mod;
		this.y = Math.sin(angle)*mod;
		return this;
	},
	toString: function(){
		return "("+[this.x, this.y].join()+")";
	}
});