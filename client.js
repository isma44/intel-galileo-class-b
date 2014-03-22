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
                                                                                            
    socket.on('move', function(data) {                                                        
        // console.log( data );                                                               
        // $circle.css({                                                                      
        //    top: data.y,                                                                    
        //    left: data.x                                                                    
        // });                                                                                
                                                                                              
        if ( data.xDiff != 0 || data.yDiff != 0 ) {                                           
            // $("#distance").text( 'dX : ' + data.xDiff + ' , dY : ' + data.yDiff );         
            console.log( 'dX : ' + data.xDiff + ' , dY : ' + data.yDiff );                    
        }                                                                                     
    });                                                                                       
                                                                                              
                                                                                              
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


                                                                                             
prepareConnectedAndDisconnectedEvent();                                                   
                                                                                              

