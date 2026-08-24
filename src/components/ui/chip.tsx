/**
 * Material calls this 32dp component a chip. `Badge` is retained as a
 * compatibility name because it is the corresponding shadcn component API.
 *
 * Ticket 02 builds the semantic assist, filter, input, and suggestion chip
 * behaviors on top of this compatibility boundary.
 */
export {
  Badge as Chip,
  badgeVariants as chipVariants,
} from "./badge"
