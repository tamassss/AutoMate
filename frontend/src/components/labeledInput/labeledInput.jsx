import Input from "../input/input";

export default function LabeledInput({label, ...inputProps}){
    return(
        <div className="labeled-input">
            <p>{label}</p>
            <Input {...inputProps}/>
        </div>
    )
}