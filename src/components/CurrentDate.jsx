import { useEffect, useState } from "react";
import "../components/CurrentDate.scss";

export default function CurrentDate() {
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setDate(new Date());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return <h3 className="current-date">{date.toDateString()}</h3>;
}
