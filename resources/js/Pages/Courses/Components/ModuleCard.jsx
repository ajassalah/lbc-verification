import React from 'react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import { motion } from 'framer-motion';
import { TrashIcon } from '@heroicons/react/24/outline';

const ModuleCard = ({ index, module, updateModule, removeModule, errors, levelOptions = [], canRemove = true }) => {
    const moduleErrors = {};

    // Format errors from Laravel's nested array format to match the module
    for (const key in errors) {
        if (key.startsWith(`modules.${index}.`)) {
            const shortKey = key.replace(`modules.${index}.`, '');
            moduleErrors[shortKey] = errors[key];
        }
    } const handleChange = (field, value) => {
        updateModule(index, { ...module, [field]: value });
    };

    // Animation variants
    const moduleCardVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: { duration: 0.4 }
        }
    };

    return (
        <motion.div
            className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mb-6"
            variants={moduleCardVariants}
            initial="hidden"
            animate="visible"
        >
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Module {index + 1}</h3>
                {canRemove && (
                    <button
                        type="button"
                        className="text-red-500 hover:text-red-700 transition-colors"
                        onClick={() => removeModule(index)}
                    >
                        <TrashIcon className="w-5 h-5" />
                    </button>
                )}
            </div>            {/* Unit Reference, Units, and Name */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-1">
                    <InputLabel htmlFor={`module-code-${index}`} value="Unit Reference" />
                    <TextInput
                        id={`module-code-${index}`}
                        value={module.code || ''}
                        className="mt-1 block w-full"
                        onChange={(e) => handleChange('code', e.target.value)}
                        placeholder="LBC/2/M1D1"
                    />
                    <InputError message={moduleErrors.code} className="mt-1" />
                </div>

                <div className="md:col-span-1">
                    <InputLabel htmlFor={`module-level-${index}`} value="Units" />
                    <select
                        id={`module-level-${index}`}
                        value={module.level || ''}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        onChange={(e) => handleChange('level', e.target.value)}
                    >
                        <option value="">Select Units</option>
                        {levelOptions.map((level) => (
                            <option key={level} value={level}>
                                {level}
                            </option>
                        ))}
                    </select>
                    <InputError message={moduleErrors.level} className="mt-1" />
                </div>

                <div className="md:col-span-2">
                    <InputLabel htmlFor={`module-name-${index}`} value="Name" />
                    <TextInput
                        id={`module-name-${index}`}
                        value={module.name || ''}
                        className="mt-1 block w-full"
                        onChange={(e) => handleChange('name', e.target.value)}
                        placeholder="Module Name"
                    />
                    <InputError message={moduleErrors.name} className="mt-1" />
                </div>
            </div>
        </motion.div>
    );
};

export default ModuleCard;
