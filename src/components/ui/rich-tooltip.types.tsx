import { RichTooltip, RichTooltipContent, RichTooltipTitle, RichTooltipTrigger } from "../../index"

function RichTooltipTypeChecks() {
  return <RichTooltip open onOpenChange={() => undefined}><RichTooltipTrigger>More</RichTooltipTrigger><RichTooltipContent><RichTooltipTitle>Title</RichTooltipTitle></RichTooltipContent></RichTooltip>
}
void RichTooltipTypeChecks
