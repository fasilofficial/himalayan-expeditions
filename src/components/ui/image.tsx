import { forwardRef, type ImgHTMLAttributes, useEffect, useState } from 'react';

const FALLBACK_IMAGE_URL = 'https://static.wixstatic.com/media/12d367_4f26ccd17f8f4e3a8958306ea08c2332~mv2.png';

export type ImageProps = ImgHTMLAttributes<HTMLImageElement> & {
  fittingType?: string;
  originWidth?: number;
  originHeight?: number;
  focalPointX?: number;
  focalPointY?: number;
};

export const Image = forwardRef<HTMLImageElement, ImageProps>(({ src, ...props }, ref) => {
  const [imgSrc, setImgSrc] = useState<string | undefined>(typeof src === 'string' ? src : undefined);

  useEffect(() => {
    if (typeof src === 'string') {
      setImgSrc(src);
    }
  }, [src]);

  if (!imgSrc) {
    return <div data-empty-image ref={ref as any} {...(props as any)} />;
  }

  return (
    <img
      ref={ref}
      src={imgSrc}
      {...props}
      onError={() => setImgSrc(FALLBACK_IMAGE_URL)}
    />
  );
});

Image.displayName = 'Image';
