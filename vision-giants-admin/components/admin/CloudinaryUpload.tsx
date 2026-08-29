
import { useRef, useState } from 'react';

interface CloudinaryUploadProps {
  value: string | string[];
  onChange: (value: string | string[]) => void;
  multiple?: boolean;
  label?: string;
  accept?: string;
}

interface CloudinaryResult {
  secure_url: string;
}

interface CloudinaryWidget {
  open: () => void;
}

interface Cloudinary {
  createUploadWidget: (
    options: Record<string, unknown>,
    callback: (
      error: unknown,
      result: {
        event?: string;
        info?: CloudinaryResult;
      }
    ) => void
  ) => CloudinaryWidget;
}

declare global {
  interface Window {
    cloudinary?: Cloudinary;
  }
}

export default function CloudinaryUpload({
  value,
  onChange,
  multiple = false,
  label = 'Upload Image',
  accept = 'image/*',
}: CloudinaryUploadProps) {
  const widgetRef = useRef<CloudinaryWidget | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function loadCloudinaryScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (window.cloudinary) {
        resolve();
        return;
      }

      const existingScript = document.querySelector(
        'script[src="https://upload-widget.cloudinary.com/global/all.js"]'
      );

      if (existingScript) {
        existingScript.addEventListener('load', () => resolve());
        existingScript.addEventListener('error', () =>
          reject(new Error('Could not load Cloudinary'))
        );
        return;
      }

      const script = document.createElement('script');

      script.src =
        'https://upload-widget.cloudinary.com/global/all.js';

      script.async = true;

      script.onload = () => resolve();

      script.onerror = () =>
        reject(new Error('Could not load Cloudinary'));

      document.body.appendChild(script);
    });
  }

  async function openWidget() {
    setError(null);
    setIsLoading(true);

    try {
      await loadCloudinaryScript();

      if (!window.cloudinary) {
        throw new Error('Cloudinary failed to initialize');
      }

      if (!widgetRef.current) {
        widgetRef.current = window.cloudinary.createUploadWidget(
          {
            cloudName: 'r2fk1fws',
            uploadPreset: 'vision_giants',

            multiple,
            maxFiles: multiple ? 10 : 1,

            sources: ['local', 'url', 'camera'],

            clientAllowedFormats: ['jpg', 'jpeg', 'png', 'webp'],
            maxImageFileSize: 10000000,

            cropping: false,
            showSkipCropButton: false,

            folder: 'vision-giants',

            styles: {
              palette: {
                window: '#ffffff',
                windowBorder: '#d9d9d9',
                tabIcon: '#111111',
                menuIcons: '#555555',
                textDark: '#111111',
                textLight: '#ffffff',
                link: '#111111',
                action: '#111111',
                inactiveTabIcon: '#999999',
                error: '#c62828',
                inProgress: '#555555',
                complete: '#2e7d32',
                sourceBg: '#f7f7f7',
              },
            },
          },
          (uploadError, result) => {
            if (uploadError) {
              console.error('Cloudinary upload error:', uploadError);
              setError('Image upload failed. Please try again.');
              setIsLoading(false);
              return;
            }

            if (
              result.event === 'success' &&
              result.info?.secure_url
            ) {
              const url = result.info.secure_url;

              if (multiple) {
                const current = Array.isArray(value) ? value : [];

                onChange([...current, url]);
              } else {
                onChange(url);
              }

              setIsLoading(false);
            }

            if (result.event === 'close') {
              setIsLoading(false);
            }
          }
        );
      }

      widgetRef.current.open();
    } catch (err) {
      console.error(err);
      setError('Could not open Cloudinary uploader.');
      setIsLoading(false);
    }
  }

  function removeImage(index?: number) {
    if (multiple) {
      const current = Array.isArray(value) ? value : [];

      onChange(current.filter((_, i) => i !== index));

      return;
    }

    onChange('');
  }

  const images = Array.isArray(value)
    ? value
    : value
      ? [value]
      : [];

  return (
    <div className="admin-cloudinary-upload">
      <button
        type="button"
        onClick={openWidget}
        disabled={isLoading}
        className="admin-button-secondary"
      >
        {isLoading ? 'Uploading…' : `＋ ${label}`}
      </button>

      {error && (
        <p className="admin-error-text">
          {error}
        </p>
      )}

      {images.length > 0 && (
        <div className="admin-cloudinary-preview">
          {images.map((image, index) => (
            <div
              key={`${image}-${index}`}
              className="admin-cloudinary-preview-item"
            >
              <img
                src={image}
                alt="Uploaded preview"
                className="admin-cloudinary-preview-image"
              />

              <button
                type="button"
                onClick={() => removeImage(index)}
                className="admin-button-secondary"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}

      <p className="admin-field-hint">
        Accepted: JPG, PNG, WEBP · Max 10MB
      </p>
    </div>
  );
}

