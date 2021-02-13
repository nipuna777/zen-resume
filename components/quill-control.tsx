import { Controller } from 'react-hook-form';

let ReactQuill;
if (typeof window !== 'undefined') {
    ReactQuill = require('react-quill');
}

export default function QuillControl({ defaultValue, control, name, className }) {
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
