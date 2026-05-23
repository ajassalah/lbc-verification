import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

export default function SearchableSelect({
    id,
    value,
    options = [],
    placeholder = 'Select option',
    searchPlaceholder = 'Search...',
    noOptionsText = 'No options found',
    onChange,
    className = '',
}) {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [menuStyle, setMenuStyle] = useState(null);
    const wrapperRef = useRef(null);
    const menuRef = useRef(null);
    const inputRef = useRef(null);

    const filteredOptions = useMemo(() => {
        const term = search.trim().toLowerCase();

        if (!term) {
            return options;
        }

        return options.filter((option) => String(option).toLowerCase().includes(term));
    }, [options, search]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            const isInsideTrigger = wrapperRef.current?.contains(event.target);
            const isInsideMenu = menuRef.current?.contains(event.target);

            if (!isInsideTrigger && !isInsideMenu) {
                setOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useLayoutEffect(() => {
        if (!open || !wrapperRef.current) {
            return;
        }

        const updatePosition = () => {
            const rect = wrapperRef.current.getBoundingClientRect();
            const viewportPadding = 8;
            const width = rect.width;
            const maxLeft = window.innerWidth - width - viewportPadding;

            setMenuStyle({
                top: `${rect.bottom + 4}px`,
                left: `${Math.min(Math.max(viewportPadding, rect.left), maxLeft)}px`,
                width: `${width}px`,
            });
        };

        updatePosition();

        window.addEventListener('resize', updatePosition);
        window.addEventListener('scroll', updatePosition, true);

        return () => {
            window.removeEventListener('resize', updatePosition);
            window.removeEventListener('scroll', updatePosition, true);
        };
    }, [open]);

    useEffect(() => {
        if (open) {
            setTimeout(() => inputRef.current?.focus(), 0);
        } else {
            setSearch('');
        }
    }, [open]);

    const selectOption = (option) => {
        onChange?.(option);
        setOpen(false);
    };

    const menu = open && typeof document !== 'undefined' ? createPortal(
        <div
            ref={menuRef}
            className="fixed z-[1000] overflow-hidden rounded-md border border-gray-200 bg-white shadow-xl"
            style={menuStyle ?? { top: 0, left: 0, width: 0, visibility: 'hidden' }}
        >
            <div className="border-b border-gray-100 p-2">
                <input
                    ref={inputRef}
                    type="text"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder={searchPlaceholder}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
            </div>

            <div className="max-h-56 overflow-y-auto py-1">
                <button
                    type="button"
                    onClick={() => selectOption('')}
                    className={`block w-full px-3 py-2 text-left text-sm hover:bg-blue-50 ${!value ? 'bg-blue-50 text-blue-700' : 'text-gray-700'}`}
                >
                    {placeholder}
                </button>

                {filteredOptions.length > 0 ? filteredOptions.map((option) => (
                    <button
                        key={option}
                        type="button"
                        onClick={() => selectOption(option)}
                        className={`block w-full px-3 py-2 text-left text-sm hover:bg-blue-50 ${value === option ? 'bg-blue-50 text-blue-700' : 'text-gray-700'}`}
                    >
                        {option}
                    </button>
                )) : (
                    <div className="px-3 py-3 text-sm text-gray-500">{noOptionsText}</div>
                )}
            </div>
        </div>,
        document.body
    ) : null;

    return (
        <div ref={wrapperRef} className={`relative ${className}`}>
            <button
                id={id}
                type="button"
                onClick={() => setOpen((current) => !current)}
                className="flex w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-left text-sm shadow-sm transition focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
                <span className={value ? 'text-gray-900' : 'text-gray-500'}>
                    {value || placeholder}
                </span>
                <span className="ml-3 text-gray-400">v</span>
            </button>
            {menu}
        </div>
    );
}
