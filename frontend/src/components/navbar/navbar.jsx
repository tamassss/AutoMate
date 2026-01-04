import "./navbar.css"

export default function Navbar({leftIcon, onLeftClick, altLeft, rightIcon, onRightClick, altRight, subtitle}){
    return(
    <nav className="navbar">
        <div className={"nav-icons-div"} onClick={onLeftClick}>
            {leftIcon && <img className={"nav-icons"} src={leftIcon} alt={altLeft} />} 
        </div>

        <div className="nav-title-div">
            <p>
                Auto<span className="mate-span">Mate</span>{subtitle ? ` - ${subtitle}` : ""}
            </p>
        </div>

        <div className={"nav-icons-div"} onClick={onRightClick}>
            {rightIcon && <img className={"nav-icons"} src={rightIcon} alt={altRight}/>}
        </div>
    </nav>
    )
    
}