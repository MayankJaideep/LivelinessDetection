
export interface DeviceTrustMetrics {
    isBot: boolean;
    isHeadless: boolean;
    platformMismatch: boolean;
    screenPropertiesValid: boolean;
    trustScore: number; // 0-100
    riskFactors: string[];
}

export function detectBot(): boolean {
    // Check commonly used bot properties
    return (
        /HeadlessChrome/.test(navigator.userAgent) ||
        /WebDriver/.test(navigator.userAgent) ||
        !!(navigator as any).webdriver ||
        !!(window as any).callPhantom ||
        !!(window as any)._phantom ||
        !!(window as any).phantom ||
        !!(window as any).domAutomation
    );
}

export function checkScreenProperties(): boolean {
    // Screen dimensions should differ from window inner dimensions usually,
    // or at least be reasonable.
    // Headless browsers often default to weird sizes like 800x600 with no outer window chrome.
    if (window.screen.width < 100 || window.screen.height < 100) return false;
    if (window.innerWidth === 0 || window.innerHeight === 0) return false;

    return true;
}

export function checkPlatformConsistency(): boolean {
    const platform = (navigator as any).userAgentData?.platform || navigator.platform;
    const userAgent = navigator.userAgent;

    if (platform.toLowerCase().includes('mac') && !userAgent.toLowerCase().includes('mac')) return false;
    if (platform.toLowerCase().includes('win') && !userAgent.toLowerCase().includes('win')) return false;
    if (/iPhone|iPad|iPod/.test(platform) && !/iPhone|iPad|iPod/.test(userAgent)) return false;

    return true;
}

export function calculateDeviceTrust(): DeviceTrustMetrics {
    const isBotDetected = detectBot();
    const isHeadlessBrowser = /Headless/.test(navigator.userAgent) || (window.navigator.languages && window.navigator.languages.length === 0);
    const platformMismatch = !checkPlatformConsistency();
    const screenValid = checkScreenProperties();

    const riskFactors: string[] = [];
    if (isBotDetected) riskFactors.push('Automation Framework Detected');
    if (isHeadlessBrowser) riskFactors.push('Headless Browser Detected');
    if (platformMismatch) riskFactors.push('Platform Inconsistency (User-Agent spoofing)');
    if (!screenValid) riskFactors.push('Abnormal Screen Properties');

    // Calculate Base Score
    let score = 100;
    if (isBotDetected) score -= 90;
    if (isHeadlessBrowser) score -= 80;
    if (platformMismatch) score -= 40;
    if (!screenValid) score -= 30;

    // Ensure non-negative
    score = Math.max(0, score);

    return {
        isBot: isBotDetected,
        isHeadless: !!isHeadlessBrowser,
        platformMismatch,
        screenPropertiesValid: screenValid,
        trustScore: score,
        riskFactors
    };
}
