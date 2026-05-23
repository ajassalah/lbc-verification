import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';

export default function Edit({ auth, center }) {
    const { data, setData, put, processing, errors } = useForm({
        name: center.name || '',
        number: center.number || '',
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('centers.update', center.id));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl leading-tight">Edit Center</h2>}
        >
            <Head title="Edit Center" />

            <motion.div
                className="py-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <motion.div
                        className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.4, delay: 0.2 }}
                    >
                        <form onSubmit={submit} className="space-y-6">
                            <h3 className="text-lg font-semibold border-b pb-2">Center Details</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <InputLabel htmlFor="name" value="Center Name" />
                                    <TextInput
                                        id="name"
                                        value={data.name}
                                        className="mt-1 block w-full"
                                        onChange={(e) => setData('name', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.name} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="number" value="Center Number" />
                                    <TextInput
                                        id="number"
                                        value={data.number}
                                        className="mt-1 block w-full"
                                        onChange={(e) => setData('number', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.number} className="mt-2" />
                                </div>
                            </div>

                            <div className="flex justify-end gap-3">
                                <Link href={route('centers.index')}>
                                    <SecondaryButton type="button">Cancel</SecondaryButton>
                                </Link>
                                <PrimaryButton disabled={processing}>Update Center</PrimaryButton>
                            </div>
                        </form>
                    </motion.div>
                </div>
            </motion.div>
        </AuthenticatedLayout>
    );
}
