export default function ApplicationLogo({ className = 'h-16 w-auto', ...props }) {
    return (
        <img
            className={className}
            src="/image/ukee logo.png"
            alt="UKee Logo"
            {...props}
        />
    );
}
