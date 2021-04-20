# Radio.co Radio Player

Having a radio.co radio station, you might want to implement a radio player on your website, but: the player provided by radio.co is old and not really beautiful. However, radio.co offers a streaming endpoint and a (very minimalistic) API.

Our requirements that this repo meets:
- Stream audio from radio.co streaming endpoint
- build play/pause player that can be paused from outside
- Connect to station api endpoint
- show the currently playing track

[Source code](https://github.com/moritzebeling/radio-co/tree/main/src/radio)

[Example demo](https://radio-co-player.netlify.app)
[Final implementation](https://eosradio.de)

If you’re interested, have a look at our [research](RESEARCH.md) that leads us here.

## Development

Procedure:
1. Get your radio.co `stationId`
2. Call the API
3. The response contains a currently available streaming host
4. Create a [Howler.js](https://github.com/goldfire/howler.js) player

Ho to access radio.co
- **API** `https://public.radio.co/stations/${stationId}/status`
- **Stream** `https://${streamHost}/${stationId}/listen`

Example API result:
```json
{
  "status": "online",
  "source": {
    "type": "automated",
    "collaborator": null,
    "relay": null
  },
  "collaborators": [],
  "relays": [],
  "current_track": {
    "title": "Track 1",
    "start_time": "2021-04-07T09:51:25+00:00",
    "artwork_url": "https://images.radio.co/station_logos/s21c5fbf27.20210403125950.png",
    "artwork_url_large": "https://images.radio.co/station_logos/s21c5fbf27.20210403125950.png"
  },
  "history": [
    {
      "title": "Track 2"
    },
    {
      "title": "Track 1"
    }
  ],
  "logo_url": "https://images.radio.co/station_logos/s21c5fbf27.20210403125950.png",
  "streaming_hostname": "s5.radio.co",
  "outputs": [
    {
      "name": "listen",
      "format": "MP3",
      "bitrate": 128
    }
  ]
}
```

This project is implemented in JS framework Svelte and uses rollup and howler.js. Get going with:
```
npm install
npm run dev
```

## Disclaimer

⚠️ This is just a dummy to experiment. Feel free to enhance. Do not take it as is in production.
