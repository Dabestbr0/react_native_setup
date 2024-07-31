// src/RunTracker.js
import React, { useState } from 'react';
import { View, Button } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import { storeRunData } from '../services/storage';

const RunTracker = () => {
    const [watchId, setWatchId] = useState(null);

    const handleStartRun = () => {
        const id = Geolocation.watchPosition(
            (position) => {
                console.log(position);
                // Update position as the run progresses
            },
            (error) => {
                console.log(error.code, error.message);
            },
            { enableHighAccuracy: true, distanceFilter: 0, interval: 1000, fastestInterval: 500 }
        );

        setWatchId(id);
    };

    const handleStopRun = () => {
        if (watchId !== null) {
            Geolocation.clearWatch(watchId);
            Geolocation.stopObserving();
            setWatchId(null);

            // Save run data logic
            const finishTime = new Date().toISOString();
            const runData = { finishTime };
            storeRunData(runData);
        }
    };

    return (
        <View>
            <Button title="Start Run" onPress={handleStartRun} />
            <Button title="Stop Run" onPress={handleStopRun} />
        </View>
    );
};

export default RunTracker;