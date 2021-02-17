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
                    label={`Type`}
                    inputRef={register()}
                    name={`sections[${index}].controlType`}
                    defaultValue={section.controlType}
                    hidden={true}
                />
                <QuillControl control={control} name={`sections[${index}].content`} defaultValue={section.content} />
            </div>
        </>
    );
}
