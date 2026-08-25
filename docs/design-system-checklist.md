# Design System Checklist

Extracted from <https://www.designsystemchecklist.com/> (source: <https://github.com/ardakaracizmeli/design-system-checklist>).

## Design language

Like any language, a design language is a methodical way of communicating with your audience through your approach to product design. It’s the cornerstone of consistent customer experiences.

### Brand

Brand drives every single decision you make when building new products or features. A good brand is much more than a name and a logo. It’s the values that define your unique identity and what makes you stand out from others.

- [ ] **Vision** — Why you exist, what your values are, and how they’ll help guide the future of your product.
- [ ] **Design principles** — The considerations that guide the basis of your practice. They outline how you approach design philosophically and help with everyday decisions.
- [ ] **Tone of voice** — A clear tone of voice defines how you speak to your audience at every moment of their journey, helping them get wherever they want to go.
- [ ] **Terminology** — Create the standard terms and phrases that need to be kept the same throughout the user experience, speeding up the design process and unifying your voice.
- [ ] **Brand assets** — Using a consistent set of brand assets aligns the user experience across your product and marketing campaigns. These assets include your logo, fonts, icons, illustrations, etc.

### Guidelines

Understanding how to approach common UX patterns will allow your organization to establish a consistent approach and user experience on any platform.

- [ ] **Accessibility** — Guidelines for how you approach accessibility and how you leverage color, hierarchy, and assistive technologies to help your users.
- [ ] **Writing guidelines** — Every consistent experience needs watertight writing. Laying down the foundations for your house style early keeps everything in line with consistent grammar, style choices, and action-oriented language to help your design.
- [ ] **Microcopy guidelines** — The standard way to write for the components in your design system. These take platform conventions and best practices for writing all into consideration.
- [ ] **Terminology** — Create the standard terms and phrases that need to be kept the same throughout the user experience, speeding up the design process and unifying your voice.
- [ ] **Internationalisation** — Define standards for handling content translated into various languages supported by the product. It includes handling translation edge cases and content bi-directionality.

## Foundations

Design assets and tokens that store values for the base layer of your design system, like color and typography. They’re used in components, so changes on this level will resonate throughout the whole system.

### Color

Not only an efficient way to showcase your brand but also an efficient way to communicate with your users. Color palettes created with purpose over aesthetics in mind can help you develop intuitive design patterns by adding meaning to your interface.

- [ ] **Accessibility** — Make sure to have accessible pairings between the primary colors in your palette. More importantly, ensure that your background and text colors have at least an AA standard contrast ratio.
- [ ] **Semantic colors** — Besides your brand colors, make sure to have colors defined and made into variables for functions like disabled states, backgrounds, actions, and high-contrast text.
- [ ] **Dark mode** — Preparing a dark mode version of your color palette will allow your design system to adapt to the user's OS color preferences.
- [ ] **Guidelines** — Provide guidelines on how and when to use the colors in your palette, what to keep in mind when working with them, and how not to use them.

### Layout

A well-thought-out layout goes a long way. Consistent use of a grid and spacing makes it easier for your users to scan the user interface and grasp the content.

- [ ] **Units** — Units are the most granular building blocks for layout. Defining a set of values with consistent increments (such as 4, 8, 12, and 16 for a 4-point system) will provide the foundation for designing your grid and spacing values.
- [ ] **Grid** — Every layout should sit on a grid that brings order and hierarchy to the interface. Define a grid separately for mobile, tablet, and desktop devices with columns, gutters, and margins so your interface can adapt to any platform quickly.
- [ ] **Breakpoints** — Predefine the screen sizes and orientations your grid will adapt to.
- [ ] **Spacing** — Horizontal and vertical rhythm plays a significant role in a layout. You should provide straightforward methods for adding space between interface elements independent of your grid.

### Typography

Typography is one of the main ways you surface content in products. A clear hierarchy and contrasting styles in your typography scale will make things easier to read and help with the overall structure of your product. It’s also an opportunity to visualize your brand character and presence.

- [ ] **Responsiveness** — Desktop devices can usually afford to have bigger font sizes compared to mobile devices. Creating a typography scale that adapts to the viewport size will help with a more meaningful hierarchy and layout.
- [ ] **Grid relation** — Font sizes and leading should match your grid to allow better pairing between text and other UI elements. A good example of this is text paired with icons with bounding boxes.
- [ ] **Readability** — Optimizing the letter spacing (tracking), line height (leading) and line length for your typography scale will help with the readability of text.
- [ ] **Performance** — Custom fonts need to be downloaded before they can be displayed, especially on the web. Make sure that you have sensible fallbacks and fast loading time for your typography assets. Using system fonts solves this performance problem.
- [ ] **Guidelines** — Provide guidelines on how and when to use the pairings in your typography scale, what to keep in mind when working with them, and how not to use them.

