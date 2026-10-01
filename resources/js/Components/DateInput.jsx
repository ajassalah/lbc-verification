import { useRef } from 'react';
import TextInput from '@/Components/TextInput';
import { formatDateForDisplay, formatDateForSubmission } from '@/Utils/dateInput';

export default function DateInput({ value = '', onChange, ...props }) {
    const datePickerRef = useRef(null);
    const nativeValue = formatDateForSubmission(value);

    const openDatePicker = () => {
        if (datePickerRef.current?.showPicker) {
            datePickerRef.current.showPicker();
        } else {
            datePickerRef.current?.click();
        }
    };

    return (
        <div className="relative">
            <TextInput
                {...props}
                type="text"
                value={value}
                onChange={(event) => onChange(event.target.value)}
                placeholder="dd/mm/yyyy"
                inputMode="numeric"
                maxLength={10}
                className={`${props.className || ''} pr-12`}
            />
            <button
                type="button"
                onClick={openDatePicker}
                className="absolute right-0 top-0 h-full w-11 text-gray-500 hover:text-gray-700"
                aria-label="Open calendar"
            >
                <span aria-hidden="true">📅</span>
            </button>
            <input
                ref={datePickerRef}
                type="date"
                value={/^\d{4}-\d{2}-\d{2}$/.test(nativeValue) ? nativeValue : ''}
                onChange={(event) => onChange(formatDateForDisplay(event.target.value))}
                className="pointer-events-none absolute h-0 w-0 opacity-0"
                tabIndex={-1}
                aria-hidden="true"
            />
        </div>
    );
}
