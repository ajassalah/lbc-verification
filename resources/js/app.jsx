import './bootstrap';
import '../css/app.css';

import { createRoot } from 'react-dom/client';
import { createInertiaApp, router } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';

const appName = import.meta.env.VITE_APP_NAME || 'LBC';

function cleanupStalePageBlockers() {
    const hasVisibleDialog = Array.from(
        document.querySelectorAll('[role="dialog"], [data-headlessui-state~="open"]')
    ).some((element) => {
        const rect = element.getBoundingClientRect();
        const style = window.getComputedStyle(element);

        return rect.width > 0 && rect.height > 0 && style.display !== 'none' && style.visibility !== 'hidden';
    });

    if (!hasVisibleDialog) {
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';

        document.querySelectorAll('#app, body > [inert], body > [aria-hidden="true"]').forEach((element) => {
            element.removeAttribute('inert');
            element.removeAttribute('aria-hidden');
        });

        Array.from(document.querySelectorAll('body *')).forEach((element) => {
            if (element.id === 'app' || element.contains(document.getElementById('app'))) {
                return;
            }

            const style = window.getComputedStyle(element);
            const rect = element.getBoundingClientRect();
            const fillsViewport =
                style.position === 'fixed' &&
                Math.abs(rect.left) <= 2 &&
                Math.abs(rect.top) <= 2 &&
                rect.width >= window.innerWidth * 0.95 &&
                rect.height >= window.innerHeight * 0.95;
            const hasContent =
                element.textContent.trim().length > 0 ||
                element.querySelector('button, a, input, select, textarea, [role="dialog"]');
            const background = style.backgroundColor;
            const hasDimBackground =
                background.startsWith('rgb(') ||
                /rgba\([^,]+,[^,]+,[^,]+,\s*(0\.[3-9]|1)/.test(background) ||
                style.backdropFilter !== 'none';

            if (fillsViewport && hasDimBackground && !hasContent) {
                element.remove();
            }
        });
    }
}

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => resolvePageComponent(`./Pages/${name}.jsx`, import.meta.glob('./Pages/**/*.jsx')),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(<App {...props} />);

        [0, 50, 250, 1000].forEach((delay) => {
            window.setTimeout(cleanupStalePageBlockers, delay);
        });

        router.on('navigate', () => {
            [0, 50, 250].forEach((delay) => {
                window.setTimeout(cleanupStalePageBlockers, delay);
            });
        });
    },
    progress: {
        color: '#4B5563',
    },
});
