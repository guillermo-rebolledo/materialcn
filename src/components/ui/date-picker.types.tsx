import { DatePicker, type DatePickerProps } from "../../index"

const props: DatePickerProps = {
  label: "Date",
  value: null,
  onValueChange: () => undefined,
  locale: "es-MX",
}

function DatePickerTypeChecks() {
  return (
    <>
      <DatePicker {...props} />
      {/* @ts-expect-error DatePicker is controlled. */}
      <DatePicker label="Date" value={null} />
    </>
  )
}

void DatePickerTypeChecks