### Elevation

Elevation controls the relative distance between two surfaces along the z-axis. In light mode, it’s usually highlighted by the shadow value applied to a surface, while in dark mode, it’s communicated using the background color value.

- [ ] **Shadows** — Provide multiple shadow values based on the supported elevation levels. Most of the time, you will need 3 to 4 elevation levels in your product.
- [ ] **Background colors** — Each shadow value should have a linked background color. In light mode, these colors might all resolve to the white color since it’s used together with the shadow. In dark mode, they will be used instead of the shadow to communicate the z-axis distance of a surface.
- [ ] **Z-index** — Define a system of z-index values to control which elements have priority to be rendered on top of the others.

### Motion

Shared motion values provide a more coherent user experience and better alignment with the brand.

- [ ] **Easing** — Provide standard easing functions used across the system for component transitions. As a start, you can use standard, accelerated and decelerated functions that should cover common component use cases.
- [ ] **Duration** — Define multiple values for your animation duration to keep the component transitions consistent across the product
- [ ] **Accessibility** — Pay attention to the user's reduced motion preferences and either make the animations less prominent or remove them altogether.

### Iconography

Icons are symbols that represent functionality or content. They’re especially recognizable and helpful in user interfaces since their meaning can be understood at a glance. Though they can be used just for decoration, their full potential can be realized when they’re used meaningfully and consistently.

- [ ] **Accessibility** — For icons that convey a meaning or serve a function, offer a default accessible name that expresses that same meaning or function. Screen readers and other assistive technologies may use this name to orient the user about the interface. For purely decorative icons, a name is not required. If your design system exports front-end code, ensure that the icon name is included, for example, using an aria-label.
- [ ] **Style** — Make sure that your icon family makes visual sense as a whole. Picking an outlined or filled style and sticking with it will lead to better visual consistency and predictability.
- [ ] **Naming** — Name your icons based on their communicative purpose rather than how they look. For instance, a triangular media player plays button icon should be named 'play,' not 'triangle.' You can still add related keywords to improve discoverability.
- [ ] **Relation with grid** — Draw your icons in a bounding box that plays well with your grid. This makes for a better pairing with other UI elements. A good example would be icons with bounding boxes paired with text.
- [ ] **Keywords** — Adding keywords will improve the discoverability of each icon and provide a better user experience for anyone using your system.
- [ ] **Reserved icons** — Reserving icons representing common actions will prevent their use in any other context. System icons for navigation or adding and deleting are good examples. This leads to a more intuitive user experience.
- [ ] **Guidelines** — Provide guidelines on how and when to use icons, what to keep in mind when working with them, and how not to use them.

## Core components

Components are the main building blocks for user interfaces. Building a reusable component library enhances your product development workflow by reducing design and tech debt and speeding up the process. Core components can’t be broken down into granular pieces without losing their meaning.

### Accordion

Accordion toggles the visibility of content regions when the trigger element gets pressed.

- [ ] **Active state** — Accordion comes in two states for toggling its content visibility. If an accordion trigger displays an icon, it should be visually distinct between states.
- [ ] **Composition** — Content area should be flexible enough to support various types of content, including other components.
- [ ] **Toggle transition** — Add a subtle animation to help users understand and follow the component behavior when switching between states.
- [ ] **Content and trigger relation** — Focusing the content area with assistive technologies should announce additional context from the trigger element.

### Alert

Alert displays a prominent message about the whole page or its specific area.

- [ ] **Colors** — It's crucial to differentiate the alert's visual appearance based on its role. If you're using background colors for role differentiation, ensure there's enough contrast ratio with the content displayed inside the alert.
- [ ] **Title support** — Supporting a title can help your user understand the context of the message faster for longer alert messages.
- [ ] **Icon support** — Icon illustrates the role of the alert and provides an additional hint about it for colorblind people.
- [ ] **Supplementary actions** — Actions in the alert should relate to their text and provide a way to react to the message sent to the user.
- [ ] **Responsiveness** — Alert can adapt to the viewport size, usually becoming full-width for mobile to save some space.
- [ ] **Accessibility roles** — When using assistive technologies, alerts should announce their accessibility role correctly.

### Avatar

Thumbnail of a user photo, organization, or a visual representation of other types of content.

