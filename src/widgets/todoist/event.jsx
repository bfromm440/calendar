import { useState } from "react";
import { useTranslation } from "next-i18next";
import { DateTime } from "luxon";
import classNames from "classnames";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";

export default function Event({ task, colorVariants }) {
  const [hover, setHover] = useState(false);
  const { i18n } = useTranslation(); // Ensure you're getting 't' from useTranslation()

  const renderEventTitle = () => {
    if (task.url) {
      return (
        <a href={task.url} target="_blank" rel="noopener noreferrer" className="flex-grow truncate">
          {hover && task.additional ? task.additional : task.title}
        </a>
      );
    }

    return (
      <div className="flex-grow truncate">
        {hover && task.additional ? task.additional : task.title}
      </div>
    );
  };

  return (
    <div
      className="flex flex-row text-theme-700 dark:text-theme-200 items-center text-xs relative h-5 w-full rounded-md bg-theme-200/50 dark:bg-theme-900/20 mt-1"
      onMouseEnter={() => setHover(true)} // Change to setHover(true) and setHover(false)
      onMouseLeave={() => setHover(false)} // Change to setHover(false)
      key={`task-${task.id}`}
    >
      <span className="ml-2 w-10">
        {task.date && (
          <span>
            {DateTime.fromJSDate(task.date)
              .setLocale(i18n.language)
              .toLocaleString(DateTime.TIME_24_SIMPLE)}
          </span>
        )}
      </span>
      <span className="ml-2 h-2 w-2">
        <span className={classNames("block w-2 h-2 rounded", colorVariants[task.color] ?? "gray")} />
      </span>
      <div className="ml-2 h-5 text-left relative truncate" style={{ width: "70%" }}>
        <div className="absolute mt-0.5 text-xs">{renderEventTitle()}</div>
      </div>
      {task.isCompleted && (
        <span className="text-xs mr-1 ml-auto z-10">
          <IoMdCheckmarkCircleOutline />
        </span>
      )}
    </div>
  );
}
