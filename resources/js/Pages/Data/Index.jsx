import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, router, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    AcademicCapIcon,
    CircleStackIcon,
    PlusIcon,
    SparklesIcon,
    TrashIcon,
} from '@heroicons/react/24/outline';

const optionLabels = {
    course_faculty: 'Faculty',
    module_level: 'Module Level',
};

function OptionSection({ title, type, values, placeholder, canDelete }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        type,
        value: '',
    });
    const [deletingValue, setDeletingValue] = useState(null);

    const submit = (event) => {
        event.preventDefault();

        post(route('data-options.store'), {
            preserveScroll: true,
            onSuccess: () => reset('value'),
        });
    };

    const destroy = (value) => {
        setDeletingValue(value);
        router.delete(route('data-options.destroy'), {
            data: { type, value },
            preserveScroll: true,
            onFinish: () => setDeletingValue(null),
        });
    };

    return (
        <section className="border border-gray-200 rounded-lg bg-white">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between gap-4">
                <div>
                    <h3 className="text-base font-semibold text-gray-900">{title}</h3>
                    <p className="text-sm text-gray-500">{optionLabels[type]} options used in course setup.</p>
                </div>
                <CircleStackIcon className="h-5 w-5 text-blue-500 shrink-0" />
            </div>

            <div className="p-5">
                <form onSubmit={submit} className="flex flex-col sm:flex-row gap-3">
                    <TextInput
                        value={data.value}
                        onChange={(event) => setData('value', event.target.value)}
                        placeholder={placeholder}
                        className="w-full"
                    />
                    <PrimaryButton disabled={processing || !data.value.trim()} className="justify-center">
                        <PlusIcon className="h-4 w-4 mr-2" />
                        Add
                    </PrimaryButton>
                </form>
                <InputError message={errors.value || errors.type} className="mt-2" />

                <div className="mt-4 flex flex-wrap gap-2">
                    {values.length > 0 ? values.map((value) => (
                        <span
                            key={value}
                            className="inline-flex items-center gap-2 rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm font-medium text-gray-700"
                        >
                            {value}
                            {canDelete && (
                                <button
                                    type="button"
                                    onClick={() => destroy(value)}
                                    disabled={deletingValue === value}
                                    className="text-red-500 hover:text-red-700 disabled:opacity-50"
                                    aria-label={`Delete ${value}`}
                                >
                                    <TrashIcon className="h-4 w-4" />
                                </button>
                            )}
                        </span>
                    )) : (
                        <p className="text-sm text-gray-500">No options added yet.</p>
                    )}
                </div>
            </div>
        </section>
    );
}

export default function Index({ auth, options = {} }) {
    const courseFaculty = options.course_faculty || [];
    const moduleLevels = options.module_level || [];
    const isAdmin = auth.user?.role === 'admin';

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl leading-tight">Data</h2>}
        >
            <Head title="Data" />

            <motion.div
                className="py-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.25 }}
            >
                <div className="max-w-7xl mx-auto space-y-6">
                    <section className="bg-white border border-gray-200 rounded-lg p-5">
                        <div className="flex items-start gap-4">
                            <div className="rounded-md bg-blue-50 p-3">
                                <SparklesIcon className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="text-base font-semibold text-gray-900">Auto Generation</h3>
                                <p className="mt-1 text-sm text-gray-600">
                                    Learner IDs and certificate reference numbers are generated automatically by default. Manual entry is controlled per user in the Users section.
                                </p>
                            </div>
                        </div>
                    </section>

                    <OptionSection
                        title="Faculty"
                        type="course_faculty"
                        values={courseFaculty}
                        placeholder="Add course faculty"
                        canDelete={isAdmin}
                    />

                    <section>
                        <div className="py-2 flex items-center gap-3">
                            <AcademicCapIcon className="h-5 w-5 text-blue-600" />
                            <h3 className="text-base font-semibold text-gray-900">Level Section</h3>
                        </div>
                        <div className="mt-3 grid grid-cols-1 xl:grid-cols-2 gap-5">
                            <OptionSection
                                title="Module Level"
                                type="module_level"
                                values={moduleLevels}
                                placeholder="Add module level"
                                canDelete={isAdmin}
                            />
                        </div>
                    </section>
                </div>
            </motion.div>
        </AuthenticatedLayout>
    );
}
