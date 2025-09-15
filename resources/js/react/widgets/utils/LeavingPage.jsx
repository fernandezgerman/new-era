import React from 'react';

export const LeavingPage = ({}) => {

    const [loading, setLoading] = React.useState(false);
    React.useEffect(() => {
        setLoading(false);
    }, []);


    React.useEffect(() => {
        const handleBeforeUnload = (event) => {
            setLoading(true);
        };

        // Add the event listener when the component mounts
        window.addEventListener('beforeunload', handleBeforeUnload);

        // Clean up the event listener when the component unmounts
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []); // Empty dependency array ensures this runs only on mount and unmount


    return (
        <>
            <div style={{
                backgroundColor: 'gray',
                width: '100%',
                height: '100%',
                display: loading ? 'block' : 'none',
                position: 'fixed',
                zIndex: 999,
                opacity: 0.5,
            }}>
            </div>
        </>

    );
}
