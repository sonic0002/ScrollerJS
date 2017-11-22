/*
 *  Copyright (c) 2014-2015, Pi Ke, All rights reserved
 *  
 *  This is a free software
 *
 *  Author      : Pi Ke
 *  Description : A number scroller module to be embedded in your web apps
 *  Website     : http://www.pixelstech.net
 */
;(function(parent){
	var Util = {
		/* Implement the inheritance logic to make it true OOP*/
		extend:function(sup, sub){
			sub.prototype = Object.create(sup.prototype);
			sub.prototype.constructor = sup;
			return sub;
		},
		/* Clone an object. It is a shallow clone */
		clone:function(obj) {
		    if (null == obj || "object" != typeof obj) return obj;
		    var copy = obj.constructor();
		    for (var attr in obj) {
		        if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
		    }
		    return copy;
		}
	};

	// Define ScrollPanel super class
	function ScrollPanel(props){
		this.fragment=null;
		this.div=null;
		this.innerDdiv=null;
		this.direction=props.direction||null;
		this.interval=props.interval||0;
		this.amount=props.amount||0;
		this.width=props.width||0;
		this.height=props.amount||0;
		this.textAlign=props.textAlign||"center";
		this.upperBound=props.upperBound||9;
		this.forceFallback=props.forceFallback || false;
		this.mode=props._mode||Scroller.MODE.COUNTUP;
		// Private variables
		this.stepSize=Math.ceil((this.amount+1)*1.0/10) || 2;
		this.stepInterval=0;
		this.step=1;
		this.startNum=1;
		this.endNum=1;
		this.nextNum=1;
		this.firstChild = null;
		this.lastChild  = null;
		this.count = 0;
	}
	ScrollPanel.prototype=(function(){
		return {
			init:function(){
				this.fragment = document.createDocumentFragment();
				this.div = document.createElement("div");
				this.div.className = "scroller";
				this.div.setAttribute("style","position:relative;overflow:hidden;width:"+this.width+"px;text-align:"+this.textAlign+";height:"+(this.height)+"px;line-height:"+this.height+"px;");
				
				this.innerDiv = document.createElement("div");
				this.innerDiv.className = "scroller-inner-pane";
				this.innerDiv.setAttribute("style","position:absolute;width:"+this.width+"px;text-align:"+this.textAlign+";top:0;");
				// Create the first child
				this.firstChild = document.createElement("span");
				this.firstChild.className = "scroller-span";
				this.firstChild.setAttribute("style","position:absolute;height:"+this.height+"px;line-height:"+this.height+"px;left:0px;top:0px;width:"+this.width+"px;");
				this.innerDiv.appendChild(this.firstChild);
				// Create the last child
				this.lastChild = document.createElement("span");
				this.lastChild.className = "scroller-span";
				this.lastChild.setAttribute("style", "position:absolute;height:"+this.height+"px;line-height:"+this.height+"px;left:0px;width:"+this.width+"px;");
				switch(this.direction){
				case Scroller.DIRECTION.UP   : this.innerDiv.appendChild(this.lastChild); 
											   this.lastChild.style.top = this.height + "px";
											   break;
				case Scroller.DIRECTION.DOWN : this.innerDiv.insertBefore(this.lastChild, this.firstChild); 
											   this.lastChild.style.top = (-this.height) + "px";
											   break; 
				}
				this.div.appendChild(this.innerDiv);
				this.fragment.appendChild(this.div);

				this.innerInit();

				return this;
			},
			innerInit:function(){/* To be implemented by subclasses */},
			start:function(start, end){
				start = parseInt(start);
				end   = parseInt(end);
				this.startNum = start;
				this.endNum = end;
				this.nextNum = this.startNum;

				if(this.mode == Scroller.MODE.COUNTDOWN){
					if(start!=end){
						this.step = (this.endNum>this.startNum)?(this.startNum+(this.upperBound+1)-this.endNum):(this.startNum-this.endNum);
					}else{
						this.step = Number.MAX_VALUE;
					}
				} else {
					if(start!=end){
						this.step = (this.endNum<this.startNum)?(this.endNum+(this.upperBound+1)-this.startNum):(this.endNum-this.startNum);
					}else{
						this.step = Number.MAX_VALUE;
					}
				}

				this.firstChild.innerHTML = this.startNum;
				this.lastChild.innerHTML  = this.nextNum;
				
				this.innerStart();

				// Iterate the counter numbers
				this.iterate();
			},
			innerStart:function(){/* To be implemented by subclasses */},
			iterate:function(){
				if(this.nextNum != this.endNum || this.lastChild.innerHTML != this.endNum){
					// Below check is to ensure the UI is updated properly.
					// Sometimes when in low memory situation the nextNum 
					// has been set to endNum, but the corresponding UI is 
					// not updated to the endNum
					if(this.nextNum == this.endNum){
						this.nextNum = parseInt(this.lastChild.innerHTML);
					}

					if(this.mode == Scroller.MODE.COUNTDOWN){
						this.nextNum = (this.nextNum == 0)?this.upperBound:(this.nextNum-1);
					} else {
						this.nextNum = (this.nextNum == this.upperBound)?0:(this.nextNum+1);
					}

					this.innerIterate();		
				}
			},
			innerIterate:function(){/* To be implemented by subclasses */},
			scroll:function(){/* To be implemented by subclasses */},
			stop:function(){/* To be implemented by subclasses */},
			revalidate:function(){
				this.nextNum = parseInt(this.nextNum);
				this.endNum  = parseInt(this.endNum);
				// If next number is the same as end number, do nothing
				if(this.nextNum == this.endNum){
					return;
				}

				if(this.mode == Scroller.MODE.COUNTDOWN){
					if(this.nextNum!=this.endNum){
						this.step = (this.endNum>this.nextNum)?(this.nextNum+(this.upperBound+1)-this.endNum):(this.nextNum-this.endNum);
					}else{
						this.step = Number.MAX_VALUE;
					}
				} else {
					if(this.nextNum!=this.endNum){
						this.step=(this.endNum<this.nextNum)?(this.endNum+(this.upperBound+1)-this.nextNum):(this.endNum-this.nextNum);
					}else{
						this.step = Number.MAX_VALUE;
					}
				}

				this.innerRevalidate();
			},
			innerRevalidate:function(){/* To be implemented by subclasses */},
			resetPosition:function(){
				this.innerDiv.style.top = "0px";
				this.innerDiv.offsetHeight;
			},
			getPanel:function(){
				return this.fragment;
			},
			setEndNum:function(endNumber){
				this.endNum=endNumber;
			},
			setMode:function(mode){
				this.mode=mode;
			}
		};
	})();

	// Create subclass CSSTransitionScrollPanel
	function CSSTransitionScrollPanel(props){
		ScrollPanel.call(this, props);
	}
	Util.extend(ScrollPanel, CSSTransitionScrollPanel);		

	CSSTransitionScrollPanel.prototype._props = {};

	CSSTransitionScrollPanel.prototype._cssPropMap = {
		"transition-timing-function" : "TransitionTimingFunction",
		"transition-duration"        : "TransitionDuration",
		"transform"					 : "Transform"
	};

	CSSTransitionScrollPanel.prototype._set=function(obj, type, value){
		if(this._props[type]){
			obj.style.setProperty(this._props[type], value, "important");
		}else{
			var modes = "-webkit- -moz- -ms- -o-".split(" ");
			CSSTransitionScrollPanel.prototype._props[type] = type;
			for(var i=0, len = modes.length; i<len; ++i){
				var mode = modes[i].replace(/-/g,"");
				mode = (mode == "moz") ? "Moz" : mode;
				var jsStyleProp = mode+CSSTransitionScrollPanel.prototype._cssPropMap[type];
            	if(obj.style[jsStyleProp] !== undefined){
            		CSSTransitionScrollPanel.prototype._props[type] = modes[i]+type;
            		break;
            	}
            }
            this._set(obj, type, value);
		}
	}

	// Add event listener to each scroll pane
	CSSTransitionScrollPanel.prototype._addEventListener=function(obj, that){
		var transitions = {
            'WebkitTransition' : 'webkitTransitionEnd',
            'MozTransition'    : 'transitionend',
            'MSTransition'     : 'msTransitionEnd',
            'OTransition'      : 'oTransitionEnd',
            'transition'       : 'transitionend'
        };
        for(var t in transitions){
            if(obj.style[t] !== undefined){
                obj.addEventListener(transitions[t], function(event){
                	var transitionDuration = obj.style.transitionDuration || obj.style.webkitTransitionDuration;
					if(transitionDuration != "0ms"){
						that.stop();
					} 
				}, false);
				break;
            }
        }
	}

	CSSTransitionScrollPanel.prototype.innerInit = function(){
		this._addEventListener(this.innerDiv, this);
		this._set(this.innerDiv, "transition-timing-function", "linear");
	};

	CSSTransitionScrollPanel.prototype.innerStart = function(){
		this.stepInterval=Math.max(1, Math.floor(this.interval*1.0/this.step));
		if(this.direction == Scroller.DIRECTION.UP){
			this.amount = -this.amount;
		}
	};

	CSSTransitionScrollPanel.prototype.innerIterate = function(){
		// Swap first and last child
		this.firstChild.innerHTML = this.lastChild.innerHTML;
		this.lastChild.innerHTML  = this.nextNum;
		// Ensure UI repaint
		this.lastChild.offsetHeight;

		var that = this;
		setTimeout(function(){that.scroll();},0);						
	};

	CSSTransitionScrollPanel.prototype.scroll = function(){
		var rand = 1.0 +(Math.random()/100000);  // This ensures "transitionend" event will always
												 // be fired when applied to transform.scaleY().
		var transformProperty = "translateY("+this.amount+"px) scaleX("+rand+")";
		var durationProperty = (this.stepInterval)+"ms";
		this._set(this.innerDiv, "transition-duration", durationProperty);
		this._set(this.innerDiv, "transform", transformProperty);
	};

	CSSTransitionScrollPanel.prototype.stop = function(){
		var rand = 1.0 +(Math.random()/100000);
		var transformProperty = "translateY(0px) scaleX("+rand+")";
		var durationProperty  = "0ms";

		this.firstChild.innerHTML = this.lastChild.innerHTML;
		// Ensure UI repaint
		this.lastChild.offsetHeight;

		// Sometimes when in low memory situation the nextNum 
		// has been set to endNum, but the corresponding UI is 
		// not updated to the endNum
		this.nextNum = parseInt(this.lastChild.innerHTML); 

		this._set(this.innerDiv,"transition-duration", durationProperty);
		this._set(this.innerDiv,"transform", transformProperty);
		
		// Here cannot use transitionend event is because the 
		// transition duration is set to 0ms which may not trigger 
		// the transitionend event in some browsers. 
		// Initially the transition duration was set to 1ms so that 
		// we can rely on the transitionend event to trigger next 
		// iteration. But the scroll pane will have some flashing 
		// effects which is not what we expected.
		// One disadvantage of this approach is that it has some 
		// jump ship effects as it doesn't wait the transition to 
		// completes to trigger next iteration.
		var that = this;
		setTimeout(function(){
			that.iterate();
		}, 1);
	};

	CSSTransitionScrollPanel.prototype.innerRevalidate = function(){
		this.stepInterval=Math.max(1, Math.floor(this.interval*1.0/this.step));
	};

	// Create subclass DOMScrollPanel
	function DOMScrollPanel(props){
		ScrollPanel.call(this, props);
		this.scrolledAmount=0;
		this.scrollID=null;
	}
	Util.extend(ScrollPanel, DOMScrollPanel);

	DOMScrollPanel.prototype.innerStart = function(){
		this.stepInterval=Math.ceil((this.interval*this.stepSize)/(this.amount*this.step));
	};

	DOMScrollPanel.prototype.innerIterate = function(){
		// Swap first and last child
		this.firstChild.innerHTML = this.lastChild.innerHTML;
		this.lastChild.innerHTML  = this.nextNum;
		// Ensure UI repaint
		this.lastChild.offsetHeight;
		this.scroll();
	};

	DOMScrollPanel.prototype.scroll = function(){
		var innerDivStyle = this.innerDiv.style;
		var top = parseInt(innerDivStyle.top);
		switch(this.direction){
		case Scroller.DIRECTION.UP     : innerDivStyle.top = (top - this.stepSize) + "px";
										 break;
		case Scroller.DIRECTION.DOWN   : innerDivStyle.top = (top + this.stepSize) + "px";
		                                 break;
		default:break;
		}

		this.scrolledAmount+=this.stepSize;
		if(this.scrolledAmount < this.amount){
			// Below is ensure that the last scroll will not overflow
			this.stepSize = Math.min(this.stepSize, (this.amount - this.scrolledAmount));
			var that = this;
			this.scrollID = setTimeout(function(){that.scroll();},this.stepInterval);
		}else{
			if(this.scrollID!=null){
				clearTimeout(this.scrollID);
			}
			this.stop();
			this.iterate();
		}
	};

	DOMScrollPanel.prototype.stop = function(){
		this.scrolledAmount = 0;
		this.firstChild.innerHTML = this.lastChild.innerHTML;
		this.resetPosition();
	};

	DOMScrollPanel.prototype.innerRevalidate = function(){
		this.stepInterval=Math.ceil((this.interval*this.stepSize)/(this.amount*this.step));
	};

	// ScrollPanelFactory to create ScrollPanels
	var ScrollPanelFactory = (function(){
		var _isTransformSupported = _detectTransformSupport("transform");

		// Check whether CSS3 transform is supported. This is a one time check
		// performed above.
		function _detectTransformSupport(featureName){
		    var isSupported = false,
		    	domPrefixes = 'Webkit Moz ms O Khtml'.split(' '),
		    	elm = document.createElement('div'),
		    	featureNameCapital = null;

		    featureName = featureName.toLowerCase();

		    if(elm.style[featureName] !== undefined ) { isSupported = true; } 

		    if(isSupported === false){
		        featureNameCapital = featureName.charAt(0).toUpperCase() + featureName.substr(1);
		        for( var i = 0; i < domPrefixes.length; i++ ) {
		            if(elm.style[domPrefixes[i] + featureNameCapital ] !== undefined ) {
		              isSupported = true;
		              break;
		            }
		        }
		    }
		    return isSupported; 
		}

		return {
			createScrollPanel : function(props){
				if(_isTransformSupported && !props.forceFallback){
					return new CSSTransitionScrollPanel(props);
				}else{
					return new DOMScrollPanel(props);
				}
			}
		};
	})();

	var Scroller=(function(){
		// Watch how many Scroller instances created.
		// Just for statistic purpose
		var numOfComponent=0;
		
		function ScrollerImpl(props){
			this.scrollPanelArray=[];
			this.props=props;
			this.scrollPane=document.createElement("div");
			this.table=null;
			this.beginNum=0;
			this.endNum=0;
			this.css=null;
			this.width=this.props.width;
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

				// Do necessary padding
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

				// Start building UI
				var divFragment=document.createDocumentFragment();
				this.table=document.createElement("table");
				this.table.className="scroller-table";
				this.table.setAttribute("style","margin:auto;");
				if(this.css!=null){
					this.setStyle(this.css);
				}
				
				var indWidth=Math.floor(this.width/maxLength);
				this.props._mode=(this.beginNum>this.endNum)?Scroller.MODE.COUNTDOWN:Scroller.MODE.COUNTUP;
				this.props.width = indWidth; //Set the width property

				this.innerInit(maxLength);

				divFragment.appendChild(this.table);
				this.scrollPane.appendChild(divFragment);

				for(var i=0,len=this.oldCountArray.length;i<len;++i){
					this.scrollPanelArray[i].start(this.oldCountArray[i],this.oldCountArray[i]);
				}
			},
			innerInit:function(maxLength){
				var separatorCount=0;
				if(this.props.separatorType!==Scroller.SEPARATOR.NONE){
					separatorCount = this.props.separatorType+1-maxLength%(this.props.separatorType);
				}
				var tr=document.createElement("tr");
				for(var i=0;i<maxLength;++i){
					var td=document.createElement("td");
					
					// Update props
					var scrollPanel=ScrollPanelFactory.createScrollPanel(this.props).init();
					this.scrollPanelArray.push(scrollPanel);
					td.appendChild(scrollPanel.getPanel());
					tr.appendChild(td);

					if(this.props.separatorType!=Scroller.SEPARATOR.NONE&&
					  (i+separatorCount)%this.props.separatorType===0&&(i+1)<maxLength){
						var td=document.createElement("td");
						var div = document.createElement("div");
						div.className = "scroller-separator-pane";
						var span=document.createElement("span");
						span.className="scroller-span";
						span.innerHTML=this.props.separator;
						div.setAttribute("style","height:"+(this.props.amount + 10)+"px;line-height:"+this.props.amount+"px;left:0px;top:0px;vertical-align:middle;");
						div.appendChild(span);
						td.appendChild(div);
						tr.appendChild(td);
					}
				}
				this.table.appendChild(tr);
			},
			appendTo:function(parent){
				parent.appendChild(this.scrollPane);
				return this;
			},
			getScrollPanels:function(){
				return this.scrollPanelArray;
			},
			// Here style should be JavaScript format
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
				// Else silently ignore the css
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
				var count=(number+"").trim().replace(/,:/g,"");
				if(count.length!=this.newCountArray.length){
					this.init(this.endNum, count);
				}else{
					this.beginNum=this.endNum;
					this.oldCountArray=this.newCountArray;
					this.endNum=count;
					this.newCountArray=[];
					this.props._mode=(this.beginNum>this.endNum)?Scroller.MODE.COUNTDOWN:Scroller.MODE.COUNTUP;
					for(var i=0,len=count.length;i<len;++i){
						this.newCountArray.push(count.charAt(i));
					}
				}

				this.refresh();
			},
			scrollFromTo:function(from,to){
				var from=(from+"").trim().replace(/,:/g,"");
				var to = (to+"").trim().replace(/,:/g,"");

				this.start(from);
				this.scrollTo(to);
			},
			refresh:function(){
				var that = this;
				setTimeout(function(){
					for(var i=0,len=that.oldCountArray.length;i<len;++i){
						if(that.props._mode !== undefined){
							that.scrollPanelArray[i].setMode(that.props._mode);
						}
						that.scrollPanelArray[i].setEndNum(that.newCountArray[i]);
						that.scrollPanelArray[i].revalidate();
						that.scrollPanelArray[i].iterate();
					}
				},1);	
			},
			clear:function(){
				while (this.scrollPane.firstChild) {
    				this.scrollPane.removeChild(this.scrollPane.firstChild);
				}
			}
		};

		// Time ScrollerImpl to extend the ScrollerImpl
		function TimeScrollerImpl(props){
			ScrollerImpl.call(this, props);
		}
		Util.extend(ScrollerImpl, TimeScrollerImpl);
		TimeScrollerImpl.prototype.innerInit = function(maxLength){
			var separatorCount = this.props.separatorType+1-maxLength%(this.props.separatorType);
			var tr=document.createElement("tr");
			for(var i=0;i<maxLength;++i){
				var td=document.createElement("td");

				var props = Util.clone(this.props);
				if(i%2==0){
					if(i==0){
						props.upperBound = 2;
					}else{
						props.upperBound = 5;
					}
				}
				// Update props
				var scrollPanel=ScrollPanelFactory.createScrollPanel(props).init();
				this.scrollPanelArray.push(scrollPanel);
				td.appendChild(scrollPanel.getPanel());
				tr.appendChild(td);

				if((i+separatorCount)%props.separatorType===0&&(i+1)<maxLength){
					var td=document.createElement("td");
					var div = document.createElement("div");
					var span=document.createElement("span");
					span.className="scroller-span";
					span.innerHTML=props.separator;
					div.setAttribute("style","height:"+(props.amount + 10)+"px;line-height:"+props.amount+"px;left:0px;top:0px;vertical-align:middle;");
					div.appendChild(span);
					td.appendChild(div);
					tr.appendChild(td);
				}
			}
			this.table.appendChild(tr);
		};

		// ScrollerImplFactory to create different ScrollerImpl
		var ScrollerImplFactory = (function(){
			return {
				createScrollerImpl:function(props){
					var obj = null;
					switch(props.separatorType){
					case Scroller.SEPARATOR.TIME :
						obj = new TimeScrollerImpl(props);
						break;
					case  Scroller.SEPARATOR.THOUSAND:
					default :
						obj = new ScrollerImpl(props);
						break;
					}
					return obj;
				}
			};
		})();

		return {
			DIRECTION:{
				UP    : 1,
				DOWN  : 2
			},
			SEPARATOR:{
				NONE     : 0,
				TIME     : 2,
				THOUSAND : 3
			},
			MODE:{
				COUNTUP   : 0,
				COUNTDOWN : 1
			},
			getNewInstance:function(props){
				numOfComponent++;

				// Sanitize properties
				props                   = props || {};
				props.direction         = props.direction || Scroller.DIRECTION.UP;
				props.interval          = props.interval || 5000;
				props.width             = props.width || 400;
				props.amount            = props.amount || 250;
				props.separatorType     = props.separatorType || Scroller.SEPARATOR.NONE;
				props.separator         = props.separator || "";
				props.textAlign         = props.textAlign || "center";
				props.forceFallback     = props.forceFallback || false;

				return ScrollerImplFactory.createScrollerImpl(props);
			},
			getScrollerSize:function(){
				return numOfComponent;
			}
		};
	})();

	// Export the Scroller object
	parent.Scroller=Scroller;
})(window); 