import { Link } from "@inertiajs/react";

export default function Pagination({ links, params = {} }) {
    // Helper function to build URLs with optional params
    const buildUrlWithParams = (baseUrl) => {
        if (!baseUrl) return null;

        // Make a copy of `params` without the `page` property
        const filteredParams = { ...params };
        delete filteredParams.page;

        // Construct the URL
        const url = new URL(baseUrl, window.location.origin);
        Object.entries(filteredParams).forEach(([key, value]) => {
            if (value !== null && value !== undefined) {
                url.searchParams.set(key, value);
            }
        });

        return url.toString();
    };

    return (
        <nav className="flex items-center justify-center mt-4 gap-1">
            {links.map((link, index) => (
                <Link
                    preserveScroll
                    href={buildUrlWithParams(link.url)}
                    key={link.label}
                    className={
                        "inline-flex items-center justify-center min-w-[2rem] h-8 px-3 text-sm border transition-colors duration-150 ease-in-out " +
                        (link.active
                            ? "border-blue-500 bg-blue-50 text-blue-600 font-medium "
                            : "border-gray-200 text-gray-700 ") +
                        (!link.url
                            ? "text-gray-300 cursor-not-allowed border-gray-100 "
                            : "hover:bg-gray-50 hover:border-gray-300")
                    }
                >
                    {link.label.includes("Previous") ? (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    ) : link.label.includes("Next") ? (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    ) : (
                        <span dangerouslySetInnerHTML={{ __html: link.label }} />
                    )}
                </Link>
            ))}
        </nav>
    );
}
