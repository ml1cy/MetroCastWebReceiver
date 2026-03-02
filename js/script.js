if (typeof cast === 'undefined') {
    console.error("Google Cast SDK failed to load. Ensure you are on HTTPS and scripts aren't blocked.");
    document.getElementById('ui-title').innerText = "Cast SDK Error";
    document.getElementById('ui-artist').innerText = "Failed to load framework.";
} else {
    console.log("Metrolist Receiver: Initializing Cast Context...");
    const context = cast.framework.CastReceiverContext.getInstance();
    const playerManager = context.getPlayerManager();

    // Track and State changes
    playerManager.addEventListener(
        cast.framework.events.EventType.MEDIA_STATUS, (event) => {
            console.log("Metrolist Receiver: Received MEDIA_STATUS event");
            
            // Update metadata
            const mediaInfo = playerManager.getMediaInformation();
            if (mediaInfo && mediaInfo.metadata) {
                document.getElementById('ui-title').innerText = mediaInfo.metadata.title || 'Unknown Title';
                document.getElementById('ui-artist').innerText = mediaInfo.metadata.artist || 'Unknown Artist';
                
                if (mediaInfo.metadata.images && mediaInfo.metadata.images.length > 0) {
                    document.getElementById('ui-album-art').src = mediaInfo.metadata.images[0].url;
                }
            }

            // Update play/pause icon
            const state = playerManager.getPlayerState();
            const playIcon = document.getElementById('ui-icon-play');
            const pauseIcon = document.getElementById('ui-icon-pause');
            
            if (state === cast.framework.messages.PlayerState.PLAYING || 
                state === cast.framework.messages.PlayerState.BUFFERING) {
                playIcon.style.display = 'none';
                pauseIcon.style.display = 'block';
            } else {
                playIcon.style.display = 'block';
                pauseIcon.style.display = 'none';
            }
        }
    );

    // Playback progress
    playerManager.addEventListener(
        cast.framework.events.EventType.TIME_UPDATE, (event) => {
            const currentTime = event.currentMediaTime;
            const duration = playerManager.getDurationSec();
            
            if (duration > 0) {
                const progressPercent = (currentTime / duration) * 100;
                document.getElementById('ui-progress').style.width = progressPercent + '%';
                
                document.getElementById('ui-time-current').innerText = formatTime(currentTime);
                document.getElementById('ui-time-total').innerText = formatTime(duration);
            }
        }
    );

    // Controls
    document.getElementById('ui-btn-play-pause').addEventListener('click', () => {
        const state = playerManager.getPlayerState();
        console.log("Metrolist Receiver: Play/Pause clicked. Current state:", state);
        if (state === cast.framework.messages.PlayerState.PLAYING || 
            state === cast.framework.messages.PlayerState.BUFFERING) {
            playerManager.pause();
        } else {
            playerManager.play();
        }
    });

    document.getElementById('ui-btn-prev').addEventListener('click', () => {
        console.log("Metrolist Receiver: Previous clicked");
        const request = new cast.framework.messages.QueueUpdateRequestData();
        request.jump = -1;
        playerManager.sendLocalMediaRequest(request);
    });

    document.getElementById('ui-btn-next').addEventListener('click', () => {
        console.log("Metrolist Receiver: Next clicked");
        const request = new cast.framework.messages.QueueUpdateRequestData();
        request.jump = 1;
        playerManager.sendLocalMediaRequest(request);
    });

    function formatTime(seconds) {
        if (!seconds || isNaN(seconds)) return "0:00";
        const min = Math.floor(seconds / 60);
        const sec = Math.floor(seconds % 60);
        return min + ":" + (sec < 10 ? "0" + sec : sec);
    }

    // Receiver context setup
    const options = new cast.framework.CastReceiverOptions();
    
    // Disable idle timeout
    options.disableIdleTimeout = true;
    
    // Disable Smart Display touch UI
    const uiConfig = new cast.framework.ui.UiConfig();
    uiConfig.touchScreenOptimizedApp = false;
    options.uiConfig = uiConfig;
    
    // Enable debug logging
    options.customNamespaces = Object.assign({});
    cast.framework.CastReceiverContext.getInstance().setLoggerLevel(cast.framework.LoggerLevel.DEBUG);
    
    console.log("Metrolist Receiver: Starting context...");
    context.start(options);

    // Clear default Smart Display slots
    try {
        const controls = cast.framework.ui.Controls.getInstance();
        controls.clearDefaultSlotAssignments();
        console.log("Metrolist Receiver: Cleared default Smart Display controls.");
    } catch (e) {
        console.log("Metrolist Receiver: UI Controls not applicable.");
    }
}
