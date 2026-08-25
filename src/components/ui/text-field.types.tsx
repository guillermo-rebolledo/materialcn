import { TextField, type TextFieldProps } from "../../index"

const props: TextFieldProps = { label: "Name", value: "", onValueChange: () => undefined }
function TextFieldTypeChecks() {
  return (
    <>
      <TextField {...props} multiline variant="filled" />
      <TextField label="Name" defaultValue="Ada" />
      {/* @ts-expect-error Controlled TextField needs onValueChange. */}
      <TextField label="Name" value="Ada" />
    </>
  )
}
void TextFieldTypeChecks
