import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID, signal } from '@angular/core';

export type AppTheme = 'light' | 'dark';

@Injectable({
    providedIn: 'root'
})
export class ThemeService {
    private readonly storageKey = 'elise-theme';
    private readonly document = inject(DOCUMENT);
    private readonly platformId = inject(PLATFORM_ID);

    readonly isDarkMode = signal(false);

    initializeTheme(): void {
        const storedTheme = this.getStoredTheme();
        const theme = storedTheme ?? (this.prefersDarkMode() ? 'dark' : 'light');
        this.applyTheme(theme);
    }

    toggleTheme(): void {
        this.setTheme(this.isDarkMode() ? 'light' : 'dark');
    }

    setTheme(theme: AppTheme): void {
        this.applyTheme(theme);
        this.persistTheme(theme);
    }

    private applyTheme(theme: AppTheme): void {
        this.isDarkMode.set(theme === 'dark');

        if (!isPlatformBrowser(this.platformId)) {
            return;
        }

        this.document.body.classList.toggle('dark-theme', theme === 'dark');
        this.document.documentElement.style.colorScheme = theme;
    }

    private getStoredTheme(): AppTheme | null {
        if (!isPlatformBrowser(this.platformId)) {
            return null;
        }

        try {
            const value = localStorage.getItem(this.storageKey);
            return value === 'dark' || value === 'light' ? value : null;
        }
        catch {
            return null;
        }
    }

    private persistTheme(theme: AppTheme): void {
        if (!isPlatformBrowser(this.platformId)) {
            return;
        }

        try {
            localStorage.setItem(this.storageKey, theme);
        }
        catch {
            // Ignore storage failures and keep the in-memory theme.
        }
    }

    private prefersDarkMode(): boolean {
        if (!isPlatformBrowser(this.platformId) || !window.matchMedia) {
            return false;
        }

        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
}
