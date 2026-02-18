import "./button.css"

export default function Button({text, onClick, type, className}){
    return(
        <button onClick={onClick} type={type} className={className}> 
            {text}
        </button>
    )
}