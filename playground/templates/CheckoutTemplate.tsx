/**
 * Checkout — a list that edits itself, and a summary that has to keep up.
 *
 * The quantity steppers are `InputGroup` rather than `TextField`: a number
 * welded to two buttons is exactly the case Material's text field does not
 * cover. The order summary is a sheet on compact and a sticky column above it,
 * which is the one layout change worth making at this size.
 */
import { useState } from "react"
import {
  ArrowLeftIcon,
  MinusIcon,
  PlusIcon,
  ShieldCheckIcon,
  ShoppingBagIcon,
  TagIcon,
  Trash2Icon,
  TruckIcon,
} from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Chip } from "@/components/ui/chip"
import { Icon } from "@/components/ui/icon"
import { Image } from "@/components/ui/image"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { Link } from "@/components/ui/link"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { FieldLabel, FieldDescription } from "@/components/ui/field"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetFooter,
  SheetHandle,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { TextField } from "@/components/ui/text-field"
import {
  TopAppBar,
  TopAppBarActions,
  TopAppBarNavigation,
  TopAppBarTitle,
} from "@/components/ui/top-app-bar"
import { Toaster, toast } from "@/components/ui/toast"
import { gradient } from "./placeholders"

const INITIAL_ITEMS = [
  { id: "a", name: "Expressive desk lamp", variant: "Walnut", price: 129, quantity: 1 },
  { id: "b", name: "Token notebook, A5", variant: "Dotted", price: 18, quantity: 2 },
  { id: "c", name: "Surface ramp poster", variant: "50 × 70 cm", price: 32, quantity: 1 },
]

const SHIPPING = [
  { value: "standard", label: "Standard", note: "4–6 days — free", cost: 0 },
  { value: "express", label: "Express", note: "1–2 days", cost: 12 },
  { value: "pickup", label: "Collect in store", note: "Ready in 2 hours", cost: 0 },
]

const currency = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
})

