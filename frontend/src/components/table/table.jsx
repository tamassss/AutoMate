export default function Table({children}){
    return(
        <table className="table table-striped table-dark custom-table">
            <tbody>
                {children}
            </tbody>
        </table>
    )
}