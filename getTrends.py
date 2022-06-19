#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Fri May 20 15:54:40 2022

@author: andromede
"""

import tweepy

import os
import json
import sys
import geocoder

import numpy as np

# API Keys and Tokens
consumer_key = "your_consumer_key"
consumer_secret = "your_consumer_secret"
access_token = "your_access_token"
access_token_secret = "your_access_token_secret"

# Authorization and Authentication
auth = tweepy.OAuthHandler(consumer_key, consumer_secret)
auth.set_access_token(access_token, access_token_secret)
api = tweepy.API(auth)


if __name__ == "__main__":
    
    # Manual input of desired countries 
    # You can get available countries by checking api.available_trends()
    countries = ["France", "United States", "Germany", "Italy","Japan","Brazil","Egypt"]
    
    allTrends = {}
    
    for loc in countries :
        g = geocoder.osm(loc) # getting object that has location's latitude and longitude
        loc = loc.replace(" ","")
        closest_loc = api.closest_trends(g.lat, g.lng)

        # get the trends
        trends = api.get_place_trends(closest_loc[0]['woeid'])

        # We only want trend name and tweet volume if exists
        trends = trends[0]['trends']
        select = ["name", "tweet_volume"] 
        trends = [{s : trend[s] for s in select} for trend in trends if trend["tweet_volume"]!=None]
        
        # Normalize tweet volumes
        maxVolume = max([trend["tweet_volume"] for trend in trends ])
        
        for t in trends : 
            t['name'] = t['name'].replace('#',"").replace("_","-").replace(" ", "-")
            t['tweet_volume'] = np.round(t['tweet_volume']/maxVolume, 4)
        
        trends = sorted(trends, key=lambda d: d['tweet_volume'], reverse=True)
        trends = {str(i) : t for (i,t) in enumerate(trends)}
        
        allTrends[loc] = trends

    # We dump the trends in a json file to be read by the max patcher
    with open("json/twitter_all_trends.json","w") as wp:
        wp.write(json.dumps(allTrends, indent=1))
        