import {
  DatePickerDialog,
  DateRangePicker,
  type DatePickerDialogProps,
  type DateRange,
} from "../../index"

const range: DateRange = { start: null, end: null }
const single: DatePickerDialogProps = {
  label: "Date",
  value: null,
  onValueChange: () => undefined,
}

function DatePickerDialogTypeChecks() {
  return (
    <>
      <DatePickerDialog {...single} mode="input" />
      <DateRangePicker label="Range" value={range} onValueChange={() => undefined} />
      {/* @ts-expect-error RangePicker requires both value and onValueChange. */}
      <DateRangePicker label="Range" />
    </>
  )
}

void DatePickerDialogTypeChecks
