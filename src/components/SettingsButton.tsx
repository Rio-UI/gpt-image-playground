import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { useState } from "react";
import { SettingsDialog } from "./SettingsDialog";

export function SettingsButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 right-4"
        onClick={() => setOpen(true)}
      >
        <Settings className="h-5 w-5" />
      </Button>
      <SettingsDialog open={open} onOpenChange={setOpen} />
    </>
  );
} 