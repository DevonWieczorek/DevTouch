/***********************************************/
// DevTouch.js
// v0.2.0
// Authored By: Devon Wieczorek
// https://github.com/DevonWieczorek/DevTouch
// <script type="text/javascript" src="http://cdn.rawgit.com/DevonWieczorek/DevTouch/master/touch.js"></script>
/***********************************************/

'use strict';

function TouchInstance(el){
    
    this.el = $(el);
    this.elWidth = this.el.width();
    this.elHeight = this.el.height();
    this.parent = this.el.parent();
    this.boundX = this.parent.width();
    this.boundY = this.parent.height();
    this.origX = this.el.offset().left - this.parent.offset().left;
    this.origY = this.el.offset().top - this.parent.offset().top;
    this.deviceWidth = $(window).width();
    this.deviceHeight = $(window).height();

    // Restrict Motion
    this.slideXEnabled = true;
    this.slideYEnabled = true;

    // Misc Optional Arguments
    this.preventPageScroll = false;
    this.returnToOrigin = true;
    
    // Event Functions
    this.handleTouchFunction = function(){}
    this.handleDragFunction = function(){}
    this.handleReleaseFunction = function(){}
    
    this.touchNotEnabledFunction = function(){}
    
    this.onBoundTop = function(){}
    this.onBoundBotton = function(){}
    this.onOverflowTop = function(){}
    this.onOverflowBottom = function(){}

    this.onBoundLeft = function(){}
    this.onBoundRight = function(){}
    this.onOverflowLeft = function(){}
    this.onOverflowRight = function(){}

    // Is this a touch enabled device?
    this.checkTouchEnabled = function(){
             // Works on Most Browsers  || Works on IE 10/11 and Surface
        return 'ontouchstart' in window || navigator.maxTouchPoints; 
    }
    this.touchEnabled = this.checkTouchEnabled();

    // Tracking elements for development/debugging
    this.trackingElements = `
        <div id="touchTrackingInfo" style="position: fixed; bottom: 0; right: 0; width: 100%; z-index: 99999; background: #fff;">
            Origin Y: <span class="origY"></span><br>
            Origin X: <span class="origX"></span><br>
            Limit Top: <span class="limitTop"></span><br>
            Limit Bottom: <span class="limitBottom"></span><br>
            Limit Left: <span class="limitLeft"></span><br>
            Limit Right: <span class="limitRight"></span><br>
            Offset X: <span class="elPosX"></span><br>
            Offset Y: <span class="elPosY"></span><br>
            Touch Location Y: <span class="touchLocY"></span><br>
            Touch Loaction X: <span class="touchLocX"></span><br>
        </div>
    `;
    this.showTrackingElements = false;
        
    // Work some scope magic - 'self' saves the context of 'this'
    var self = this;

    this.setEventListeners = function(){
        this.el.on('mousedown touchstart', this.handleTouch);
        
        this.el.on('mouseup touchend', function(){
            var bL = self.el.hasClass('touchBoundLeft');
            var oL = self.el.hasClass('touchOverflowLeft');
            var bR = self.el.hasClass('touchBoundRight');
            var oR = self.el.hasClass('touchOverflowRight');

            var bT = self.el.hasClass('touchBoundTop');
            var oT = self.el.hasClass('touchOverflowTop');
            var bB = self.el.hasClass('touchBoundBottom');
            var oB = self.el.hasClass('touchOverflowBottom');

            // Return element to it's original position
            if(self.returnToOrigin && !bT && !oT && !bB && !oB && !bL && !oL && !bR && !oR){ 
                self.el.animate({
                    position: 'absolute', 
                    margin: '0px', 
                    top: self.origY,
                    left: self.origX
                }, 250);
            }
        });
    }

    // When element is touched
    this.handleTouch = function(){
        if(typeof self.handleTouchFunction == 'function') self.handleTouchFunction();
        
        self.el.addClass('touched');

        $('body')
        .on('mouseup touchend', self.handleRelease)
        .on('mousemove touchmove', function(e){ self.handleDrag(e) }); 
    }

    // When element is moved
    this.handleDrag = function(e){
        var x, y;
        (self.touchEnabled) ? x = e.originalEvent.touches[0].pageX : x = e.clientX;
        (self.touchEnabled) ? y = e.originalEvent.touches[0].pageY : y = e.clientY;
        var elPosX = self.el.offset().left;
        var elPosY = self.el.offset().top;
        var touchLocX = x - (self.elWidth / 2);
        var touchLocY = y - (self.elHeight / 2);
        var limitRight = self.boundX + self.parent.offset().left;
        var limitLeft = self.parent.offset().left;
        var limitBottom = self.boundY + self.parent.offset().top;
        var limitTop = self.parent.offset().top;

        if(typeof self.handleDragFunction == 'function') self.handleDragFunction();

        // Horizontal movements
        if(self.slideXEnabled){
            
            self.el.offset({left: touchLocX});
            
            if(touchLocX >= (limitRight - self.elWidth)){
                self.el.addClass('touchBoundRight');
                if(typeof self.onBoundRight == 'function') self.onBoundRight();

                if(touchLocX >= (limitRight - self.elWidth / 2)){
                    self.el.addClass('touchOverflowRight');
                    if(typeof self.onOverflowRight == 'function') self.onOverflowRight();
                }
            }
            else if(touchLocX <= limitLeft){
                self.el.addClass('touchBoundLeft');
                if(typeof self.onBoundLeft == 'function') self.onBoundLeft();

                if(touchLocX <= (limitLeft - self.elWidth / 2)){
                    self.el.addClass('touchOverflowLeft');
                    if(typeof self.onOverflowLeft == 'function') self.onOverflowLeft();
                }
            }
            else{
                self.el.removeClass('touchBoundRight touchBoundLeft touchOverflowRight touchOverflowLeft');
            }
        } 

        // Vertical Movements
        if(self.slideYEnabled){
            
            self.el.offset({top: touchLocY});
            
            if(touchLocY <= limitTop){
                self.el.addClass('touchBoundTop');
                if(typeof self.onBoundBottom == 'function') self.onBoundBottom();

                if(touchLocY <= (limitTop - self.elHeight / 2)){
                    self.el.addClass('touchOverflowTop');
                    if(typeof self.onOverflowBottom == 'function') self.onOverflowBottom();
                }
            }
            else if(touchLocY >= (limitBottom - self.elHeight)){
                self.el.addClass('touchBoundBottom');
                if(typeof self.onBoundTop == 'function') self.onBoundTop();

                if(touchLocY >= (limitBottom - self.elHeight / 2)){
                    self.el.addClass('touchOverflowBottom');
                    if(typeof self.onOverflowTop == 'function') self.onOverflowTop();
                }
            }
            else{
                self.el.removeClass('touchBoundTop touchBoundBottom touchOverflowTop touchOverflowBottom');
            }
        } 

        // Update tracking elements
        if(self.showTrackingElements){
            $('.origY').html(self.origY);
            $('.origX').html(self.origX);
            $('.touchLocY').html(touchLocY);
            $('.touchLocX').html(touchLocX);
            $('.limitTop').html(limitTop);
            $('.limitBottom').html(limitBottom);
            $('.elPosX').html(elPosX);
            $('.elPosY').html(elPosY);
            $('.limitLeft').html(limitLeft);
            $('.limitRight').html(limitRight);
        }
    }

    // When element is released
    this.handleRelease = function(e){
        $('body')
        .off('mousemove touchmove', this.handleDrag)
        .off('mouseup touchend', this.handleRelease);

        self.el.removeClass('touched');

        if(typeof self.handleReleaseFunction == 'function') self.handleReleaseFunction();
    }

    // Called when the constructor is called
    this.checkConditionals = function(){
        if(self.preventPageScroll){
            $('html, body').on('touchstart touchmove', function(e){ 
                 e.preventDefault(); 
            });
        }

        if(self.showTrackingElements){
            $('body').append(this.trackingElements);
            $('.origX').html(this.origX);
            $('.origY').html(this.origY);
        } 
    }
    
    // Pre init function for overriding functions and options
    // touchInstance.beforeTouchInstanceInit(function(){ alert('touch init!') });
    this.beforeTouchInstanceInit = function(callFirst){ if(callFirst) callFirst(); }

    // Custom callback after the touchInstance object has been created
    // touchInstance.afterTouchInstanceInit(function(){ alert('touch init!') });
    this.afterTouchInstanceInit = function(callFirst){ if(callFirst) callFirst(); }

    // Constructor Function
    this.createTouchInstance = function(){
        // Call before init function if exists
        if(typeof this.beforeTouchInstanceInit == 'function') this.beforeTouchInstanceInit();
        
        // If touch isn't enabled allow for a custom function to be called
        if(!this.touchEnabled && typeof this.touchNotEnabledFunction == 'function'){
            this.touchNotEnabledFunction();
        } 
        
        this.checkConditionals();
        this.setEventListeners();
        
        // Call after init function after object is created
        if(typeof this.afterTouchInstanceInit == 'function') this.afterTouchInstanceInit();
    }

    // Rather than creating the object internally with this.createTouchInstance();
    // Let the user declare the instance var touchInstance = new TouchInstance('#el');
    // So that they can make use of touchInstance.beforeTouchInstanceInit(function(){});
    // In order to that they can override variables, create pre-init functions, etc.
    
    // Other custom event callback functions are declared as follows:
    // touchInstance.handleTouchFunction = function(){}
    // touchInstance.onOverflowBottom = function(){} ... etc.

}
    
