/**
 * Auto-generated entity types
 * Contains all CMS collection interfaces in a single file 
 */

/**
 * Collection ID: expeditions
 * Interface for Expeditions
 */
export interface Expeditions {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  name?: string;
  /** @wixFieldType text */
  shortDescription?: string;
  /** @wixFieldType number */
  price?: number;
  /** @wixFieldType image - Contains image URL, render with <Image> component, NOT as text */
  mainImage?: string;
  /** @wixFieldType image */
  images?: string[];
  /** @wixFieldType text */
  destination?: string;
  /** @wixFieldType number */
  durationInDays?: number;
  /** @wixFieldType text */
  difficulty?: string;
  /** @wixFieldType text */
  highlights?: string;
  /** @wixFieldType text */
  itinerary?: string;
  /** @wixFieldType text */
  whatsIncluded?: string;
  /** @wixFieldType text */
  whatsNotIncluded?: string;
  /** @wixFieldType boolean */
  isFeatured?: boolean;
}


/**
 * Collection ID: gallery
 * Interface for Gallery
 */
export interface Gallery {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  title?: string;
  /** @wixFieldType image - Contains image URL, render with <Image> component, NOT as text */
  image?: string;
  /** @wixFieldType text */
  description?: string;
  /** @wixFieldType text */
  category?: string;
  /** @wixFieldType date */
  dateTaken?: Date | string;
}
