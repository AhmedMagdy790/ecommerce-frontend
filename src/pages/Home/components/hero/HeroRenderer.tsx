import { CollectionHero } from "./CollectionHero";

interface HeroRendererProps {
  variant?: "collection" | "full-width";
  // Instead of [key: string]: any, let's be explicit about the possible props
  [key: string]: any; 
}

export default function HeroRenderer({ variant = "collection", ...props }: HeroRendererProps) {
  
  // We explicitly check for the variant
  switch (variant) {
    case "collection":
      // Cast the props to the expected interface to satisfy the compiler
      return <CollectionHero {...(props as React.ComponentProps<typeof CollectionHero>)} />;
      
    default:
      return <CollectionHero {...(props as React.ComponentProps<typeof CollectionHero>)} />;
  }
}