import { useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import { DateTime } from "luxon";

import useWidgetAPI from "../../../utils/proxy/use-widget-api";
import Error from "../../../components/services/widget/error";
import Agenda from "../agenda";

export default function Filter({ widget }) {
  const { t } = useTranslation();
  const { data: tasksData, error: tasksError } = useWidgetAPI(widget, "getTasksWithCustomFilter", {
    refreshInterval: widget.refreshInterval || 300000, // 5 minutes, use default if not provided
    filter: widget.filter
  });

  const [tasks, setTasks] = useState([]); // State to hold tasks

  useEffect(() => {
    if (!tasksError && tasksData && tasksData.length > 0) {
      // Process label data and set tasks
      const tasksToAdd = tasksData.slice(0, widget.maxTasks || tasksData.length).map((task) => ({
        title: task.content || t("Untitled Task by Label"),
        date: task.due ? DateTime.fromISO(task.due.date, { zone: widget.timeZone }).toJSDate() : null,
        color: widget.color || task.color || "blue",
        description: task.tags ? task.tags.join(", ") : "",
        url: task.url,
        id: task.id,
      }));

      // Update the tasks state
      setTasks(tasksToAdd);
    }
  }, [tasksData, tasksError, widget, t, setTasks]);

  const error = tasksError ?? tasksData?.error;
  if (error && !widget.hideErrors) {
    return <Error error={{ message: `${widget.type}: ${error.message ?? error}` }} />;
  }

  // Render the Agenda component if tasks is not empty
  return <Agenda tasks={tasks} />;
}
