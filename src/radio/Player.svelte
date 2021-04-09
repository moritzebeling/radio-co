<script context="module">

	let radio;

	export function pause(){
		try {
			radio.stop();
			radio.unload();
		} catch( error ){
			console.error( error );
		}
	}

</script>

<script>

	/*
	* https://github.com/goldfire/howler.js#options
	*/

	import { onMount, onDestroy } from 'svelte';
	import { Howl, Howler } from 'howler';

	Howler.autoUnlock = false;

	export let src;

	let status = 'ready';

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
				status = 'error';
				break;
		}
	}

	const config = {
		html5: true, // required for live streams
		format: ['mp3', 'aac'],
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
		onvolume: () => {
			console.log('on volume');
		},
	};

	function handlePlay(){
		config.src = `${src}?i${new Date().getTime()}`;
		try {
			radio = new Howl(config);
			setStatus('loading');
			radio.play();
		} catch(error){
			setStatus('error');
			console.error( error );
		}
	}

	function handlePause(){
		try {
			radio.stop();
			radio.unload();
		} catch( error ){
			console.error( error );
		}
	}

	onDestroy(()=>{
		try {
			radio.stop();
			radio.unload();
		} catch( error ){
			console.error( error );
		}
		setStatus('ended');
	});

</script>

<div>

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

</div>

<style>

</style>
