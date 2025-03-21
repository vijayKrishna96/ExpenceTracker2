import { Dimensions, PixelRatio } from "react-native";

// Get screen width and height
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

// Determine the shorter and longer dimension of the screen
const [shortDimension, longDimension] =
  SCREEN_WIDTH < SCREEN_HEIGHT
    ? [SCREEN_WIDTH, SCREEN_HEIGHT]
    : [SCREEN_HEIGHT, SCREEN_WIDTH];

// Base guideline dimensions (for reference)
const guidelineBaseWidth = 375;
const guidelineBaseHeight = 812;

// Function to scale size based on screen width
export const scale = (size: number) => {
  return Math.round(
    PixelRatio.roundToNearestPixel((shortDimension / guidelineBaseWidth) * size)
  );
};

// Function to scale size vertically based on screen height
export const verticalScale = (size: number) => {
  return Math.round(
    PixelRatio.roundToNearestPixel((longDimension / guidelineBaseHeight) * size)
  );
};
