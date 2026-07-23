import { Stack } from 'expo-router';

export default function DealerServiceLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="create-job" />
    </Stack>
  );
}
