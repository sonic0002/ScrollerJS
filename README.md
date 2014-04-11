scroller
========

A number scroller module to be embeded in your web apps.

It's easy to set up

1. Include the scroller.js into your WEB page with &lt;script type="text/javascript" src="scroller.js"&gt;&lt;/script&gt;
2. Create a Scroller instance by callying Scroller.getNewInstance(props)
   var scroller=Scroller.getNewInstance({
  	direction:Scroller.DIRECTION.UP,
  	interval:3000,
  	width:200,
  	amount:80
   });

   --direction : Scroll direction, currently supported direction is UP. Default is UP<br/>
   --interval  : The time interval to scroll from start to end number in milliseconds. Default is 5 seconds<br/>
   --width     : The scroller panel width in px. Default is 400px<br/>
   --amount    : The amount of px to scroll for each number,e.g 0->1,1->2,2->3......Default is 0<br/>
   You can omit one or all the properties above. The default value is used if the property is not specified
   
3. Start the scroller by calling scroller.start(number); Here number is the initial number to start, e.g 100
4. Scroll to the number you want by calling scroller.scrollTo(number);

You can modify the style of the scroller panel by modifying the scroller.css file. The class .scroller-span is the the panel for each individual digit. More classes will be added.