- [ ] **Image** — Avatars should mask an image into their shape and work with any image size since they may get this image from unknown data sources.
- [ ] **Image fallback** — When not passing an image or there is an image loading error, avatars should be able to show a fallback with a different image, icon, or text initials.
- [ ] **Sizes** — There are many contexts to use an avatar, which require different sizes for the component. Use at least 2-3 different sizes for average projects and ensure there’s at least a small size available.
- [ ] **Colors** — A background color should be applied to the avatar shape when used without an image. Make sure that icons and text have enough contrast ratio with the background according to the WCAG AA standard.
- [ ] **Shape** — Avatars might support multiple shapes, like square or circle, based on the area they are used in.
- [ ] **Avatar groups** — Multiple avatars can be stacked together to represent a group of users.
- [ ] **Accessibility label** — Avatar should provide an accessibility label when used for non-decorative images and has no text representation of its contents.

### Badge

Compact element that represents the status of an object or user input.

- [ ] **Colors** — Badges may play various roles in your product, and having a predefined color for each role should help users understand their meaning. When changing colors, make sure the text has enough contrast ratio with the background according to the WCAG AA standard.
- [ ] **Variants** — Based on where in the product badges are rendered, you might support multiple component variants. For example, you can have some badges using a faded background to avoid drawing too much attention.
- [ ] **Sizes** — Badges can come in multiple sizes depending on where a badge is used. For example, you can use the large size for marketing pages.
- [ ] **Icon support** — To better illustrate the meaning of a badge, you can display an icon next to the text. Make sure that for small badges, icon contents are still recognizable.
- [ ] **Dismissible action** — Badges can be used as a dynamic way to display selected values, and there should be a way to dismiss them.
- [ ] **Empty state** — Badges can be used without any text content inside. That usually requires changing their styles to preserve the correct shape.
- [ ] **Positioning** — When used as a status badge, like a notification indicator – you should be able to position it relative to those elements.

### Button

Interactive element used for single-step actions.

- [ ] **Colors** — Buttons may play various roles in your product, and having a predefined color for each role should help users understand their meaning. When changing colors, make sure the text has enough contrast ratio with the background according to the WCAG AA standard.
- [ ] **Variants** — When using multiple buttons, there should be a way to differentiate between primary and secondary actions. Buttons may play different roles for the user or be used on various surfaces, and they have to change how they look.
- [ ] **Sizes** — Depending on where a button will be used, it can come in multiple sizes. For example, you can use the small size for dense areas of your application.
- [ ] **Icon support** — Icons easily communicate the button's purpose when used next to its label or can be used without text when there's insufficient space. Ensure the accessibility label is provided when used with an icon only.
- [ ] **Hover state** — Clearly show that the button is interactive when hovered with a mouse cursor.
- [ ] **Active state** — Provide a visual cue when a button is pressed, used for selecting a value, or toggles other elements on the page.
- [ ] **Loading state** — Indicate when users have to wait for the result of their action after pressing a button. If a spinner is used to display this state, ensure it’s not changing the original button width or height.
- [ ] **Disabled state** — Visually shows that the button is not interactive and restricts it from being pressed.
- [ ] **Accessibility role** — Button should correctly announce the button or link accessibility roles and automatically resolve it based on the properties passed to it.
- [ ] **Focus indicator** — Button should have a visible focus indicator when it’s focused using the keyboard or assistive technologies.

### Breadcrumbs

Top-level product navigation that helps user understand the location of the current page and navigate back to its parents.

- [ ] **Icon support** — Icons help to communicate the roles of the pages to which breadcrumbs items link. Most of the time, you want to ensure they’re used consistently, not only for random items in the list.
- [ ] **Disabled state** — Each item in the list can be disabled separately to prevent users from navigating to the page.
- [ ] **Collapsed state** — If breadcrumbs items don’t fit into the parent container, the list should support collapsing items only to keep the relevant ones visible to the user.
- [ ] **Custom separator** — Depending on the usage context, items in the breadcrumbs list can use different separator styles.

### Calendar

Grid displaying days in one or more months and allow users to select a single date or a date range

