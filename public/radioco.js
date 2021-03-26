(function(){
    'use strict';
    var player = {"id":"46e8c92","name":"Default Player","type":"classic","size":"small","stream":{"station ":"s71e070cf3","output":null,"streaming_url":"https:\/\/s2.radio.co\/s71e070cf3"},"theme":{"width":400,"background_colour":"#ffffff","text_colour":"#000000","accent_colour":"#ff00ff","rounded_corners":false,"track_information":true},"settings":{"autoplay":false,"artwork":false,"spotify":false,"popout":false},"embed_url":"https:\/\/embed.radio.co\/player\/46e8c92.html","social":{"twitter":false,"facebook_share":false,"embed":false,"template":""}};
    var i = document.createElement('iframe');

    var style = "border: none;overflow:hidden;";
    var width = player.theme.width;

    i.src = player.embed_url;
    i.width = '100%';
    i.allow = 'autoplay';

    if (player.size !== 'small') {
        style += 'max-width:' + width + 'px;margin:0 auto;';
    }

    i.setAttribute('scrolling', 'no');
    i.setAttribute('style', style);

    var s = document.getElementsByTagName('script');
    s = s[s.length-1];

    if(s.parentNode.nodeName === 'HEAD'){
        window.onload = function() { document.body.appendChild(i); };
    }else{
        s.parentNode.insertBefore(i, s);
    }

    window.addEventListener('message', function(e) {
        var eventName = e.data[0];
        var data = e.data[1];
        if(eventName === player.id+'.setHeight') {
            i.style.height = data+'px';
        }
    }, false);

    i.addEventListener('load', function(){
        var targetUrl = player.embed_url.split('/').splice(0,3).join('/'); // strips everything after hostname
        setTimeout(function() {
            i.contentWindow.postMessage(JSON.stringify(['parent', location]), targetUrl);
        }, 1000); // Prevent the iframe not being ready for messages.
    });
}());
