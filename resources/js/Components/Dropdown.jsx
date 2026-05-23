import { useState, createContext, useContext, Fragment, useLayoutEffect, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Link } from '@inertiajs/react';
import { Transition } from '@headlessui/react';

const DropDownContext = createContext();

const Dropdown = ({ children }) => {
    const [open, setOpen] = useState(false);
    const triggerRef = useRef(null);

    const toggleOpen = () => {
        setOpen((previousState) => !previousState);
    };

    return (
        <DropDownContext.Provider value={{ open, setOpen, toggleOpen, triggerRef }}>
            <div className="relative">{children}</div>
        </DropDownContext.Provider>
    );
};

const Trigger = ({ children }) => {
    const { open, setOpen, toggleOpen, triggerRef } = useContext(DropDownContext);

    return (
        <>
            <div ref={triggerRef} onClick={toggleOpen}>{children}</div>

            {open && <div className="fixed inset-0 z-40" onClick={() => setOpen(false)}></div>}
        </>
    );
};

const Content = ({ align = 'right', width = '48', contentClasses = 'py-1 bg-white', children, position = 'absolute', offsetX = 0 }) => {
    const { open, setOpen, triggerRef } = useContext(DropDownContext);
    const [fixedStyle, setFixedStyle] = useState(null);

    let alignmentClasses = 'origin-top';

    if (align === 'left') {
        alignmentClasses = 'ltr:origin-top-left rtl:origin-top-right start-0';
    } else if (align === 'right') {
        alignmentClasses = 'ltr:origin-top-right rtl:origin-top-left end-0';
    }

    let widthClasses = '';

    if (width === '48') {
        widthClasses = 'w-48';
    } else if (width === '72') {
        widthClasses = 'w-72 max-w-[calc(100vw-1rem)]';
    } else if (width === '80') {
        widthClasses = 'w-80 max-w-[calc(100vw-1rem)]';
    }

    const menuWidth = useMemo(() => {
        if (width === '48') {
            return 192;
        }
        if (width === '72') {
            return 288;
        }
        if (width === '80') {
            return 320;
        }

        return 192;
    }, [width]);

    useLayoutEffect(() => {
        if (!open || position !== 'fixed' || !triggerRef.current) {
            return;
        }

        const updatePosition = () => {
            const rect = triggerRef.current.getBoundingClientRect();
            const minOffset = 8;
            const maxLeft = window.innerWidth - menuWidth - minOffset;
            const desiredLeft = (align === 'right' ? rect.right - menuWidth : rect.left) + offsetX;

            setFixedStyle({
                top: `${rect.bottom + minOffset}px`,
                left: `${Math.min(Math.max(minOffset, desiredLeft), maxLeft)}px`,
            });
        };

        updatePosition();

        window.addEventListener('resize', updatePosition);
        window.addEventListener('scroll', updatePosition, true);

        return () => {
            window.removeEventListener('resize', updatePosition);
            window.removeEventListener('scroll', updatePosition, true);
        };
    }, [align, menuWidth, offsetX, open, position, triggerRef]);

    const content = (
        <Transition
            as={Fragment}
            show={open}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
        >
            <div
                className={`${position === 'fixed' ? 'fixed z-[100]' : 'absolute z-50 mt-2'} rounded-md shadow-lg ${position === 'fixed' ? 'origin-top-right' : alignmentClasses} ${widthClasses}`}
                style={position === 'fixed' ? fixedStyle ?? { top: 0, left: 0, visibility: 'hidden' } : undefined}
                onClick={() => setOpen(false)}
            >
                <div className={`rounded-md ring-1 ring-black ring-opacity-5 ` + contentClasses}>{children}</div>
            </div>
        </Transition>
    );

    if (position === 'fixed' && typeof document !== 'undefined') {
        return createPortal(content, document.body);
    }

    return content;
};

const DropdownLink = ({ className = '', children, ...props }) => {
    return (
        <Link
            {...props}
            className={
                'block w-full px-4 py-2 text-start text-sm leading-5 text-gray-700 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 transition duration-150 ease-in-out ' +
                className
            }
        >
            {children}
        </Link>
    );
};

Dropdown.Trigger = Trigger;
Dropdown.Content = Content;
Dropdown.Link = DropdownLink;

export default Dropdown;