- [ ] **Display modes** — Calendar might be used in various product areas and viewports. Make sure to support different display modes for rendering more than one month or a vertical layout.
- [ ] **Selected state** — Calendar should support a single date and a selection range. Selected dates should be visually highlighted, and the range between selected dates should be visible to the users.
- [ ] **Month selection** — To help users navigate longer date ranges, the calendar should provide an easy way to switch displayed months.
- [ ] **Day names** — Provide short labels for the weekday names in addition to the date numbers to let users easier navigate the date selection.
- [ ] **Internationalisation** — Calendars should be localized for all country regions supported by the product. That includes date formats and correct ordering of the weekdays.
- [ ] **Keyboard navigation** — Calendar dates should be focusable with keyboard and assistive technologies. Further navigation on the dates should happen with keyboard arrows or screen reader navigation and support switching the month by navigating out of a column or a row.
- [ ] **State announcement** — Selected dates should be announced by the assistive technologies when they get focused.

### Card

Container to group information about subjects and their related actions.

- [ ] **Content composition** — Content area should be flexible enough to support various types of content, including other components.
- [ ] **Media sections** — Cards are frequently used with media content. The most popular options are having a full-width area on top of the content or an area at one of the card’s sides.
- [ ] **Supplementary actions** — Cards can be used with actions usually placed at the bottom of the card, or the card itself can be tappable and represent an action.
- [ ] **Responsiveness** — On mobile viewports, cards are usually full-width to save space for the content.
- [ ] **Card groups** — Multiple cards can be grouped in a single list of content sections.

### Carousel

Horizontal scrollable areas used for displaying grouped content.

- [ ] **Navigation controls** — Carousels should be accessible for navigating its content on devices that work with the mouse instead of touch events.
- [ ] **Item composition** — Content area of the carousel items should be flexible enough to support various types of content, including other components.
- [ ] **Item sizes** — Layout of the items should be flexible to support different types of content. For mobile devices, make sure to show a part of the carousel item that doesn’t fit into the viewport to indicate the scrollable area.
- [ ] **Touch navigation** — Carousel content should be rendered inside a scrollable area to support touch events.
- [ ] **Responsiveness** — Carousel items layout might require adjustments based on the available space.
- [ ] **Keyboard navigation** — Keyboard and assistive technologies users should be able to navigate the carousel content without clicking on the navigation controls.

### Checkbox

Form field used to select one or multiple values from the list.

- [ ] **Label** — There should be a text label linked with the checkbox field. Clicking the label should also trigger the checkbox selection. If the label is not rendered on the page, assistive technologies should still announce it.
- [ ] **Checked state** — Display when the checkbox gets selected and is used for the form submission.
- [ ] **Error state** — Use an error state for form validation when the error is related to the checkbox field. Always use a text error along with a different field color.
- [ ] **Disabled state** — Use a disabled state to prevent checkbox interactions and remove its value from the submitted form values.
- [ ] **Indeterminate state** — Visually display when the checkbox has children selectable elements and only some are selected.
- [ ] **Checkbox group** — Checkboxes can be grouped to work with multiple values at the same time.
- [ ] **Keyboard support** — Checkbox selections should be triggered with the keyboard. Using native elements for this should provide this kind of interaction automatically.

### Divider

Element for visual content separation

- [ ] **Direction** — Dividers should separate both horizontal and vertical lists of content.
- [ ] **Accessibility role** — If the divider is playing a non-decorative role in the layout, its role should be announced by the assistive technologies.

### Dropdown

List of contextual actions that users can trigger.

- [ ] **Content composition** — Dropdowns may be used for context menus, product navigation, and other purposes. Their content area should be flexible enough to support various types of content, including other components.
- [ ] **Hover trigger** — Dropdown should support displaying its content on hover events. The same behavior should happen for keyboard users once its trigger gets focused.
- [ ] **Dynamic positioning** — Dropdown content should be displayed based on the current position of the trigger element on the screen and always stay visible to the user.
- [ ] **Responsiveness** — Dropdown content should be adjusted if it doesn’t fit the screen the same way on mobile devices as on desktop.
- [ ] **Focus trapping** — Once dropdown content is opened, the focus ring should move inside its content area and return to the trigger element when closed.
- [ ] **Keyboard navigation** — Dropdown should be accessible for keyboard and assistive technologies. Users should be able to close the dropdown using a separate close action, or once they tab outside the content area.

### Icon

Wrapper for SVG assets to control their appearance

- [ ] **Colors** — Icons should support color values available in design system tokens. Additionally, it’s a good practice to support color inheritance from their parent element.
- [ ] **Sizes** — Icons should have several predefined sizes to provide a holistic experience across the product. Typography pairings may be used for these size values to ensure they align with the text sizes.
- [ ] **Interactivity** — Icons are used as decorative elements most of the time. If an icon is meant to be interactive – that functionality should be included using buttons, links, or other interactive components.

### Image

Utility for displaying images and controlling their behavior.

