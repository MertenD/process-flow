"use client"

import { useEffect } from 'react';

export default function ScrollToTop() {
    useEffect(() => {
        // Scroll to top when navigating to a new page without a hash
        if (window.location.hash === "") {
            window.scrollTo(0, 0);
        }
    }, []);

    return <></>
}