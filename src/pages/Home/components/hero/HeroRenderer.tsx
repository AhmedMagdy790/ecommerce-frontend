import type { Section } from "../SectionRenderer";
import { CollectionHero } from "./CollectionHero";
// import { FullWidthHero } from "./FullWidthHero";
// import { SliderHero } from "./SliderHero";
// import { VideoHero } from "./VideoHero";

const heroComponents = {
  hero: CollectionHero,
  // full_width: FullWidthHero,
  // slider: SliderHero,
  // video: VideoHero,
} as const;

type HeroKey = keyof typeof heroComponents;

interface HeroRendererProps {
  section: Section;
}

export default function HeroRenderer({ section }: HeroRendererProps) {
  const Component = heroComponents[section.key as HeroKey];

  console.log("test 1", section)
  if (!Component) {
    if (import.meta.env.DEV) {
      console.warn(
        `HeroRenderer: Component not found for hero key "${section.key}"`
      );

      console.log("Available hero keys:", Object.keys(heroComponents));
      console.log("Current section:", section);
    }

    return null;
  }

  return <Component section={section} />;
}