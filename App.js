/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useEffect, useState} from 'react';
import YoutubePlayer from 'react-native-youtube-iframe';

import type {Node} from 'react';
import {
  SafeAreaView,
  StatusBar,
  Text,
  useColorScheme,
  View,
  PermissionsAndroid,
} from 'react-native';

import GoogleFit, {Scopes, BucketUnit} from 'react-native-google-fit';
import moment from 'moment';

const App: () => Node = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const [steps, setSteps] = useState(0);
  const [authorized, setAuthorized] = useState(false);

  // or with async/await syntax
  async function fetchData() {
    const opt = {
      startDate: moment().startOf('day').toISOString(), // required ISO8601Timestamp
      endDate: moment().endOf('day').toISOString(), // required ISO8601Timestamp
      bucketUnit: BucketUnit.DAY, // optional - default "DAY". Valid values: "NANOSECOND" | "MICROSECOND" | "MILLISECOND" | "SECOND" | "MINUTE" | "HOUR" | "DAY"
      bucketInterval: 1, // optional - default 1.
    };

    return GoogleFit.getDailyStepCountSamples(opt);
  }

  async function fetchData2() {
    const opt = {
      unit: 'pound', // required; default 'kg'
      startDate: '2017-01-01T00:00:17.971Z', // required
      endDate: new Date().toISOString(), // required
      bucketUnit: BucketUnit.DAY, // optional - default "DAY". Valid values: "NANOSECOND" | "MICROSECOND" | "MILLISECOND" | "SECOND" | "MINUTE" | "HOUR" | "DAY"
      bucketInterval: 1, // optional - default 1.
      ascending: false, // optional; default false
    };

    return GoogleFit.getWeightSamples(opt);
  }

  useEffect(() => {
    // The list of available scopes inside of src/scopes.js file
    const options = {
      scopes: [
        Scopes.FITNESS_ACTIVITY_READ,
        Scopes.FITNESS_ACTIVITY_WRITE,
        Scopes.FITNESS_BODY_READ,
        Scopes.FITNESS_BODY_WRITE,
      ],
    };
    GoogleFit.authorize(options)
      .then(async authResult => {
        if (authResult.success) {
          // dispatch('AUTH_SUCCESS');
          console.log('AUTH_SUCCESS');
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACTIVITY_RECOGNITION,
            {
              title: 'Cool Photo App Camera Permission',
              message:
                'Cool Photo App needs access to your camera ' +
                'so you can take awesome pictures.',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            },
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            const granted2 = await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
              {
                title: 'Cool Photo App Camera Permission',
                message:
                  'Cool Photo App needs access to your camera ' +
                  'so you can take awesome pictures.',
                buttonNeutral: 'Ask Me Later',
                buttonNegative: 'Cancel',
                buttonPositive: 'OK',
              },
            );

            if (granted2 === PermissionsAndroid.RESULTS.GRANTED) {
              console.log('You have the permissions');
              GoogleFit.startRecording(async callback => {
                console.log(callback);
                console.log(await fetchData());
                console.log(await fetchData2());

                const actualSteps = await fetchData();
                const step = actualSteps.find(
                  i => i.source === 'com.google.android.gms:estimated_steps',
                );

                if (step) {
                  console.log(step);
                  setSteps(step.steps[0].value);
                }

                setAuthorized(true);

                // Process data from Google Fit Recording API (no google fit app needed)
              });
            }
          } else {
            console.log('Camera permission denied');
          }
        } else {
          // dispatch('AUTH_DENIED', authResult.message);
          console.log('AUTH_DENIED');
        }
      })
      .catch(() => {
        console.log('error AUTH_ERROR');
        // dispatch('AUTH_ERROR');
      });
  }, []);

  return (
    <SafeAreaView style={{flex: 1}}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <View style={{padding: 10}}>
        <Text>PASOS: {steps} </Text>

        <YoutubePlayer height={300} play={authorized} videoId={'8VEPLYOOk-w'} />
      </View>
    </SafeAreaView>
  );
};

export default App;
