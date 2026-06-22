import { useEffect, useState } from "react";

export default function VerificationIntroVideo() {
    const [isOpen, setIsOpen] = useState(true);

    useEffect(() => {
        if (!isOpen) {
            document.body.style.overflow = "";
            document.documentElement.style.overflow = "";
            return undefined;
        }

        document.body.style.overflow = "hidden";
        document.documentElement.style.overflow = "hidden";

        const closeOnEscape = (event) => {
            if (event.key === "Escape") setIsOpen(false);
        };

        window.addEventListener("keydown", closeOnEscape);

        return () => {
            window.removeEventListener("keydown", closeOnEscape);
            document.body.style.overflow = "";
            document.documentElement.style.overflow = "";
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/90 p-3 backdrop-blur-sm sm:p-6"
            role="dialog"
            aria-modal="true"
            aria-label="LBC introduction video"
        >
            <div className="relative w-full max-w-5xl overflow-hidden rounded-2xl bg-black shadow-2xl sm:rounded-3xl">
                <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="absolute right-3 top-3 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full bg-black/70 text-2xl leading-none text-white shadow-lg transition hover:bg-black focus:outline-none focus:ring-2 focus:ring-white sm:right-4 sm:top-4"
                    aria-label="Close video"
                    title="Close video"
                >
                    &times;
                </button>

                <video
                    className="max-h-[88vh] w-full bg-black object-contain"
                    autoPlay
                    muted
                    playsInline
                    controls
                    controlsList="nodownload"
                    disablePictureInPicture
                    preload="auto"
                    onEnded={() => setIsOpen(false)}
                    onError={() => setIsOpen(false)}
                    onContextMenu={(event) => event.preventDefault()}
                >
                    <source src="/image/New%20Logo%20Revel.mp4" type="video/mp4" />
                    Your browser does not support video playback.
                </video>
            </div>
        </div>
    );
}
