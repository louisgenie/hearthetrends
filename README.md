# Deprecated
This repository is no longer maintained. [Twitter API is no longer available freely.]


# hearthetrends
Sound art from Twitter trends

MaxMsp based sound composition patch that fetches the top 5 twitter trends in a given country. Trends are converted to audio files with TTS and audio effects are applied relative to tweet volume. 

***

## Files

`nodeAPIcalls.js` : js script making VOICERSS API calls and write soundfiles.<br />
`getTrends.py` : python script for twitter API call to get trends and format them into JSON files.<br />

`mainControl.maxpat` : The main Max patch to run.<br />
`muteRoute.maxpat` : subpatch that adds mute and auto pan functionality.<br />
`process.maxpat` : subpatch hosting the node.js script<br />
`trendPlayer.maxpat` : subpatch for the player.<br />


***

## Usage

1. Setup a twitter App and run getTrends.py with your API credentials 
2. Setup a VOICERSS API account and copy your key
3. in `process.maxpat` copy your key in the set_VOICERSS_API_KEY message box
4. Open `mainControl.maxpat` and choose the country you want to listen to.
