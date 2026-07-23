import React from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { ChevronRight, LucideIcon } from 'lucide-react-native';
import { radius, spacing, typography } from '@/constants/theme';
import { useTheme } from '@/providers/ThemeProvider';

interface ListRowProps {
  label: string;
  description?: string;
  icon?: LucideIcon;
  onPress?: () => void;
  rightText?: string;
  showChevron?: boolean;
  style?: ViewStyle;
  accessibilityLabel?: string;
}

export function ListRow({
  label,
  description,
  icon: Icon,
  onPress,
  rightText,
  showChevron = !!onPress,
  style,
  accessibilityLabel,
}: ListRowProps) {
  const { theme } = useTheme();

  const content = (
    <>
      {Icon ? (
        <View style={[styles.iconWrap, { backgroundColor: theme.colors.surface2 }]}>
          <Icon size={18} color={theme.colors.text2} strokeWidth={1.75} />
        </View>
      ) : null}
      <View style={styles.body}>
        <Text style={[styles.label, { color: theme.colors.text1 }]}>{label}</Text>
        {description ? <Text style={[styles.description, { color: theme.colors.text2 }]}>{description}</Text> : null}
      </View>
      {rightText ? <Text style={[styles.rightText, { color: theme.colors.text2 }]}>{rightText}</Text> : null}
      {showChevron && onPress ? (
        <ChevronRight size={16} color={theme.colors.text3} strokeWidth={1.75} />
      ) : null}
    </>
  );

  if (onPress) {
    return (
      <TouchableOpacity
        style={[
          styles.row,
          { borderBottomColor: theme.colors.divider },
          style,
        ]}
        onPress={onPress}
        activeOpacity={0.6}
        accessibilityLabel={accessibilityLabel ?? label}
      >
        {content}
      </TouchableOpacity>
    );
  }

  return (
    <View
      style={[
        styles.row,
        { borderBottomColor: theme.colors.divider },
        style,
      ]}
    >
      {content}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    gap: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: { flex: 1 },
  label: {
    ...typography.body,
    fontSize: 14,
  },
  description: {
    ...typography.caption,
    fontSize: 12,
    marginTop: 2,
  },
  rightText: {
    ...typography.caption,
    fontSize: 12,
    ...typography.mono,
  },
});
