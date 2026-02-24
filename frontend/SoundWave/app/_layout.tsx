import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Root page: app/page.tsx */}
      <Stack.Screen name="index" options={{ title: 'Home' }} />

      {/* Folder routes */}
      <Stack.Screen name="Song" options={{ title: 'Song' }} />
      <Stack.Screen name="Album" options={{ title: 'Album' }} />
      <Stack.Screen name="Login" options={{ title: 'Login' }} />
      <Stack.Screen name="Profile" options={{ title: 'Profile' }} />
      <Stack.Screen name="Settings" options={{ title: 'Settings' }} />
      <Stack.Screen name="Homepage" options={{ title: 'Homepage' }} />
    </Stack>
  );
}
