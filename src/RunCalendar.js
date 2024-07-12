// src/RunCalendar.js
import React, { useEffect, useState } from 'react';
import { Calendar } from 'react-native-calendars';
import { getRunData } from '../services/storage';

const RunCalendar = () => {
    const [runs, setRuns] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            const data = await getRunData();
            if (data) {
                const formattedRuns = data.reduce((acc, run) => {
                    const date = run.finishTime.split('T')[0];
                    if (!acc[date]) {
                        acc[date] = { marked: true, dotColor: 'blue', activeOpacity: 0 };
                    }
                    return acc;
                }, {});
                setRuns(formattedRuns);
            }
        };

        fetchData();
    }, []);

    return (
        <Calendar
            markedDates={runs}
            onDayPress={(day) => {
                console.log('selected day', day);
            }}
        />
    );
};

export default RunCalendar;
