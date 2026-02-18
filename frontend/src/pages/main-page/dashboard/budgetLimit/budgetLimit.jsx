import "./budgetLimit.css"

export default function BudgetLimit({spent = 0, limit = 0}) {
    const percentage = limit ? Math.min(Math.round((spent / limit) * 100), 100) : 0;
    const isOverLimit = limit > 0 && spent > limit;

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
                <p className={`stats-ft ${isOverLimit ? "stats-ft-over" : ""}`}>{spent}/{limit}</p>
                <p  className="stats-percentage">{percentage}%</p>
            </div>
        </div>
    );
}
