import "./navbar.css"

export default function Navbar({leftIcon, onLeftClick, altLeft, title, rightIcon, onRightClick, altRight}){
    return(
    <nav>
        <div onClick={onLeftClick}>
            {leftIcon && <img src={leftIcon} alt={altLeft} />} 
        </div>

        <div>
            {title}
        </div>

        <div onClick={onRightClick}>
            {rightIcon && <img src={rightIcon} alt={altRight}/>}
        </div>
    </nav>
    )
    
}