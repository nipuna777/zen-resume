import { Controller } from 'react-hook-form';

let ReactQuill;
if (typeof window !== 'undefined') {
    ReactQuill = require('react-quill');
}

export function QuillControl({
    defaultValue,
    control,
    name,
    className,
}: {
    control: any;
    name: string;
    defaultValue?: string;
    className?: string;
}) {
    return ReactQuill ? (
        <Controller
            as={
                <ReactQuill
                    className={`shadow text-gray-700 focus:shadow-outline bg-white ${className}`}
                    theme={'bubble'}
                />
            }
            name={name}
            control={control}
            defaultValue={defaultValue}
        />
    ) : null;
}
