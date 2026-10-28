// Typography - Quy chuẩn font và cỡ chữ cho ứng dụng
import {Platform} from 'react-native';

const Typography = {
  // Font family
  fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',

  // Heading
  h1: {
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 36,
    letterSpacing: -0.5,
  },
  h2: {
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 30,
    letterSpacing: -0.3,
  },
  h3: {
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 26,
  },

  // Body
  bodyLarge: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
  },
  body: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 22,
  },
  bodySmall: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 18,
  },

  // Label
  labelLarge: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
  },
  labelSmall: {
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 16,
  },

  // Caption
  caption: {
    fontSize: 11,
    fontWeight: '400',
    lineHeight: 16,
  },

  // Button
  button: {
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 22,
    letterSpacing: 0.3,
  },
  buttonSmall: {
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
  },

  // Price
  price: {
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 22,
  },
  priceSmall: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
  },
};

export default Typography;
