<script>

	/*
	* https://github.com/goldfire/howler.js#options
	*/

	import { Howl, Howler } from 'howler';

	export let id;

	const timestamp = new Date().getTime();
	const stream = `${id}_a`;
	const src = `https://${id}.out.airtime.pro/${stream}?i${timestamp}`;

	console.log( src );
	let status = 'loading';

	function setStatus( set ){
		switch (set) {
			case 'loading':
			case 'ready':
			case 'playing':
			case 'ended':
			case 'error':
				status = set;
				break;
			default:
				console.warn(`Unknown status "${set}"`);
				break;
		}
	}

	const radio = new Howl({
		src: src,
		html5: true,
		format: ['mp3'],
		volume: 1,
		onload: () => {
			setStatus('ready');
			console.log('on load');
		},
		onloaderror: () => {
			setStatus('error');
			console.log('on loaderror');
		},
		onplayerror: () => {
			setStatus('error');
			console.log('on playerror');
		},
		onplay: () => {
			setStatus('playing');
			console.log('on play');
		},
		onend: () => {
			setStatus('ended');
			console.log('on end');
		},
		onpause: () => {
			setStatus('ready');
			console.log('on pause');
		},
		onstop: () => {
			setStatus('ready');
			console.log('on stop');
		},
	});

	function handlePlay(){
		if( radio.playing() ){
			setStatus('playing');
		} else {
			setStatus('loading');
			radio.play();
		}
		radio.volume(1);
	}

	function handlePause(){
		radio.volume(0);
		setStatus('ready');
	}

</script>

<section>

	{#if status === 'loading'}
		<p>Loading...</p>
	{:else if status === 'ready'}
		<button on:click={handlePlay}>Play</button>
	{:else if status === 'playing'}
		<button on:click={handlePause}>Pause</button>
	{:else if status === 'ended'}
		<p>Thank you for listening</p>
	{:else if status === 'error'}
		<p>Error</p>
	{/if}

</section>

<style>

</style>
