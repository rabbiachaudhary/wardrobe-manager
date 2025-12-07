import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import {
  CalendarHeart,
  MapPin,
  Sparkles,
  Check,
  Shirt,
  Heart,
} from "lucide-react";
import type { OutfitWithPieces } from "@shared/schema";

export default function WearToday() {
  const { toast } = useToast();
  const [selectedOutfit, setSelectedOutfit] = useState<string | null>(null);
  const [location, setLocation] = useState("");

  const { data: outfits, isLoading } = useQuery<OutfitWithPieces[]>({
    queryKey: ["/api/outfits"],
  });

  const logWearMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", "/api/wear-log", {
        outfitId: selectedOutfit,
        location: location || undefined,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/outfits"] });
      queryClient.invalidateQueries({ queryKey: ["/api/wear-log/recent"] });
      queryClient.invalidateQueries({ queryKey: ["/api/analytics"] });
      toast({
        title: "Outfit logged!",
        description: "Your outfit has been recorded for today.",
      });
      setSelectedOutfit(null);
      setLocation("");
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to log outfit. Please try again.",
        variant: "destructive",
      });
    },
  });

  const selectedOutfitData = outfits?.find((o) => o.id === selectedOutfit);

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="font-heading font-bold text-3xl text-foreground mb-2">
          What are you wearing today?
        </h1>
        <p className="font-body text-muted-foreground">
          Log your outfit to track your style and get better recommendations
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="font-heading text-lg">
                Choose an Outfit
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <Skeleton key={i} className="aspect-square rounded-xl" />
                  ))}
                </div>
              ) : outfits && outfits.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-h-[500px] overflow-y-auto p-1">
                  {outfits.map((outfit) => {
                    const isSelected = selectedOutfit === outfit.id;
                    return (
                      <button
                        key={outfit.id}
                        onClick={() => setSelectedOutfit(outfit.id)}
                        className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all text-left ${
                          isSelected
                            ? "border-primary ring-2 ring-primary/30"
                            : "border-transparent hover:border-primary/30"
                        }`}
                        data-testid={`outfit-select-${outfit.id}`}
                      >
                        {outfit.coverImage ? (
                          <img
                            src={outfit.coverImage}
                            alt={outfit.name}
                            className="w-full h-full object-cover"
                          />
                        ) : outfit.pieces && outfit.pieces.length > 0 ? (
                          <div className="w-full h-full grid grid-cols-2 gap-0.5 p-1 bg-muted/30">
                            {outfit.pieces.slice(0, 4).map((piece) => (
                              <div
                                key={piece.id}
                                className="rounded overflow-hidden bg-muted/50"
                              >
                                {piece.imagePath ? (
                                  <img
                                    src={piece.imagePath}
                                    alt={piece.name}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <Shirt className="w-4 h-4 text-muted-foreground/30" />
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="w-full h-full bg-muted/30 flex items-center justify-center">
                            <Sparkles className="w-8 h-8 text-muted-foreground/30" />
                          </div>
                        )}
                        {isSelected && (
                          <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                              <Check className="w-6 h-6 text-primary-foreground" />
                            </div>
                          </div>
                        )}
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                          <p className="text-white text-sm font-medium truncate">
                            {outfit.name}
                          </p>
                          {outfit.wornCount && outfit.wornCount > 0 && (
                            <p className="text-white/70 text-xs">
                              Worn {outfit.wornCount}x
                            </p>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Sparkles className="w-12 h-12 mx-auto text-muted-foreground/30 mb-3" />
                  <p className="text-muted-foreground mb-2">No outfits yet</p>
                  <p className="text-sm text-muted-foreground">
                    Create some outfits first to log what you wear
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="font-heading text-lg flex items-center gap-2">
                <Heart className="w-5 h-5 text-primary" />
                Today's Look
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedOutfitData ? (
                <div className="aspect-square rounded-xl overflow-hidden border-2 border-primary/20">
                  {selectedOutfitData.coverImage ? (
                    <img
                      src={selectedOutfitData.coverImage}
                      alt={selectedOutfitData.name}
                      className="w-full h-full object-cover"
                    />
                  ) : selectedOutfitData.pieces &&
                    selectedOutfitData.pieces.length > 0 ? (
                    <div className="w-full h-full grid grid-cols-2 gap-1 p-2 bg-muted/30">
                      {selectedOutfitData.pieces.slice(0, 4).map((piece) => (
                        <div
                          key={piece.id}
                          className="rounded-lg overflow-hidden bg-muted/50"
                        >
                          {piece.imagePath ? (
                            <img
                              src={piece.imagePath}
                              alt={piece.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Shirt className="w-6 h-6 text-muted-foreground/30" />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="w-full h-full bg-muted/30 flex items-center justify-center">
                      <Sparkles className="w-10 h-10 text-muted-foreground/30" />
                    </div>
                  )}
                </div>
              ) : (
                <div className="aspect-square rounded-xl border-2 border-dashed border-muted-foreground/20 flex items-center justify-center">
                  <div className="text-center">
                    <CalendarHeart className="w-10 h-10 mx-auto text-muted-foreground/30 mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Select an outfit
                    </p>
                  </div>
                </div>
              )}

              {selectedOutfitData && (
                <div>
                  <h4 className="font-heading font-medium text-foreground">
                    {selectedOutfitData.name}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {selectedOutfitData.pieces?.length || 0} pieces
                  </p>
                </div>
              )}

              <div>
                <Label className="font-heading mb-2 block">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  Location (optional)
                </Label>
                <Input
                  placeholder="e.g., Work, Date night, Shopping"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="rounded-xl"
                  data-testid="input-location"
                />
              </div>

              <Button
                onClick={() => logWearMutation.mutate()}
                disabled={!selectedOutfit || logWearMutation.isPending}
                className="w-full"
                data-testid="button-log-wear"
              >
                {logWearMutation.isPending ? (
                  <>
                    <CalendarHeart className="w-4 h-4 mr-2 animate-pulse" />
                    Logging...
                  </>
                ) : (
                  <>
                    <CalendarHeart className="w-4 h-4 mr-2" />
                    Log Today's Outfit
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          <Card className="border-2 mt-4">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <CalendarHeart className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-heading font-medium text-sm text-foreground">
                    {new Date().toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                  <p className="text-xs text-muted-foreground">Today</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
