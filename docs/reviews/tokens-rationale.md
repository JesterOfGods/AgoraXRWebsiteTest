# AgoraXR — "Humanist Immersive" Token Rationale

## Palette: "Clay Paper & Sage" (warm-humanist)

A two-hue warm-natural system on a warm-paper neutral ramp. Not the generic
violet/cyan tech gradient — every hue is drawn from earth, clay and foliage so
an XR-at-scale product for museums, education, healthcare and enterprise reads
as *human and inclusive*, not synthetic.

- **Primary — Terracotta / burnt clay** `#B14A2C` (light) / `#E39068` (dark).
  Warm, grounded, hand-made. The load-bearing brand accent.
- **Secondary — Sage / muted-teal** `#3F5F54` (light) / `#8FB6A2` (dark).
  Calm, restful, natural counterweight — the "breath" in the system.
- **Neutral — "Clay paper"** warm off-white paper `#FCF9F4`/`#FAF5EF` in light,
  warm charcoal `#211D1A` (NOT pure black) in dark, with warm off-white ink
  `#F5EEE4` on dark. No cool greys anywhere; greys carry a clay undertone.

### Sources cited
- **Colors** — `ui-ux-pro-max/data/colors.csv`, drawn/adapted from these named
  warm-natural rows: **#97 Recipe & Cooking App** ("Warm terracotta + fresh
  green", `#9A3412` + `#059669` on cream `#FFFBEB`) and **#141 Yoga & Stretching
  Guide** ("Sage neutral + calm teal", sage `#6B7280` + teal `#0891B2` on
  `#F5F5F0`). The terracotta+sage pairing and warm-cream paper ground come
  directly from these; individual values were re-tuned to clear WCAG 2.2 AA.
  Supporting warmth cues from **#161 Home Decoration** and **#93 Notes & Writing
  App** ("Warm ink + amber on cream").
- **Fonts** — `ui-ux-pro-max/data/google-fonts.csv` rows **`Fraunces`**
  (Serif; keywords: elegant/refined/editorial/humanist, variable opsz+SOFT+WONK
  axes, popularity 215) and **`Hanken Grotesk`** (Sans Serif; keywords:
  readable/humanist/grotesque, full 100–900 weights, popularity 231). Pairing
  logic is consistent with `typography.csv` **#8 Wellness Calm**
  (serif+sans "calm, wellness, natural, organic") and **#60 Calistoga+Inter**
  ("adds human warmth"), but upgraded to a more characterful, accessible pair.
- **Method** — `design-tokens/SKILL.md` (semantic tokens, dual-mode, motion
  scale) and `frontend-design/SKILL.md` **Scandinavian** (warm + restraint, no
  pure black, soft large-blur shadows) + **Japanese Minimalism / Ma** (generous
  whitespace, hairline borders, slow 400–600ms fades).

## Typography — exact Google Fonts

- **Display:** Fraunces — weights 400, 500, 600, 700 (variable optical size 9–144).
- **Body:** Hanken Grotesk — weights 400, 500, 600, 700. Body ≥16px on mobile
  (`--fs-base` clamps 16px → 18px).

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Hanken+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet">
```

## WCAG 2.2 contrast — verified (AA: 4.5:1 body, 3:1 large/UI)

### Light mode
| Pair | Colors | Ratio | Result |
|---|---|---|---|
| Ink text / bg | `#332C27` on `#FAF5EF` | 14.08:1 | PASS AA |
| Ink text / surface | `#332C27` on `#FFFDFA` | 15.03:1 | PASS AA |
| Ink text / surface-2 | `#332C27` on `#F1E9DE` | 12.68:1 | PASS AA |
| Muted text / bg | `#6E6157` on `#FAF5EF` | 5.52:1 | PASS AA |
| Muted text / surface-2 | `#6E6157` on `#F1E9DE` | 4.97:1 | PASS AA |
| Primary as text / bg | `#B14A2C` on `#FAF5EF` | 4.99:1 | PASS AA |
| White ink / primary button | `#FFFFFF` on `#B14A2C` | 5.40:1 | PASS AA |
| Secondary as text / bg | `#3F5F54` on `#FAF5EF` | 6.51:1 | PASS AA |
| White ink / secondary button | `#FFFFFF` on `#3F5F54` | 7.06:1 | PASS AA |
| Focus ring / bg (non-text) | `#B14A2C` on `#FAF5EF` | 4.99:1 | PASS (≥3:1) |
| Line-strong / bg (non-text) | `#93806A` on `#FAF5EF` | 3.50:1 | PASS (≥3:1) |
| Success / bg | `#3D6B47` on `#FAF5EF` | 5.71:1 | PASS AA |
| Warning / bg | `#8A5A16` on `#FAF5EF` | 5.45:1 | PASS AA |
| Error / bg | `#B23A32` on `#FAF5EF` | 5.47:1 | PASS AA |
| Info / bg | `#356072` on `#FAF5EF` | 6.32:1 | PASS AA |

### Dark mode
| Pair | Colors | Ratio | Result |
|---|---|---|---|
| Ink text / bg | `#F5EEE4` on `#211D1A` | 14.06:1 | PASS AA |
| Ink text / surface | `#F5EEE4` on `#292420` | 12.76:1 | PASS AA |
| Ink text / surface-2 | `#F5EEE4` on `#332C27` | 11.40:1 | PASS AA |
| Muted text / bg | `#B8A48C` on `#211D1A` | 7.20:1 | PASS AA |
| Muted text / surface-2 | `#B8A48C` on `#332C27` | 5.84:1 | PASS AA |
| Primary as text / bg | `#E39068` on `#211D1A` | 6.81:1 | PASS AA |
| Dark ink / primary button | `#241511` on `#E39068` | 7.10:1 | PASS AA |
| Secondary as text / bg | `#8FB6A2` on `#211D1A` | 7.56:1 | PASS AA |
| Dark ink / secondary button | `#241511` on `#8FB6A2` | 7.88:1 | PASS AA |
| Focus ring / bg (non-text) | `#E39068` on `#211D1A` | 6.81:1 | PASS (≥3:1) |
| Line-strong / bg (non-text) | `#857567` on `#211D1A` | 3.82:1 | PASS (≥3:1) |
| Success / bg | `#8FC79C` on `#211D1A` | 8.71:1 | PASS AA |
| Warning / bg | `#E0B570` on `#211D1A` | 8.87:1 | PASS AA |
| Error / bg | `#EC8C82` on `#211D1A` | 6.96:1 | PASS AA |
| Info / bg | `#86B4C7` on `#211D1A` | 7.54:1 | PASS AA |

*Note:* the hairline `--line` divider is intentionally decorative and below 3:1
(WCAG exempts purely decorative dividers); any boundary that conveys essential
state uses `--line-strong`, which is verified ≥3:1. Ratios computed with the
WCAG 2.x relative-luminance formula (`scratchpad/contrast.py`).

## Intended feel

The system should feel like a sunlit Scandinavian studio: warm paper, soft
clay, and quiet sage, with type that is characterful (Fraunces) yet endlessly
readable (Hanken Grotesk). Ma-scale whitespace and slow 300–600ms ease-out fades
let content breathe instead of shout — calm confidence over tech spectacle. Because
AgoraXR's soul is accessibility, "comfortable for everyone" is literal: every
text pair clears WCAG AA (most far beyond it), focus is always visible, motion
yields to `prefers-reduced-motion`, body text never drops below 16px, and the
warm dark mode uses off-white ink on warm charcoal to reduce eye strain rather
than harsh white-on-black. Warm, human, inclusive — engineered, not decorative.
