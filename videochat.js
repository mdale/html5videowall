(function( global, $){
    var connected = false,
        local,
        remote,
        localStream,
        remoteStream,
        pc,
        peers = 0,
        ready = false;

    getUserMedia(function() {
        ready = true;
    });

    function stop() {
        if (localStream) {
            localStream.stop()
            localStream = null;
            app.$ui.videos.set('local', '');
        }
        hangup();
    }

    function getUserMedia(callback) {
        local = $('#local')[0];
        remote = $('#remote')[0];
        if (localStream) {
            callback && callback();
            return;
        }
        var get = 'getUserMedia';
        if (!navigator.getUserMedia && navigator.webkitGetUserMedia) {
            get = 'webkitGetUserMedia';
        };
        navigator[get]({audio:true, video:true},
            function(stream) {
                console.log("User has granted access to local media.");
                localStream = stream;
                var url = webkitURL.createObjectURL(stream);
                local.src = url;
                local.play();
                callback && callback();
            },
            function(error) {
                console.log("Failed to get access to local media. Error code was " + error.code);
                //alert("Failed to get access to local media. Error code was " + error.code + ".");
            }
        );
        console.log("Requested access to local media with new syntax.");
    }

    var remoteId;
    function send(message) {
        connection.sendMessage({
            to: remoteId,
            rtc: message    
        })
    }
    window.call = function(userId) {
        $('#local').show();
        if ( remoteId ) {
            return;
        }
        remoteId = userId;
        var offer;
        if (!pc) {
            createPeerConnection(userId);
        }
        if (localStream) {
            pc.addStream(localStream, null);
        }
        offer = pc.createOffer({ has_video: true, has_audio: true });
        pc.setLocalDescription(webkitPeerConnection00.SDP_OFFER, offer);
        send({ type: "offer", data: offer.toSdp() });
        pc.startIce();
    }
    window.hangup = function() {
        if (remoteStream) {
            remoteStream = null;
        }
        if (pc) {
            pc.close();
            pc = null;
        }
        send({ type: "hangup" });
        remoteId = null;
        $('#remote').hide();
        $('#local').hide();
    }
    function createPeerConnection () {
        pc = new webkitPeerConnection00(
            "STUN stun.l.google.com:19302",
            function(candidate, moreToFollow) {
                if (moreToFollow) {
                    var msg = JSON.stringify({ label: candidate.label, sdp: candidate.toSdp() });
                    send({ type: "icecandidate", data: msg });
                } else {
                    candidate && console.log(candidate, candidate.toSdp());
                    //console.log("Received end of candidates (more_to_follow == false)");
                }
            }
        );
        pc.onaddstream = function(event) {
            console.log("Remote stream added.", event);
            remoteStream = event.stream;
            var url = webkitURL.createObjectURL(event.stream);
            remote.src = url;
            remote.play();
            $('#remote').show();
        };
        pc.onremovestream = function(event) {
            console.log("Remote stream removed.");
            remote.src = '';
        }
    }

    connection.onMessage(function(msg) {
        var offer,
            answer,
            candidate, c,
            message;
        if (msg.data.rtc && msg.data.to == localStorage.id) {
            message = msg.data.rtc;
            if (message.type == 'hangup') {
                hangup();
            } else if (message.type == 'offer' && !remoteId) {
                remoteId = msg.user;
                console.log('offer', message);
                if (!pc) {
                    createPeerConnection();
                }
                // create the PeerConnection
                if (localStream)
                    pc.addStream(localStream, null);
                // feed the received offer into the PeerConnection and
                // start candidate generation
                offer = new SessionDescription(message.data);
                pc.setRemoteDescription(webkitPeerConnection00.SDP_OFFER, offer);
                answer = pc.createAnswer(message.data, { has_video: true, has_audio: true });
                pc.setLocalDescription(webkitPeerConnection00.SDP_ANSWER, answer);
                send({ type: "answer", data: answer.toSdp() });
                pc.startIce();
            } else if (message.type == "answer") {
                console.log('answer', message);
                answer = new SessionDescription(message.data);
                pc.setRemoteDescription(webkitPeerConnection00.SDP_ANSWER, answer);
            } else if (message.type == "icecandidate") {
                candidate = JSON.parse(message.data);
                //console.log("ice", candiate);
                candidate = new IceCandidate(candidate.label, candidate.sdp);
                pc.processIceMessage(candidate);
            }
        }
    });
})( window, window.jQuery )
