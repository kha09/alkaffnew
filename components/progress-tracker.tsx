"use client"

import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  CreditCard,
  TrendingUp,
} from "lucide-react"

type ProgressTrackerProps = {
  submissionStatus: string;
  showFullProgress?: boolean;
  compact?: boolean;
};

export function ProgressTracker({ submissionStatus, showFullProgress = false, compact = false }: ProgressTrackerProps) {
  // Define submission status stages
  const submissionStages = [
    { key: "submitted", label: "تم التقديم", icon: FileText },
    { key: "approved_by_admin", label: "موافقة الإدارة", icon: CheckCircle },
    { key: "sent_to_university", label: "مرسل للجامعة", icon: FileText },
    { key: "accepted_by_university", label: "مقبول من الجامعة", icon: CheckCircle },
    { key: "submitted_visa_info", label: "تقديم معلومات التأشيرة", icon: FileText },
    { key: "submitted_payment", label: "تقديم الدفع", icon: CreditCard },
    { key: "completed", label: "مكتمل", icon: CheckCircle }
  ];

  // Calculate progress based on current submission status
  const getCurrentStageIndex = (status: string) => {
    const stageIndex = submissionStages.findIndex(stage => stage.key === status);
    return stageIndex >= 0 ? stageIndex : 0;
  };

  const currentStageIndex = getCurrentStageIndex(submissionStatus);
  const progressPercentage = ((currentStageIndex + 1) / submissionStages.length) * 100;

  // Get status badge color
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "accepted_by_university":
      case "completed":
        return "bg-green-100 text-green-800";
      case "rejected_by_university":
        return "bg-red-100 text-red-800";
      case "submitted":
      case "approved_by_admin":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  // Get status label in Arabic
  const getStatusLabel = (status: string) => {
    const stage = submissionStages.find(s => s.key === status);
    if (stage) return stage.label;
    
    switch (status) {
      case "rejected_by_university":
        return "مرفوض من الجامعة";
      default:
        return "قيد المتابعة";
    }
  };

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <Badge className={getStatusBadgeColor(submissionStatus)}>
          {getStatusLabel(submissionStatus)}
        </Badge>
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <span>{Math.round(progressPercentage)}%</span>
          <Progress value={progressPercentage} className="h-1 w-16" />
        </div>
      </div>
    );
  }

  if (!showFullProgress) {
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Badge className={getStatusBadgeColor(submissionStatus)}>
            {getStatusLabel(submissionStatus)}
          </Badge>
          <span className="text-sm font-medium">{Math.round(progressPercentage)}%</span>
        </div>
        <Progress value={progressPercentage} className="h-2" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm text-[#4b5563]">إجمالي التقدم</span>
        <span className="text-sm font-medium">{Math.round(progressPercentage)}%</span>
      </div>
      <Progress value={progressPercentage} className="h-3" />
      
      {/* Submission Status Progress Steps */}
      <div className="space-y-4">
        <h4 className="font-medium text-[#111827]">مراحل التقديم</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {submissionStages.map((stage, index) => {
            const Icon = stage.icon;
            const isCompleted = index <= currentStageIndex;
            const isCurrent = index === currentStageIndex;
            const isRejected = stage.key === "rejected_by_university" && submissionStatus === "rejected_by_university";
            
            return (
              <div
                key={stage.key}
                className={`flex items-center gap-2 p-2 rounded-lg border ${
                  isRejected
                    ? "bg-red-50 border-red-200"
                    : isCompleted
                    ? "bg-green-50 border-green-200"
                    : isCurrent
                    ? "bg-blue-50 border-blue-200"
                    : "bg-gray-50 border-gray-200"
                }`}
              >
                <Icon
                  className={`w-4 h-4 ${
                    isRejected
                      ? "text-red-600"
                      : isCompleted
                      ? "text-green-600"
                      : isCurrent
                      ? "text-blue-600"
                      : "text-gray-400"
                  }`}
                />
                <span
                  className={`text-xs font-medium ${
                    isRejected
                      ? "text-red-800"
                      : isCompleted
                      ? "text-green-800"
                      : isCurrent
                      ? "text-blue-800"
                      : "text-gray-600"
                  }`}
                >
                  {stage.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
