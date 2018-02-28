# DevTouch
Javascript Touch Library
Author: Devon Wieczorek
Release: 0.2.0
Last Updated: 9/1/17

Languages:
- Javascript
- jQuery

Dependencies:
- jQuery

Known Limitations:
- Has been tested in limited environments

To Do:
- Add more granular events

DevTouch is a super lightweight Javascript Library (dependant on jQuery) that allows touch functionality and event listening to your pages.
This library has now been expanded for desktop support as well. 

### Creating the Object
DevTouch is based around the TouchInstance object that accepts any legal CSS selector as it's argument.

Your object can be created like so:
```javascript
var touchInstance = new TouchInstance('#element');
```

### Calling the Object
Your construtor function is not called when the reference to your object is created. This is for good reason though, 
as DevTouch has beforeTouchInstanceInit and afterTouchInstanceInit functions that allow you to overwrite native variables and functions,
create custom callbacks, etc. You pass each of them an anonymous function as an argument, and inside is where you
can work your magic.

Examples of both can be found below:

```javascript
// Override properties of the object or trigger functions before the object is constructed
touchInstance.beforeTouchInstanceInit(function(){
    console.log('Call me first');
    touchInstance.preventPageScroll = true;
    touchInstance.showTrackingElements = true;
});

// Create callback functions to be executed after the object is constructed (typically for code dependant upon that object)
touchInstance.afterTouchInstanceInit(function(){
    console.log('Call me after');
});

// You then construct your object like so:
touchInstance.createTouchInstance();
```

### Native Functions

There are multiple native functions called that you can take advantage of that act as event listeners:
- handleTouchFunction
- handleDragFunction
- handleReleaseFunction
- touchNotEnabledFunction
- onBoundTop
- onBoundBottom
- onBoundLeft
- onBoundRight
- onOverflowTop
- onOverflowBottom
- onOverflowLeft
- onOverflowRight

These functions are written internally as variables, and are intended to be set to anonymous functions like so:

```javascript
touchInstance.handleTouchFunction = function(){
    console.log('Touched');
}
```

Please note that boundaries are based on the parent element's dimensions and positioning. Parents should be either relatively 
or absolutely positioned. For a better mobile experience, I recommend also adding these attributes to the parent's CSS.
```css
#parent{
     -webkit-user-drag: none;
     -webkit-tap-highlight: transparent;
     -webkit-tap-highlight: rgba(0,0,0,0);
}
```

### Class Names
These functions also have corresponding classes that are automatically added/removed to your element based on certain events:
- touched
- touchBoundTop
- touchBoundBottom
- touchBoundLeft
- touchBoundRight
- touchOverflowTop
- touchOverflowBottom
- touchOverflowLeft
- touchOverflowRight

### Debugging
As a final hidden perk of the library, for development/debugging purposes it also includes tracking elements.
In your beforeTouchInstanceInit function if you set showTrackingElements to true, an absolutely positioned
container will be added to your document which tracks the following for your object:
- Origin X
- Origin Y
- Limit Top
- Limit Bottom
- Limit Left
- Limit Right
- Offset X (Position Offset Top)
- Offset Y (Position Offset Left)
- Touch Location X (Location of your finger)
- Touch Location Y (Location of your finger)

### Contribute
DevScript includes a  full Javascript file which is heavily documented. 
Paruse as your leisure, test it out for yourself, and PLEASE any feedback would be much appreciated! 
This project was intended to be open source and I would love to see it take on a life of it's own.

Happy Hacking!
