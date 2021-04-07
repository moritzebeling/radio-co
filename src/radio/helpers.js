export function radioStatus( radioData = false ){
    try {
        return radioData.status === 'online' ? 'online' : 'offline';
    } catch (error) {
        return 'offline';
    }
}

export function radioStream( radioData = false, id ){
    try {
        return `https://${radioData.streaming_hostname}/${id}/listen`;
    } catch (error) {
        return false;
    }
}

export function radioTrack( radioData = false ){
    try {
        return radioData.current_track.title;
    } catch (error) {
        return 'Unknown';
    }
}