export function CheckoutTemplate() {
  const [items, setItems] = useState(INITIAL_ITEMS)
  const [shipping, setShipping] = useState("standard")
  const [promo, setPromo] = useState("")
  const [promoError, setPromoError] = useState<string | undefined>()
  const [applied, setApplied] = useState<string | null>(null)

  const subtotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  )
  const shippingCost = SHIPPING.find((option) => option.value === shipping)!.cost
  const discount = applied ? subtotal * 0.1 : 0
  const total = subtotal + shippingCost - discount

  function setQuantity(id: string, next: number) {
    setItems((current) =>
      current.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, next) } : item,
      ),
    )
  }

  function applyPromo() {
    if (promo.trim().toUpperCase() === "M3EXPRESSIVE") {
      setApplied(promo.trim().toUpperCase())
      setPromoError(undefined)
      toast.add({ description: "Promotion applied", timeout: 4000 })
    } else {
      setApplied(null)
      setPromoError("That code is not recognised.")
    }
  }

  const summary = (
    <div className="flex flex-col gap-m3-md">
      <div className="flex items-center justify-between text-m3-body-lg">
        <span>Subtotal</span>
        <span>{currency.format(subtotal)}</span>
      </div>
      <div className="flex items-center justify-between text-m3-body-lg">
        <span>Shipping</span>
        <span>
          {shippingCost === 0 ? "Free" : currency.format(shippingCost)}
        </span>
      </div>
      {applied ? (
        <div className="flex items-center justify-between text-m3-body-lg text-m3-primary">
          <span className="flex items-center gap-m3-sm">
            <Icon size="xs">
              <TagIcon />
            </Icon>
            {applied}
          </span>
          <span>−{currency.format(discount)}</span>
        </div>
      ) : null}
      <Separator />
      <div className="flex items-center justify-between text-m3-title-lg">
        <span>Total</span>
        <span>{currency.format(total)}</span>
      </div>
    </div>
  )

  return (
    <div className="bg-background text-foreground flex min-h-full flex-col">
      <TopAppBar>
        {/*
          The small app bar reserves a 56dp leading slot, so a bar without a
          navigation icon starts its title 4dp from the edge. This is that
          slot, not decoration.
        */}
        <TopAppBarNavigation>
          <Button variant="ghost" size="icon" aria-label="Go back">
            <ArrowLeftIcon />
          </Button>
        </TopAppBarNavigation>
        <TopAppBarTitle>Checkout</TopAppBarTitle>
        <TopAppBarActions>
          <Chip variant="outline" size="sm">
            <ShoppingBagIcon data-icon="inline-start" />
            {items.reduce((count, item) => count + item.quantity, 0)}
          </Chip>
        </TopAppBarActions>
      </TopAppBar>

      <main className="mx-auto grid w-full max-w-5xl gap-m3-lg p-m3-lg pb-m3-4xl m3-expanded:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] m3-expanded:items-start">
        <div className="flex min-w-0 flex-col gap-m3-lg">
          <Card>
            <CardHeader>
              <CardTitle>Your bag</CardTitle>
              <CardDescription>
                Prices include VAT. Items are held for 30 minutes.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-m3-lg">
              {items.map((item, index) => (
                <div
                  key={item.id}
                  className="flex flex-wrap items-center gap-m3-md"
                >
                  <Image
                    src={gradient(index + 4)}
                    alt={item.name}
                    shape="md"
                    className="size-20 object-cover"
                  />
                  <div className="flex min-w-40 flex-1 flex-col gap-m3-xs">
                    <span className="text-m3-title-sm">{item.name}</span>
                    <span className="text-m3-body-sm text-m3-on-surface-variant">
                      {item.variant}
                    </span>
                    <span className="text-m3-body-md">
                      {currency.format(item.price)}
                    </span>
                  </div>

                  {/*
                    The stepper is one control, not three: the buttons live
                    inside the input's own box so the whole thing reads as a
                    single field with a value.
                  */}
                  <InputGroup className="w-36">
                    <InputGroupAddon align="inline-start">
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        aria-label={`Decrease ${item.name}`}
                        disabled={item.quantity === 1}
                        onClick={() => setQuantity(item.id, item.quantity - 1)}
                      >
                        <MinusIcon />
                      </Button>
                    </InputGroupAddon>
                    <InputGroupInput
                      aria-label={`Quantity of ${item.name}`}
                      className="text-center"
                      inputMode="numeric"
                      value={String(item.quantity)}
                      onChange={(event) =>
                        setQuantity(item.id, Number(event.target.value) || 1)
                      }
                    />
                    <InputGroupAddon align="inline-end">
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        aria-label={`Increase ${item.name}`}
                        onClick={() => setQuantity(item.id, item.quantity + 1)}
                      >
                        <PlusIcon />
                      </Button>
                    </InputGroupAddon>
                  </InputGroup>

                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={`Remove ${item.name}`}
                    onClick={() => {
                      setItems((current) =>
                        current.filter((entry) => entry.id !== item.id),
                      )
                      toast.add({
                        description: `${item.name} removed`,
                        timeout: 5000,
                        actionProps: {
                          children: "Undo",
                          onClick: () => setItems(INITIAL_ITEMS),
                        },
                      })
                    }}
                  >
                    <Trash2Icon />
                  </Button>
                </div>
              ))}

              {items.length === 0 ? (
                <div className="flex flex-col items-center gap-m3-md py-m3-3xl">
                  <Icon size="xl">
                    <ShoppingBagIcon />
                  </Icon>
                  <p className="text-m3-title-md">Your bag is empty</p>
                  <Button
                    variant="tonal"
                    onClick={() => setItems(INITIAL_ITEMS)}
                  >
                    Restore items
                  </Button>
                </div>
              ) : null}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Delivery</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={shipping}
                onValueChange={(value) => setShipping(value as string)}
                className="flex flex-col gap-m3-md"
              >
                {SHIPPING.map((option) => (
                  <div key={option.value} className="flex items-start gap-m3-md">
                    <RadioGroupItem
                      id={`ship-${option.value}`}
                      value={option.value}
                    />
                    <div className="flex flex-1 flex-col gap-m3-xs">
                      <FieldLabel htmlFor={`ship-${option.value}`}>
                        {option.label}
                      </FieldLabel>
                      <FieldDescription>{option.note}</FieldDescription>
                    </div>
                    <span className="text-m3-body-md">
                      {option.cost === 0 ? "Free" : currency.format(option.cost)}
                    </span>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Promotion</CardTitle>
              <CardDescription>
                Try <code>M3EXPRESSIVE</code> for 10% off.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap items-start gap-m3-md">
              <TextField
                label="Promo code"
                className="min-w-56 flex-1"
                value={promo}
                onValueChange={(value) => {
                  setPromo(value)
                  setPromoError(undefined)
                }}
                error={promoError}
              />
              <Button
                variant="tonal"
                className="mt-m3-sm"
                disabled={promo.trim().length === 0}
                onClick={applyPromo}
              >
                Apply
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Expanded and up gets a sticky summary column; compact gets the
            same content in a bottom sheet, reached from the fixed bar. */}
        <Card variant="filled" className="hidden m3-expanded:block m3-expanded:sticky m3-expanded:top-m3-lg">
          <CardHeader>
            <CardTitle>Order summary</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-m3-lg">
            {summary}
            <Alert severity="success">
              <AlertTitle>Free returns</AlertTitle>
              <AlertDescription>
                30 days, no questions. <Link href="#">Returns policy</Link>.
              </AlertDescription>
            </Alert>
            <Button
              className="w-full"
              disabled={items.length === 0}
              onClick={() =>
                toast.add({ description: "Taking you to payment…", timeout: 4000 })
              }
            >
              Pay {currency.format(total)}
            </Button>
            <div className="flex items-center justify-center gap-m3-sm text-m3-body-sm text-m3-on-surface-variant">
              <Icon size="xs">
                <ShieldCheckIcon />
              </Icon>
              Encrypted end to end
            </div>
          </CardContent>
        </Card>
      </main>

      <div className="fixed inset-x-0 bottom-0 flex items-center justify-between gap-m3-md bg-m3-surface-container p-m3-lg shadow-m3-2 m3-expanded:hidden">
        <div className="flex flex-col">
          <span className="text-m3-label-md text-m3-on-surface-variant">
            Total
          </span>
          <span className="text-m3-title-lg">{currency.format(total)}</span>
        </div>
        <Sheet>
          <SheetTrigger render={<Button variant="outline">Summary</Button>} />
          <SheetContent side="bottom">
            <SheetHandle />
            <SheetHeader>
              <SheetTitle>Order summary</SheetTitle>
            </SheetHeader>
            <SheetBody>{summary}</SheetBody>
            <SheetFooter>
              <Button
                className="w-full"
                onClick={() =>
                  toast.add({
                    description: "Taking you to payment…",
                    timeout: 4000,
                  })
                }
              >
                Pay {currency.format(total)}
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
        <Button
          disabled={items.length === 0}
          onClick={() =>
            toast.add({ description: "Taking you to payment…", timeout: 4000 })
          }
        >
          <TruckIcon />
          Pay
        </Button>
      </div>

      <Toaster />
    </div>
  )
}
