import { LeaveRequest, Loan, OverTime, RemoteWork } from "@/store/Requests";

export const validateLeaveForm = (form: LeaveRequest) => {
  if (!form.dayType) return "Please select leave duration";
  if (!form.leaveType) return "Please select leave type";
  if (!form.startDate) return "Please select a start date";
  if (!form.endDate) return "Please select an end date";
  if (form.endDate < form.startDate)
    return "end date can't be before start date";
  if (!form.reason.trim()) return "please put a reason";
  if (!form.managerId) return "Please select manager from the list";
  return null;
};

export const validateOverTimeForm = (form: OverTime) => {
  if (!form.date) return "Please select a date";
  if (!form.startTime) return "Please enter start time";
  if (!form.endTime) return "Please enter end time";
  if (form.endTime < form.startTime)
    return "start time should be before end time";
  if (!form.reason.trim()) return "Please put a reason";
  if (!form.managerId) return "Please select manager from the list";
  return null;
};

export const validateRemoteWork = (form: RemoteWork) => {
  if (!form.date) return "Please select a date";
  if (!form.reason) return "Please put a reason";
  if (!form.managerId) return "Please select manager from the list";
  return null;
};

export const validateLoan = (form: Loan) => {
  if (!form.loanReason) return "Please select loan reason";
  if (!form.Amount) return "Please select loan amount";
  if (!form.detailedExplanation) return "Please enter detailed explanation";
  if (!form.managerId) return "Please select manager from the list";
  return null;
};
