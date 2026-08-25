import { DialTimePicker, TimeDial, type DialTimePickerProps } from "../../index"

const props: DialTimePickerProps = {
  label: "Time",
  value: { hour: 13, minute: 30 },
  onValueChange: () => undefined,
}

function TimeDialTypeChecks() {
  return (
    <>
      <DialTimePicker {...props} mode="24-hour" />
      <TimeDial value={props.value} onValueChange={props.onValueChange} phase="minute" />
      {/* @ts-expect-error DialTimePicker uses the shared controlled TimeValue. */}
      <DialTimePicker label="Time" value="13:30" onValueChange={() => undefined} />
    </>
  )
}

void TimeDialTypeChecks
