import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UsersRound } from "lucide-react";

export default function TeamAvailabilityPage() {
  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center text-2xl">
            <UsersRound className="mr-2 h-6 w-6 text-primary" />
            Team Availability Overview
          </CardTitle>
          <CardDescription>
            View your team's upcoming availability and time-off requests.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="min-h-[400px] flex items-center justify-center border-2 border-dashed border-border rounded-lg p-8">
            <p className="text-muted-foreground">
              Team availability calendar and request list will be displayed here.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
