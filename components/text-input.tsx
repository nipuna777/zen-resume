export default function TextInput({ label, name, inputRef }) {
    return (
        <label style={{ display: 'flex', flexDirection: 'column', width: '100%', marginBottom: 10 }}>
            {label}
            <input name={name} ref={inputRef} />
        </label>
    );
}
