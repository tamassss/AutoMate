import "./budgetLimit.css"

export default function BudgetLimit({ currentFt, limitFt }) {
    const percentage = Math.min(Math.round((currentFt / limitFt) * 100), 100);

    return (
        <div className="budget-container mx-auto">
            <h3 className="fw-bold budget-title">HAVI KÖLTÉSI LIMIT</h3>
            
            <div className="bar-wrapper">
                <div className="bar">
                    <div 
                        className="limit-indicator" 
                        style={{ left: `${percentage}%` }}
                    ></div>
                </div>
            </div>

            <div className="d-flex flex-column">
                <p  className="stats-ft">{currentFt}/{limitFt}</p>
                <p  className="stats-percentage">{percentage}%</p>
            </div>
        </div>
    );
}
