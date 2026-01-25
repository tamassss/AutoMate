import "./eventItem.css"

export default function EventItem({title, days, km}){
    return (
    <div className="event-item d-flex flex-column align-items-center">
      <h4 className="event-item-title">{title}</h4>
      <div className="d-flex flex-column align-items-center">
        {days && <p className="event-detail-text">{days} nap</p>}
        {km && <p className="event-detail-text">{km} km</p>}
      </div>
    </div>
  )
}