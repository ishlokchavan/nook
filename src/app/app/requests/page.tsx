import { Plus } from "lucide-react";

import { ScreenHeader } from "@/components/app-shell/screen-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function RequestsScreen() {
  return (
    <div>
      <ScreenHeader
        title="Requests"
        subtitle="Post a brief, get quotes"
        action={
          <Button size="sm">
            <Plus className="size-4" /> New
          </Button>
        }
      />
      <div className="flex flex-col gap-4 px-4 pt-2">
        <Card>
          <CardContent className="flex flex-col items-center gap-2 p-8 text-center">
            <p className="font-semibold">No requests yet</p>
            <p className="text-sm text-muted-foreground">
              Describe your room, finish and budget in a structured brief.
              Suppliers send quotes — no cold calls, no chat.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
