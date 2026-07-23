import { Tabs } from 'expo-router';
import { LayoutDashboard, Car, Bell, Shield, User } from 'lucide-react-native';
import { getTabBarOptions } from '@/constants/navigation';
import { useTheme } from '@/providers/ThemeProvider';

export default function OemLayout() {
  const { theme } = useTheme();
  return (
    <Tabs screenOptions={getTabBarOptions(theme)}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Fleet',
          tabBarIcon: ({ color, size }) => (
            <LayoutDashboard size={size - 2} color={color} strokeWidth={1.75} />
          ),
        }}
      />
      <Tabs.Screen
        name="vehicles"
        options={{
          title: 'Vehicles',
          tabBarIcon: ({ color, size }) => <Car size={size - 2} color={color} strokeWidth={1.75} />,
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
        name="immobilization"
        options={{
          title: 'Immobilize',
          tabBarIcon: ({ color, size }) => <Shield size={size - 2} color={color} strokeWidth={1.75} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <User size={size - 2} color={color} strokeWidth={1.75} />,
        }}
      />
    </Tabs>
  );
}
