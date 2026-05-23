import ApplicationLogo from '@/Components/ApplicationLogo';
import InputError from '@/Components/InputError';
import { Head, Link, useForm } from '@inertiajs/react';
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

function ResetIcon({ className = 'h-5 w-5' }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className={className}
        >
            <path d="M3 12a9 9 0 0 1 15.3-6.3L21 8" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M21 3v5h-5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M21 12a9 9 0 0 1-15.3 6.3L3 16" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M8 16H3v5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function CheckBadgeIcon({ className = 'h-6 w-6' }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className={className}
        >
            <circle cx="12" cy="12" r="9" />
            <path d="m8.5 12.5 2.2 2.2 4.8-5.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function UserIcon({ className = 'h-5 w-5' }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className={className}
        >
            <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
            <path d="M4.5 20a7.5 7.5 0 0 1 15 0" strokeLinecap="round" />
        </svg>
    );
}

function AcademicIcon({ className = 'h-5 w-5' }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className={className}
        >
            <path d="m3 8.5 9-4 9 4-9 4-9-4Z" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M7 10.5V15c0 1.2 2.2 3 5 3s5-1.8 5-3v-4.5" strokeLinecap="round" />
        </svg>
    );
}

function IdCardIcon({ className = 'h-5 w-5' }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className={className}
        >
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <circle cx="9" cy="11" r="2" />
            <path d="M6.5 15c.7-1.3 1.8-2 2.5-2s1.8.7 2.5 2" strokeLinecap="round" />
            <path d="M14 10h4" strokeLinecap="round" />
            <path d="M14 14h3" strokeLinecap="round" />
        </svg>
    );
}

function AlertIcon({ className = 'h-6 w-6' }) {
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
                d="M12 3 2.7 19a1.2 1.2 0 0 0 1 1.8h16.6a1.2 1.2 0 0 0 1-1.8L12 3Z"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path d="M12 9v4.5" strokeLinecap="round" />
            <circle cx="12" cy="16.8" r="0.8" fill="currentColor" stroke="none" />
        </svg>
    );
}

function formatDate(dateString, options = { year: 'numeric', month: 'long', day: 'numeric' }) {
    if (!dateString) {
        return null;
    }

    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
        return dateString;
    }

    return date.toLocaleDateString(undefined, options);
}

function maskSensitiveValue(value) {
    if (!value) {
        return null;
    }

    const stringValue = String(value).trim();

    if (stringValue.length <= 4) {
        return stringValue;
    }

    return `${'*'.repeat(stringValue.length - 4)}${stringValue.slice(-4)}`;
}

function buildDetailRows(rows) {
    return rows.filter(([, value]) => value !== null && value !== undefined && value !== '');
}

