/*
 *  Copyright (c) 2014-2015, Pi Ke, All rights reserved
 *  
 *  This is a free software
 *
 *  Author      : Pi Ke
 *  Description : A number scroller module to be embeded in your web apps
 *  Website     : http://www.pixelstech.net
 */
;(function(parent){
	//Define ScrollPanel class
	function ScrollPanel(props){
		this.fragment=null;
		this.div=null;
		this.direction=props.direction||null;
		this.interval=props.interval||0;
		this.amount=props.amount||0;
		this.width=props.width||0;
		this.height=props.amount||0;
		this.textAlign=props.textAlign||"center";
		//Private variables
		this.scrolledAmount=0;
		this.stepSize=Math.ceil((this.amount+1)*1.0/25) || 2;
		this.stepInterval=0;
		this.step=1;
		this.startNum=1;
		this.endNum=1;
		this.nextNum=1;
		this.firstChild = null;
		this.lastChild  = null;
	}
	ScrollPanel.prototype=(function(){
		return {
			init:function(){
				this.fragment=document.createDocumentFragment();
				this.div=document.createElement("div");
				this.div.className="scroller";
				this.div.setAttribute("style","position:relative;overflow:hidden;width:"+this.width+"px;text-align:"+this.textAlign+";height:"+(this.height)+"px;");
				//Create the first child
				this.firstChild=document.createElement("span");
				this.firstChild.className="scroller-span";
				this.firstChild.setAttribute("style","position:absolute;height:"+this.height+"px;line-height:"+this.height+"px;left:0px;width:"+this.width+"px;");
				this.div.appendChild(this.firstChild);
				//Create the last child
				this.lastChild = document.createElement("span");
				this.lastChild.className = "scroller-span";
				this.lastChild.setAttribute("style", "position:absolute;height:"+this.height+"px;line-height:"+this.height+"px;left:0px;width:"+this.width+"px;");
				switch(this.direction){
				case Scroller.DIRECTION.UP   : this.div.appendChild(this.lastChild); break;
				case Scroller.DIRECTION.DOWN : this.div.insertBefore(this.lastChild, this.firstChild); break; 
				}
				
				this.fragment.appendChild(this.div);
				return this;
			},
			start:function(start, end){
				this.startNum = start;
				this.endNum = end;
				this.nextNum = this.startNum;
				if(start!=end){
					this.step = (this.endNum<this.startNum)?(this.endNum+10-this.startNum):(this.endNum-this.startNum);
				}else{
					this.step = 1;
				}
				this.stepInterval=Math.ceil((this.interval*this.stepSize)/(this.amount*this.step));
				this.firstChild.innerHTML = this.startNum;
				this.lastChild.innerHTML  = this.nextNum;
				
				//Iterate the counter numbers
				this.iterate();
			},
			iterate:function(){
				if(this.nextNum != this.endNum){
					if(this.nextNum == 9){
						this.nextNum = 0;
					}else{
						this.nextNum++;
					}
					//Swap first and last child
					this.firstChild.innerHTML = this.lastChild.innerHTML;
					this.lastChild.innerHTML  = this.nextNum;

					//Change position
					this.firstChild.style.top = "0px";

					switch(this.direction){
					case Scroller.DIRECTION.UP   :  this.lastChild.style.top  = this.height + "px";
													break;
					case Scroller.DIRECTION.DOWN :  this.lastChild.style.top  = (-this.height) + "px";
					                                break; 
					}
					this.scroll(this.firstChild, this.lastChild);
				}
			},
			scroll:function(firstChild, lastChild){
				var firstChildStyle = firstChild.style;
				var lastChildStyle  = lastChild.style;

				var top = parseInt(lastChildStyle.top);
				switch(this.direction){
				case Scroller.DIRECTION.UP     : 
				 							     if(top > 0){
				                                	firstChildStyle.top = (top - this.height - this.stepSize) + "px";
			                                		lastChildStyle.top  = (top - this.stepSize) + "px";
				                             	 }
												 break;
				case Scroller.DIRECTION.DOWN   : 
												 if(top < 0){
				                                	firstChildStyle.top = (top + this.height + this.stepSize) + "px";
				                                	lastChildStyle.top  = (top + this.stepSize) + "px";
				                             	 }
				                                 break;
				default:break;
				}

				this.scrolledAmount+=this.stepSize;
				if(this.scrolledAmount<this.amount){
					var that = this;
					setTimeout(function(){that.scroll(firstChild, lastChild);},this.stepInterval);
				}else{
					this.stop();
					this.iterate();
				}
			},
			stop:function(){
				if(this.nextNum == this.endNum){
					this.firstChild.innerHTML = this.lastChild.innerHTML;
				}
				this.scrolledAmount = 0;
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
	})();

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
				var divFragment=document.createDocumentFragment();
				this.table=document.createElement("table");
				this.table.className="scroller-table";
				this.table.setAttribute("style","margin:auto;");
				if(this.css!=null){
					this.setStyle(this.css);
				}
				var tr=document.createElement("tr");
				var indWidth=Math.floor(this.props.width/maxLength);
				var seperatorCount=0;
				if(this.props.seperatorType!==Scroller.SEPERATOR.NONE){
					seperatorCount = this.props.seperatorType+1-maxLength%(this.props.seperatorType);
				}
				for(var i=0;i<maxLength;++i){
					var td=document.createElement("td");
					
					//Update props
					this.props.width = indWidth;
					var scrollPanel=new ScrollPanel(this.props).init();
					this.scrollPanelArray.push(scrollPanel);
					td.appendChild(scrollPanel.getPanel());
					tr.appendChild(td);

					if(this.props.seperatorType!=Scroller.SEPERATOR.NONE&&
					  (i+seperatorCount)%this.props.seperatorType===0&&(i+1)<maxLength){
						var td=document.createElement("td");
						var span=document.createElement("span");
						span.className="scroller-span";
						span.innerHTML=this.props.seperator;
						span.setAttribute("style","height:"+this.height+"px;left:0px;width:"+this.width+"px;top:0px;");
						td.appendChild(span);
						tr.appendChild(td);
					}
				}
				this.table.appendChild(tr);
				divFragment.appendChild(this.table);
				this.scrollPane.appendChild(divFragment);

				for(var i=0,len=this.oldCountArray.length;i<len;++i){
					this.scrollPanelArray[i].start(this.oldCountArray[i],this.newCountArray[i]);
				}
			},
			appendTo:function(parent){
				parent.appendChild(this.scrollPane);
				return this;
			},
			getScrollPanels:function(){
				return this.scrollPanelArray;
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
			SEPERATOR:{
				NONE     : 0,
				THOUSAND : 3,
				TIME     : 2
			},
			getNewInstance:function(props){
				numOfComponent++;

				//Sanitize properties
				props                   = props || {};
				props.direction         = props.direction || Scroller.DIRECTION.UP;
				props.interval          = props.interval || 5000;
				props.width             = props.width || 400;
				props.amount            = props.amount || 250;
				props.seperatorType     = props.seperatorType || Scroller.SEPERATOR.NONE;
				props.seperator         = props.seperator || "";
				props.textAlign         = props.textAlign || "center";

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
