import ErrorNotification from '@/Components/ErrorNotification';
import ApplicationLogo from '@/Components/ApplicationLogo';
import InputError from '@/Components/InputError';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

function SearchIcon({ className = 'h-5 w-5' }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className={className}
        >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" strokeLinecap="round" />
        </svg>
    );
}

function ShieldIcon({ className = 'h-5 w-5' }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className={className}
        >
            <path
                d="M12 3l7 3v5c0 5-3.4 8.8-7 10-3.6-1.2-7-5-7-10V6l7-3Z"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path d="m9.5 12 1.8 1.8 3.5-4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

export default function Home() {
    const { flash } = usePage().props;
    const [showErrorNotification, setShowErrorNotification] = useState(false);

    const { data, setData, get, processing, errors } = useForm({
        reference_no: '',
    });

    useEffect(() => {
        document
            .querySelectorAll('[aria-hidden="true"].fixed.inset-0')
            .forEach((element) => element.remove());

        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
    }, []);

    useEffect(() => {
        if (!flash?.error) {
            return undefined;
        }

        setShowErrorNotification(true);

        const timeoutId = setTimeout(() => {
            setShowErrorNotification(false);
        }, 5000);

        return () => clearTimeout(timeoutId);
    }, [flash]);

    const submit = (e) => {
        e.preventDefault();
        get(route('certificates.search'));
    };

    const currentYear = new Date().getFullYear();

    return (
        <>
            {showErrorNotification && <ErrorNotification />}

            <Head title="UKEE Certificate Verification" />

            <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,_#f8fbff_0%,_#eef4fb_48%,_#e7eef8_100%)] text-slate-900">
                <div className="pointer-events-none absolute inset-0">
                    <div className="absolute left-1/2 top-24 h-64 w-64 -translate-x-1/2 rounded-full bg-blue-100/40 blur-3xl" />
                    <div className="absolute bottom-12 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-slate-200/45 blur-3xl" />
                </div>

                <main className="relative mx-auto flex min-h-screen w-full max-w-6xl items-center justify-center px-4 py-5 sm:px-6 sm:py-8">
                    <div className="w-full max-w-4xl">
                        <div className="mb-5 text-center sm:mb-7">
                            <Link href="/" className="inline-flex">
                                <ApplicationLogo className="h-16 w-auto sm:h-20" />
                            </Link>

                            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                                UKEE Certificate Verification
                            </h1>
                            <p className="mt-3 text-base text-slate-600 sm:text-lg">
                                Secure &amp; Reliable Certificate Authentication
                            </p>
                        </div>

                        <section className="rounded-[30px] border border-slate-200/80 bg-white/95 px-4 py-7 shadow-[0_30px_80px_rgba(15,23,42,0.12)] backdrop-blur sm:px-8 sm:py-10">
                            <div className="mx-auto max-w-2xl text-center">
                                <h2 className="text-3xl font-semibold tracking-tight text-slate-900">
                                    Certificate Verification
                                </h2>
                                <p className="mx-auto mt-4 max-w-xl text-lg leading-8 text-slate-500">
                                    Enter the certificate reference number below to verify and
                                    view the authentic certificate details.
                                </p>
                            </div>

                            <form onSubmit={submit} className="mx-auto mt-8 max-w-2xl sm:mt-10">
                                <label
                                    htmlFor="reference_no"
                                    className="block text-sm font-semibold text-slate-700"
                                >
                                    Certificate Reference Number
                                </label>

                                <div className="relative mt-3">
                                    <input
                                        id="reference_no"
                                        type="text"
                                        value={data.reference_no}
                                        onChange={(e) => setData('reference_no', e.target.value)}
                                        placeholder="Enter reference number"
                                        autoFocus
                                        required
                                        className="h-14 w-full rounded-2xl border border-slate-300 bg-white px-4 pr-12 text-base text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 sm:h-16 sm:px-5 sm:pr-14 sm:text-lg"
                                    />
                                    <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-slate-400 sm:right-5">
                                        <SearchIcon className="h-5 w-5 sm:h-6 sm:w-6" />
                                    </span>
                                </div>

                                <InputError message={errors.reference_no} className="mt-3" />

                                <div className="mt-6 space-y-4">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="inline-flex h-14 w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-[#3568f6] to-[#244fd8] px-5 text-xs font-semibold uppercase tracking-[0.18em] text-white shadow-[0_18px_30px_rgba(37,79,216,0.28)] transition hover:from-[#2f60ea] hover:to-[#1f46c6] focus:outline-none focus:ring-4 focus:ring-blue-200 disabled:cursor-not-allowed disabled:opacity-70 sm:px-6 sm:text-sm sm:tracking-[0.2em]"
                                    >
                                        <ShieldIcon />
                                        {processing ? 'Verifying...' : 'Verify Certificate'}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => window.location.href = '/'}
                                        className="inline-flex h-14 w-full items-center justify-start gap-3 rounded-2xl border border-slate-300 bg-white px-5 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600 shadow-sm transition hover:border-slate-400 hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-200 sm:text-sm sm:tracking-[0.2em]"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.8"
                                            className="h-5 w-5"
                                        >
                                            <path
                                                d="M3 12a9 9 0 0 1 15.3-6.3L21 8"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                            <path
                                                d="M21 3v5h-5"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                            <path
                                                d="M21 12a9 9 0 0 1-15.3 6.3L3 16"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                            <path
                                                d="M8 16H3v5"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                        Reset
                                    </button>
                                </div>
                            </form>
                        </section>

                        <footer className="mt-6 text-center text-slate-600 sm:mt-8">
                            <p className="text-lg font-medium">UKEE &copy; {currentYear}</p>
                            <p className="mt-2 text-base">Secure Certificate Verification System</p>
                        </footer>
                    </div>
                </main>
            </div>
        </>
    );
}