function DetailGrid({ title, rows, icon = null, className = '' }) {
    const visibleRows = buildDetailRows(rows);

    if (!visibleRows.length) {
        return null;
    }

    return (
        <section className={`rounded-3xl border border-slate-200 bg-slate-50/80 p-5 sm:p-6 ${className}`}>
            <div className="flex items-center gap-2 border-b border-slate-200 pb-4">
                {icon}
                <h3 className="text-lg font-semibold text-blue-700">{title}</h3>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 sm:gap-4">
                {visibleRows.map(([label, value]) => (
                    <div key={label} className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                            {label}
                        </p>
                        <p className="mt-2 text-sm font-medium leading-6 text-slate-800 sm:text-base">
                            {value}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default function Verify({ certificate, reference_no, certificate_type }) {
    const { data, setData, get, processing, errors } = useForm({
        reference_no: reference_no || '',
    });
    const [activeTab, setActiveTab] = useState('learner');

    useEffect(() => {
        document
            .querySelectorAll('[aria-hidden="true"].fixed.inset-0')
            .forEach((element) => element.remove());

        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
    }, []);

    const submit = (e) => {
        e.preventDefault();
        get(route('certificates.search'));
    };

    const currentYear = new Date().getFullYear();
    const hasCertificate = certificate && certificate !== 0;
    const isPending = hasCertificate && String(certificate.status || '').toLowerCase() === 'pending';
    const isVerified = hasCertificate && !isPending;
    const registrationNumber =
        certificate_type === 'old' ? certificate?.student_id : certificate?.learner?.learner_id;
    const courseLabel =
        certificate_type === 'old'
            ? certificate?.course_name
            : certificate?.course?.name
              ? `${certificate.course.name}${certificate.course.code ? ` (${certificate.course.code})` : ''}`
              : null;
    const idType =
        certificate_type === 'old' ? certificate?.proof_type : certificate?.learner?.proof_type;
    const maskedIdNumber =
        certificate_type === 'old'
            ? maskSensitiveValue(certificate?.proof_id)
            : maskSensitiveValue(certificate?.learner?.proof_id);
    const learnerIdentification =
        idType && maskedIdNumber
            ? `${String(idType).toUpperCase()}: ${maskedIdNumber}`
            : maskedIdNumber || (idType ? String(idType).toUpperCase() : null);
    const gradingType = (() => {
        if (certificate_type === 'old') {
            return null;
        }

        const modulesData = certificate?.modules_data;
        let parsedModulesData = modulesData;

        if (typeof modulesData === 'string') {
            try {
                parsedModulesData = JSON.parse(modulesData || '{}');
            } catch {
                parsedModulesData = null;
            }
        }

        const years = parsedModulesData?.years || [];
        const modules = years.flatMap((year) => year?.modules || []);

        if (!modules.length) {
            return null;
        }

        const grades = modules.map((module) => String(module?.grade || '').toUpperCase());

        if (grades.includes('FAIL')) {
            return 'FAIL';
        }

        if (grades.every((grade) => grade === 'PASS')) {
            return 'PASS';
        }

        return 'PENDING';
    })();

    const learnerRows =
        certificate_type === 'old'
            ? [
                  ['Learner ID', certificate?.student_id],
                  ['Full Name', certificate?.student_name],
                  ['Gender', certificate?.gender],
                  ['Date of Birth', formatDate(certificate?.student_dob)],
                  ['Country', certificate?.country],
                  ['Identification', learnerIdentification ? String(learnerIdentification).toUpperCase() : null],
              ]
            : [
                  ['Learner ID', certificate?.learner?.learner_id],
                  ['Full Name', certificate?.learner?.full_name],
                  ['Gender', certificate?.gender || certificate?.learner?.gender],
                  ['Date of Birth', formatDate(certificate?.learner?.date_of_birth)],
                  ['Country', certificate?.country || certificate?.learner?.country],
                  ['Identification', learnerIdentification ? String(learnerIdentification).toUpperCase() : null],
              ];

    const academicRows =
        certificate_type === 'old'
            ? [
                  ['Course', certificate?.course_name],
                  ['Credits Earned', certificate?.cumulative_credits_earned],
                  ['Grading Type', gradingType],
                  ['Duration', certificate?.course_duration],
                  ['Start Date', formatDate(certificate?.course_start_date)],
                  ['End Date', formatDate(certificate?.course_end_date)],
                  ['Award Date', formatDate(certificate?.awarding_date)],
                  ['Awarding Institution', certificate?.center_name],
                  ['Status', certificate?.status],
              ]
            : [
                  ['Course', courseLabel],
                  ['Credits Earned', certificate?.cumulative_credits_earned],
                  ['Grading Type', gradingType],
                  ['Start Date', formatDate(certificate?.course_start_date)],
                  ['End Date', formatDate(certificate?.course_end_date)],
                  ['Award Date', formatDate(certificate?.awarding_date)],
                  ['Awarding Institution', certificate?.center_name],
                  ['Status', certificate?.status],
              ];

    return (
        <>
            <Head title="UKEE Certificate Verification" />

            <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,_#f8fbff_0%,_#eef4fb_48%,_#e7eef8_100%)] text-slate-900">
                <div className="pointer-events-none absolute inset-0">
                    <div className="absolute left-1/2 top-24 h-64 w-64 -translate-x-1/2 rounded-full bg-blue-100/40 blur-3xl" />
                    <div className="absolute bottom-12 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-slate-200/45 blur-3xl" />
                </div>

                <main className="relative mx-auto flex min-h-screen w-full max-w-7xl items-center justify-center px-4 py-8 sm:px-6 sm:py-10">
                    <div className="w-full max-w-5xl">
                        <div className="mb-8 text-center sm:mb-10">
                            <Link href="/" className="inline-flex">
                                <ApplicationLogo className="h-28 w-auto sm:h-32" />
                            </Link>

                            <h1 className="mt-5 text-3xl font-semibold tracking-tight text-slate-900 sm:mt-6 sm:text-4xl">
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
                                        <ResetIcon />
                                        Reset
                                    </button>
                                </div>
                            </form>
                        </section>

                        {certificate === 0 && (
                            <section className="mt-8 rounded-[30px] border border-red-200 bg-white/95 p-8 shadow-[0_18px_50px_rgba(15,23,42,0.1)]">
                                <div className="flex items-start gap-4">
                                    <div className="rounded-2xl bg-red-50 p-3 text-red-500">
                                        <AlertIcon />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-semibold text-red-700">
                                            Certificate Not Found
                                        </h3>
                                        <p className="mt-3 text-base leading-7 text-slate-600">
                                            The certificate with reference number{' '}
                                            <span className="font-semibold text-slate-800">
                                                {data.reference_no}
                                            </span>{' '}
                                            could not be found in our system. Please confirm that
                                            you are using the certificate reference number.
                                        </p>
                                    </div>
                                </div>
                            </section>
                        )}

                        {hasCertificate && isPending && (
                            <section className="mt-8 rounded-[30px] border border-amber-200 bg-white/95 p-8 shadow-[0_18px_50px_rgba(15,23,42,0.1)]">
                                <div className="flex items-start gap-4">
                                    <div className="rounded-2xl bg-amber-50 p-3 text-amber-500">
                                        <AlertIcon />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-semibold text-amber-700">
                                            Verification Pending
                                        </h3>
                                        <p className="mt-3 text-base leading-7 text-slate-600">
                                            The certificate with reference number{' '}
                                            <span className="font-semibold text-slate-800">
                                                {certificate.reference_no}
                                            </span>{' '}
                                            is currently pending verification. Please check again
                                            later or contact the institution for confirmation.
                                        </p>
                                    </div>
                                </div>
                            </section>
                        )}

                        {hasCertificate && isVerified && (
                            <section className="mt-8 rounded-[30px] border border-emerald-200 bg-white/95 p-4 shadow-[0_18px_50px_rgba(15,23,42,0.1)] sm:p-6 lg:p-8">
                                <div className="text-center">
                                    <h3 className="text-3xl font-semibold text-blue-700">
                                        Certificate Details
                                    </h3>
                                    <div className="mt-4 inline-flex rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 shadow-sm">
                                        {certificate.reference_no}
                                    </div>
                                    <div className="mx-auto mt-4 h-1 w-20 rounded-full bg-blue-600" />
                                </div>

                                <div className="mt-8 rounded-3xl border border-blue-100 bg-white p-5 shadow-sm sm:p-6">
                                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                                        <div className="flex min-w-0 items-start gap-3">
                                            <div className="mt-1 rounded-xl bg-blue-50 p-2 text-blue-600">
                                                <IdCardIcon />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-2xl font-semibold text-slate-900">
                                                    Registration:{' '}
                                                    <span className="text-blue-700">
                                                        {registrationNumber}
                                                    </span>
                                                </p>
                                                <p className="mt-2 text-sm uppercase tracking-[0.04em] text-slate-600 sm:text-base">
                                                    {courseLabel}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="inline-flex items-center gap-2 self-start rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700">
                                            <CheckBadgeIcon className="h-4 w-4" />
                                            Verified
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 flex flex-wrap justify-center gap-2 sm:gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setActiveTab('learner')}
                                        className={`inline-flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition ${
                                            activeTab === 'learner'
                                                ? 'border-blue-600 bg-blue-600 text-white shadow-lg shadow-blue-200'
                                                : 'border-slate-200 bg-white text-slate-700 hover:border-blue-200 hover:text-blue-700'
                                        }`}
                                    >
                                        <UserIcon className="h-4 w-4" />
                                        Learner Details
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setActiveTab('academic')}
                                        className={`inline-flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition ${
                                            activeTab === 'academic'
                                                ? 'border-blue-600 bg-blue-600 text-white shadow-lg shadow-blue-200'
                                                : 'border-slate-200 bg-white text-slate-700 hover:border-blue-200 hover:text-blue-700'
                                        }`}
                                    >
                                        <AcademicIcon className="h-4 w-4" />
                                        Academic Info
                                    </button>
                                </div>

                                <div className="mt-6">
                                    {activeTab === 'learner' ? (
                                        <DetailGrid
                                            title="Learner Information"
                                            rows={learnerRows}
                                            icon={<UserIcon className="h-5 w-5 text-blue-600" />}
                                        />
                                    ) : (
                                        <DetailGrid
                                            title="Academic Information"
                                            rows={academicRows}
                                            icon={<AcademicIcon className="h-5 w-5 text-blue-600" />}
                                        />
                                    )}
                                </div>

                                <div className="mt-6 rounded-3xl border border-blue-100 bg-blue-50/80 p-5 sm:p-6">
                                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-700">
                                        Verification Note
                                    </p>
                                    <p className="mt-2 text-sm leading-7 text-slate-600 sm:text-base">
                                        This certificate has been verified as authentic. For any
                                        additional verification requirements, please contact the
                                        institution directly.
                                    </p>
                                </div>
                            </section>
                        )}

                        <footer className="mt-10 text-center text-slate-600">
                            <p className="text-lg font-medium">UKEE &copy; {currentYear}</p>
                            <p className="mt-2 text-base">Secure Certificate Verification System</p>
                        </footer>
                    </div>
                </main>
            </div>
        </>
    );
}
