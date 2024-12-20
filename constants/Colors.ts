/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const lightBackgroundOpacity = "33"
const darkBackgroundOpacity = "50"

export const Colors = {
  light: {
    //backgrounds
    background: "#E0DBC6",
    elevated: "#F5F2E8",

    //text
    text: "#1F1F1F",

    //colors
    primaryElevated: "#2B59C3",
    primaryBackground: "#2B59C3" + lightBackgroundOpacity,

    secondaryElevated: "#E55934",
    secondaryBackground: "#E55934" + lightBackgroundOpacity,

    successElevated: "#0B6E4F",
    successBackground: "#0B6E4F" + lightBackgroundOpacity,

    dangerElevated: "#A4243B",
    dangerBackground: "#A4243B" + lightBackgroundOpacity,

    //buttons
    buttonText: "#fff",
    primaryButton: "#2B59C3",
    secondaryButton: "#E55934",
    successButton: "#0B6E4F",
    dangerButton: "#A4243B",

    //TODO don't know if we need it but will test later
    tint: "#2B59C3",
    icon: "#687076",
    tabIconDefault: "#687076",
    tabIconSelected: "#2B59C3",
  },
  dark: {
    //backgrounds
    background: "#09090B",
    elevated: "#1C1C22",

    //text
    text: "#EEEEEE",

    //colors
    primaryElevated: "#A3CFFF",
    primaryBackground: "#2B59C3" + darkBackgroundOpacity,

    secondaryElevated: "#FBD89A",
    secondaryBackground: "#E55934" + darkBackgroundOpacity,

    successElevated: "#75C1A6",
    successBackground: "#0B6E4F" + darkBackgroundOpacity,

    dangerElevated: "#E4C0AF",
    dangerBackground: "#A4243B" + darkBackgroundOpacity,

    //buttons
    buttonText: "#fff",
    primaryButton: "#2B59C3",
    secondaryButton: "#E55934",
    successButton: "#0B6E4F",
    dangerButton: "#A4243B",

    //TODO don't know if we need it but will test later
    tint: "#2B59C3",
    icon: "#687076",
    tabIconDefault: "#687076",
    tabIconSelected: "#2B59C3",
  },
}
