import React from 'react';
import { Feather } from '@expo/vector-icons';

const ICON_MAP = {
  'activity': 'activity',
  'alert-circle': 'alert-circle',
  'arrow-left': 'arrow-left',
  'arrow-right': 'arrow-right',
  'bar-chart-2': 'bar-chart-2',
  'calendar': 'calendar',
  'caret-right': 'chevron-right',
  'check': 'check',
  'check-circle': 'check-circle',
  'circle': 'circle',
  'clock': 'clock',
  'columns': 'columns',
  'dollar-sign': 'dollar-sign',
  'edit-3': 'edit-3',
  'external-link': 'external-link',
  'file-text': 'file-text',
  'info': 'info',
  'percent': 'percent',
  'search': 'search',
  'shield': 'shield',
  'sliders': 'sliders',
  'star': 'star',
  'tag': 'tag',
  'trending-up': 'trending-up',
  'user': 'user',
  'x': 'x',
  'zap': 'zap',
  'chevron-right': 'chevron-right',
} as const;

export type AppIconName = keyof typeof ICON_MAP;

type FeatherProps = React.ComponentProps<typeof Feather>;

interface AppIconProps extends Omit<FeatherProps, 'name'> {
  name: AppIconName;
  weight?: 'regular' | 'bold' | 'fill' | 'light' | 'thin';
}

export function AppIcon({ name, weight: _weight, ...rest }: AppIconProps) {
  return <Feather name={ICON_MAP[name]} {...rest} />;
}
