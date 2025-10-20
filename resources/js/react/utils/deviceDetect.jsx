import React, { useState, useEffect } from 'react';

const useWindowWidth = ()=> {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);

        // Clean up the event listener when the component unmounts
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []); // Empty dependency array ensures the effect runs only once on mount

    return windowWidth;
}
const isMenuColapsable = () => {
    const windowWidth = useWindowWidth() ;

    console.log();
    return windowWidth < 1290;
}

export { useWindowWidth, isMenuColapsable };
