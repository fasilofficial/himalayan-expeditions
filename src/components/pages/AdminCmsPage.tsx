import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { defaultSiteContent, loadSiteContent, saveSiteContent } from '@/data/contentStore';
import { useState } from 'react';

type Primitive = string | number | boolean | null;
type JsonValue = Primitive | JsonValue[] | { [key: string]: JsonValue };

function pathLabel(path: string[]) {
  return path[path.length - 1]
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (s) => s.toUpperCase());
}

function isLongText(value: string) {
  return value.length > 90 || value.includes('\n');
}

export default function AdminCmsPage() {
  const [content, setContent] = useState<Record<string, JsonValue>>(
    () => loadSiteContent() as unknown as Record<string, JsonValue>,
  );
  const [status, setStatus] = useState('');

  const updatePath = (path: string[], value: JsonValue) => {
    setContent((prev) => {
      const next = JSON.parse(JSON.stringify(prev)) as Record<string, JsonValue>;
      let cursor: any = next;

      for (let i = 0; i < path.length - 1; i += 1) {
        const key = path[i];
        const index = Number(key);
        cursor = Number.isNaN(index) ? cursor[key] : cursor[index];
      }

      const finalKey = path[path.length - 1];
      const finalIndex = Number(finalKey);
      if (Number.isNaN(finalIndex)) {
        cursor[finalKey] = value;
      } else {
        cursor[finalIndex] = value;
      }

      return next;
    });
  };

  const saveBrowser = () => {
    saveSiteContent(content as unknown as typeof defaultSiteContent);
    setStatus('Saved. The site now uses your updated content.');
  };

  const loadBrowser = () => {
    setContent(loadSiteContent() as unknown as Record<string, JsonValue>);
    setStatus('Loaded saved content.');
  };

  const resetDefaults = () => {
    setContent(defaultSiteContent as unknown as Record<string, JsonValue>);
    setStatus('Reset to current project defaults.');
  };

  const renderEditor = (value: JsonValue, path: string[] = []): JSX.Element => {
    if (typeof value === 'string') {
      return (
        <div className="space-y-2">
          <label className="font-paragraph text-sm text-foreground">{pathLabel(path)}</label>
          {isLongText(value) ? (
            <textarea
              value={value}
              onChange={(e) => updatePath(path, e.target.value)}
              rows={4}
              className="w-full border border-foreground/20 p-3 font-paragraph text-sm text-foreground"
            />
          ) : (
            <input
              value={value}
              onChange={(e) => updatePath(path, e.target.value)}
              className="w-full border border-foreground/20 p-3 font-paragraph text-sm text-foreground"
            />
          )}
        </div>
      );
    }

    if (typeof value === 'number') {
      return (
        <div className="space-y-2">
          <label className="font-paragraph text-sm text-foreground">{pathLabel(path)}</label>
          <input
            type="number"
            value={value}
            onChange={(e) => updatePath(path, Number(e.target.value))}
            className="w-full border border-foreground/20 p-3 font-paragraph text-sm text-foreground"
          />
        </div>
      );
    }

    if (typeof value === 'boolean') {
      return (
        <label className="flex items-center gap-3 font-paragraph text-sm text-foreground">
          <input
            type="checkbox"
            checked={value}
            onChange={(e) => updatePath(path, e.target.checked)}
          />
          {pathLabel(path)}
        </label>
      );
    }

    if (value === null) {
      return (
        <div className="space-y-2">
          <label className="font-paragraph text-sm text-foreground">{pathLabel(path)}</label>
          <input
            value=""
            onChange={(e) => updatePath(path, e.target.value)}
            className="w-full border border-foreground/20 p-3 font-paragraph text-sm text-foreground"
          />
        </div>
      );
    }

    if (Array.isArray(value)) {
      return (
        <div className="space-y-4 border border-foreground/10 p-4">
          <p className="font-heading text-lg text-foreground">{pathLabel(path)}</p>
          {value.map((item, index) => (
            <div key={`${path.join('.')}.${index}`} className="border border-foreground/10 p-3">
              {renderEditor(item, [...path, String(index)])}
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className="space-y-4 border border-foreground/10 p-4">
        <p className="font-heading text-lg text-foreground">{path.length ? pathLabel(path) : 'Content'}</p>
        {Object.entries(value).map(([key, nested]) => (
          <div key={`${path.join('.')}.${key}`}>{renderEditor(nested, [...path, key])}</div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="w-full max-w-[110rem] mx-auto px-6 md:px-8 py-28">
        <div className="mb-8">
          <h1 className="font-heading text-4xl md:text-5xl text-foreground mb-4">Content Manager</h1>
          <p className="font-paragraph text-base text-secondary max-w-4xl">
            Edit all site content here, then click Save. No file editing is required.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 mb-8">
          <button onClick={saveBrowser} className="bg-primary text-primary-foreground px-5 py-2.5 font-paragraph text-sm">Save In Browser</button>
          <button onClick={loadBrowser} className="border border-foreground/20 px-5 py-2.5 font-paragraph text-sm text-foreground">Load Saved</button>
          <button onClick={resetDefaults} className="border border-foreground/20 px-5 py-2.5 font-paragraph text-sm text-foreground">Reset Defaults</button>
        </div>

        {status && <p className="font-paragraph text-sm text-accent-blue mb-6">{status}</p>}

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {Object.entries(content).map(([key, value]) => (
            <div key={key}>{renderEditor(value, [key])}</div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
