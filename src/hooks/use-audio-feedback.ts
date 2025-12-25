import { useRef, useCallback } from 'react';

export function useAudioFeedback() {
    const synth = window.speechSynthesis;
    const isEnabledRef = useRef(true);

    const speak = useCallback((text: string) => {
        if (!isEnabledRef.current || !synth) return;

        // Cancel current utterance
        synth.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.volume = 1;
        utterance.rate = 1.0;
        utterance.pitch = 1.0;

        // Try to select a good voice (English)
        const voices = synth.getVoices();
        const preferredVoice = voices.find(v => v.lang.includes('en-US') && v.name.includes('Google')) ||
            voices.find(v => v.lang.includes('en-US'));

        if (preferredVoice) {
            utterance.voice = preferredVoice;
        }

        synth.speak(utterance);
    }, [synth]);

    const toggleAudio = useCallback(() => {
        isEnabledRef.current = !isEnabledRef.current;
        if (!isEnabledRef.current) {
            synth.cancel();
        }
        return isEnabledRef.current;
    }, [synth]);

    return {
        speak,
        toggleAudio,
        isEnabled: isEnabledRef.current
    };
}
