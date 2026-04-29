import React, { createContext, useState, useEffect, useContext } from 'react';
import API from '../api';

const SettingsContext = createContext();

export function SettingsProvider({ children }) {
    const [settings, setSettings] = useState({
        siteName: 'মেসবাহ',
        tagline: 'তোমার পছন্দের মেস খোঁজো',
        primaryColor: '#6C63FF',
        logo: '',
        heroBanner: '',
        contactEmail: '',
        contactPhone: '',
        footerText: '',
    });

    useEffect(() => {
        API.get('/settings').then(r => setSettings(r.data)).catch(() => { });
    }, []);

    return (
        <SettingsContext.Provider value={{ settings, setSettings }}>
            {children}
        </SettingsContext.Provider>
    );
}

export const useSettings = () => useContext(SettingsContext);