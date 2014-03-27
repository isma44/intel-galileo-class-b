
var nDistMoved = 0;

var io = require('socket.io-client');

var portMain = 8080;
var nsMain = 'pg';

var $circle,
    playerId, browserName,
    nBallRadius = 40,
    nFixX = 8, nFixY = 12,
    xMax = 300 - nBallRadius*2,
    yMax = 300 - nBallRadius*2,
    // nCntServerErr = 0,
    // nMaxCntErrForWarning = 2,
    socket;
    


// _____________ GPIO setup ______________


var button_gpio = 14; // maps to digital PIN2 on the board. 14 for SoC, 32 for Cypr.
var led_gpio    = 24; // maps to digital PIN6

// var led_gpio    = 26; // maps to digital PIN8
// var button_gpio = 17; // maps to digital PIN5 on the board
// var led_gpio    = 27; // maps to digital PIN7
 


// _____________ connected/disconnected event of all client ______________


function drawConnectEvents( client )
{
    if ( !client ) { return; }
    console.log( 'CONNECTED : ' + getCurrentTime() + 
		 ' Device '+client.playerId + ' (' + client.browserName + ')'
               ); 
    // $('#event-list').prepend( event );
}


function drawDisconnectEvents( client )
{
    if ( !client ) { return; }
    console.log( 'DISCONNECTED : ' + getCurrentTime() + 
		 ' Device '+client.playerId + ' (' + client.browserName + ')' 
               );
    // $('#event-list').prepend( event );
}


function drawNetworkOrServerProblem()
{
    console.log( 'PROBLEM : ' + getCurrentTime() + 
		 ' Sleeping of Device, or Network / Server Problem!'
               );
    // $('#event-list').prepend( event );
}





function prepareConnectedAndDisconnectedEvent()
{
    socket = io.connect('http://hp2hp.net:'+portMain+'/'+nsMain);
    // socket = io.connect('http://'+location.hostname+':'+portMain+'/'+nsMain);

    socket.on('response', function( data )
    {
        console.log('playerId response : ' + data.playerId);
        playerId = data.playerId;
        browserName = getBrowserName();
        
        var setupForEmit = {     
            playerId: playerId,
            browserName: browserName
        }
        console.log('player browser = ' + setupForEmit.browserName);
        
        socket.emit('setup', setupForEmit);
    });


    socket.on( 'Player.newconnect', function( client ) {
        if ( !client ) { return; }
        console.log( 'player newconnected : ' + client.playerId + ', ' + client.browserName );
        drawConnectEvents( client );
        // $circle.show();
    });
    

    socket.on( 'Player.disconnect', function( client ) {
        if ( !client ) { return; }
        console.log( 'player disconnected : ' + client.playerId + ', ' + client.browserName );
        drawDisconnectEvents( client );
    });


    
    // catching server event : network or server problem.
    socket.on( 'disconnect', function() {
        console.log( 'server down or net disconnected?' );
        drawNetworkOrServerProblem();
        // $circle.hide();
    });    
        
    
    
    socket.on('move', function(data) {
        // console.log( data );
        // $circle.css({
        //    top: data.y,
        //    left: data.x
        // });
        
        if ( data.xDiff != 0 || data.yDiff != 0 ) { 
            // $("#distance").text( 'dX : ' + data.xDiff + ' , dY : ' + data.yDiff );
            console.log( 'dX : ' + data.xDiff + ' , dY : ' + data.yDiff );
	    nDistMoved = Math.abs( data.xDiff + data.yDiff );	
        }
    });


}

// _____________ coordinate related ______________


