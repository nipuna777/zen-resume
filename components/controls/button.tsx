import { MouseEvent } from 'react';

export function Button({
    onClick,
    children,
    className = '',
    color = 'primary',
    size = 'md',
}: {
    onClick: (e: MouseEvent) => void;
    children: JSX.Element | string;
    className?: string;
    color?: 'primary' | 'danger' | 'secondary';
    size?: Size;
}) {
    let colorClasses = 'hover:bg-blue-500 text-blue-700 border-blue-500 ';
    switch (color) {
        case 'danger':
            colorClasses = 'hover:bg-red-300 text-red-400 border-red-300';
            break;
        case 'secondary':
            colorClasses = 'hover:bg-gray-500 text-gray-700 border-gray-500';
            break;
    }

    let sizeClasses = 'font-semibold py-2 px-4';
    switch (size) {
        case 'sm':
            sizeClasses = 'text-sm p-1 mb-3';
    }

    return (
        <button
            type="button"
            className={`bg-transparent border hover:border-transparent hover:text-white rounded ${colorClasses} ${sizeClasses} ${className}`}
            onClick={onClick}
        >
            {children}
        </button>
    );
}

type Size = 'sm' | 'md' | 'lg';
