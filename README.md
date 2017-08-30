# DevTouch
Javascript Touch Library
Author: Devon Wieczorek
Release: 0.1.1
Last Updated: 8/17/17

Languages:
- Javascript
- jQuery

Dependencies:
- jQuery

Known Limitations:
- Currently does not work for web, only touch-enabled devices

To Do:
- Adapt for web
- Add more granular events

DevTouch is a super lightweight Javascript Library (dependant on jQuery) that allows touch functionality and event listening to your pages.
This library currently only supports touch on mobile devices, but will be expanded for web soon. 

DevTouch is based around the TouchInstance object that accepts any legal CSS selector as it's argument.

Your object can be created like so:
var touchInstance = new TouchInstance('#element');

However, your construtor function is not called when your object is created. This is for good reason though, 
as DevTouch has beforeTouchInstanceInit and afterTouchInstanceInit functions that allow you to overwrite native variables and functions,
create custom callbacks, etc. You pass each of them an anonymous function as an argument, and inside is where you
can work your magic.

Examples of both can be found below:
touchInstance.beforeTouchInstanceInit(function(){
    console.log('Call me first');
    touchInstance.preventPageScroll = true;
    touchInstance.showTrackingElements = true;
});

touchInstance.afterTouchInstanceInit(function(){
    console.log('Call me after');
});

You then construct your object like so:
touchInstance.createTouchInstance();

There are multiple native functions called that you can take advantage of that act as event listeners:
- handleTouchFunction
- handleDragFunction
- handleReleaseFunction
- onBoundTop
- onBoundBottom
- onBoundLeft
- onBoundRight
- onOverflowTop
- onOverflowBottom
- onOverflowLeft
- onOverflowRight

These functions are written internally as variables, and are intended to be set to anonymous functions like so:
touchInstance.handleTouchFunction = function(){
    console.log('Touched');
}

These functions also have corresponding classes that are automatically added/removed to your element:
- touched
- touchBoundTop
- touchBoundBottom
- touchBoundLeft
- touchBoundRight
- touchOverflowTop
- touchOverflowBottom
- touchOverflowLeft
- touchOverflowRight

As a final hidden perk of the library, for development/debugging purposes it also includes tracking elements.
In your beforeTouchInstanceInit function if you set showTrackingElements to true, an absolutely positioned
container will be added to your document which tracks the following for your object:
- Origin X
- Origin Y
- Location X (Location of your finger)
- Location Y (Location of your finger)
- Touch X (Position Offset Top)
- Touch Y (Position Offset Left)

DevScript includes a  full Javascript file which is heavily documented. 
Paruse as your leisure, test it out for yourself, and PLEASE any feedback would be much appreciated! 
This project was intended to be open source and I would love to see it take on a life of it's own.

Happy Hacking!