- [ ] **Sizes** — Image should be flexible in terms of supported sizes. Besides just supporting width and height – add support for aspect ratio to scale its proportions based on the parent element dynamically.
- [ ] **Image fallback** — Display a fallback when the image URL is incorrect or undefined. That can be an empty box with a background, an icon, or a static placeholder image.
- [ ] **Screen density support** — Depending on the screen density, you should support loading multiple image assets of different sizes and serve the relevant one to the user.
- [ ] **Alt text** — When the image is non-decorative, it should provide an alt text describing the picture contents.

### Link

Interactive text element used for navigation within the text paragraphs.

- [ ] **Icon support** — An icon can be used next to the link to communicate the purpose of the link. Icons shouldn’t be used inside a link without a text label.
- [ ] **Colors** — Links may play various roles in your product, and having a predefined color for each role should help users understand their meaning. Since the link is a text element, it should be able to automatically inherit the color defined by its parent element, the same as other text content.
- [ ] **Disabled state** — Visually shows that the link is not interactive and restricts it from being pressed.
- [ ] **Font inheritance** — Links should be able to inherit the typography styles when used as a part of the text element.
- [ ] **Multiline display** — When used inside a text paragraph, links should support multiline display without breaking the text flow.
- [ ] **Accessibility role** — Links should correctly announce the button or link accessibility roles automatically resolve it based on the properties passed to it.

### List

List is used to display a list of items.

- [ ] **Order** — List items can use bulleted, numbered, and other styles and types of ordering.
- [ ] **Content cmposition** — List item content areas should be flexible enough to support various types of content, including other components.
- [ ] **Accessibility role** — Assistive technologies should announce lists with the correct role and number of items displayed.

### Loading indicator

Animated element that communicates progress without telling how long the process will take.

- [ ] **Colors** — Loading indicators might be used inside the elements with various roles and follow their color scheme.
- [ ] **Sizes** — Loading indicators might provide multiple sizes, depending on the size of the areas where the loading indicator is rendered.
- [ ] **Loading duration** — In some cases, the wait time can’t be determined. The loading indicator should be shown until the loading finishes or an error happens. In other cases, it’s better to indicate the time left until the loading is finished.
- [ ] **Reduced motion** — The loading indicator should be synced with the system motion settings and reduce its animation speed when reduced motion settings are turned on.
- [ ] **Accessibility label** — If the loading indicator is standalone – provide an accessibility label for the content area it’s loading.

### Modal

Container appearing in front of the main content to provide critical information or an actionable piece of content.

- [ ] **Content composition** — The main content area should be flexible enough to support various types of content, including other components.
- [ ] **Supplementary actions** — Since content in the modal may be actionable, it’s essential to have an area for action elements. This area is usually located at the bottom of the modal container.
- [ ] **Close action** — Modals should provide a straightforward way to close, as they block content when open. This may be either a separate close button or one of the supplementary actions.
- [ ] **Positioning** — Modals can be positioned in the center of the screen or displayed as sliding sheets on either side of the screen.
- [ ] **Sizes** — Provide support for changing the modal height and width based on the content you display.
- [ ] **Focus trapping** — When the modal gets opened, the user focus should move to the first focusable element and stay trapped inside it. When the modal is closed, the focus should return to the last active element.
- [ ] **Keyboard navigation** — It should be possible to close a modal by pressing the Esc key, and all the focusable elements inside the modal container should be accessible with keyboard navigation.
- [ ] **Title and subtitle labeling** — Modals should use the correct accessibility role, and they should be labeled by the title and subtitle elements. If there is no visible title or subtitle, it may use an accessibility label instead.

### Pagination

Pagination enables a selection from a range of pages

- [ ] **Selected page state** — Visually highlight the selected page in the list and make it non-interactive.
- [ ] **Page display ranges** — Define the ranges for pages rendered around the selected page. It helps render only a limited number of pages but lets the users navigate faster than moving by 1 page at a time.
- [ ] **Amount of items per page** — Provide an option to select the number of paginated items displayed on the page.
- [ ] **Indeterminate amount of pages** — When you don’t know the total number of available pages beforehand, use a different display mode to navigate pages individually.
- [ ] **Full page label announcements** — Pagination should provide clear, dynamic labels for each page for assistive technologies instead of just announcing the number without context.
- [ ] **State announcement** — Pagination should announce when a selected page is focused.

### Progress bar

Bar displaying progress for a task that takes a long time or consists of several steps.

