/**
 * The playground's theme and palette controls.
 *
 * Together they are the demonstration: nothing below them is patched for
 * colour, so switching either re-points the token layer and every component
 * on the screen follows. The palette swatches carry `data-palette` themselves,
 * which is the same mechanism at the scale of a single element.
 */
import { MoonIcon, PaletteIcon, SunIcon, MonitorIcon } from "lucide-react"

import {
  useTheme,
  PALETTES,
  type Palette,
  type Theme,
} from "@/components/theme-provider"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

const THEMES: { value: Theme; label: string; icon: typeof SunIcon }[] = [
  { value: "light", label: "Light", icon: SunIcon },
  { value: "dark", label: "Dark", icon: MoonIcon },
  { value: "system", label: "System", icon: MonitorIcon },
]

const CHOICES: { id: Palette; label: string }[] = [
  { id: "baseline", label: "Baseline" },
  ...PALETTES.map((entry) => ({ id: entry.id as Palette, label: entry.label })),
]

export function ThemeControls() {
  const { theme, setTheme, palette, setPalette } = useTheme()
  const current = CHOICES.find((choice) => choice.id === palette)

  return (
    <div className="flex items-center gap-m3-sm">
      <DropdownMenu>
        <DropdownMenuTrigger render={<Button variant="outline" size="xs" />}>
          <PaletteIcon />
          {current?.label}
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuRadioGroup
            value={palette}
            onValueChange={(next) => setPalette(next as Palette)}
          >
            {CHOICES.map((choice) => (
              <DropdownMenuRadioItem key={choice.id} value={choice.id}>
                {/*
                  The swatch is the point: an element carrying `data-palette`
                  resolves `bg-m3-primary` against that palette, so the colour
                  is the real one rather than a hard-coded sample of it.
                */}
                <span
                  aria-hidden="true"
                  data-palette={choice.id === "baseline" ? undefined : choice.id}
                  className="size-4 shrink-0 rounded-m3-full bg-m3-primary"
                />
                {choice.label}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <ToggleGroup
        value={[theme]}
        onValueChange={([next]) => next && setTheme(next as Theme)}
        variant="outline"
        size="sm"
      >
        {THEMES.map(({ value, label, icon: Glyph }) => (
          <ToggleGroupItem key={value} value={value} aria-label={label}>
            <Glyph />
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  )
}
