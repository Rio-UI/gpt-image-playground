'use client';

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import * as React from "react";

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SettingsDialog({ open, onOpenChange }: SettingsDialogProps): React.JSX.Element {
  const [apiKey, setApiKey] = React.useState("");
  const [model, setModel] = React.useState("gpt-image-1");

  React.useEffect(() => {
    const savedApiKey = localStorage.getItem("OPENAI_API_KEY");
    const savedModel = localStorage.getItem("OPENAI_MODEL");
    if (savedApiKey) {
      setApiKey(savedApiKey);
    }
    if (savedModel) {
      setModel(savedModel);
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem("OPENAI_API_KEY", apiKey);
    localStorage.setItem("OPENAI_MODEL", model);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>设置</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="api-key">OpenAI API Key</Label>
            <Input
              id="api-key"
              type="password"
              value={apiKey}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setApiKey(e.target.value)}
              placeholder="输入您的 OpenAI API Key"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="model">模型</Label>
            <Select value={model} onValueChange={setModel}>
              <SelectTrigger id="model">
                <SelectValue placeholder="选择模型" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gpt-image-1">GPT Image 1</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between">
            <a
              href="https://riiio.top"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-500 hover:underline"
            >
              获取 API Key
            </a>
            <Button onClick={handleSave}>保存</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 