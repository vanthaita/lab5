import '../global.css';

import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="(routes)" options={{ headerShown: false }} />
      <Stack.Screen name="places/places" options={{ headerShown: false }} />

    </Stack>
  );
}
