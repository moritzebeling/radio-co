# Research on implementing a live radio station into a website

## Premise
The aim ist to have a live radio player on a website, together with an archive of all previous played artists and tracks.

The best case would be a solution, that can stream the current track and also functions as a CMS for the archive (tldr: we didn’t find that).
The minimum we would need only a play/pause button and a display of the current track, so audio streaming + some API (tldr: possible, quite easy actually). The archive content could then be managed through a seperate CMS.

## Ways of doing live audio streaming

"Live" audio can be "solved" in 2 different ways:
- real time live
- pseudo live (set up a timetable of existing audio files or media embeds, control playback time on client side depending on actual time)

But if you don’t want to do all the shedule planning yourself, a "real" radio software might work better.

## Examples

A list of somehow good looking radio stations with players that meet our requirements:

[Airtime pro](https://www.airtime.pro):
- [Worldwide FM](https://worldwidefm.net/)
- [Dublab](https://www.dublab.com/)
- [Radio80k](https://www.radio80k.de/)
- [Netil Radio](http://www.netilradio.com/)
- [KchungRadio](https://www.kchungradio.org/)
- [n10](http://www.n10.as/)
- [boxoutfm](https://boxout.fm/)

[Radio.co](https://radio.co):
- [Foundation.fm](https://foundation.fm/)

[Icecast](https://icecast.org):
- [LYL Radio](https://lyl.live/)

[Shoutcast](https://www.shoutcast.com):
- [Hotel Radio Paris](https://hotelradioparis.com/)

[Castos](https://castos.com):
- [Beats in space](https://beatsinspace.net/)

Mp3:
- [WNYU](https://wnyu.org/)

Unknown, but no list of radio stations would be complete without:
- [NTS](https://www.nts.live/)

On top of that we also found:
- [Azuracast](https://www.azuracast.com)

## Problems with those services

- expensive (~$50-80/month)
- some seem to be old
- non-intuitive interface and hard to administrate
- no good looking embed player
- no dev docs on how to build a custom player or do API requests

## Solution

After searching the whole wide web (github, stackoverflow) for example projects or help on how to create a custom player for any of those services above (look at the other branches of this repo), we somehow opted for radio.co. The mix of reverse engeneering their poorly built embed player and asking the customer service for API access, we somehow worked it out and came to a really simple solution:

- we use [Howler.js](https://howlerjs.com) to create a HTML-5 audio player element that has the radio.co audio streaming endpoint as source
- the live player only has a play/pause button
- every 10 or so seconds we call the api for the current track to display
- for the archive we have our own CMS (Kirby) where artists and tracks are organized
- all archived tracks are hosted on Mixcloud and are embedded on the website with a [second cusom player](https://gist.github.com/moritzebeling/bfa5b01c98aa8eff9e5753eded011df0)
- both those players pause each other when one is being played

[Bare player example](https://radio-co-player.netlify.app)

[Source code](https://github.com/moritzebeling/radio-co/tree/main/src/radio)

Further reading:
[Brief history of internet radio](https://radio.co/blog/a-brief-history-of-internet-radio) by radio.co
