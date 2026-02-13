import "./button.css"

export default function Button({text, onClick, type}){
    return(
        <button onClick={onClick} type={type}> 
            {text}
        </button>
    )
}