/*****
var _touchSupport = ("ontouchstart" in window);
console.log( 'touch support : '+ _touchSupport );
var events = {
    move : _touchSupport ? 'touchmove' : 'mousemove',
    start: _touchSupport ? 'touchstart': 'mousedown',
    end  : _touchSupport ? 'touchend'  : 'mouseup'
};
******/




    // var newColor = '#'+(0x1000000+(Math.random())*0xffffff).toString(16).substr(1,6);
    // $('.circle').css("background-color", newColor);
    // $circle = $('.circle').show();
    
    // $("#distance").text('X, Yの差分 (複数の移動差分中、最終のみ)');
    // console.log('X, Yの差分 (複数の移動差分中、最終のみ)');


    
    prepareConnectedAndDisconnectedEvent();



    
    /********
    $(window)
        .on(events.start, function(e){
            e.preventDefault();

            var xy = _getXY(e);

            if ( $circle.css('display') === 'none' ) {
                $circle.show();
            }
            $circle.css({top: xy.y, left: xy.x});
            
            $(this).on(events.move, _onMove);
        })
        .on(events.end, function(e){
            e.preventDefault();

            var xy = _getXY(e);

            $circle.css({top: xy.y, left: xy.x});
    
            $(this).off(events.move, _onMove);
        });
        

    var _onMove = function(e){
        e.preventDefault();

        var xy = _getXY(e);
        
        socket.emit('move', {x: xy.x, y: xy.y });
    };
    *********/
    
    var _getXY = function(/* MouseEvent */ e) {
        var touches = e.originalEvent && e.originalEvent.touches ? e.originalEvent.touches : [],
            x = nBallRadius, y = nBallRadius;

        if ( _touchSupport && 0 < touches.length ) {
            x = touches[0].pageX;
            y = touches[0].pageY;
        }
        else {
            x = e.pageX;
            y = e.pageY;
        }

        if ( x < 0 ) { x = nFixX; } 
        if ( y < 0 ) { y = nFixY; } 
        if ( x > xMax ) { x = xMax + nFixX; } 
        if ( y > yMax ) { y = yMax + nFixY; } 

        return { x: x, y: y };
    }




function getCurrentTime()
{
    var currentdate = new Date(); 
    var datetime = (currentdate.getMonth()+1) + "/" + currentdate.getDate() + " "
            + currentdate.getHours() + ":"  
            + currentdate.getMinutes(); 
            // + currentdate.getSeconds();
    
    return datetime;
}


function getBrowserName() 
{
    return 'Galileo';
}



// ---------------------------------------

var fs = require('fs');
 
var fileOptions = {encoding: 'ascii'};
 
var exportGpio = function(gpio_nr) {
  fs.writeFile('/sys/class/gpio/export', gpio_nr, fileOptions, function (err) {
    if (err) { console.log("Couldn't export %d, probably already exported.", gpio_nr); }
  });
};
 
var setGpioDirection = function(gpio_nr, direction) {
  fs.writeFile("/sys/class/gpio/gpio" + gpio_nr + "/direction", direction, fileOptions, function (err) {
    if (err) { console.log("Could'd set gpio" + gpio_nr + " direction to " + direction + " - probably gpio not available via sysfs"); }
  });
}
 
var setGpioIn = function(gpio_nr) {
  setGpioDirection(gpio_nr, 'in');
}
 
var setGpioOut = function(gpio_nr) {
  setGpioDirection(gpio_nr, 'out');
}
 
// pass callback to process data asynchroniously
var readGpio = function(gpio_nr, callback) {
  var value;
  
  fs.readFile("/sys/class/gpio/gpio" + gpio_nr + "/value", fileOptions, function(err, data) {
    if (err) { console.log("Error reading gpio" + gpio_nr); }
    value = data;
    callback(data);
  });
  return value;
};
 
var writeGpio = function(gpio_nr, value) {
  fs.writeFile("/sys/class/gpio/gpio" + gpio_nr + "/value", value, fileOptions, function(err, data) {
    if (err) { console.log("Writing " + gpio_nr + " " + value); }
  });
};
 
exportGpio(led_gpio);
// exportGpio(button_gpio);
 
setGpioOut(led_gpio);
// setGpioIn(button_gpio);
 
// repeat reading/writing in a loop
var nOnOff = 1;
var nDelay = 10;

setInterval(function() {

  if ( nDistMoved > 2 ) { nOnOff = 1; }
  else { nOnOff = 0; }
  writeGpio(led_gpio, nOnOff);

  // NG? // nDelay = 2000 / (nDistMoved+1);
  // console.log( 'nDelay = ' + nDelay );

  // readGpio(button_gpio, function(data) {
    // writeGpio(led_gpio, data);
  // });
}, nDelay);

