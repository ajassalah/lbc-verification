import { useState, useEffect } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import { motion } from "framer-motion";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import InputError from "@/Components/InputError";
import SelectInput from "@/Components/SelectInput";
import TextareaInput from "@/Components/TextareaInput";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import SearchableSelect from "@/Components/SearchableSelect";

export default function Create({
    auth,
    genderOptions,
    proofTypeOptions,
    countryOptions,
    nationalityOptions = [],
    nationalityDialCodes = {},
    nextLearnerId,
}) {
    const allowManualLearnerId = Boolean(auth.user?.allow_manual_learner_id);
    const [previewUrl, setPreviewUrl] = useState(null); const { data, setData, post, processing, errors, reset } = useForm({
        prefix: "",
        full_name: "",
        name_with_initials: "",
        date_of_birth: "",
        profile_picture: "",
        gender: "",
        email: "",
        learner_id: allowManualLearnerId ? "" : (nextLearnerId || ""),
        proof_type: "",
        proof_id: "",
        id_proof_document: "",
        cv_document: "",
        phone_no: "",
        address_line_1: "",
        address_line_2: "",
        city: "",
        state: "",
        postal_code: "",
        country: "",
        nationality: "",
    });

    const phoneDialCodes = Object.values(nationalityDialCodes)
        .filter(Boolean)
        .sort((a, b) => b.length - a.length);

    const proofIdLabel = data.proof_type ? `${data.proof_type} Number *` : "ID Number *";

    const applyDialCodeToPhone = (phoneNumber, dialCode) => {
        if (!dialCode) {
            return phoneNumber;
        }

        const trimmedPhoneNumber = String(phoneNumber || "").trim();
        const existingDialCode = phoneDialCodes.find((code) => trimmedPhoneNumber.startsWith(code));
        const localNumber = existingDialCode
            ? trimmedPhoneNumber.slice(existingDialCode.length).trimStart()
            : trimmedPhoneNumber;

        return localNumber ? `${dialCode} ${localNumber}` : `${dialCode} `;
    };

    const handleNationalityChange = (nationality) => {
        const dialCode = nationalityDialCodes[nationality] || "";

        setData({
            ...data,
            nationality,
            phone_no: applyDialCodeToPhone(data.phone_no, dialCode),
        });
    };

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                duration: 0.5,
                when: "beforeChildren",
                staggerChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.4 },
        },
    };

    const buttonVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: { duration: 0.3, delay: 0.3 },
        },
        hover: {
            scale: 1.05,
            transition: { duration: 0.2 },
        },
    };

    // Update field in form data
    const handleChange = (field, value) => {
        setData(field, value);
    };

    // Handle profile picture change
    const handleProfilePictureChange = (e) => {
        const file = e.target.files[0];

        if (file) {
            setData("profile_picture", file);

            // Create preview URL
            const reader = new FileReader();
            reader.onload = (e) => {
                setPreviewUrl(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // Handle ID proof document change
    const handleIdProofDocumentChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData("id_proof_document", file);
        }
    };

    // Handle CV document change
    const handleCVDocumentChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData("cv_document", file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("learners.store"));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Create New Learner
                    </h2>
                </div>
            }
        >
            <Head title="Create Learner" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <motion.div
                        className="bg-white overflow-hidden shadow-sm sm:rounded-lg"
                        initial="hidden"
                        animate="visible"
                        variants={containerVariants}
                    >
                        <div className="p-6 bg-white border-b border-gray-200">
                            <form
                                onSubmit={handleSubmit}
                                encType="multipart/form-data"
                            >
                                {" "}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Profile Picture Section - Moved to the top */}
                                    <motion.div
                                        variants={itemVariants}
                                        className="md:col-span-2 mb-6"
                                    >
                                        <h3 className="text-lg font-medium text-gray-900 border-b pb-2 mb-4">
                                            Profile Picture
                                        </h3>
                                        <div className="flex flex-col items-center">
                                            <div className="w-40 h-40 rounded-full overflow-hidden bg-gray-100 mb-4 flex items-center justify-center">
                                                {previewUrl ? (
                                                    <img
                                                        src={previewUrl}
                                                        alt="Profile preview"
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <span className="text-gray-400 text-5xl">
                                                        <i className="fas fa-user"></i>
                                                    </span>
                                                )}
                                            </div>
                                            <div>
                                                <input
                                                    type="file"
                                                    id="profile_picture"
                                                    className="hidden"
                                                    onChange={
                                                        handleProfilePictureChange
                                                    }
                                                    accept="image/jpeg,image/png,image/jpg"
                                                />
                                                <label
                                                    htmlFor="profile_picture"
                                                    className="inline-block px-4 py-2 bg-gray-200 text-gray-800 rounded cursor-pointer hover:bg-gray-300 transition"
                                                >
                                                    Choose Image
                                                </label>
                                                <InputError
                                                    message={
                                                        errors.profile_picture
                                                    }
                                                    className="mt-2"
                                                />
                                            </div>
                                        </div>
                                    </motion.div>

                                    {/* Personal Info Section */}
                                    <motion.div
                                        className="md:col-span-2 mb-6"
                                        variants={itemVariants}
                                    >
                                        <h3 className="text-lg font-medium text-gray-900 border-b pb-2 mb-4">
                                            Personal Information
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            {/* Learner ID */}
                                            <div>
                                                <InputLabel
                                                    htmlFor="learner_id"
                                                    value="Learner Number /Reference *"
                                                />
                                                <TextInput
                                                    id="learner_id"
                                                    type="text"
                                                    className={`mt-1 block w-full ${allowManualLearnerId ? "" : "bg-gray-100"}`}
                                                    value={data.learner_id}
                                                    onChange={(e) =>
                                                        handleChange(
                                                            "learner_id",
                                                            e.target.value
                                                        )
                                                    }
                                                    readOnly={!allowManualLearnerId}
                                                    required
                                                />
                                                <InputError
                                                    message={errors.learner_id}
                                                    className="mt-2"
                                                />
                                            </div>

                                            {/* Prefix */}
                                            <div>
                                                <InputLabel
                                                    htmlFor="prefix"
                                                    value="Prefix"
                                                />
                                                <SelectInput
                                                    id="prefix"
                                                    className="mt-1 block w-full"
                                                    value={data.prefix}
                                                    onChange={(e) =>
                                                        handleChange(
                                                            "prefix",
                                                            e.target.value
                                                        )
                                                    }
                                                >
                                                    <option value="">Select Prefix</option>
                                                    <option value="Mr.">Mr.</option>
                                                    <option value="Mrs.">Mrs.</option>
                                                    <option value="Ms.">Ms.</option>
                                                    <option value="Dr.">Dr.</option>
                                                    <option value="Prof.">Prof.</option>
                                                </SelectInput>
                                                <InputError
                                                    message={errors.prefix}
                                                    className="mt-2"
                                                />
                                            </div>

                                            {/* Full Name */}
                                            <div className="md:col-span-2">
                                                <InputLabel
                                                    htmlFor="full_name"
                                                    value="Full Name *"
                                                />
                                                <TextInput
                                                    id="full_name"
                                                    type="text"
                                                    className="mt-1 block w-full"
                                                    value={data.full_name}
                                                    onChange={(e) =>
                                                        handleChange(
                                                            "full_name",
                                                            e.target.value
                                                        )
                                                    }
                                                    required
                                                />
                                                <InputError
                                                    message={errors.full_name}
                                                    className="mt-2"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                            {/* Name with Initials */}
                                            <div>
                                                <InputLabel
                                                    htmlFor="name_with_initials"
                                                    value="Name with Initials *"
                                                />
                                                <TextInput
                                                    id="name_with_initials"
                                                    type="text"
                                                    className="mt-1 block w-full"
                                                    value={
                                                        data.name_with_initials
                                                    }
                                                    onChange={(e) =>
                                                        handleChange(
                                                            "name_with_initials",
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder="J. R. Smith"
                                                    required
                                                />
                                                <InputError
                                                    message={
                                                        errors.name_with_initials
                                                    }
                                                    className="mt-2"
                                                />
                                            </div>

                                            {/* Date of Birth */}
                                            <div>
                                                <InputLabel
                                                    htmlFor="date_of_birth"
                                                    value="Date of Birth *"
                                                />
                                                <TextInput
                                                    id="date_of_birth"
                                                    type="date"
                                                    className="mt-1 block w-full"
                                                    value={data.date_of_birth}
                                                    onChange={(e) =>
                                                        handleChange(
                                                            "date_of_birth",
                                                            e.target.value
                                                        )
                                                    }
                                                    required
                                                />
                                                <InputError
                                                    message={
                                                        errors.date_of_birth
                                                    }
                                                    className="mt-2"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                            {/* Gender */}
                                            <div>
                                                <InputLabel
                                                    htmlFor="gender"
                                                    value="Gender *"
                                                />
                                                <SelectInput
                                                    id="gender"
                                                    className="mt-1 block w-full"
                                                    value={data.gender}
                                                    onChange={(e) =>
                                                        handleChange(
                                                            "gender",
                                                            e.target.value
                                                        )
                                                    }
                                                    required
                                                >
                                                    <option value="">
                                                        Select Gender
                                                    </option>
                                                    {genderOptions.map(
                                                        (gender, index) => (
                                                            <option
                                                                key={index}
                                                                value={gender}
                                                            >
                                                                {gender}
                                                            </option>
                                                        )
                                                    )}
                                                </SelectInput>
                                                <InputError
                                                    message={errors.gender}
                                                    className="mt-2"
                                                />
                                            </div>

                                            {/* Email */}
                                            <div>
                                                <InputLabel
                                                    htmlFor="email"
                                                    value="Email *"
                                                />
                                                <TextInput
                                                    id="email"
                                                    type="email"
                                                    className="mt-1 block w-full"
                                                    value={data.email}
                                                    onChange={(e) =>
                                                        handleChange(
                                                            "email",
                                                            e.target.value
                                                        )
                                                    }
                                                    required
                                                />
                                                <InputError
                                                    message={errors.email}
                                                    className="mt-2"
                                                />
                                            </div>

                                        </div>
                                    </motion.div>

                                    {/* Identification Section */}
                                    <motion.div
                                        variants={itemVariants}
                                        className="md:col-span-2"
                                    >
                                        <h3 className="text-lg font-medium text-gray-900 border-b pb-2 mb-4">
                                            Identification
                                        </h3>
                                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                                            {/* Phone Number */}
                                            <div>
                                                <InputLabel
                                                    htmlFor="phone_no"
                                                    value="Phone Number"
                                                />
                                                <TextInput
                                                    id="phone_no"
                                                    type="text"
                                                    className="mt-1 block w-full"
                                                    value={data.phone_no}
                                                    onChange={(e) =>
                                                        handleChange(
                                                            "phone_no",
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                                <InputError
                                                    message={errors.phone_no}
                                                    className="mt-2"
                                                />
                                            </div>

                                            {/* Proof Type */}
                                            <div>
                                                <InputLabel
                                                    htmlFor="proof_type"
                                                    value="ID Type *"
                                                />
                                                <SelectInput
                                                    id="proof_type"
                                                    className="mt-1 block w-full"
                                                    value={data.proof_type}
                                                    onChange={(e) =>
                                                        handleChange(
                                                            "proof_type",
                                                            e.target.value
                                                        )
                                                    }
                                                    required
                                                >
                                                    <option value="">
                                                        Select ID Type
                                                    </option>
                                                    {proofTypeOptions.map(
                                                        (type, index) => (
                                                            <option
                                                                key={index}
                                                                value={type}
                                                            >
                                                                {type}
                                                            </option>
                                                        )
                                                    )}
                                                </SelectInput>
                                                <InputError
                                                    message={errors.proof_type}
                                                    className="mt-2"
                                                />
                                            </div>

                                            {/* Proof ID */}
                                            <div>
                                                <InputLabel
                                                    htmlFor="proof_id"
                                                    value={proofIdLabel}
                                                />
                                                <TextInput
                                                    id="proof_id"
                                                    type="text"
                                                    className="mt-1 block w-full"
                                                    value={data.proof_id}
                                                    onChange={(e) =>
                                                        handleChange(
                                                            "proof_id",
                                                            e.target.value
                                                        )
                                                    }
                                                    required
                                                />
                                                <InputError
                                                    message={errors.proof_id}
                                                    className="mt-2"
                                                />
                                            </div>
                                        </div>
                                    </motion.div>

                                    {/* Documents Section */}
                                    <motion.div
                                        variants={itemVariants}
                                        className="md:col-span-2"
                                    >
                                        <h3 className="text-lg font-medium text-gray-900 border-b pb-2 mb-4">
                                            Document Uploads
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {/* ID Proof Document */}
                                            <div>
                                                <InputLabel
                                                    htmlFor="id_proof_document"
                                                    value="ID Proof Document"
                                                />
                                                <div className="mt-1">
                                                    <input
                                                        type="file"
                                                        id="id_proof_document"
                                                        className="block w-full text-sm text-gray-500
                                                            file:mr-4 file:py-2 file:px-4
                                                            file:rounded file:border-0
                                                            file:text-sm file:font-semibold
                                                            file:bg-gray-200 file:text-gray-700
                                                            hover:file:bg-gray-300"
                                                        onChange={handleIdProofDocumentChange}
                                                        accept="application/pdf,image/png,image/jpeg,image/jpg"
                                                    />
                                                </div>
                                                <p className="mt-1 text-sm text-gray-500">Upload PDF, PNG, or JPEG maximum 20MB</p>
                                                <InputError
                                                    message={errors.id_proof_document}
                                                    className="mt-2"
                                                />
                                            </div>

                                            {/* CV Document */}
                                            <div>
                                                <InputLabel
                                                    htmlFor="cv_document"
                                                    value="CV/Resume"
                                                />
                                                <div className="mt-1">
                                                    <input
                                                        type="file"
                                                        id="cv_document"
                                                        className="block w-full text-sm text-gray-500
                                                            file:mr-4 file:py-2 file:px-4
                                                            file:rounded file:border-0
                                                            file:text-sm file:font-semibold
                                                            file:bg-gray-200 file:text-gray-700
                                                            hover:file:bg-gray-300"
                                                        onChange={handleCVDocumentChange}
                                                        accept="application/pdf,image/png,image/jpeg,image/jpg"
                                                    />
                                                </div>
                                                <p className="mt-1 text-sm text-gray-500">Upload PDF, PNG, or JPEG maximum 20MB</p>
                                                <InputError
                                                    message={errors.cv_document}
                                                    className="mt-2"
                                                />
                                            </div>
                                        </div>
                                    </motion.div>

                                    {/* Address Section */}
                                    <motion.div
                                        variants={itemVariants}
                                        className="md:col-span-2"
                                    >
                                        <h3 className="text-lg font-medium text-gray-900 border-b pb-2 mb-4">
                                            Address Information
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {/* Address Line 1 */}
                                            <div className="col-span-2">
                                                <InputLabel
                                                    htmlFor="address_line_1"
                                                    value="Address Line 1"
                                                />
                                                <TextInput
                                                    id="address_line_1"
                                                    type="text"
                                                    className="mt-1 block w-full"
                                                    value={data.address_line_1}
                                                    onChange={(e) =>
                                                        handleChange(
                                                            "address_line_1",
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                                <InputError
                                                    message={
                                                        errors.address_line_1
                                                    }
                                                    className="mt-2"
                                                />
                                            </div>

                                            {/* Address Line 2 */}
                                            <div className="col-span-2">
                                                <InputLabel
                                                    htmlFor="address_line_2"
                                                    value="Address Line 2"
                                                />
                                                <TextInput
                                                    id="address_line_2"
                                                    type="text"
                                                    className="mt-1 block w-full"
                                                    value={data.address_line_2}
                                                    onChange={(e) =>
                                                        handleChange(
                                                            "address_line_2",
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                                <InputError
                                                    message={
                                                        errors.address_line_2
                                                    }
                                                    className="mt-2"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                            {/* City */}
                                            <div>
                                                <InputLabel
                                                    htmlFor="city"
                                                    value="City"
                                                />
                                                <TextInput
                                                    id="city"
                                                    type="text"
                                                    className="mt-1 block w-full"
                                                    value={data.city}
                                                    onChange={(e) =>
                                                        handleChange(
                                                            "city",
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                                <InputError
                                                    message={errors.city}
                                                    className="mt-2"
                                                />
                                            </div>

                                            {/* State/Province */}
                                            <div>
                                                <InputLabel
                                                    htmlFor="state"
                                                    value="State/Province"
                                                />
                                                <TextInput
                                                    id="state"
                                                    type="text"
                                                    className="mt-1 block w-full"
                                                    value={data.state}
                                                    onChange={(e) =>
                                                        handleChange(
                                                            "state",
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                                <InputError
                                                    message={errors.state}
                                                    className="mt-2"
                                                />
                                            </div>

                                            {/* Postal Code */}
                                            <div>
                                                <InputLabel
                                                    htmlFor="postal_code"
                                                    value="Postal/ZIP Code"
                                                />
                                                <TextInput
                                                    id="postal_code"
                                                    type="text"
                                                    className="mt-1 block w-full"
                                                    value={data.postal_code}
                                                    onChange={(e) =>
                                                        handleChange(
                                                            "postal_code",
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                                <InputError
                                                    message={errors.postal_code}
                                                    className="mt-2"
                                                />
                                            </div>
                                            <div>
                                                <InputLabel
                                                    htmlFor="nationality"
                                                    value="Nationality"
                                                />
                                                <SearchableSelect
                                                    id="nationality"
                                                    className="mt-1 block w-full"
                                                    value={data.nationality}
                                                    options={nationalityOptions}
                                                    placeholder="Select Nationality"
                                                    searchPlaceholder="Search nationalities..."
                                                    noOptionsText="No nationalities found"
                                                    onChange={handleNationalityChange}
                                                />
                                                <InputError
                                                    message={errors.nationality}
                                                    className="mt-2"
                                                />
                                            </div>
                                        </div>
                                    </motion.div>
                                </div>
                                {/* Action Buttons */}
                                <motion.div
                                    className="flex items-center justify-end mt-6 gap-4"
                                    variants={itemVariants}
                                >
                                    <Link href={route("learners.index")}>
                                        <SecondaryButton>
                                            Cancel
                                        </SecondaryButton>
                                    </Link>
                                    <motion.div
                                        variants={buttonVariants}
                                        whileHover="hover"
                                    >
                                        <PrimaryButton
                                            type="submit"
                                            className="ml-4"
                                            disabled={processing}
                                        >
                                            {processing
                                                ? "Creating..."
                                                : "Create Learner"}
                                        </PrimaryButton>
                                    </motion.div>
                                </motion.div>
                            </form>
                        </div>
                    </motion.div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
