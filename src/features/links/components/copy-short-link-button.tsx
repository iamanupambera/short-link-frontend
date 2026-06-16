'use client';

import { useState } from 'react';
import { CheckIcon, CopyIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

type CopyShortLinkButtonProps = {
  value: string;
};

export function CopyShortLinkButton({ value }: CopyShortLinkButtonProps) {
  const [copied, setCopied] = useState(false);

  async function copyLink() {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      onClick={copyLink}
      aria-label="Copy short link"
      title="Copy short link"
    >
      {copied ? <CheckIcon /> : <CopyIcon />}
    </Button>
  );
}
