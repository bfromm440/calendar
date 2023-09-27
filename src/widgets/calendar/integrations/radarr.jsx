import { DateTime } from "luxon";
import { useEffect, useContext } from "react";

import useWidgetAPI from "../../../utils/proxy/use-widget-api";
import { EventContext } from "../../../utils/contexts/calendar";
import Error from "../../../components/services/widget/error";

export default function Integration({ config, params }) {
  const { setEvents } = useContext(EventContext);
  const { data: radarrData, error: radarrError } = useWidgetAPI(config, "calendar",
    { ...params,  ...config?.params ?? {} }
  );
  useEffect(() => {
    if (!radarrData || radarrError) {
      return;
    }

    const eventsToAdd = {};

    radarrData?.forEach(event => {
      const cinemaTitle = `${event.title} - In cinemas`;
      const physicalTitle = `${event.title} - Physical release`;
      const digitalTitle = `${event.title} - Digital release`;

      eventsToAdd[cinemaTitle] = {
        title: cinemaTitle,
        date: DateTime.fromISO(event.inCinemas),
        color: config?.color ?? 'amber'
      };
      eventsToAdd[physicalTitle] = {
        title: physicalTitle,
        date: DateTime.fromISO(event.physicalRelease),
        color: config?.color ?? 'cyan'
      };
      eventsToAdd[digitalTitle] = {
        title: digitalTitle,
        date: DateTime.fromISO(event.digitalRelease),
        color: config?.color ?? 'emerald'
      };
    })

    setEvents((prevEvents) => ({ ...prevEvents, ...eventsToAdd }));
  }, [radarrData, radarrError, config, setEvents]);

  const error = radarrError ?? radarrData?.error;
  return error && <Error error={{ message: `${config.type}: ${error.message ?? error}`}} />
}
