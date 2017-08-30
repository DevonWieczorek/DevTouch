/***********************************************/
// DevTouch.js
// v0.1.1
// Authored By: Devon Wieczorek
// Last Updated: 8/17/17
/***********************************************/

'use strict';

function TouchInstance(el){
        
    this.el = $(el);
    this.elWidth = this.el.width();
    this.elHeight = this.el.height();
    this.parent = this.el.parent();
    this.boundX = this.parent.width();
    this.boundY = this.parent.height();
    this.origX = this.el.offset().left;
    this.origY = this.el.offset().top;
    this.deviceWidth = $(window).width();
    this.deviceHeight = $(window).height();

    this.slideXEnabled = true;
    this.slideYEnabled = true;

    this.preventPageScroll = false;
    this.returnToOrigin = true;
    
    this.handleTouchFunction = function(){}
    this.handleDragFunction = function(){}
    this.handleReleaseFunction = function(){}
    
    this.onBoundTop = function(){}
    this.onBoundBotton = function(){}
    this.onOverflowTop = function(){}
    this.onOverflowBottom = function(){}

    this.onBoundLeft = function(){}
    this.onBoundRight = function(){}
    this.onOverflowLeft = function(){}
    this.onOverflowRight = function(){}
    
    this.checkTouchEnabled = function(){
             // Works on Most Browsers  || Works on IE 10/11 and Surface
        return 'ontouchstart' in window || navigator.maxTouchPoints; 
    }
    this.touchNotEnabled = function(){
        console.log('Touch not supported on this device.');
        return false;
    }
    this.touchEnabled = this.checkTouchEnabled();

    this.trackingElements = `
        <div id="touchTrackingInfo" style="position: fixed; bottom: 0; right: 0; width: 100%; z-index: 99999; background: #fff;">
            Origin Y: <span class="origY"></span><br>
            Origin X: <span class="origX"></span><br>
            Location Y: <span class="touchLocY"></span><br>
            Loaction X: <span class="touchLocX"></span><br>
            Touch Y (Position Offset Top): <span class="elPosY"></span><br>
            Touch X (Position Offset Left): <span class="elPosX"></span><br>
        </div>
    `;
    this.showTrackingElements = false;
        
    // Work some scope magic
    // 'self' saves the context of 'this'
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

    this.handleTouch = function(){
        if(typeof self.handleTouchFunction == 'function') self.handleTouchFunction();
        
        self.el.addClass('touched');

        $('body')
        .on('mouseup touchend', self.handleRelease)
        .on('mousemove touchmove', function(e){ self.handleDrag(e) }); 
    }

    this.handleDrag = function(e){
        var x, y;
        (self.touchEnabled) ? x = e.originalEvent.touches[0].pageX : x = self.el.pageX;
        (self.touchEnabled) ? y = e.originalEvent.touches[0].pageY : y = self.el.pageY;
        var touchLocX = x - (self.elWidth / 2);
        var touchLocY = y - (self.elHeight / 2);
        var elPosX = self.el.offset().left;
        var elPosY = self.el.offset().top;
        
        if(typeof self.handleDragFunction == 'function') self.handleDragFunction();

        if(self.slideXEnabled){
            
            self.el.offset({left: touchLocX});
            
            if(touchLocX >= (self.boundX - self.elWidth)){
                self.el.addClass('touchBoundRight');
                if(typeof self.onBoundRight == 'function') self.onBoundRight();

                //find out why 1.5 works for touchLocX
                if(touchLocX >= (self.boundX - self.elWidth / 1.5)){
                    self.el.addClass('touchOverflowRight');
                    if(typeof self.onOverflowRight == 'function') self.onOverflowRight();
                }
            }
            else if(elPosX <= 0){
                self.el.addClass('touchBoundLeft');
                if(typeof self.onBoundLeft == 'function') self.onBoundLeft();

                if(elPosX <= (0 - self.elWidth / 4)){
                    self.el.addClass('touchOverflowLeft');
                    if(typeof self.onOverflowLeft == 'function') self.onOverflowLeft();
                }
            }
            else{
                self.el.removeClass('touchBoundRight touchBoundLeft touchOverflowRight touchOverflowLeft');
            }
        } 

        if(self.slideYEnabled){
            
            self.el.offset({top: touchLocY});
            
            if(elPosY <= 0){
                self.el.addClass('touchBoundTop');
                if(typeof self.onBoundBottom == 'function') self.onBoundBottom();

                if(elPosY <= (0 - self.elHeight / 4)){
                    self.el.addClass('touchOverflowTop');
                    if(typeof self.onOverflowBottom == 'function') self.onOverflowBottom();
                }
            }
            else if(touchLocY >= (self.boundY - self.elHeight)){
                self.el.addClass('touchBoundBottom');
                if(typeof self.onBoundTop == 'function') self.onBoundTop();

                //find out why 1.5 works for touchLocY
                if(touchLocY >= (self.boundY - self.elHeight / 1.5)){
                    self.el.addClass('touchOverflowBottom');
                    if(typeof self.onOverflowTop == 'function') self.onOverflowTop();
                }
            }
            else{
                self.el.removeClass('touchBoundTop touchBoundBottom touchOverflowTop touchOverflowBottom');
            }
        } 

        if(self.showTrackingElements){
            $('.origY').html(self.origY);
            $('.origX').html(self.origX);
            $('.touchLocY').html(touchLocY);
            $('.touchLocX').html(touchLocX);
            $('.elPosY').html(elPosY);
            $('.elPosX').html(elPosX);
        }
    }

    this.handleRelease = function(e){
        $('body')
        .off('mousemove touchmove', this.handleDrag)
        .off('mouseup touchend', this.handleRelease);

        self.el.removeClass('touched');

        if(typeof self.handleReleaseFunction == 'function') self.handleReleaseFunction();
    }

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
        
        if(!this.touchEnabled){
            this.touchNotEnabled();
        }
        else{
            this.checkConditionals();
            this.setEventListeners();
            console.log('Touch Instance Created');
        }
        
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