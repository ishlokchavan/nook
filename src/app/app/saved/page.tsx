import { Heart } from "lucide-react";

import { ScreenHeader } from "@/components/app-shell/screen-header";
import { Card, CardContent } from "@/components/ui/card";

export default function SavedScreen() {
  return (
    <div>
      <ScreenHeader title="Saved" subtitle="Projects you've liked" />
      <div className="flex flex-col gap-4 px-4 pt-2">
        <Card>
          <CardContent className="flex flex-col items-center gap-2 p-8 text-center">
            <span className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Heart className="size-6" />
            </span>
            <p className="font-semibold">Nothing saved yet</p>
            <p className="text-sm text-muted-foreground">
              Tap the heart on a project to keep it here for later.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
