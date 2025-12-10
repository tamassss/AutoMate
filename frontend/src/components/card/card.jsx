import "./card.css"

export default function Card({title, children}){
    return(
        <div>
            <h3>{title}</h3>
            {children}
        </div>
    )
}