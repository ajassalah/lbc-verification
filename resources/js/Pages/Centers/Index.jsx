import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Dropdown from '@/Components/Dropdown';
import Pagination from '@/Components/Pagination';
import { Head, Link, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    BuildingOffice2Icon,
    EllipsisVerticalIcon,
    MagnifyingGlassIcon,
    PencilSquareIcon,
    PlusIcon,
    TrashIcon,
    XMarkIcon,
} from '@heroicons/react/24/outline';
import { useState } from 'react';

export default function Index({ auth, centers, params = {} }) {
    const [search, setSearch] = useState(params.search || '');
    const isAdmin = auth.user?.role === 'admin';

    const deleteCenter = (center) => {
        if (!window.confirm(`Delete center "${center.name}"?`)) {
            return;
        }

        router.delete(route('centers.destroy', center.id));
    };

    const submitSearch = (e) => {
        e.preventDefault();

        router.get(
            route('centers.index'),
            { ...params, search, page: 1 },
            { preserveState: true, preserveScroll: true }
        );
    };

    const clearSearch = () => {
        setSearch('');
        router.get(
            route('centers.index'),
            { ...params, search: '', page: 1 },
            { preserveState: true, preserveScroll: true }
        );
    };

    const totalCenters = centers.total ?? centers.data.length;

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Centers</h2>}
        >
            <Head title="Centers" />

            <motion.div
                className="py-8 sm:py-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.35 }}
            >
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="overflow-visible rounded-3xl bg-white p-4 shadow-sm ring-1 ring-blue-100 sm:p-6 lg:p-8">
                        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-700 via-blue-600 to-sky-500 p-6 text-white shadow-lg sm:p-8">
                            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10" />
                            <div className="absolute bottom-0 right-16 h-24 w-24 rounded-full bg-sky-200/20" />

                            <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                                <div>
                                    <div className="mb-4 inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-xs font-bold uppercase tracking-widest">
                                        <BuildingOffice2Icon className="mr-2 h-4 w-4" />
                                        Center Management
                                    </div>
                                    <h3 className="text-2xl font-bold sm:text-3xl">All Centers</h3>
                                    <p className="mt-2 max-w-2xl text-sm font-medium text-blue-50">
                                        Manage center names and numbers used in certificate information and PDF output.
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-3 sm:flex sm:items-center">
                                    <div className="rounded-2xl bg-white/15 px-5 py-4 backdrop-blur">
                                        <p className="text-xs font-semibold uppercase tracking-wider text-blue-100">Total Centers</p>
                                        <p className="mt-1 text-3xl font-black">{totalCenters}</p>
                                    </div>

                                    <Link
                                        href={route('centers.create')}
                                        className="inline-flex items-center justify-center rounded-2xl bg-white px-5 py-4 text-sm font-bold uppercase tracking-wide text-blue-700 shadow-md transition hover:bg-blue-50"
                                    >
                                        <PlusIcon className="mr-2 h-5 w-5" />
                                        Add Center
                                    </Link>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <form onSubmit={submitSearch} className="relative w-full md:max-w-md">
                                <MagnifyingGlassIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-blue-400" />
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search by center name or number..."
                                    className="w-full rounded-2xl border border-blue-100 bg-blue-50/60 py-3 pl-12 pr-12 text-sm font-medium text-blue-950 shadow-sm transition focus:border-blue-400 focus:bg-white focus:ring-blue-400"
                                />
                                {search && (
                                    <button
                                        type="button"
                                        onClick={clearSearch}
                                        className="absolute right-3 top-1/2 rounded-full p-1 text-blue-400 transition hover:bg-blue-100 hover:text-blue-700 -translate-y-1/2"
                                    >
                                        <XMarkIcon className="h-5 w-5" />
                                    </button>
                                )}
                            </form>

                            <p className="text-sm font-medium text-slate-500">
                                {centers.data.length} center{centers.data.length === 1 ? '' : 's'} shown
                            </p>
                        </div>

                        {centers.data.length === 0 ? (
                            <div className="mt-8 rounded-3xl border-2 border-dashed border-blue-100 bg-blue-50/50 px-6 py-16 text-center">
                                <BuildingOffice2Icon className="mx-auto h-14 w-14 text-blue-300" />
                                <h4 className="mt-4 text-lg font-bold text-blue-950">No centers found</h4>
                                <p className="mt-2 text-sm text-slate-500">
                                    Add a center or adjust your search to see results here.
                                </p>
                            </div>
                        ) : (
                            <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                                {centers.data.map((center, index) => (
                                    <motion.div
                                        key={center.id}
                                        className="group relative overflow-visible rounded-3xl border border-blue-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl"
                                        initial={{ opacity: 0, y: 16 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3, delay: index * 0.04 }}
                                    >
                                        <div className="absolute inset-x-0 top-0 h-1 rounded-t-3xl bg-gradient-to-r from-blue-600 via-sky-400 to-orange-400" />

                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex min-w-0 items-center gap-4">
                                                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-700 ring-1 ring-blue-100">
                                                    <BuildingOffice2Icon className="h-7 w-7" />
                                                </div>
                                                <div className="min-w-0">
                                                    <h4 className="truncate text-base font-black text-blue-950">
                                                        {center.name}
                                                    </h4>
                                                    <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-slate-400">
                                                        Center Name
                                                    </p>
                                                </div>
                                            </div>

                                            <Dropdown>
                                                <Dropdown.Trigger>
                                                    <button className="rounded-full p-2 text-slate-400 transition hover:bg-blue-50 hover:text-blue-700">
                                                        <EllipsisVerticalIcon className="h-5 w-5" />
                                                    </button>
                                                </Dropdown.Trigger>
                                                <Dropdown.Content width="48" align="right">
                                                    <Dropdown.Link
                                                        href={route('centers.edit', center.id)}
                                                        className="flex items-center text-blue-700"
                                                    >
                                                        <PencilSquareIcon className="h-4 w-4 mr-2" />
                                                        Edit
                                                    </Dropdown.Link>
                                                    {isAdmin && (
                                                        <button
                                                            type="button"
                                                            onClick={() => deleteCenter(center)}
                                                            className="flex w-full items-center px-4 py-2 text-start text-sm leading-5 text-red-600 transition duration-150 ease-in-out hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                                                        >
                                                            <TrashIcon className="h-4 w-4 mr-2" />
                                                            Delete
                                                        </button>
                                                    )}
                                                </Dropdown.Content>
                                            </Dropdown>
                                        </div>

                                        <div className="mt-6 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-100">
                                            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                                Center Number
                                            </p>
                                            <p className="mt-2 break-words text-xl font-black text-slate-900">
                                                {center.number}
                                            </p>
                                        </div>

                                        <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                                            <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-700 ring-1 ring-green-100">
                                                Active
                                            </span>
                                            <Link
                                                href={route('centers.edit', center.id)}
                                                className="text-sm font-bold text-blue-700 transition hover:text-blue-900"
                                            >
                                                Edit Center
                                            </Link>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}

                        {centers.links && centers.data.length > 0 && (
                            <div className="mt-8 flex justify-end">
                                <Pagination links={centers.links} params={params} />
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>
        </AuthenticatedLayout>
    );
}
