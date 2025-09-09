import { useState, useEffect } from 'react';

function useSystemTheme() {
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        // Check initial system preference
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        setIsDarkMode(mediaQuery.matches);

        // Add a listener for changes in system preference
        const handleChange = (event) => {
            setIsDarkMode(event.matches);
        };

        mediaQuery.addEventListener('change', handleChange);

        // Clean up the event listener on unmount
        return () => {
            mediaQuery.removeEventListener('change', handleChange);
        };
    }, []);

    return isDarkMode;
}

export default useSystemTheme;
