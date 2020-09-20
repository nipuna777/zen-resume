import { Controller } from 'react-hook-form';
import TextInput from '../components/text-input';

let ReactQuill;
if (typeof window !== 'undefined') {
    ReactQuill = require('react-quill');
}

export default function SectionEditor({ section, control, register, index }) {
    return (
        <>
            <hr />
            <div className="mb-4 mt-4">
                <TextInput
                    label={`Section title`}
                    inputRef={register()}
                    name={`sections[${index}].title`}
                    defaultValue={section.title}
                />
                {ReactQuill ? (
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        <Controller
                            as={ReactQuill}
                            name={`sections[${index}].content`}
                            control={control}
                            defaultValue={section.content}
                        />
                    </label>
                ) : null}
            </div>
        </>
    );
}
