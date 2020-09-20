export default function TextInput({ label, name, inputRef, hidden = false, defaultValue = '' }) {
    return (
        <div className={`mb-5 ${hidden && 'hidden'}`}>
            <label className="block text-gray-700 text-sm font-bold mb-2">
                {label}
                <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    name={name}
                    ref={inputRef}
                    defaultValue={defaultValue}
                />
            </label>
        </div>
    );
}
