import { ScreenConfig } from '@/types';

/**
 * Central screen corner coordinates as percentages of the mall image dimensions.
 * These values define the exact position of the giant central screen.
 *
 * To recalibrate, update these 4 corner points based on your actual mall image.
 * Each point is [x%, y%] where 0,0 is top-left and 100,100 is bottom-right.
 *
 * The order is: topLeft, topRight, bottomRight, bottomLeft (clockwise from top-left)
 */
export const MALL_SCREEN_CONFIG: ScreenConfig = {
  centralScreen: {
    // These coordinates define the large central vertical screen
    // Adjust these to match your actual mall photo's screen position
    topLeft:     [38.5, 12.0],
    topRight:    [61.5, 12.0],
    bottomRight: [61.5, 88.0],
    bottomLeft:  [38.5, 88.0],
  },

  // Visual tuning
  brightness: 1.1,
  contrast: 1.05,
  saturation: 1.1,

  // LED screen overlay effect
  ledOverlay: true,
  glowIntensity: 0.35,
};

/**
 * Side screens - these are part of the base image and are NOT modified.
 * Documented here for future expansion.
 */
export const SIDE_SCREENS = {
  left: {
    topLeft:     [0.0,  20.0],
    topRight:    [32.0, 20.0],
    bottomRight: [32.0, 75.0],
    bottomLeft:  [0.0,  75.0],
  },
  right: {
    topLeft:     [68.0, 20.0],
    topRight:    [100.0, 20.0],
    bottomRight: [100.0, 75.0],
    bottomLeft:  [68.0,  75.0],
  },
};
