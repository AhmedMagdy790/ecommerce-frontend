export interface CollectionHeroProps {
  // Use strings for links instead of functions
  categoryLabel: string; 
  categorySlug: string;
  title: string;
  description: string;
  primaryActionLabel: string;
  primaryActionLink: string; // The data contains the URL, not the click handler
  imageSrc: string;
  imageAlt: string;
}