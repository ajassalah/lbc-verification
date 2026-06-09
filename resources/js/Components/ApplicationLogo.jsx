export default function ApplicationLogo({ className = 'h-16 w-auto', ...props }) {
    return (
        <img
            className={`bg-black ${className}`}
            src="/image/lbc-logo.png"
            alt="London Business Campus Logo"
            {...props}
        />
    );
}
