import { Theme } from '@/theme/tokens';

export const getTabBarOptions = (theme: Theme) => ({
  headerShown: false,
  tabBarStyle: {
    backgroundColor: theme.tabBar.backgroundColor,
    borderTopWidth: 1,
    borderTopColor: theme.tabBar.borderColor,
    height: theme.tabBar.height,
    paddingTop: 4,
    paddingBottom: 4,
    elevation: 0,
    shadowOpacity: 0,
  },
  tabBarActiveTintColor: theme.tabBar.activeTint,
  tabBarInactiveTintColor: theme.tabBar.inactiveTint,
  tabBarLabelStyle: {
    fontSize: 10,
    fontWeight: '500' as const,
    marginTop: -2,
  },
  sceneStyle: {
    backgroundColor: theme.colors.background,
  },
});

