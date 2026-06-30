"use client";

import React, { useState } from "react";
import { CheckSquare, Square, CheckCircle2, ArrowRight, ClipboardList, PlusCircle } from "lucide-react";

interface TaskItem {
  id: string;
  text: string;
  priority: "Critical" | "High" | "Medium" | "Low";
  patientId?: string;
  actionLabel: string;
}

interface MyTasksWidgetProps {
  onSelectPatient: (id: string) => void;
  setActiveTab: (tabId: any) => void;
  reduceMotion?: boolean;
}

export default function MyTasksWidget({
  onSelectPatient,
  setActiveTab,
  reduceMotion = false,
}: MyTasksWidgetProps) {
  const [tasks, setTasks] = useState<TaskItem[]>([
    { id: "task-1", text: "Review Rahul Sharma IgE Panel reports", priority: "Critical", patientId: "pat-rahul-01", actionLabel: "Review Reports" },
    { id: "task-2", text: "Approve CDSS affinity recommendations for Meera", priority: "High", patientId: "pat-meera-02", actionLabel: "View CDSS" },
    { id: "task-3", text: "Outreach follow-up call with Baby Kabir Jethwani", priority: "Medium", patientId: "pat-kabir-03", actionLabel: "Call Patient" },
    { id: "task-4", text: "Verify 4 pending Materia Medica drafts in KMS editor", priority: "Medium", actionLabel: "Open Editor" },
    { id: "task-5", text: "Authorize pending invoice statement for billing ledger", priority: "Low", actionLabel: "Verify billing" },
  ]);

  const [completedTaskIds, setCompletedTaskIds] = useState<Record<string, boolean>>({});

  const toggleTask = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCompletedTaskIds(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleTaskAction = (task: TaskItem) => {
    if (task.patientId) {
      onSelectPatient(task.patientId);
      setActiveTab("patients");
    } else if (task.id === "task-4") {
      setActiveTab("nexus-atlas");
    } else {
      setActiveTab("communication");
    }
  };

  const activeTasks = tasks.filter(t => !completedTaskIds[t.id]);

  const getPriorityBadgeClass = (priority: string) => {
    switch (priority) {
      case "Critical":
        return "bg-rose-50 text-rose-700 dark:bg-rose-955/20 dark:text-rose-400 border border-rose-100 dark:border-rose-900/30";
      case "High":
        return "bg-amber-50 text-amber-800 dark:bg-amber-955/20 dark:text-amber-400 border border-amber-100 dark:border-amber-900/30";
      case "Medium":
        return "bg-blue-50 text-blue-700 dark:bg-blue-955/20 dark:text-blue-400 border border-blue-100 dark:border-blue-900/30";
      default:
        return "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-700";
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-5 rounded-[24px] border border-slate-202/80 dark:border-slate-800/80 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 select-none">
        <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
          <ClipboardList className="w-4 h-4 text-teal-500" />
          <span>My Tasks &amp; Checklist</span>
        </h3>
        <span className="text-[9px] bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded-full font-bold">
          {activeTasks.length} Pending
        </span>
      </div>

      {/* Task List */}
      {activeTasks.length > 0 ? (
        <div className="space-y-2.5 max-h-[280px] overflow-y-auto pr-1">
          {tasks.map((task) => {
            const isCompleted = !!completedTaskIds[task.id];
            if (isCompleted) return null;

            return (
              <div
                key={task.id}
                onClick={() => handleTaskAction(task)}
                className={`p-3 bg-slate-50 dark:bg-slate-850/50 hover:bg-slate-100/50 dark:hover:bg-slate-800/40 border border-slate-202/50 dark:border-slate-800 rounded-xl flex items-center justify-between gap-3 cursor-pointer transition-all ${
                  reduceMotion ? "" : "hover:translate-x-0.5 duration-150"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  {/* Custom Checkbox Button */}
                  <button
                    onClick={(e) => toggleTask(task.id, e)}
                    className="text-slate-400 hover:text-teal-500 transition-colors p-0.5 border-none bg-transparent cursor-pointer outline-none focus-visible:ring-1 focus-visible:ring-teal-500 rounded"
                    aria-label={`Mark task completed: ${task.text}`}
                  >
                    {isCompleted ? (
                      <CheckSquare className="w-4 h-4 text-teal-500" />
                    ) : (
                      <Square className="w-4 h-4" />
                    )}
                  </button>

                  <div className="min-w-0">
                    <span className="text-[11px] font-bold text-slate-800 dark:text-slate-100 leading-snug block truncate max-w-[280px] sm:max-w-md">
                      {task.text}
                    </span>
                    <div className="flex items-center gap-2 mt-1 select-none">
                      <span className={`px-1.5 py-0.1 rounded text-[8px] font-extrabold uppercase ${getPriorityBadgeClass(task.priority)}`}>
                        {task.priority}
                      </span>
                      <span className="text-[9px] text-slate-400 dark:text-slate-500 font-medium">
                        Action: {task.actionLabel}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="shrink-0 text-slate-400 hover:text-slate-600 dark:hover:text-slate-350 select-none">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-8 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-[20px] space-y-2 select-none">
          <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
          <div className="text-xs font-bold text-slate-500 dark:text-slate-400">All tasks completed!</div>
          <p className="text-[10px] text-slate-450 dark:text-slate-600 max-w-xs mx-auto">
            You have checked off all clinical and administrative items on your schedule.
          </p>
          <button
            onClick={() => {
              setCompletedTaskIds({});
            }}
            className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 dark:bg-slate-800 dark:hover:bg-slate-750 dark:text-slate-300 rounded-xl text-[9px] font-bold cursor-pointer border-none transition-colors"
          >
            Reset checklist
          </button>
        </div>
      )}
    </div>
  );
}
