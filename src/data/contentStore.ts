import { useEffect, useState } from 'react';
import {
  aboutPageContent,
  contactPageContent,
  expeditionDetailPageContent,
  expeditions,
  expeditionsPageContent,
  footerContent,
  galleryItems,
  galleryPageContent,
  headerContent,
  homePageContent,
} from './siteContent';

export const CMS_STORAGE_KEY = 'limitless_admin_cms_content_v1';

export const defaultSiteContent = {
  headerContent,
  footerContent,
  homePageContent,
  aboutPageContent,
  contactPageContent,
  expeditionsPageContent,
  expeditionDetailPageContent,
  galleryPageContent,
  expeditions,
  galleryItems,
};

export type SiteContent = typeof defaultSiteContent;

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

function deepMerge<T>(base: T, override: unknown): T {
  if (Array.isArray(base)) {
    return (Array.isArray(override) ? override : base) as T;
  }

  if (!isPlainObject(base)) {
    return (override === undefined ? base : override) as T;
  }

  const output: Record<string, unknown> = { ...base };
  const overrideObj = isPlainObject(override) ? override : {};

  Object.keys(base).forEach((key) => {
    output[key] = deepMerge((base as Record<string, unknown>)[key], overrideObj[key]);
  });

  return output as T;
}

export function loadSiteContent(): SiteContent {
  if (typeof window === 'undefined') return defaultSiteContent;

  const raw = localStorage.getItem(CMS_STORAGE_KEY);
  if (!raw) return defaultSiteContent;

  try {
    const parsed = JSON.parse(raw);
    return deepMerge(defaultSiteContent, parsed);
  } catch (_error) {
    return defaultSiteContent;
  }
}

export function saveSiteContent(content: SiteContent): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(CMS_STORAGE_KEY, JSON.stringify(content));
  window.dispatchEvent(new CustomEvent('site-content-updated'));
}

export function useSiteContent(): SiteContent {
  const [content, setContent] = useState<SiteContent>(defaultSiteContent);

  useEffect(() => {
    const applyLatest = () => setContent(loadSiteContent());
    applyLatest();

    window.addEventListener('storage', applyLatest);
    window.addEventListener('site-content-updated', applyLatest);

    return () => {
      window.removeEventListener('storage', applyLatest);
      window.removeEventListener('site-content-updated', applyLatest);
    };
  }, []);

  return content;
}
