import "./eventItem.css"
import { formatDate, formatGroupedNumber } from "../../actions/shared/formatters";

function formatKmText(rawValue) {
  if (!rawValue) return "";

  const value = String(rawValue).trim();

  if (/^\d+$/.test(value)) {
    return `${formatGroupedNumber(value)} km`;
  }

  if (/^\d+\s*km$/i.test(value)) {
    const numeric = value.replace(/km/i, "").trim();
    return `${formatGroupedNumber(numeric)} km`;
  }

  return value;
}

function formatReminderText(reminder) {
  if (!reminder) return "";

  const text = String(reminder).trim();
  if (!text) return "";

  if (text.includes("|")) {
    const [datePartRaw, kmPartRaw] = text.split("|");
    const datePart = (datePartRaw || "").trim();
    const kmPart = formatKmText(kmPartRaw || "");
    return [datePart, kmPart].filter(Boolean).join(" | ");
  }

  return formatKmText(text);
}

export default function EventItem({ title, days, km, reminder, date }) {
  const reminderText = formatReminderText(reminder ?? km);
  const dateText = formatDate(date);

  return (
    <div className="event-item d-flex flex-column align-items-center">
      <h4 className="event-item-title">{title}</h4>
      <div className="d-flex flex-column align-items-center">
        {date && dateText !== "-" && <p className="event-detail-text">{dateText}</p>}
        {days && <p className="event-detail-text">{days} nap</p>}
        {reminderText && <p className="event-detail-text">{reminderText}</p>}
      </div>
    </div>
  );
}
