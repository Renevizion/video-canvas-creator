import { useState, forwardRef } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, Download, Code } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface CodePreviewProps {
  code: string;
}

export const CodePreview = forwardRef<HTMLDivElement, CodePreviewProps>(({ code }, ref) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success('Code copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: 'text/typescript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'VideoComposition.tsx';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Code downloaded!');
  };

  return (
    <div ref={ref} className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-foreground flex items-center gap-2">
          <Code className="w-4 h-4 text-primary" />
          Generated Remotion Code
        </h3>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleCopy} className="gap-2">
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied!' : 'Copy'}
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownload} className="gap-2">
            <Download className="w-4 h-4" />
            Download
          </Button>
        </div>
      </div>

      {/* Code block */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative"
      >
        <pre className="bg-muted/50 rounded-xl p-6 overflow-x-auto max-h-[600px] overflow-y-auto border border-border">
          <code className="text-sm font-mono text-foreground whitespace-pre">
            {code}
          </code>
        </pre>

        {/* Language badge */}
        <div className="absolute top-3 right-3 px-2 py-1 bg-primary/20 rounded text-xs font-mono text-primary">
          TypeScript
        </div>
      </motion.div>
    </div>
  );
});

CodePreview.displayName = 'CodePreview';
