import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { type Registration } from "@shared/schema";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, Ticket, Calendar, MapPin, Download } from "lucide-react";

export default function Success() {
  const [, setLocation] = useLocation();
  const [data, setData] = useState<Registration | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("lastRegistration");
    if (!stored) {
      setLocation("/");
      return;
    }
    try {
      setData(JSON.parse(stored));
    } catch {
      setLocation("/");
    }
  }, [setLocation]);

  if (!data) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 font-sans">
      <div className="max-w-md w-full animate-in zoom-in-95 duration-500">
        <Card className="shadow-2xl overflow-hidden border-0">
          <div className="bg-gradient-to-br from-primary via-primary/90 to-accent/70 p-8 text-center relative">
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
            <div className="relative z-10">
              <CheckCircle2 className="w-16 h-16 mx-auto mb-4 text-primary-foreground/90" />
              <h1 className="font-display text-3xl font-bold tracking-tight text-primary-foreground">You're In!</h1>
              <p className="opacity-90 mt-2 font-medium text-primary-foreground">Successfully registered for Zenith 2026</p>
            </div>
          </div>

          <div className="p-8 bg-card relative">
            <div className="absolute -top-4 left-8 right-8 h-8 flex justify-between">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="w-3 h-3 rounded-full bg-background shadow-inner border border-border -mt-1.5"></div>
              ))}
            </div>

            <div className="space-y-6 pt-2">
              <div className="text-center">
                <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest mb-1">Registration ID</p>
                <div className="inline-flex items-center gap-2 bg-muted px-4 py-2 rounded-lg border border-border/50">
                  <Ticket className="w-4 h-4 text-primary" />
                  <span className="font-mono text-xl font-bold tracking-wider" data-testid="text-registration-id">{data.registrationId}</span>
                </div>
              </div>

              <Separator className="border-dashed" />

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase font-semibold">Attendee</p>
                    <p className="font-medium text-foreground">{data.name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase font-semibold">Domain</p>
                    <div className="inline-flex mt-0.5">
                      <span className={`px-2 py-0.5 text-xs font-semibold rounded-md ${data.domain === 'Tech' ? 'bg-primary/15 text-primary' : 'bg-accent/15 text-accent'}`}>
                        {data.domain === 'Tech' ? 'Technical' : 'Non-Technical'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase font-semibold">Email</p>
                    <p className="font-medium text-foreground text-sm truncate" title={data.email}>{data.email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase font-semibold">Institution</p>
                    <p className="font-medium text-foreground text-sm truncate" title={data.college}>{data.college}</p>
                  </div>
                </div>
              </div>

              <div className="bg-primary/8 rounded-xl p-4 flex items-center gap-4 border border-primary/15 mt-6">
                <div className="bg-primary/15 p-3 rounded-lg text-primary shrink-0">
                  <Calendar className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-bold text-sm">Zenith 2026</p>
                  <p className="text-xs text-muted-foreground flex items-center mt-1">
                    <MapPin className="w-3 h-3 mr-1" /> Event Venue, 2026
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 flex gap-3">
              <Button className="flex-1" variant="outline" onClick={() => window.print()} data-testid="button-save">
                <Download className="w-4 h-4 mr-2" /> Save
              </Button>
              <Button className="flex-1" onClick={() => {
                sessionStorage.removeItem("lastRegistration");
                setLocation('/');
              }} data-testid="button-done">
                Done
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
