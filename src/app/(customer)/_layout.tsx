import { Tabs } from 'expo-router';
import { Home, Car, Wrench, Bell, User } from 'lucide-react-native';
import { getTabBarOptions } from '@/constants/navigation';
import { useTheme } from '@/providers/ThemeProvider';

export default function CustomerLayout() {
  const { theme } = useTheme();
  return (
    <Tabs screenOptions={getTabBarOptions(theme)}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Home size={size - 2} color={color} strokeWidth={1.75} />,
        }}
      />
      <Tabs.Screen
        name="vehicle"
        options={{
          title: 'Vehicle',
          tabBarIcon: ({ color, size }) => <Car size={size - 2} color={color} strokeWidth={1.75} />,
        }}
      />
      <Tabs.Screen
        name="service"
        options={{
          title: 'Service',
          tabBarIcon: ({ color, size }) => <Wrench size={size - 2} color={color} strokeWidth={1.75} />,
        }}
      />
      <Tabs.Screen
        name="alerts"
        options={{
          title: 'Alerts',
          tabBarIcon: ({ color, size }) => <Bell size={size - 2} color={color} strokeWidth={1.75} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <User size={size - 2} color={color} strokeWidth={1.75} />,
        }}
      />
      <Tabs.Screen name="documents" options={{ href: null }} />
      <Tabs.Screen name="support" options={{ href: null }} />
      <Tabs.Screen name="add-vehicle" options={{ href: null }} />
      <Tabs.Screen name="transfer-ownership" options={{ href: null }} />
    </Tabs>
  );
}
