/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

export const primaryColors = {
  primary: '#2B59C3',
  secondary: '#E55934',
  success: '#0B6E4F',
  danger: '#E55934',
  white: '#fff',
  black: '#000',
}

const tintColorLight = primaryColors.primary
const tintColorDark = primaryColors.primary

export const Colors = {
  light: {
    //backgrounds
    background: '#E0DBC6',
    elevated: '#F5F2E8',

    //text
    text: '#1F1F1F',

    //colors
    ...primaryColors,

    //TODO don't know if we need it but will test later
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    //backgrounds
    background: '#E0DBC6',
    elevated: '#F5F2E8',

    //text
    text: '#1F1F1F',

    //colors
    ...primaryColors,

    //TODO don't know if we need it but will test later
    tint: tintColorDark,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorDark,
  },
}
