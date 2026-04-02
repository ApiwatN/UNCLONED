'use client'
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Lang = 'th' | 'en';
interface LangContextType {
    lang: Lang;
    setLang: (lang: Lang) => void;
}

const LanguageContext = createContext<LangContextType>({ lang: 'th', setLang: () => {} });

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [lang, setLang] = useState<Lang>('th');
    
    // Optional: Sync with localStorage if client side
    useEffect(() => {
        const stored = localStorage.getItem('app_lang');
        if (stored === 'en' || stored === 'th') {
            setLang(stored);
        }
    }, []);

    const handleSetLang = (newLang: Lang) => {
        setLang(newLang);
        localStorage.setItem('app_lang', newLang);
    };

    return (
        <LanguageContext.Provider value={{ lang, setLang: handleSetLang }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    return useContext(LanguageContext);
}
