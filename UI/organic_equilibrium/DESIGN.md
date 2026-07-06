---
name: Organic Equilibrium
colors:
  surface: '#faf9f7'
  surface-dim: '#dadad8'
  surface-bright: '#faf9f7'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f4f3f1'
  surface-container: '#efeeec'
  surface-container-high: '#e9e8e6'
  surface-container-highest: '#e3e2e0'
  on-surface: '#1a1c1b'
  on-surface-variant: '#424841'
  inverse-surface: '#2f3130'
  inverse-on-surface: '#f1f1ef'
  outline: '#737970'
  outline-variant: '#c2c8be'
  surface-tint: '#456646'
  primary: '#436444'
  on-primary: '#ffffff'
  primary-container: '#5b7d5b'
  on-primary-container: '#f7fff2'
  inverse-primary: '#abd0a9'
  secondary: '#635e53'
  on-secondary: '#ffffff'
  secondary-container: '#e7dfd1'
  on-secondary-container: '#676257'
  tertiary: '#515c70'
  on-tertiary: '#ffffff'
  tertiary-container: '#6a7589'
  on-tertiary-container: '#fefcff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#c6edc4'
  primary-fixed-dim: '#abd0a9'
  on-primary-fixed: '#012108'
  on-primary-fixed-variant: '#2e4e30'
  secondary-fixed: '#eae1d4'
  secondary-fixed-dim: '#cdc6b9'
  on-secondary-fixed: '#1f1b13'
  on-secondary-fixed-variant: '#4b463d'
  tertiary-fixed: '#d8e3fa'
  tertiary-fixed-dim: '#bcc7dd'
  on-tertiary-fixed: '#111c2c'
  on-tertiary-fixed-variant: '#3c475a'
  background: '#faf9f7'
  on-background: '#1a1c1b'
  surface-variant: '#e3e2e0'
typography:
  headline-xl:
    fontFamily: Source Serif 4
    fontSize: 48px
    fontWeight: '600'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Source Serif 4
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Source Serif 4
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
  headline-md:
    fontFamily: Source Serif 4
    fontSize: 24px
    fontWeight: '500'
    lineHeight: 32px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 24px
  lg: 48px
  xl: 80px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 64px
---

## Brand & Style

This design system centers on a "Natural/Light" aesthetic, moving away from high-contrast digital tropes toward a grounded, organic atmosphere. The brand personality is professional yet approachable, evoking the calm of a well-ordered botanical study or a modern architectural space integrated with nature.

The design style is a blend of **Soft Minimalism** and **Tactile Layering**. It prioritizes heavy whitespace (breathing room) and a limited, nature-inspired palette to reduce cognitive load. Surfaces are treated with subtle tonal shifts rather than harsh borders, creating a UI that feels "grown" rather than "built." The emotional response should be one of clarity, reliability, and restorative calm.

## Colors

The palette is derived from natural elements: moss, stone, parchment, and slate.

- **Primary (Sage Green):** Used for key actions, active states, and brand moments. It represents growth and vitality.
- **Secondary (Warm Beige):** Used for surface levels, container backgrounds, and soft dividers to provide warmth and prevent the UI from feeling clinical.
- **Tertiary (Slate Gray):** Used for primary text and iconography to maintain high legibility without the harshness of pure black.
- **Neutral (Soft White):** The base canvas color, providing a crisp, clean foundation that allows the organic colors to pop.

Avoid using pure black (#000000) or pure white (#FFFFFF). Use the provided Slate Gray for text and Soft White for the deepest background layer.

## Typography

The typography strategy pairs the authoritative, literary feel of **Source Serif 4** with the modern, friendly accessibility of **Plus Jakarta Sans**.

- **Headlines:** Use Source Serif 4 to establish a grounded, professional tone. The slight serifs provide a classic touch that feels traditional and trustworthy.
- **Body & Interface:** Use Plus Jakarta Sans for all functional text. Its soft, rounded terminals complement the organic shape language of the design system.
- **Hierarchy:** Maintain generous vertical rhythm. Headlines should always have significant leading (line-height) to prevent the "compressed" digital look.

## Layout & Spacing

The layout follows a **Fluid Grid** model with significant padding to emphasize the feeling of openness.

- **Desktop:** 12-column grid with a maximum content width of 1280px. Use 64px side margins to "frame" the content like a page in a book.
- **Mobile:** 4-column grid with 16px margins.
- **Spacing Rhythm:** Use a base-8 increment system. For organic feel, favor larger gaps (48px+) between major sections to let the design breathe. Elements within a group should use tighter spacing (12px or 24px) to indicate relationship.

## Elevation & Depth

Depth is communicated through **Tonal Layers** rather than shadows. This maintains a flat, grounded, and "natural" appearance.

- **Base Layer:** The Neutral Soft White.
- **Elevated Surfaces:** Use the Secondary Warm Beige for cards or containers resting on the base layer.
- **Interactions:** When an element is hovered or active, use a subtle 1px inner stroke of a slightly darker beige or a very soft, diffused ambient shadow (Opacity: 5%, Blur: 20px, Offset-Y: 4px).
- **Glass Effects:** For navigation bars or floating menus, use a 70% opacity Soft White with a heavy backdrop blur (20px) to simulate frosted glass, allowing the organic background colors to bleed through.

## Shapes

The shape language is **Soft and Organic**. Avoid sharp 90-degree corners, as they feel too aggressive for this design narrative. 

- **Standard Elements:** Use a 0.5rem (8px) radius for buttons, input fields, and small cards.
- **Large Containers:** Use 1rem (16px) or 1.5rem (24px) for main content areas or modal overlays to emphasize a friendly, "pebble-like" geometry.
- **Interactive States:** Soften corners further on interaction if appropriate, but maintain the primary 8px-16px-24px logic throughout the system.

## Components

- **Buttons:** Primary buttons use a solid Sage Green background with Soft White text. Secondary buttons use a Warm Beige background with Slate Gray text. Ghost buttons use Slate Gray text with no border, becoming Warm Beige on hover.
- **Inputs:** Fields should have a Warm Beige background and a 1px border that is only slightly darker than the surface. On focus, the border transitions to Sage Green.
- **Chips/Tags:** Use low-contrast Sage Green (20% opacity) with dark Sage Green text. This creates an "herbal" look that fits the guild's grounded vibe.
- **Cards:** Cards should be borderless, utilizing a Warm Beige fill to separate them from the Soft White background. Padding within cards should be generous (minimum 24px).
- **Lists:** Use soft dividers (1px, 10% Slate Gray) or simply use whitespace to separate items.
- **Guild-Specific Elements:** Consider "Status Blossoms"—small, organic-shaped indicators (non-perfect circles) used to show member activity or project status, using the Primary Sage Green color.