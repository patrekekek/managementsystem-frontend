import { useWindowDimensions, Platform } from "react-native";

export function useResponsive() {
    const { width, height } = useWindowDimensions();

    const isWeb = Platform.OS === 'web';
    const isMobile = width < 768;
    const isTablet = width >= 768 && width < 1024;
    const isDesktop = width >= 1024;


    return {
        width,
        height,
        isWeb,
        isMobile,
        isTablet,
        isDesktop
    }
}