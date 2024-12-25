/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const largeOpacity = '66'
const lightBackgroundOpacity = '33'
const darkBackgroundOpacity = '50'

export const Colors = {
  light: {
    white: '#fff',
    black: '#000',

    //backgrounds
    background: '#E0DBC6',
    backgroundOpaque: '#E0DBC6' + lightBackgroundOpacity,
    elevated: '#F5F2E8',
    elevatedOpaque: '#F5F2E8' + lightBackgroundOpacity,

    //text
    text: '#1F1F1F',
    placeholder: '#A0A0A0',

    //inputs
    inputBackground: '#F5F2E8' + largeOpacity,

    //colors
    primaryElevated: '#2B59C3',
    primaryBackground: '#2B59C3' + lightBackgroundOpacity,

    secondaryElevated: '#E55934',
    secondaryBackground: '#E55934' + lightBackgroundOpacity,

    tertiaryElevated: '#673E7F',
    tertiaryBackground: '#673E7F' + lightBackgroundOpacity,

    successElevated: '#0B6E4F',
    successBackground: '#0B6E4F' + lightBackgroundOpacity,

    dangerElevated: '#A4243B',
    dangerBackground: '#A4243B' + lightBackgroundOpacity,

    //buttons
    buttonText: '#fff',
    primaryButton: '#2B59C3',
    secondaryButton: '#E55934',
    successButton: '#0B6E4F',
    dangerButton: '#A4243B',

    //TODO don't know if we need it but will test later
    tint: '#2B59C3',
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: '#2B59C3',
  },
  dark: {
    white: '#fff',
    black: '#000',

    //backgrounds
    background: '#09090B',
    backgroundOpaque: '#09090B' + darkBackgroundOpacity,
    elevated: '#1C1C22',
    elevatedOpaque: '#1C1C22' + darkBackgroundOpacity,

    //text
    text: '#EEEEEE',
    placeholder: '#A0A0A0',

    //inputs
    inputBackground: '#1C1C22' + largeOpacity,

    //colors
    primaryElevated: '#A3CFFF',
    primaryBackground: '#2B59C3' + darkBackgroundOpacity,

    secondaryElevated: '#FBD89A',
    secondaryBackground: '#E55934' + darkBackgroundOpacity,

    tertiaryElevated: '#E3B9F2',
    tertiaryBackground: '#673E7F' + darkBackgroundOpacity,

    successElevated: '#75C1A6',
    successBackground: '#0B6E4F' + darkBackgroundOpacity,

    dangerElevated: '#E4C0AF',
    dangerBackground: '#A4243B' + darkBackgroundOpacity,

    //buttons
    buttonText: '#fff',
    primaryButton: '#2B59C3',
    secondaryButton: '#E55934',
    successButton: '#0B6E4F',
    dangerButton: '#A4243B',

    //TODO don't know if we need it but will test later
    tint: '#2B59C3',
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: '#2B59C3',
  },
}

export type ThemeColor = keyof (typeof Colors)['dark' | 'light']

export const cardColorMap: Record<string, CardColors> = {
  blue: {
    background: 'primaryBackground',
    text: 'primaryElevated',
  },
  orange: {
    background: 'secondaryBackground',
    text: 'secondaryElevated',
  },
  purple: {
    background: 'tertiaryBackground',
    text: 'tertiaryElevated',
  },
  green: {
    background: 'successBackground',
    text: 'successElevated',
  },
  red: {
    background: 'dangerBackground',
    text: 'dangerElevated',
  },
}
type CardColors = {
  background: ThemeColor
  text: ThemeColor
}
