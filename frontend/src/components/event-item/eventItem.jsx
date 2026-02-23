import "./eventItem.css"
import { formatGroupedNumber } from "../../actions/shared/formatters";

function formatReminderText(reminder) {
  if (!reminder) return "";

  const text = String(reminder);
  return text.replace(/(\d+)\s*km/gi, (_, rawNum) => `${formatGroupedNumber(rawNum)} km`);
}

export default function EventItem({ title, days, km, reminder }) {
  const reminderText = formatReminderText(reminder ?? km);

  return (
    <div className="event-item d-flex flex-column align-items-center">
      <h4 className="event-item-title">{title}</h4>
      <div className="d-flex flex-column align-items-center">
        {days && <p className="event-detail-text">{days} nap</p>}
        {reminderText && <p className="event-detail-text">{reminderText}</p>}
      </div>
    </div>
  );
}
