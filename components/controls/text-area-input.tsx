export function TextAreaInput({ label, name, inputRef }) {
    return (
        <div className="mb-5">
            <label className="block text-gray-700 text-sm font-bold mb-2">
                {label}
                <textarea
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    name={name}
                    ref={inputRef}
                />
            </label>
        </div>
    );
}
