import "./input.css"

export default function Input({ id, value, onChange, placeholder, type, inputRef, error}){
    return(
        <>
            {error && <span className="error-message">{error}</span>}
            
            <input className="input"
                type={type}
                id={id}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                ref={inputRef}
            />
        </>
    )
}