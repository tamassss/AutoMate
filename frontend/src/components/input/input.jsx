import "./input.css"

export default function Input({id, value, onChange, placeholder, type}){
    return(
        <input className="input"
            type={type}
            id={id}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
        />
    )
}