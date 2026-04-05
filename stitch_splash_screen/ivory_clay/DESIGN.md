```markdown
# Design System Document: The Tactile Cartographer

## 1. Overview & Creative North Star
**Creative North Star: The Tactile Cartographer**
This design system moves beyond the generic "bubble-ui" aesthetic to create a sophisticated, high-end editorial experience for campus navigation. It treats the interface not as a flat screen, but as a physical, molded architectural model. By combining the softness of claymorphism with the structured hierarchy of modern editorial design, we create an environment that feels both cutting-edge and deeply intuitive.

We break the "template" look through **intentional asymmetry** and **tonal depth**. Instead of rigid grids, we use breathing room (whitespace) and varying "extrusions" of UI elements to guide the student’s eye. The goal is a "squishy" tactile feel that invites interaction while maintaining the authority of a premium navigation tool.

---

## 2. Colors & Surface Logic
The palette is rooted in a pristine, airy base, using grayscale tones to communicate structure and subtle teal/slate accents for functional wayfinding.

### The Color Palette (Material Design Tokens)
*   **Background:** `#f8f9fb` (The primary canvas)
*   **Surface Tiers:** 
    *   `surface-container-lowest`: `#ffffff` (Used for the highest "raised" elements)
    *   `surface-container`: `#eaeef2` (Used for the base UI layer)
    *   `surface-container-highest`: `#dbe4ea` (Used for "sunken" or recessed areas like search inputs)
*   **Accents:** 
    *   `tertiary`: `#006c56` (Strategic wayfinding and success states)
    *   `primary`: `#586062` (Main structural text and icons)

### The "No-Line" Rule
**Explicit Instruction:** Prohibit the use of 1px solid borders for sectioning. Boundaries must be defined solely through background color shifts. For example, a `surface-container-low` card sitting on a `surface` background provides all the definition needed. 

### Glass & Gradient Soul
While the system is "clay-like," use `surface-container-lowest` with a 70% opacity and a `20px` backdrop-blur for floating navigation bars. This "Glassmorphism" ensures the map or content bleeds through, softening the edges of the UI and preventing it from feeling "pasted on."

---

## 3. Typography: Editorial Clarity
We use **Plus Jakarta Sans** for its geometric yet friendly proportions. The hierarchy is designed to be legible while a student is walking between lectures.

*   **Display (Large/Medium):** Use for "Arrival Times" or "Building Names." These should feel bold and authoritative.
*   **Headline (Small):** Use for category headers.
*   **Body (Large/Medium):** Primary information. Use `on-surface-variant` (`#586065`) for secondary info to maintain the minimalist grayscale aesthetic.
*   **Label:** Used for micro-copy or distances (e.g., "300m away").

**Editorial Note:** Use exaggerated scale contrasts. A `display-md` headline paired with a `label-md` distance marker creates a sophisticated, high-end look that standard apps lack.

---

## 4. Elevation & Depth: The Claymorphism Formula
True claymorphism is achieved through the marriage of inner and outer shadows. To maintain a premium feel, these must be "Ambient," not heavy.

### The Layering Principle
Depth is achieved by stacking `surface-container` tiers. 
*   **Raised Elements:** To make a card feel "squishy" and extruded:
    *   **Fill:** `surface-container-lowest` (`#ffffff`)
    *   **Outer Shadow:** `0px 20px 40px` using `on-surface` at 6% opacity.
    *   **Inner Shadow 1 (Highlight):** Top-left, `4px 4px 8px`, white (`#ffffff`) at 80% opacity.
    *   **Inner Shadow 2 (Depth):** Bottom-right, `-4px -4px 10px`, `primary-container` (`#dde4e6`) at 50% opacity.

### The "Ghost Border" Fallback
If an element lacks contrast on a specific background, use a **Ghost Border**: a 1.5px stroke using `outline-variant` at 15% opacity. Never use 100% opaque lines.

---

## 5. Components

### Buttons (The Tactile Interaction)
*   **Primary:** Pill-shaped (`rounded-full`). Use `primary` (`#586062`) with a subtle top-down gradient transitioning to `primary-dim` (`#4c5456`). This adds "soul" to the button.
*   **Tertiary/Ghost:** No container. Use `title-sm` typography with an icon.

### Search & Input Fields
*   **Visual Style:** These should appear "sunken" into the clay. 
*   **Execution:** Use `surface-container-highest` background with an **inner shadow** (top-left, `inset 2px 2px 4px` using `on-surface` at 10% opacity).

### Navigation Cards
*   **Layout:** Use `rounded-lg` (2rem) or `rounded-md` (1.5rem). 
*   **Constraint:** Forbid divider lines. Separate "Current Location" from "Destination" using vertical whitespace (`spacing-6`) or a subtle background shift to `surface-container-low`.

### Campus Progress Chips
*   Small, `rounded-full` pills using `tertiary-container` for the background and `on-tertiary-container` for text. These should feel like small "beads" resting on the surface.

---

## 6. Do’s and Don’ts

### Do:
*   **Use Large Radii:** Stick to the `16px–24px` range. Sharp corners break the "tactile" metaphor.
*   **Embrace Whitespace:** Let the `background` (`#f8f9fb`) breathe. Sophistication comes from what you *don't* crowd onto the screen.
*   **Tint Your Shadows:** Shadows should never be pure black. Always tint them with a hint of the `primary` or `on-surface` color to mimic natural light reflecting off the "clay."

### Don’t:
*   **Don’t Over-Stack:** Avoid more than three levels of nesting. It makes the UI feel heavy and "thick" rather than light and squishy.
*   **Don’t Use Pure Grays for Accents:** If an action is positive (e.g., "Start Route"), use the `tertiary` teal. If it's just structural, use the `primary` slate.
*   **Don’t Use 1px Dividers:** They are the enemy of this design system. Use the `spacing-scale` to create separation through distance.

---

## 7. Spacing Scale
Utilize the spacing scale to drive the editorial layout.
*   **Section Gaps:** Use `spacing-10` (3.5rem) to separate major content blocks.
*   **Internal Padding:** Use `spacing-4` (1.4rem) for card internals to ensure the "tactile" elements don't feel cramped.
*   **Micro-adjustments:** Use `spacing-1` (0.35rem) for icon-to-label relationships.

By adhering to these principles, the design system will provide students with a navigation experience that feels premium, effortless, and physically present.```