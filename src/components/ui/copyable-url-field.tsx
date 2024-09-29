'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Check, Copy } from "lucide-react"

export function CopyableUrlField({ url = "https://example.com/message" }) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  return (
    <div className="w-full mx-auto space-y-2">
      <div className="flex">
        <Input
          type="text"
          value={url}
          readOnly
          className="rounded-r-none"
        />
        <Button
          onClick={copyToClipboard}
          variant="outline"
          className="rounded-l-none"
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        </Button>
      </div>
      {copied && (
        <p className="text-sm text-green-600">URL wurde in die Zwischenablage kopiert!</p>
      )}
    </div>
  )
}