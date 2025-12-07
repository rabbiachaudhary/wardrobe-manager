import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Sparkles, CalendarHeart, Shirt } from "lucide-react";
import type { OutfitWithPieces } from "@shared/schema";

export default function OutfitGallery() {
  const { data: outfits, isLoading } = useQuery<OutfitWithPieces[]>({
    queryKey: ["/api/outfits"],
  });

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-heading font-bold text-3xl text-foreground mb-2">
            My Outfits
          </h1>
          <p className="font-body text-muted-foreground">
            {outfits?.length || 0} outfit combinations
          </p>
        </div>
        <Link href="/create-outfit">
          <Button data-testid="button-create-outfit">
            <Plus className="w-4 h-4 mr-2" />
            Create Outfit
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="border-2">
              <CardContent className="p-0">
                <Skeleton className="aspect-[4/3] rounded-t-lg" />
                <div className="p-4 space-y-2">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : outfits && outfits.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {outfits.map((outfit) => (
            <Card
              key={outfit.id}
              className="border-2 overflow-hidden transition-all duration-200 hover:shadow-lg group"
              data-testid={`card-outfit-${outfit.id}`}
            >
              <CardContent className="p-0">
                <div className="aspect-[4/3] bg-muted/30 relative overflow-hidden">
                  {outfit.coverImage ? (
                    <img
                      src={outfit.coverImage}
                      alt={outfit.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : outfit.pieces && outfit.pieces.length > 0 ? (
                    <div className="w-full h-full grid grid-cols-2 gap-1 p-2">
                      {outfit.pieces.slice(0, 4).map((piece, idx) => (
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
                    <div className="w-full h-full flex items-center justify-center">
                      <Sparkles className="w-12 h-12 text-muted-foreground/30" />
                    </div>
                  )}
                  {outfit.wornCount && outfit.wornCount > 0 && (
                    <Badge className="absolute top-2 right-2">
                      <CalendarHeart className="w-3 h-3 mr-1" />
                      {outfit.wornCount}x
                    </Badge>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-heading font-semibold text-lg text-foreground mb-2">
                    {outfit.name}
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground font-body">
                      {outfit.pieces?.length || 0} pieces
                    </span>
                    {outfit.lastWorn && (
                      <span className="text-xs text-muted-foreground">
                        Last worn: {new Date(outfit.lastWorn).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-2">
          <CardContent className="py-16 text-center">
            <Sparkles className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
            <h3 className="font-heading font-semibold text-xl text-foreground mb-2">
              No outfits yet
            </h3>
            <p className="font-body text-muted-foreground mb-6">
              Create your first outfit by combining your clothing pieces!
            </p>
            <Link href="/create-outfit">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Outfit
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
