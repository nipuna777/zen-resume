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
                    label={`Title`}
                    inputRef={register()}
                    name={`sections[${index}].title`}
                    defaultValue={section.title}
                />
                
                <TextInput
                    label={`Subtitle`}
                    inputRef={register()}
                    name={`sections[${index}].subtitle`}
                    defaultValue={section.subtitle}
                />
                <TextInput
                    label={`Duration`}
                    inputRef={register()}
                    name={`sections[${index}].duration`}
                    defaultValue={section.duration}
                />
                {ReactQuill ? (
                    <Controller
                        as={ReactQuill}
                        name={`sections[${index}].content`}
                        control={control}
                        defaultValue={section.content}
                    />
                ) : null}
            </div>
        </>
    );
}
