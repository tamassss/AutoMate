import xIcon from "../../assets/icons/x-icon.png";

import "./error.css"

export default function Error({onClose}){
    return(
        <div className="error-div" onClick={() => onClose()}>
            <div className="error-close-img-div">
                <img src={xIcon} onClick={() => onClose()} className="error-close-img"/>
            </div>
            <div className="error-content p-3">
                <div className="error-text-div">
                    <p className="error-text">Error</p>
                </div>
                <div className="error-description-div">
                    <p className="error-description">404 Error: Not found</p>
                </div>
            </div>
        </div>
    )
}