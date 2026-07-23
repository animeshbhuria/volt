import { Stack } from 'expo-router';

export default function VehicleLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="[id]" />
      <Stack.Screen name="trips" />
      <Stack.Screen name="charging" />
      <Stack.Screen name="ota" />
    </Stack>
  );
}