- [ ] **Label** — Provide support for visually displaying a label explaining what a progress bar is responsible for.
- [ ] **Sizes** — Loading indicators might provide multiple sizes, depending on the size of the areas where the loading indicator is rendered.
- [ ] **Duration** — In some cases, the wait time can’t be determined. The loading indicator should be shown until the loading finishes or an error happens. In other cases, it’s better to indicate the time left until the loading is complete.
- [ ] **Accessibility label** — Provide support for adding an accessibility label in case you can’t display a label in the interface.

### Input radio

Radio is a form element used for selecting one option from a list.

- [ ] **Label** — There should be a text label linked with the radio field. Clicking the label should also trigger the checkbox selection. If the label is not rendered on the page, assistive technologies should still announce it.
- [ ] **Checked state** — Display when the radio gets selected and is used for the form submission.
- [ ] **Error state** — Use an error state for form validation when the error is related to the radio field. Always use a text error along with a different field color.
- [ ] **Disabled state** — Use a disabled state to prevent radio interactions and remove its value from the submitted form values.
- [ ] **Radio group** — Radio buttons are always used as a group to avoid locking the selection after one of the radio buttons is checked.
- [ ] **Keyboard support** — Radio selection should be triggered with the keyboard. Using native elements for this should provide this kind of interaction automatically.

### Select

Select lets you choose a single value from a list of options.

- [ ] **Label** — Text labels linked with the Select field can provide users with additional context. Clicking the label should also trigger the select dropdown.
- [ ] **Error state** — Use an error state for form validation when the error is related to the select only. Display an additional error icon for better accessibility.
- [ ] **Disabled state** — Use the disabled state to prevent Select interactions and remove its value from the submitted form values.
- [ ] **Placeholder** — When no value is selected – display a placeholder value. You can use the same placeholder value to let users reset the select value back to the default.
- [ ] **Helper text** — Provide users with additional context about the select purpose and the requirements for the selection.
- [ ] **Icon support** — Add an area for displaying an icon at the start of the field to communicate the purpose of the Select as a component or the selected value.
- [ ] **Prefix** — Add an area for custom content to make the selection more contextual for the user. For example, you can display country flags in your country code selection.
- [ ] **Sizes** — Depending on where select is going to be used, it can come in multiple sizes. For example, you can use the small size for dense areas of your application.
- [ ] **Accessibility label** — In case you don’t provide a visual text label for select, make sure to provide an accessibility label still describing the purpose of the component.

### Skeleton

Placeholder replacing page elements while their data is loading.

- [ ] **Sizes** — Skeleton should be able to match components of various sizes available in your design system to avoid unnecessary layout shifts once data is loaded.
- [ ] **Shapes** — Skeleton should be able to match components of various shapes available in your design system to keep the loading state aligned with the actual components' layout.
- [ ] **Composition** — You can compose simple skeletons into more advanced layouts. You don’t have to 1:1 map your application interface with skeletons.
- [ ] **Reduced motion** — Reduce or altogether remove the animation for the reduced motion user preference.

### Switch

Toggle for immediately changing the state of a single item.

- [ ] **Label** — There should be a text label linked with the switch. Clicking the label should also trigger the switch selection. If the label is not rendered on the page, assistive technologies should still announce it.
- [ ] **Checked state** — Display when the switch gets selected and activates the underlying functionality. Often, a switch is used to immediately update the data after it’s selected.
- [ ] **Disabled state** — Use a disabled state to prevent switch interactions.
- [ ] **Keyboard navigation** — Switch selection should be triggered with the keyboard. Using native elements for this should provide this kind of interaction automatically.
- [ ] **Accessibility label** — In case you don’t provide a visual text label for Switch, make sure to provide an accessibility label still describing the purpose of the component.

### Tabs

Navigation between multiple pages or content sections.

- [ ] **Content composition** — Content area should be flexible enough to support various types of content, including other components.
- [ ] **Variants** — To support different rendering contexts, tabs might support multiple variants. For example, they might be rendered as pills when used directly on the page while using an underlined variant for tabs rendered inside cards.
- [ ] **Selected state** — Since tabs always display the content from one of their panels, one of the tab triggers should always be selected and highlighted visually.
- [ ] **Disabled state** — Tab triggers can be disabled to prevent users from switching to a specific tab panel.
- [ ] **Icon support** — To better illustrate the meaning of each tab, you can display an icon next to the tab trigger text.
- [ ] **Equal width layout** — When used to take the entire width of the parent container, tab triggers can be stretched to take equal horizontal space.
- [ ] **Keyboard support** — When interacting with tabs using the keyboard, they should support arrow navigation to switch between the previous and next panels. The Home and End buttons should also move the selection to the first and last panels, respectively.

