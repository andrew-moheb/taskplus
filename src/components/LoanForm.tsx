import { Loan } from "@/store/Requests";
import { Flex, NumberInput, Select, Textarea } from "@mantine/core";
import { getAllManagers } from "@/utils/managers";

export const Intial_Loan_Form: Loan = {
  kind: "loan",
  loanReason: "",
  Amount: 0,
  detailedExplanation: "",
  managerId: "",
};

const LOAN_REASONS = [
  { label: "Medical Expenses", value: "medical" },
  { label: "Education Fees", value: "education" },
  { label: "Home Renovation", value: "renovation" },
  { label: "Emergency Expenses", value: "emergency" },
  { label: "Personal Expenses", value: "personal" },
];

function LoanForm({
  form,
  onChange,
}: {
  form: Loan;
  onChange: <K extends keyof Loan>(key: K, value: Loan[K]) => void;
}) {
  return (
    <>
      <Select
        styles={{
          label: {
            fontWeight: 500,
            fontSize: "14px",
            marginBottom: "8px",
          },
        }}
        value={form.loanReason}
        onChange={(v) => onChange("loanReason", v as string)}
        data={LOAN_REASONS}
        label="Loan Reason"
        placeholder="select reason"
      />
      <NumberInput
        label={"Amount  (5000 max)"}
        suffix=" EGP"
        styles={{
          label: {
            fontWeight: 500,
            fontSize: "14px",
            marginBottom: "8px",
          },
        }}
        min={0}
        max={5000}
        value={form.Amount}
        onChange={(v) => onChange("Amount", v as number)}
      />
      <Flex direction={"column"} className="gap-4">
        <Textarea
          styles={{
            label: {
              fontWeight: 500,
              fontSize: "14px",
              marginBottom: "8px",
            },
          }}
          required
          label={"Detailed Explanation"}
          rows={10}
          value={form.detailedExplanation}
          onChange={(e) => onChange("detailedExplanation", e.target.value)}
          placeholder="Write Detailed Explanation here...."
          radius={8}
        />
        <Select
          styles={{
            label: {
              fontWeight: 500,
              fontSize: "14px",
              marginBottom: "8px",
            },
          }}
          value={form.managerId}
          onChange={(v) => onChange("managerId", v as string)}
          data={getAllManagers()}
          label="Manager"
          placeholder="Assign To"
        />
      </Flex>
    </>
  );
}

export default LoanForm;
