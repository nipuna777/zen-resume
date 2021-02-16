import { Controller } from 'react-hook-form';
import TextInput from '../components/text-input';
import QuillControl from './quill-control';

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
                    label={`Type`}
                    inputRef={register()}
                    name={`sections[${index}].type`}
                    defaultValue={section.type}
                    hidden={true}
                />
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
                <QuillControl control={control} name={`sections[${index}].content`} defaultValue={section.content} />
            </div>
        </>
    );
}
