import { useNavigate, Link } from "react-router-dom"
import helpIcon from "../../assets/icons/help.png"
import "./navbar.css"

export default function Navbar({leftIcon, onLeftClick, altLeft, rightIcon, onRightClick, altRight}){
    const navigate = useNavigate();
    return(
    <nav className="custom-navbar">
        <div className={"nav-icons-div"} onClick={onLeftClick}>
            {leftIcon && <img className={"nav-icons"} src={leftIcon} alt={altLeft} />} 
        </div>

        <div className="nav-title-div">
            <p className="brand" onClick={() => navigate("/")}>
                Auto<span className="mate-span">Mate</span>
            </p>
        </div>

        <div className={"nav-icons-div"} onClick={onRightClick}>
            {rightIcon && <img className={"nav-icons"} src={rightIcon} alt={altRight}/>}
        </div>

        <div className="help-div">
            <Link to="/tippek" className="help-link">
                <img src={helpIcon} alt="Segítség kezdőknek"/>
            </Link>
        </div>

    </nav>
    )
    
}