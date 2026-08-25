import { TimePicker, type TimePickerProps, type TimeValue } from "../../index"

const value: TimeValue = { hour: 13, minute: 45 }
const props: TimePickerProps = {
  label: "Time",
  value,
  onValueChange: () => undefined,
  mode: "24-hour",
}

function TimePickerTypeChecks() {
  return (
    <>
      <TimePicker {...props} />
      {/* @ts-expect-error TimePicker is controlled. */}
      <TimePicker label="Time" value={value} />
    </>
  )
}

void TimePickerTypeChecks
