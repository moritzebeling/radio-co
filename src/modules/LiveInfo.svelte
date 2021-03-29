<script>

  import {load} from '../utilities/load.js';
  import {parseTime} from '../utilities/time.js';

  export let host;
  export let info;

  const src = `${host}/api/live-info-v2`;

  let data;
  let liveInfo;
	let loading = true;

  async function triggerFetch(){
      console.log('Fetching LiveInfo');
      data = await load(`${src}`);
      console.log('LiveInfo fetched');
  }

  async function fetchLiveInfo(){
    await triggerFetch();
    liveInfo = new LiveInfo(data);
    loading = false;
  }

  fetchLiveInfo();

  let updateLiveInfo = setInterval(()=>{
      fetchLiveInfo();
  }, 20 * 1000);



  class LiveInfo{
    constructor(liveInfoData) {
      this.data = liveInfoData;

      this.station = this.data.station;
      this.tracks = this.data.tracks;
      this.shows = this.data.shows;

      this.currentTrack =  this.tracks.current ? {
        data : this.tracks.current,
        name : this.tracks.current.name,
        artist : this.tracks.current.metadata.artist_name,
        title : this.tracks.current.metadata.track_title,
        start : this.tracks.current.starts,
        end : this.tracks.current.ends,
      } : null;

      this.nextTrack = this.tracks.next ? {
        data : this.tracks.next,
        name : this.tracks.next.name,
        artist : this.tracks.next.metadata.artist_name,
        title : this.tracks.next.metadata.track_title,
        start : this.tracks.next.starts,
        end : this.tracks.next.ends
      } : null;

      this.previousTrack = this.tracks.previous ? {
        data : this.tracks.previous,
        name : this.tracks.previous.name,
        artist : this.tracks.previous.metadata.artist_name,
        title : this.tracks.previous.metadata.track_title,
        start : this.tracks.previous.starts,
        end : this.tracks.previous.ends
      } : null;

      this.silent = this.currentTrack === null ? true : false;
    }

    getTimeLeftCurrentTrack(){
      if(this.currentTrack){
        let now = new Date();
        let end = new Date(this.currentTrack.end);
        let timeDiff = end - now;
        return timeDiff;
      }
      else{
        return undefined;
      }
    }

    getTimeUntilNextTrack(){
      if(this.nextTrack)
      {
        let now = new Date();
        let start = new Date(this.nextTrack.start);
        let timeDiff = start - now;
        return timeDiff;
      }
      else{
        return undefined;
      }
    }

  }


  var secondsLeftCurrentTrack;
  var secondsUntilNextTrack;
  let updateSecondsSinceLiveInfoUpdate = setInterval(()=>{
    secondsLeftCurrentTrack = liveInfo.getTimeLeftCurrentTrack()/1000;
    secondsUntilNextTrack = liveInfo.getTimeUntilNextTrack()/1000;

    if(secondsLeftCurrentTrack <= 0 || secondsUntilNextTrack <= 0){
      fetchLiveInfo();
    }


  }, 1000);


</script>

{#if !loading}
  {#if info === "station_status"}
    {#if !liveInfo.silent}
      <div>Station broadcasting</div>
    {:else if liveInfo.silent}
      <div>Station idle</div>
    {/if}
  {:else if info === "current_track" && !liveInfo.silence}
      <div>Track: {liveInfo.currentTrack.artist} - {liveInfo.currentTrack.title}</div>
      <div>Time left: {parseTime(secondsLeftCurrentTrack)} </div>
  {:else if info === "next_track" && liveInfo.nextTrack}
      <div>{liveInfo.nextTrack.artist} - {liveInfo.nextTrack.title}</div>
      <div>Time until: {parseTime(secondsUntilNextTrack)} </div>
  {/if}
{/if}
