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
  	amount:80,
   seperatorType:Scroller.SEPERATOR.THOUSAND,
   seperator:",",
   textAlign:"right"
   });

   --direction : Scroll direction, currently supported direction is UP. Default is UP<br/>
   --interval  : The time interval to scroll from start to end number in milliseconds. Default is 5 seconds<br/>
   --width     : The scroller panel width in px. Default is 400px<br/>
   --amount    : The amount of px to scroll for each number,e.g 0->1,1->2,2->3......Default is 250px<br/>
   --seperatorType : The seperatorType to be used, default is NONE. Possible values are Scroller.SEPERATOR.[NONE|THOUSAND|TIME]<br/>
   --seperator : The seperator symbol,e.g ",". Default is no seperator<br/>
   --textAlign : The text alignment on the scroller. It is equivalent to the CSS text-align property. Default is center aligned<br/>
   You can omit one or all the properties above. The default value is used if the property is not specified

3. Append the scroller to the target element to display the scroller. Call scroller.appendTo(target);
4. Start the scroller by calling scroller.start(number); Here number is the initial number to start, e.g 100
5. Scroll to the number you want by calling scroller.scrollTo(number);

You can modify the style of the scroller panel by modifying the scroller.css file. The class .scroller-span is the the panel for each individual digit. More classes will be added.

<h2>Websites which use this module</h2>
   PixelsTech : http://www.pixelstech.net/fun.php

<h2>Why this?</h2>
1. The non compressed version is only 12KB and the minitified version is ONLY 7KB. This means you will spend less on getting more
2. It is cross browser compatible. It has been tested on Chrome 42.0, Firefox 37.0.2, IE 11, Safari 5.1.7, Opera 29.0.
3. It has no dependency. It doesn't any other JS framework to work.
4. More...(Waiting for you to make itt.)

<h3>We welcome pull requests to improve its performance and benefit more people.</h3>
