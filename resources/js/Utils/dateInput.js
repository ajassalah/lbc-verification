const DATE_FIELDS = [
    'course_start_date',
    'course_end_date',
    'date_of_exam',
    'awarding_date',
    'completion_letter_date',
];

export const certificateDateFields = DATE_FIELDS;

export const formatDateForDisplay = (value) => {
    if (!value) return '';

    const match = String(value).match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (match) return `${match[3]}/${match[2]}/${match[1]}`;

    return String(value);
};

export const formatDateInput = (value) => {
    const rawValue = String(value || '');

    if (/^\d{4}-\d{2}-\d{2}/.test(rawValue)) {
        return formatDateForDisplay(rawValue);
    }

    const digits = rawValue.replace(/\D/g, '').slice(0, 8);

    if (digits.length <= 2) return digits;
    if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;

    return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
};

export const formatDateForSubmission = (value) => {
    const match = String(value || '').match(/^(\d{2})\/(\d{2})\/(\d{4})$/);

    return match ? `${match[3]}-${match[2]}-${match[1]}` : value;
};
