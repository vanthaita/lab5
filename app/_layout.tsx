import '../global.css';

import { Stack } from 'expo-router';

import { LocationProvider } from './context/location';

export default function Layout() {
  return (
    <LocationProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(route)" options={{ headerShown: false }} />
        <Stack.Screen
          name="(route)/[placeid]"
          options={{
            title: 'Details',
            headerShown: true,
            headerStyle: {
              backgroundColor: 'white',
            },
            headerTitleStyle: {
              fontSize: 20,
              fontWeight: 'bold',
            },
          }}
        />
        <Stack.Screen
          name="places/places"
          options={{
            title: 'Places',
            headerShown: true,
            headerStyle: {
              backgroundColor: 'white',
            },
            headerTitleStyle: {
              fontSize: 20,
              fontWeight: 'bold',
            },
          }}
        />
        <Stack.Screen
          name="Map/map"
          options={{
            title: 'Map',
            headerShown: true,
            headerStyle: {
              backgroundColor: 'white',
            },
            headerTitleStyle: {
              fontSize: 20,
              fontWeight: 'bold',
            },
          }}
        />
      </Stack>
    </LocationProvider>
  );
}
