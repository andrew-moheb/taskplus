import { Button, Flex, Modal, Stack, Text } from "@mantine/core";
import { useState } from "react";
import { MdAttachMoney, MdHome, MdTimer, MdTimeToLeave } from "react-icons/md";
import "@mantine/dates/styles.css";
import { useUserStore } from "@/store/user";
import {
  LeaveRequest,
  OverTime,
  RemoteWork,
  Loan,
  useRequestStore,
} from "@/store/Requests";
import LeaveForm, { Intial_Leave_Form } from "./LeaveForm";
import { notify } from "@/utils/toast";
import {
  validateLeaveForm,
  validateLoan,
  validateOverTimeForm,
  validateRemoteWork,
} from "@/validations/validations";
import OverTimeForm, { Intial_OverTime_Form } from "./OverTimeForm";
import { Intial_RemoteWork_Form } from "./RemoteWorkForm";
import RemoteWorkForm from "./RemoteWorkForm";
import LoanForm, { Intial_Loan_Form } from "./LoanForm";
import { useRouter } from "next/navigation";

const requestTypes = [
  { icon: <MdTimeToLeave size={18} />, label: "Leave" },
  { icon: <MdTimer size={18} />, label: "OverTime" },
  { icon: <MdHome size={18} />, label: "Remote Work" },
  { icon: <MdAttachMoney size={18} />, label: "Loan" },
];

export default function AddRequestModal({
  close,
  opened,
}: {
  close: () => void;
  opened: boolean;
}) {
  const { currentUser } = useUserStore();
  const { addRequest } = useRequestStore();
  const [kind, setKind] = useState("Leave");
  const [leaveForm, setLeaveForm] = useState<LeaveRequest>(Intial_Leave_Form);
  const [overTimeForm, setOverTimeForm] =
    useState<OverTime>(Intial_OverTime_Form);
  const [remoteWorkForm, setRemoteWorkForm] = useState<RemoteWork>(
    Intial_RemoteWork_Form,
  );
  const [loanForm, setLoanForm] = useState<Loan>(Intial_Loan_Form);
  const [error, setError] = useState<string | null>(null);

  const onChangeUpdateLeaveFormFields = <K extends keyof LeaveRequest>(
    key: K,
    value: LeaveRequest[K],
  ) => {
    setLeaveForm((prev) => ({ ...prev, [key]: value }));
    setError(null);
  };

  const onChangeOverTimeForm = <K extends keyof OverTime>(
    key: K,
    value: OverTime[K],
  ) => {
    setOverTimeForm((prev) => ({ ...prev, [key]: value }));
    setError(null);
  };

  const onChangeRemoteWorkForm = <K extends keyof RemoteWork>(
    key: K,
    value: RemoteWork[K],
  ) => {
    setRemoteWorkForm((prev) => ({ ...prev, [key]: value }));
    setError(null);
  };

  const onChangeLoanForm = <K extends keyof Loan>(key: K, value: Loan[K]) => {
    setLoanForm((prev) => ({ ...prev, [key]: value }));
    setError(null);
  };

  // close function after submitting the state
  const handleClose = () => {
    setKind("Leave");
    setLeaveForm(Intial_Leave_Form);
    setLoanForm(Intial_Loan_Form);
    setOverTimeForm(Intial_OverTime_Form);
    setRemoteWorkForm(Intial_RemoteWork_Form);
    setError(null);
    close();
  };

  const handleSubmit = () => {
    if (!currentUser) return;

    if (kind === "Leave") {
      const validationError = validateLeaveForm(leaveForm);
      if (validationError) {
        setError(validationError);
        return;
      }

      addRequest(currentUser.id, {
        kind: "leave",
        dayType: leaveForm.dayType,
        leaveType: leaveForm.leaveType,
        startDate: leaveForm.startDate,
        endDate: leaveForm.endDate,
        reason: leaveForm.reason,
        managerId: leaveForm.managerId,
      });

      notify.success("Leave request Added successfully!");
    } else if (kind === "OverTime") {
      const validationError = validateOverTimeForm(overTimeForm);
      if (validationError) {
        setError(validationError);
        return;
      }

      addRequest(currentUser.id, {
        kind: "overTime",
        date: overTimeForm.date,
        startTime: overTimeForm.startTime,
        endTime: overTimeForm.endTime,
        reason: overTimeForm.reason,
        managerId: overTimeForm.managerId,
      });

      notify.success("Over time request Added successfully!");
    } else if (kind === "Remote Work") {
      const validationError = validateRemoteWork(remoteWorkForm);
      if (validationError) {
        setError(validationError);
        return;
      }

      addRequest(currentUser.id, {
        kind: "remoteWork",
        date: remoteWorkForm.date,
        reason: remoteWorkForm.reason,
        managerId: remoteWorkForm.managerId,
      });

      notify.success("Remote work request Added successfully!");
    } else if (kind === "Loan") {
      const validationError = validateLoan(loanForm);
      if (validationError) {
        setError(validationError);
        return;
      }

      addRequest(currentUser.id, {
        kind: "loan",
        loanReason: loanForm.loanReason,
        Amount: loanForm.Amount,
        detailedExplanation: loanForm.detailedExplanation,
        managerId: loanForm.managerId,
      });
      notify.success("Loan request Added successfully!");
    }

    handleClose();
  };

  return (
    <Modal
      opened={opened}
      onClose={close}
      size="90%"
      title="Add Request"
      centered
    >
      <Flex direction={"column"} gap={16}>
        <Flex gap={16}>
          {requestTypes.map((r, i) => (
            <Button
              key={i}
              value={kind}
              onClick={() => setKind(r.label)}
              variant={r.label === kind ? "filled" : "outline"}
              w="25%"
              bg={r.label === kind ? "" : "#fafafb"}
              h={"100%"}
              py={20}
              radius={16}
              className={`${r.label == kind ? "" : "!border !border-border !font-medium"}`}
            >
              <Stack gap={12} align="center">
                <span>{r.icon}</span>
                <span className="text-[14px]">{r.label}</span>
              </Stack>
            </Button>
          ))}
        </Flex>
        {/* here is the form */}
        {kind === "Leave" && (
          <LeaveForm
            form={leaveForm}
            onChange={onChangeUpdateLeaveFormFields}
          />
        )}
        {kind === "OverTime" && (
          <OverTimeForm form={overTimeForm} onChange={onChangeOverTimeForm} />
        )}
        {kind === "Remote Work" && (
          <RemoteWorkForm
            form={remoteWorkForm}
            onChange={onChangeRemoteWorkForm}
          />
        )}
        {kind === "Loan" && (
          <LoanForm form={loanForm} onChange={onChangeLoanForm} />
        )}
        {error && (
          <Text c="red" size="sm">
            {error}
          </Text>
        )}
        <Flex justify="flex-end" gap="12px" px={24} pb={16}>
          <Button variant="default" onClick={close}>
            Cancel
          </Button>
          <Button type="submit" onClick={handleSubmit}>
            Send Request
          </Button>
        </Flex>
      </Flex>
    </Modal>
  );
}
