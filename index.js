
var pr,sz_dt={},AUTO_RUN=true
function _rd(a){
	return Math.floor(a*10**15)/10**15
}
function _size(txt){
	txt=txt.toString()
	var el=document.createElement("div")
	var t=document.createTextNode(txt)
	el.appendChild(t)
	el.style="font-family: Montserrat; font-size: 18px; font-weight: 400; position: absolute; top: -1000px; left: -1000px; visibility: hidden; white-space: nowrap;"
	document.body.appendChild(el)
	var w=el.offsetWidth,h=el.offsetHeight
	el.parentNode.removeChild(el)
	sz_dt[txt]=sz_dt[txt]||{w,h}
	return sz_dt[txt]
}
function _map(v,as,ae,bs,be){
	return (v-as)/(ae-as)*(be-bs)+bs
}
function _mapC(v,vs,ve,c1,c2){
	return `hsl(${_map(v,vs,ve,c1[0],c2[0])},${_map(v,vs,ve,c1[1],c2[1])}%,${_map(v,vs,ve,c1[2],c2[2])}%)`
}
var functions={}
functions.GCD=function(a,b){
	while (true){
		if (b==0){
			return a
		}
		var tmp=a
		a=b
		b=tmp%b
	}
}
functions.LCM=function(a,b){
	return a*b/functions.GCD(a,b)
}
functions.SQRT=function(a){
	return _rd(Math.sqrt(a))
}
functions.SIN=function(a){
	return _rd(Math.sin(a))
}
functions.COS=function(a){
	return _rd(Math.cos(a))
}
functions.TAN=function(a){
	return _rd(Math.tan(a))
}
class Fraction{
	constructor(a,b,c){
		this.whole=0
		this.nom=0
		this.denom=1
		this.neg=false
		this.set(a,b,c)
		this.fraction=true
	}
	add(a,b,c){
		if (a.constructor.name=="Fraction"){[a,b,c]=a.toArray()}
		a=new Fraction(a,b,c)
		var v=functions.LCM(this.denom,a.denom)
		this.set(0,(this.whole*this.denom+this.nom)*(v/this.denom)*(this.neg==true?-1:1)+(a.whole*a.denom+a.nom)*(v/a.denom)*(a.neg==true?-1:1),v)
		this._fr()
	}
	sub(a,b,c){
		if (a.constructor.name=="Fraction"){[a,b,c]=a.toArray()}
		a=new Fraction(a,b,c)
		var v=functions.LCM(this.denom,a.denom)
		this.set(0,(this.whole*this.denom+this.nom)*(v/this.denom)*(this.neg==true?-1:1)-(a.whole*a.denom+a.nom)*(v/a.denom)*(a.neg==true?-1:1),v)
	}
	mult(a,b,c){
		if (a.constructor.name=="Fraction"){[a,b,c]=a.toArray()}
		a=new Fraction(a,b,c)
		this.set(0,((this.whole*this.denom+this.nom)*(this.neg==true?-1:1))*((a.whole*a.denom+a.nom)*(a.neg==true?-1:1)),this.denom*a.denom)
	}
	div(a,b,c){
		if (a.constructor.name=="Fraction"){[a,b,c]=a.toArray()}
		a=new Fraction(a,b,c)
		a.invert()
		this.mult(a)
	}
	invert(){
		var v=(this.whole*this.denom+this.nom)*(this.neg==true?-1:1)
		this.nom=this.denom
		this.denom=v
		this._fr()
	}
	set(a,b,c){
		if (typeof a=="string"&&b==undefined&&c==undefined){
			a=a.split(" ")
			if (a.length==2){
				b=a[1].split("/")[0]
				c=a[1].split("/")[1]
				a=a[0]
			}
			else if (a.length==1){
				if (a[0].split("/").length==1){
					a=a[0]
					b=0
					c=1
				}
				else{
					b=a[0].split("/")[0]
					c=a[0].split("/")[1]
					a=0
				}
			}
			else{
				a=0
				b=0
				c=1
			}
		}
		this.neg=false
		this.whole=parseInt(a)
		this.nom=parseInt(b)
		this.denom=parseInt(c)
		this._fr()
	}
	toArray(){
		return [this.whole*(this.neg==true?-1:1),this.nom,this.denom]
	}
	get(){
		return `${this.neg==true?"-":""}${this.neg==true&&this.nom!=0?"(":""}${this.whole!=0?this.whole:""}${this.whole!=0&&this.nom!=0?" + ":""}${this.nom!=0?this.nom+" / "+this.denom:""}${this.neg==true&&this.nom!=0?")":""}`
	}
	get_width(){
		return _size(this.whole+(this.neg==true?"-":"")).w+Math.max(_size(this.nom).w,_size(this.denom).w)
	}
	get_height(){
		return _size(this.whole+(this.neg==true?"-":"")).h+Math.max(_size(this.nom).h,_size(this.denom).h)
	}
	_fr(){
		if (this.nom<0){
			this.nom=Math.abs(this.nom)
			this.neg=true
		}
		if (this.whole<0){
			this.whole=Math.abs(this.whole)
			this.neg=true
		}
		if (this.nom>this.denom){
			this.whole+=Math.floor(this.nom/this.denom)
			this.nom%=this.denom
		}
		if (this.nom>0){
			var v=functions.GCD(this.nom,this.denom)
			this.nom/=v
			this.denom/=v
			if (this.nom==this.denom){
				this.whole++
				this.nom=0
				this.denom=1
			}
		}
	}
}
class Operation{
	constructor(o){
		this.o=o
		this.lvl={"+":0,"-":0,"*":1,"/":1,"^":2}[this.o]
		this.operation=true
	}
	get(){
		return {"+":"add","-":"sub","*":"mult","/":"div","^":"power"}[this.o]
	}
	get_width(){
		return _size(this.o).w
	}
	get_height(){
		return _size(this.o).h
	}
}
class Number{
	constructor(n){
		this.v=n
		this.number=true
	}
	toFraction(){
		return new Fraction(this.v,0,1)
	}
	add(n){
		this.v+=n.v
		this._fr()
	}
	sub(n){
		this.v-=n.v
		this._fr()
	}
	mult(n){
		this.v*=n.v
		this._fr()
	}
	div(n){
		this.v/=n.v
		this._fr()
	}
	power(n){
		this.v**=n.v
		this._fr()
	}
	get(){
		return this.v
	}
	get_width(){
		if (this.v==Infinity){return _size("âˆž").w}
		if (this.v==-Infinity){return _size("-âˆž").w}
		return _size(this.v).w
	}
	get_height(){
		if (this.v==Infinity){return _size("âˆž").h}
		if (this.v==-Infinity){return _size("-âˆž").h}
		return _size(this.v).h
	}
	_fr(){
		this.v=_rd(this.v)
	}
}
function solve(seq){
	if (seq==""){return}
	function get_subseq(s){
		var b=1,str=""
		for (var k of s){
			if (b==0){break}
			if (k=="("){b++}
			if (k==")"){b--}
			str+=k
		}
		if (b==0){return str.substring(0,str.length-1)}
		throw new Error("Unescaped bracket!")
	}
	function evl(eq){
		var idx=0,ch=false
		var opr_lvl=0
		for (var k of eq){
			if (k.operation==true){
				opr_lvl=Math.max(opr_lvl,k.lvl)
			}
		}
		for (var k of eq){
			// if (eq[idx].fraction==true){
			// 	if (idx>1&&eq[idx-1]!=undefined&&eq[idx-1].operation==true&&eq[idx-1].lvl==opr_lvl&&eq[idx-2]!=undefined&&eq[idx-2].operation!=true&&(!(idx<eq.length-2&&eq[idx+1]!=undefined&&eq[idx+1].operation==true&&eq[idx+1].lvl==opr_lvl&&eq[idx+2]!=undefined&&eq[idx+2].operation!=true)||idx>=eq.length-2)){
			// 		if (eq[idx-2].fraction!=true){eq[idx-2]=eq[idx-2].toFraction()}
			// 		eq[idx-2][eq[idx-1].get()](eq[idx])
			// 		eq[idx-1]=undefined
			// 		eq[idx]=undefined
			// 		ch=true
			// 	}
			// }
			/*else */if (eq[idx].number==true){
				if (idx>1&&eq[idx-1]!=undefined&&eq[idx-1].operation==true&&eq[idx-1].lvl==opr_lvl&&eq[idx-2]!=undefined&&eq[idx-2].operation!=true&&(!(idx<eq.length-2&&eq[idx+1]!=undefined&&eq[idx+1].operation==true&&eq[idx+1].lvl==opr_lvl&&eq[idx+2]!=undefined&&eq[idx+2].operation!=true)||idx>=eq.length-2)){
					var i=idx-3/*,to_fr=false*/
					while (true){
						if (i<1){break}
						if (!(eq[i]!=undefined&&eq[i].operation==true&&eq[i].lvl==opr_lvl&&eq[i-1]!=undefined&&eq[i-1].operation!=true)){break}
						// if (eq[i-1].fraction==true){to_fr=true}
						i-=2
					}
					i+=2
					// if (eq[i-1].fraction!=true&&to_fr==true){eq[i-1]=eq[i-1].toFraction()}
					for (var j=i;j<idx;j+=2){
						// if (eq[j+1].fraction!=true&&to_fr==true){eq[j+1]=eq[j+1].toFraction()}
						eq[i-1][eq[j].get()](eq[j+1])
						eq[j]=undefined
						eq[j+1]=undefined
					}
					ch=true
				}
			}
			idx++
		}
		for (var ki=eq.length-1;ki>=0;ki--){
			if (eq[ki]==undefined){
				eq.splice(ki,1)
			}
		}
		return {eq,ch}
	}
	function format(seq){
		var idx=0,eq=[]
		while (true){
			if (idx==seq.length){break}
			if (seq.substring(idx,idx+3)=="fr("){
				idx+=3
				var s=get_subseq(seq.substring(idx))
				idx+=s.length
				eq.push(new Fraction(...s.split(",")))
			}
			else if ("+-*/^".split("").includes(seq[idx])){
				eq.push(new Operation(seq[idx]))
			}
			else if (seq[idx]==parseInt(seq[idx])){
				if (eq.length>0&&eq[eq.length-1].number==true){
					eq[eq.length-1].v=eq[eq.length-1].v*10+parseInt(seq[idx])
				}
				else{eq.push(new Number(parseInt(seq[idx])))}
			}
			idx++
		}
		return eq
	}
	var eq=format(seq)
	if (seq.indexOf("=")==-1){
		while (true){
			draw(eq)
			var v=evl(eq)
			eq=v.eq
			if (v.ch==false&&eq.length>1){
				pr.querySelectorAll(".out-wr")[0].innerHTML=""
				pr.querySelectorAll(".tb-in")[0].style.borderColor="#d52b2b"
				return
			}
			if (v.ch==false&&eq.length==1){
				pr.querySelectorAll(".out-wr")[0].innerHTML=""
			}
			if (eq.length==1){break}
		}
		draw(eq)
		pr.querySelectorAll(".tb-in")[0].style.borderColor="#11ac1f"
		for (var i=0;i<pr.querySelectorAll(".out-wr")[0].childNodes.length;i++){
			pr.querySelectorAll(".out-wr")[0].childNodes[i].style.borderColor=_mapC(i,0,pr.querySelectorAll(".out-wr")[0].childNodes.length-1,[235,76,35],[188,91,50])
		}
		if (pr.querySelectorAll(".out-wr")[0].childNodes.length==1){pr.querySelectorAll(".out-wr")[0].childNodes[0].style.borderColor="hsl(188,91%,50%)"}
		return
	}
}
function draw(eq){
	function graph(dv,xs,ys,xe,ye){
		for (var k of eq){
			if (k.number==true&&k.v!=Infinity&&k.v!=-Infinity){
				var d=document.createElement("div")
				d.classList.add("number")
				d.innerText=k.v
				d.style.top=`${(ys+ye)/2+ys}px`
				d.style.left=`${xs+k.get_width()/2}px`
				dv.appendChild(d)
				xs+=k.get_width()+1
			}
			else if (k.number==true&&(k.v==Infinity||k.v==-Infinity)){
				var d=document.createElement("div")
				d.classList.add("infinity")
				d.innerText=(k.v==-Infinity?"-":"")+"âˆž"
				d.style.top=`${(ys+ye)/2+ys}px`
				d.style.left=`${xs+k.get_width()/2}px`
				dv.appendChild(d)
				xs+=k.get_width()+1
			}
			else if (k.operation==true){
				var d=document.createElement("div")
				d.classList.add("operation")
				d.innerText=k.o
				d.style.top=`${(ys+ye)/2+ys}px`
				d.style.left=`${xs+k.get_width()/2}px`
				dv.appendChild(d)
				xs+=k.get_width()+1
			}
		}
	}
	var mh=0,mw=0
	for (var k of eq){
		mh=Math.max(mh,k.get_height())
		mw+=k.get_width()+1
	}
	var dv=document.createElement("div")
	dv.classList.add("eq-wr")
	dv.style.width=`${mw+40+(mw%2==1?1:0)}px`
	dv.style.height=`${mh+40+(mw%2==1?1:0)}px`
	var idv=document.createElement("div")
	idv.style.width=`${mw}px`
	idv.style.height=`${mh}px`
	idv.classList.add("eq")
	graph(idv,0,0,mw,mh)
	dv.appendChild(idv)
	pr.querySelectorAll(".out-wr")[0].appendChild(dv)
}
window.onload=function(){
	pr=document.getElementsByClassName("wr")[0]
	pr.querySelectorAll(".out-wr")[0].innerHTML=""
	pr.querySelectorAll(".tb-in")[0].onkeyup=function(e){
		if (e.keyCode==13&&AUTO_RUN==false){
			pr.querySelectorAll(".out-wr")[0].innerHTML=""
			solve(this.value)
		}
		else if (AUTO_RUN==true){
			pr.querySelectorAll(".out-wr")[0].innerHTML=""
			solve(this.value)
		}
		if (this.value==""){
			pr.querySelectorAll(".tb-in")[0].style.borderColor="#8d8d8d"
		}
	}
	pr.querySelectorAll(".tb-in")[0].onkeyup({keyCode:13})
}