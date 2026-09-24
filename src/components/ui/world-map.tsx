// Dotted world map, pre-rendered to /public/world-map.svg (generated once with
// the `dotted-map` package) and painted through a CSS mask so the dots follow
// the theme's foreground color. Rendering the ~8,500 dots at request time
// added over 1 MB to the page HTML.
export default function WorldMap() {
  return (
    <div
      aria-hidden="true"
      className="w-full aspect-[2/1] pointer-events-none select-none [mask-image:linear-gradient(to_bottom,transparent,black_10%,black_90%,transparent)]"
    >
      <div className="h-full w-full bg-foreground/25 [mask-image:url(/world-map.svg)] [mask-size:contain] [mask-repeat:no-repeat] [mask-position:center]" />
    </div>
  );
}
