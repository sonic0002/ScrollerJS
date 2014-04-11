/*
 *  Copyright (c) 2014, Pi Ke, All rights reserved
 *  
 *  This is a free software
 *
 *  Author      : Pi Ke
 *  Description : A number scroller module to be embeded in your web apps
 */
;(function(parent){
	//Define ScrollPanel class
	function ScrollPanel(direction,interval,width,amount){
		this.fragment=null;
		this.div=null;
		this.direction=direction||null;
		this.interval=interval||0;
		this.amount=amount||0;
		this.width=width||0;
		this.height=amount||0;
		//Private variables
		this.scrolledAmount=0;
		this.stepSize=10;
		this.stepInterval=0;
		this.span=null;
		this.step=1;
		this.startNum=1;
		this.endNum=1;
		this.nextNum=1;
	}
	ScrollPanel.prototype={
		init:function(){
			this.fragment=document.createDocumentFragment();
			this.div=document.createElement("div");
			this.div.className="scroller";
			this.div.setAttribute("style","position:relative;overflow:hidden;width:"+this.width+"px;text-align:center;height:"+(this.height)+"px;");
			this.span=document.createElement("span");
			this.span.className="scroller-span";
			this.span.setAttribute("style","position:absolute;height:"+this.height+"px;left:0px;top:0px;");
			this.div.appendChild(this.span);
			this.fragment.appendChild(this.div);
			return this;
		},
		scroll:function(){
			switch(this.direction){
			case Scroller.DIRECTION.UP     : this.div.scrollTop+=this.stepSize;break;
//			case Scroller.DIRECTION.DOWN   : this.div.scrollTop-=this.stepSize;break;
			default:break;
			}
			this.scrolledAmount+=this.stepSize;
			if(this.scrolledAmount<this.amount){
				var that=this;
				setTimeout(function(){that.scroll();},this.stepInterval);
			}else{
				this.stop();
				this.iterate();
			}
		},
		start:function(start,end){
			this.startNum=start;
			this.endNum=end;
			this.nextNum=this.startNum;
			if(start!=end){
				this.step=(this.endNum<this.startNum)?(this.endNum+10-this.startNum):(this.endNum-this.startNum);
			}else{
				this.step=1;
			}
			this.stepInterval=Math.floor((this.interval*this.stepSize)/(this.amount*this.step));
			this.span.innerHTML=this.startNum;
			//Start scrolling
			this.iterate();
		},
		stop:function(){
			this.div.removeChild(this.div.firstChild);
			this.scrolledAmount=0;
		},
		iterate:function(){
			if(this.nextNum!=this.endNum){
				if(this.nextNum==9){
					this.nextNum=0;
				}else{
					this.nextNum++;
				}
				var span=document.createElement("span");
				span.className="scroller-span";
				span.innerHTML=this.nextNum;
				span.setAttribute("style","position:absolute;height:"+this.height+"px;left:0px;top:"+(this.height+this.div.scrollTop)+"px;");
				this.div.appendChild(span);
				
				this.scroll();
			}
		},
		revalidate:function(){
			if(this.nextNum!=this.endNum){
				this.step=(this.endNum<this.nextNum)?(this.endNum+10-this.nextNum):(this.endNum-this.nextNum);
			}else{
				this.step=1;
			}
			this.stepInterval=Math.floor((this.interval*this.stepSize)/(this.amount*this.step));
		},
		getPanel:function(){
			return this.fragment;
		},
		setEndNum:function(endNum){
			this.endNum=endNum;
		}
	};

	var Scroller=(function(){
		var numOfComponent=0;
		
		function ScrollerImpl(props){
			this.scrollPanelArray=[];
			this.props=props;
			this.scrollPane=document.createElement("div");
			this.table=null;
			this.beginNum=0;
			this.endNum=0;
			this.css=null;
			this.init(0,0);
		}

		ScrollerImpl.prototype={
			init:function(begin,end){
				this.clear();
				this.oldCountArray=[];
				this.newCountArray=[];
				this.scrollPanelArray=[];
				this.beginNum=begin;
				this.endNum=end;
				begin=begin+"";
				end=end+"";
				var beginLength=begin.length,endLength=end.length;
				for(var i=0;i<beginLength;++i){
					this.oldCountArray.push(begin.charAt(i));
				}
				for(var i=0;i<endLength;++i){
					this.newCountArray.push(end.charAt(i));
				}

				//Do necessary padding
				var diff=Math.abs(beginLength-endLength);
				var maxLength=Math.max(beginLength,endLength);
				if(beginLength>endLength){
					for(var i=1;i<=diff;++i){
						this.newCountArray.unshift("0");
					}
				}else if(beginLength<endLength){
					for(var i=1;i<=diff;++i){
						this.oldCountArray.unshift("0");
					}
				}

				//Start building UI
				this.table=document.createElement("table");
				this.table.className="scroller-table";
				this.table.setAttribute("style","margin:auto;");
				if(this.css!=null){
					this.setStyle(this.css);
				}
				var tr=document.createElement("tr");
				var indWidth=Math.floor(this.props.width/maxLength);
				var thousandSeperatorCount = 4-maxLength%3;
				for(var i=0;i<maxLength;++i){
					var td=document.createElement("td");
					
					var scrollPanel=new ScrollPanel(
						this.props.direction,
						this.props.interval,
						indWidth,
						this.props.amount
					).init();
					this.scrollPanelArray.push(scrollPanel);
					td.appendChild(scrollPanel.getPanel());
					tr.appendChild(td);

					if((i+thousandSeperatorCount)%3===0&&(i+1)<maxLength&&this.props.thousandSeperator!==""){
						var td=document.createElement("td");
						var span=document.createElement("span");
						span.className="scroller-span";
						span.innerHTML=this.props.thousandSeperator;
						span.setAttribute("style","height:"+this.height+"px;left:0px;");
						td.appendChild(span);
						tr.appendChild(td);
					}
				}
				this.table.appendChild(tr);
				this.scrollPane.appendChild(this.table);

				for(var i=0,len=this.oldCountArray.length;i<len;++i){
					this.scrollPanelArray[i].start(this.oldCountArray[i],this.newCountArray[i]);
				}
			},
			appendTo:function(parent){
				parent.appendChild(this.scrollPane);
				return this;
			},
			//Here style should be JavaScript format
			setStyle:function(css){
				this.css=css;
				if(typeof css === "string"){
					var entries = css.split(";");
					for(var i in entries){
						var pair=entries[i].split(":");
						var key=pair[0];
						var value=(pair.length==2)?pair[1]:"";

						if(!this.isUnmodifiableStyle(key)){
							this.table.style[key]=value;
						}					
					}
				}else if(typeof css === "object"){
					for(var prop in css){
						this.table.style[prop]=css[prop];
					}
				}
				//Else silently ignore the css
			},
			isUnmodifiableStyle:function(propName){
				var unmodifiableAttributeNames=["position","overflow"];	
				for(var i in unmodifiableAttributeNames){
					if(propName.toLowerCase()===unmodifiableAttributeNames[i]){
						return true;
					}
				}
				return false;
			},
			start:function(number){
				var count=0;
				if(typeof number === "number"){
					count=parseInt(number)+"";
				}else{
					count=number.trim().replace(/,/g,"");
				}
				
				this.init(number,number);
			},
			scrollTo:function(number){
				var count=0;
				if(typeof number === "number"){
					count=parseInt(number)+"";
				}else{
					count=number.trim().replace(/,/g,"");
				}
				if(count.length!=this.newCountArray.length){
					this.init(this.endNum,parseInt(count));
				}else{
					this.beginNum=this.endNum;
					this.oldCountArray=this.newCountArray;
					this.endNum=parseInt(count);
					this.newCountArray=[];
					for(var i=0,len=count.length;i<len;++i){
						this.newCountArray.push(count.charAt(i));
					}
				}

				this.refresh();
			},
			scrollFromTo:function(from,to){
				var count=0;
				if(typeof from === "number"){
					count=parseInt(from);
				}else{
					count=from.trim().replace(/,/g,"");
				}
				this.endNum=parseInt(count);  //this.endNum will be assigned to this.beginNum
				                              //in scrollTo() method.
				this.newCountArray=[];
				for(var i=0,len=count.length;i<len;++i){
					this.newCountArray.push(count.charAt(i));
				}

				this.scrollTo(to);
			},
			refresh:function(){
				oldCountArray=this.oldCountArray;
				newCountArray=this.newCountArray;
				scrollPanelArray=this.scrollPanelArray;
				setTimeout(function(){
					for(var i=0,len=oldCountArray.length;i<len;++i){
						scrollPanelArray[i].setEndNum(newCountArray[i]);
						scrollPanelArray[i].revalidate();
						scrollPanelArray[i].iterate();
					}
				},1);	
			},
			clear:function(){
				while (this.scrollPane.firstChild) {
    				this.scrollPane.removeChild(this.scrollPane.firstChild);
				}
			}
		};

		return {
			DIRECTION:{
				UP    : 1,
				DOWN  : 2,
				LEFT  : 3,
				RIGHT : 4
			},
			getNewInstance:function(props){
				numOfComponent++;

				//Sanitize properties
				props                   = props || {};
				props.direction         = props.direction || Scroller.DIRECTION.UP;
				props.interval          = props.interval || 5000;
				props.width             = props.width || 400;
				props.amount            = props.amount || 250;
				props.thousandSeperator = props.thousandSeperator || "";

				return new ScrollerImpl(props);
			},
			getScrollerSize:function(){
				return numOfComponent;
			}
		};
	})();

	//Export the components
	parent.Scroller=Scroller;
})(window); 
