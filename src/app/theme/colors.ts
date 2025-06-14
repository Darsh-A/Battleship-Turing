/**
 * Color theme system for the application
 * Provides a centralized place to manage all colors used in the application
 */

export const colors = {
    // Primary colors
    primary: {
        main: '#4A90E2',      // Main brand color
        light: '#7FB1ED',     // Lighter shade for hover states
        dark: '#2C6BC0',      // Darker shade for active states
        contrast: '#FFFFFF',  // Text color on primary background
    },

    // Secondary colors
    secondary: {
        main: '#50E3C2',      // Secondary brand color
        light: '#7BEDD9',     // Lighter shade
        dark: '#2BC0A3',      // Darker shade
        contrast: '#000000',  // Text color on secondary background
    },

    // Background colors
    background: {
        default: '#1E1E1E',   // Main background color
        paper: '#2D2D2D',     // Card/container background
        dark: '#121212',      // Darker background for contrast
    },

    // Text colors
    text: {
        primary: '#FFFFFF',   // Primary text color
        secondary: '#B3B3B3', // Secondary text color
        disabled: '#757575',  // Disabled text color
    },

    // Status colors
    status: {
        success: '#4CAF50',   // Success state
        warning: '#FFC107',   // Warning state
        error: '#F44336',     // Error state
        info: '#2196F3',      // Information state
    },

    // UI Element colors
    ui: {
        border: '#3D3D3D',    // Border color
        divider: '#2C2C2C',   // Divider color
        hover: 'rgba(255, 255, 255, 0.08)',  // Hover overlay
        selected: 'rgba(255, 255, 255, 0.12)', // Selected state
        disabled: 'rgba(255, 255, 255, 0.38)', // Disabled state
    },

    // Game specific colors
    game: {
        ship: '#4A90E2',      // Ship color
        hit: '#F44336',       // Hit marker
        miss: '#B3B3B3',      // Miss marker
        water: '#2196F3',     // Water color
        grid: '#3D3D3D',      // Grid lines
    }
} as const;

// Type for the color system
export type ColorTheme = typeof colors;

// Helper function to get a color with opacity
export const withOpacity = (color: string, opacity: number): string => {
    // Convert hex to rgba
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

// Example usage:
// import { colors, withOpacity } from './theme/colors';
// 
// // Using a color
// const primaryColor = colors.primary.main;
// 
// // Using a color with opacity
// const semiTransparentPrimary = withOpacity(colors.primary.main, 0.5); 