### Text area

Form field to enter and edit multiline text.

- [ ] **Label** — Text labels linked with the text area can provide users with additional context. Clicking the label should move the focus to the field.
- [ ] **Error state** — Use an error state for form validation when the error is related only to the Text area.
- [ ] **Disabled state** — Use a disabled state to prevent text area interactions and remove its value from the submitted form values.
- [ ] **Placeholder** — When the text area value is empty – display a placeholder value. Make sure that it’s not used instead of the label.
- [ ] **Helper text** — Provide users with additional context about the Text area purpose and the requirements for the expected value.
- [ ] **Sizes** — Depending on where the text area will be used, it can come in multiple sizes. For example, you can use the large size for the forms on marketing pages.
- [ ] **Accessibility label** — In case you don’t provide a visual text label for the text area, make sure to provide an accessibility label still describing the purpose of the component.

### Text field

Form field to enter and edit single-line text.

- [ ] **Label** — Text labels linked with the text field can provide users with additional context. Clicking the label should move the focus to the field.
- [ ] **Error state** — Use an error state for form validation when the error is related only to the text field.
- [ ] **Disabled state** — Use a disabled state to prevent text field interactions and remove its value from the submitted form values.
- [ ] **Placeholder** — When the text field value is empty – display a placeholder value. Make sure that it’s not used instead of the label.
- [ ] **Helper text** — Provide users with additional context about the text field purpose and the requirements for the expected value.
- [ ] **Icon support** — Add an area for displaying an icon at the start of the field to communicate the purpose of the text field as a component or the field value.
- [ ] **Prefix / Suffix** — Add an area for custom content to make the selection more contextual for the user. For example, you can display payment providers in the text field for credit card numbers.
- [ ] **Sizes** — Depending on where the text field will be used, it can come in multiple sizes. For example, you can use the large size for the forms on marketing pages.
- [ ] **Accessibility label** — In case you don’t provide a visual text label for the text field, make sure to provide an accessibility label still describing the purpose of the component.

### Toast

Notification message or a piece of information displayed above the page content.

- [ ] **Content composition** — Content area should be flexible enough to support various types of content, including other components.
- [ ] **Colors** — Depending on the role of the notification displayed in the toast, it can come in multiple colors. For example, it can be colored red for error notifications.
- [ ] **Icon support** — Add an area for displaying an icon at the start of the toast to communicate the purpose of the notification.
- [ ] **Timeout** — Toasts are usually dismissed after a timeout. Make sure to provide a long enough timeout to let the users read the message. If there is no timeout – provide a button to close the notification.
- [ ] **Stacking** — When multiple toasts have been triggered, stack them on top of each other to avoid cluttering the screen.
- [ ] **Supplementary action** — Actions in the notifications should be contextual to the notification purpose. For example, if you notify the user about deleting content, an action element can help them undo this operation.
- [ ] **Focus management** — When toasts have actions, they should be focusable from the keyboard to trigger them. While the focus is inside the toast container – timeout should get disabled.
- [ ] **Reduced motion** — Reduce or altogether remove the animation for the reduced motion user preference.

### Tooltip

Contextual text information display on element hover or focus.

- [ ] **Positioning** — When the tooltip default position doesn’t let it fit into the viewport – make sure to dynamically switch its position to another value.
- [ ] **Timeout** — Wait briefly before opening the Tooltip to ensure they don’t open while the user moves their cursor around the screen.
- [ ] **Keyboard support** — Tooltips should be accessible not only on mouse hover but also on the trigger element focus.

## Maintenance

Design systems are no different than any other project your team might take on. In order to successfully build and maintain one, you need a clear strategy that’s well executed daily, and you‘ll need to create opportunities for your colleagues to give feedback to help share your design system together.

### Documentation

Documentation resources are a core part of any design system as it saves time and effort for the team and everyone using the design system. It allows people to learn the ropes and find answers to the most commonly asked questions without contacting the team.

