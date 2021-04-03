import { useAlerts } from "../../context/AlertState";

export default function Alerts() {
  const { alerts } = useAlerts();

  return (
    alerts.length > 0 &&
    alerts.map((alert) => (
      <div key={alert.id} className={`alert alert-${alert.type}`}>
        <i className="fas fa-info-circle" /> {alert.msg}
      </div>
    ))
  );
}
