export default function TextAreaInput({ label, name, inputRef }) {
    return (
        <label style={{ display: 'flex', flexDirection: 'column', width: '100%', marginBottom: 10 }}>
            {label}
            <textarea name={name} ref={inputRef} />
        </label>
    );
}