- [ ] **Design system principles** — List your core principles when building a design system to let designers and developers know your values and which are the main factors for the decision-making in your team.
- [ ] **Getting started** — Guide others through the first steps of setting up and using your design system, which can help them build their first feature or product without contacting you directly.
- [ ] **Design best practices** — Share tips on how to design products using the design system in a scalable way, avoid common pitfalls and use your design tool to its max potential.
- [ ] **Development best practices** — Share tips on developing products using the design system, the recommended technical dependencies, and avoiding common pitfalls.
- [ ] **Component anatomy** — Provide an overview of the components' design anatomy to help everyone understand the limitations of the component layout and which parts of it are customizable.
- [ ] **Component properties** — Document properties your components support in both design and code. We recommend aligning most of them across platforms for a smoother design handoff process.
- [ ] **Component composition examples** — When building low-level components supporting slots for inserting other content – provide examples of how to use them to create more advanced compositions.
- [ ] **Sandbox product example** — If you don’t have a way to test your components in the product yourself, you can build a simple application that simulates actual product layouts to test how your components behave in the wild and try out new design system features before releasing them.
- [ ] **Browser / OS support** — Define the level of support you provide for various operating systems and browsers, and make sure you align with the product on this topic.
- [ ] **Release cycle** — Establish and document a predictable release cycle for the major versions that include breaking changes. This way, product teams can plan the migrations on their side.

### Local libraries

The scope of the design system is usually to build the core repeating patterns to increase the velocity of product teams. That means you won't implement all UI elements yourself. Product teams will still build local components using the design system to solve their specific scenarios.

- [ ] **When to build** — Share your expectations on when product teams should build custom components instead of requesting a new feature in the design system or using an existing component.
- [ ] **Horizontal and vertical libraries** — Outline the difference between the horizontal libraries used across multiple products and vertical libraries only used by the team building it.
- [ ] **Library expectations** — Document the minimum set of requirements for shipping a local library. Describe your expectations on the library quality, documentation, and maintenance.
- [ ] **Release cycle alignment** — Ensure that local libraries are in sync with the design system release cycle. They should support your newly published major releases of the system to avoid blocking the product from updating.

### Team processes

All teams that have successfully scaled their design system did this by establishing robust processes for working with their stakeholders and the community. As you keep developing the system, they will save you endless hours and let you avoid answering the same questions repeatedly.

- [ ] **Decision-making log** — For the topics you have to handle repeatedly – make logs on how you make those decisions. You won’t miss any contextual requirements and will avoid having additional alignment meetings.
- [ ] **Roadmap** — Try planning your long-term work and allocating only a part of your time for community support. This will help you evolve the system over time instead of only focusing on smaller bug fixes and feature requests.
- [ ] **Stakeholder mapping** — List out the main stakeholders across all products you’re supporting. Those could be people working in the development and design but also don’t miss the people leadership who can help you grow the adoption.
- [ ] **Analytics** — Define a way to track the usage and the value of the libraries and tooling you provide. You can start with easy-to-set-up metrics, like analytics for your documentation website, feedback surveys, or components usage analytics in your design tool.
- [ ] **Ongoing support "shifts"** — If multiple people work on the same platform, distribute and plan the community support work for them. That will let team members focus on the planned work instead of being distracted by the requests and questions.
- [ ] **SLA** — Define the timelines for how long it takes you to handle incoming requests and bug reports to help product teams understand if they should wait for your release or find a temporary workaround.

### Community support

It’s crucial to help product designers and developers get more productive with the design system, fix the bugs they find in the products, and address their needs. To make sure you get that feedback – your goal is to make it easy and safe for everyone to share their findings.

- [ ] **Support channels** — Create support channels in the tools you use for communication. It’s a good idea to separate them by the platform to make it comfortable for everyone to share platform-specific details of their issues.
- [ ] **Templates** — Prepare templates for creating feature requests and bug reports. Use them to ask for reproduction links, design proposals, and other contextual information you need to make decisions instead of manually looking for that information.
- [ ] **Regular updates** — You’re risking the adoption of the new features if you’re only focusing on the implementation but never talking about it with the community. Defining a cadence for your updates helps build a habit for product teams to come and check what’s new in the system and how they can leverage it.
- [ ] **Open hours** — There will be questions that can’t be resolved in a single ticket or chat. Keep a few bookable calendar slots for other teams to receive a consultation or discuss their feature implementation with your team.

### Contribution

Building design systems is a team game. Make sure to include product teams in the journey, help them contribute to the system and let them advocate for it across the company.

- [ ] **House rules for the system** — Explain how your design and development process works to the product teams. Design system teams usually move slower than product teams since there is more responsibility on making scalable decisions in the components affecting the whole product.
- [ ] **Contribution guidelines** — Explain what contributors need to set up to prepare their design and development environment for adding and testing new features.
- [ ] **Feature proposal template** — Prepare a standard template for initiating the work on a new feature. This template should ensure that proposed changes will be applied across all platforms and won’t break the existing component usage in the product.
- [ ] **Engagement** — Make sure to highlight and reward contributors' work when making announcements about the new features and help them get support from their managers when they contribute.
