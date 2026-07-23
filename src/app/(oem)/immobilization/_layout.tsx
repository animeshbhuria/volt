import { Stack } from 'expo-router';

export default function OemImmobilizationLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="review/[id]" />
    </Stack>
  );
}
