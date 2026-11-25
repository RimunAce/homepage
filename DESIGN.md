# Design

Updated for the 2026 site redesign. `PRODUCT.md` remains the source for real content and capabilities. The visual direction below replaces the previous pink-retro system.

## Identity

Personal homepage for Respire (RimunAce). Friends should be able to find the diary, the photos, the music, and the anime lists. Kasane Teto is the redhead on the page. The old site stays at other.respire.my.

## Personality

A personal digital world with a calm, nocturnal atmosphere. Keep the owner's specific voice and playful details in the content; let the interface feel spacious, tactile, and quietly cinematic.

## Palette

- Night `#090B10` (main canvas)
- Slate `#151923` (raised surfaces)
- Frost `#F2F3F6` (primary text)
- Mist `#AEB5C4` (secondary text)
- Pearl `rgba(255,255,255,.08)` (glass surface)
- Muted champagne for real status states; Miku teal stays exclusive to the playlist easter egg

Ambient violet and blue-green light can appear as soft background atmosphere only. Keep interactive states and content surfaces legible and controlled.

## Typography

DM Sans for readable interface and body copy. Manrope for display headings and brand moments. IBM Plex Mono is limited to small metadata, timestamps, and technical details.

## Layout

Use layered dark translucent panels with thin low-contrast borders, subtle blur, and deep ambient shadows. Panels should overlap with clear z-order and purpose, as in the supplied reference, not collapse into a generic dashboard grid. Keep editorial home content asymmetrical and personal. Gallery, AniList, and Music share the same surface language while retaining layouts suited to their content. Limit backdrop blur to one or two focal surfaces at a time; supporting panels stay mostly sharp so layers remain distinct and text stays legible.

## Dials

ENERGY 2. The night canvas and layered panels establish the mood; Teto and the owner's writing keep it personal.
RHYTHM 3. Compose editorial and utility areas differently. Use asymmetric overlaps and varied panel scales only where content supports them.
MOTION 2. Use slow atmospheric background light and short state transitions. Keep content motion purposeful, respect reduced motion, and retain pause controls for continuous ticker motion.

## Motif

Dark depth, restrained blur, quiet light, and precise typography around real personal content.

## Surface depth

Use a dark glass visual language throughout the main interface, taking its cues from the user's reference. Reserve blur for selected, layered surfaces so foreground and background remain distinct. Use solid or lightly translucent slate for supporting panels rather than blurring every surface.

## Home composition

One column, from the masthead through the footer. The masthead is type on the canvas: the name, Kasane, the four routes, and the Malaysian headline line. It is not a floating card.

The opening is one frame, not two columns. Teto's portrait is the large left mass and runs to the left edge of the viewport on a wide screen. A solid slate plate overlaps its lower right and carries the headline, the owner's lines, and the old-site note, so the words stay on a flat surface and her face stays clear. The standing Teto cutout straddles the plate's right edge. On a phone the overlap is shallower to keep the face visible, and the cutout crosses the upper-right corner so only the heading shares its width. The body copy and links use the full plate below it.

Lately sits below the hero. A gallery photo spans the desktop spread alongside a dated diary note and a playlist sleeve. On phones the three pieces read in order as a single column. The spread uses real Appwrite content and each piece can load independently.

Three drawers follow: Diary, Things I've Made, and Bother Me. They open independently in the page flow so readers can keep more than one section open. The diary gives dates their own column when space permits, projects keep their thumbnails, and Bother Me stays compact and text-only. The plus changes to a minus while a drawer is open; opening and closing animate unless reduced motion is requested.

## Webring observatory

The full-width star chart sits between its heading and a fixed destination directory. Both the orbiting planets and directory links open the actual member sites; hover or keyboard focus in the directory highlights the corresponding planet and its orbital track. The star field and an orbital trace reveal the chart on first arrival without delaying navigation.

Reaching the webring brings a fixed star field behind the whole page; scrolling back restores the homepage canvas. A warm ringed planet marks respy, with navigable planets circling it. Stars, trajectories and planets respond at different depths to scroll and mouse movement, easing back when the cursor leaves. Light travels along the rings. Each sphere's surface turns on its own axis beneath a fixed light, even when link hover or keyboard focus holds its orbit in place. Pause motion stills the entire chart. Reduced motion uses the static chart.

## AniList composition

Keep the library full-width so cover art and filters remain legible across a page of results. Place favorites and recent activity beneath it in a two-column support area on wide screens, avoiding a tall sidebar beside a much shorter page of paginated results.
