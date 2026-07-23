import { Stack } from 'expo-router';

export default function ServiceLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="job-card/[id]" />
    </Stack>
  );
}
