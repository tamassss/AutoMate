import "./budgetLimit.css"

export default function BudgetLimit({ currentFt, limitFt }) {
    const percentage = Math.min(Math.round((currentFt / limitFt) * 100), 100);

    return (
        <div className="budget-container">
            <h3 className="fw-bold budget-title">HAVI KÖLTÉSI LIMIT</h3>
            
            <div className="bar-wrapper">
                <div className="bar">
                    <div 
                        className="limit-indicator" 
                        style={{ left: `${percentage}%` }}
                    ></div>
                </div>
            </div>

            <div>
                <p  className="fs-4 stats-ft">{currentFt}/{limitFt}</p>
                <p  className="fs-5 stats-percentage">{percentage}%</p>
            </div>
        </div>
    );
}