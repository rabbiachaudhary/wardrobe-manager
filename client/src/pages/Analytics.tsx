import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import {
  Shirt,
  Sparkles,
  CalendarHeart,
  TrendingUp,
  AlertCircle,
  Star,
  Clock,
  ArrowRight,
} from "lucide-react";
import type { AnalyticsData, OutfitWithStats, ClothingPiece } from "@shared/schema";

export default function Analytics() {
  const { data: analytics, isLoading } = useQuery<AnalyticsData>({
    queryKey: ["/api/analytics"],
  });

  const getCurrentSeason = () => {
    const month = new Date().getMonth();
    if (month >= 2 && month <= 4) return "Spring";
    if (month >= 5 && month <= 7) return "Summer";
    if (month >= 8 && month <= 10) return "Fall";
    return "Winter";
  };

  const currentSeason = getCurrentSeason();

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="font-heading font-bold text-3xl text-foreground mb-2">
          Analytics
        </h1>
        <p className="font-body text-muted-foreground">
          Insights about your wardrobe and outfit habits
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="border-2">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Shirt className="w-6 h-6 text-primary" />
              </div>
              {isLoading ? (
                <Skeleton className="h-8 w-12" />
              ) : (
                <span className="font-heading font-bold text-3xl text-foreground" data-testid="stat-total-pieces">
                  {analytics?.totalPieces || 0}
                </span>
              )}
            </div>
            <p className="font-body text-sm text-muted-foreground">
              Total Pieces
            </p>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-secondary-foreground" />
              </div>
              {isLoading ? (
                <Skeleton className="h-8 w-12" />
              ) : (
                <span className="font-heading font-bold text-3xl text-foreground" data-testid="stat-total-outfits">
                  {analytics?.totalOutfits || 0}
                </span>
              )}
            </div>
            <p className="font-body text-sm text-muted-foreground">
              Total Outfits
            </p>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center">
                <CalendarHeart className="w-6 h-6 text-accent-foreground" />
              </div>
              {isLoading ? (
                <Skeleton className="h-8 w-12" />
              ) : (
                <span className="font-heading font-bold text-3xl text-foreground" data-testid="stat-total-wears">
                  {analytics?.totalWears || 0}
                </span>
              )}
            </div>
            <p className="font-body text-sm text-muted-foreground">
              Times Worn
            </p>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
                <Star className="w-6 h-6 text-muted-foreground" />
              </div>
              <Badge variant="secondary" className="text-sm">
                {currentSeason}
              </Badge>
            </div>
            <p className="font-body text-sm text-muted-foreground">
              Current Season
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="font-heading text-lg flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Pieces by Category
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-full" />
                  </div>
                ))}
              </div>
            ) : analytics?.piecesByCategory &&
              Object.keys(analytics.piecesByCategory).length > 0 ? (
              <div className="space-y-4">
                {Object.entries(analytics.piecesByCategory).map(
                  ([category, count]) => {
                    const percentage =
                      (count / (analytics.totalPieces || 1)) * 100;
                    return (
                      <div key={category}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-body text-sm text-foreground">
                            {category}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {count}
                          </span>
                        </div>
                        <Progress value={percentage} className="h-2" />
                      </div>
                    );
                  }
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <Shirt className="w-10 h-10 mx-auto text-muted-foreground/30 mb-2" />
                <p className="text-sm text-muted-foreground">
                  Add pieces to see category breakdown
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardHeader>
            <CardTitle className="font-heading text-lg flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Pieces by Color
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-full" />
                  </div>
                ))}
              </div>
            ) : analytics?.piecesByColor &&
              Object.keys(analytics.piecesByColor).length > 0 ? (
              <div className="space-y-4">
                {Object.entries(analytics.piecesByColor)
                  .sort((a, b) => b[1] - a[1])
                  .slice(0, 6)
                  .map(([color, count]) => {
                    const percentage =
                      (count / (analytics.totalPieces || 1)) * 100;
                    return (
                      <div key={color}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-body text-sm text-foreground">
                            {color}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {count}
                          </span>
                        </div>
                        <Progress value={percentage} className="h-2" />
                      </div>
                    );
                  })}
              </div>
            ) : (
              <div className="text-center py-8">
                <Shirt className="w-10 h-10 mx-auto text-muted-foreground/30 mb-2" />
                <p className="text-sm text-muted-foreground">
                  Add pieces to see color breakdown
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card className="border-2">
          <CardHeader className="flex flex-row items-center justify-between gap-2">
            <CardTitle className="font-heading text-lg flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              Wear Me Again!
            </CardTitle>
            <Badge variant="outline" className="text-xs">
              Least worn
            </Badge>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Skeleton className="w-16 h-16 rounded-lg" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-32 mb-1" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                ))}
              </div>
            ) : analytics?.leastWornOutfits &&
              analytics.leastWornOutfits.length > 0 ? (
              <div className="space-y-3">
                {analytics.leastWornOutfits.slice(0, 3).map((outfit) => (
                  <div
                    key={outfit.id}
                    className="flex items-center gap-3 p-2 rounded-xl bg-muted/30"
                  >
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted/50 flex-shrink-0">
                      {outfit.coverImage ? (
                        <img
                          src={outfit.coverImage}
                          alt={outfit.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Sparkles className="w-6 h-6 text-muted-foreground/30" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-heading font-medium text-foreground truncate">
                        {outfit.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {outfit.daysSinceWorn !== null
                          ? `${outfit.daysSinceWorn} days ago`
                          : "Never worn"}
                      </p>
                    </div>
                    <Link href="/wear-today">
                      <Button size="sm" variant="outline">
                        Wear
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Sparkles className="w-10 h-10 mx-auto text-muted-foreground/30 mb-2" />
                <p className="text-sm text-muted-foreground">
                  Start wearing outfits to see recommendations
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardHeader className="flex flex-row items-center justify-between gap-2">
            <CardTitle className="font-heading text-lg flex items-center gap-2">
              <Star className="w-5 h-5 text-primary" />
              {currentSeason} Picks
            </CardTitle>
            <Badge variant="secondary" className="text-xs">
              Season-ready
            </Badge>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Skeleton className="w-16 h-16 rounded-lg" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-32 mb-1" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                ))}
              </div>
            ) : analytics?.seasonalRecommendations &&
              analytics.seasonalRecommendations.length > 0 ? (
              <div className="space-y-3">
                {analytics.seasonalRecommendations.slice(0, 3).map((outfit) => (
                  <div
                    key={outfit.id}
                    className="flex items-center gap-3 p-2 rounded-xl bg-muted/30"
                  >
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted/50 flex-shrink-0">
                      {outfit.coverImage ? (
                        <img
                          src={outfit.coverImage}
                          alt={outfit.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Sparkles className="w-6 h-6 text-muted-foreground/30" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-heading font-medium text-foreground truncate">
                        {outfit.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {outfit.pieces?.length || 0} pieces
                      </p>
                    </div>
                    <Link href="/wear-today">
                      <Button size="sm" variant="outline">
                        Wear
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Star className="w-10 h-10 mx-auto text-muted-foreground/30 mb-2" />
                <p className="text-sm text-muted-foreground">
                  Add {currentSeason} pieces to see recommendations
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="border-2">
        <CardHeader className="flex flex-row items-center justify-between gap-2">
          <CardTitle className="font-heading text-lg flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-destructive" />
            Never Worn Pieces
          </CardTitle>
          <Badge variant="destructive" className="text-xs">
            Needs attention
          </Badge>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="aspect-square rounded-xl" />
              ))}
            </div>
          ) : analytics?.neverWornPieces &&
            analytics.neverWornPieces.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {analytics.neverWornPieces.slice(0, 6).map((piece) => (
                <div
                  key={piece.id}
                  className="aspect-square rounded-xl overflow-hidden border-2 border-dashed border-destructive/30 relative group"
                >
                  {piece.imagePath ? (
                    <img
                      src={piece.imagePath}
                      alt={piece.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-muted/30 flex items-center justify-center">
                      <Shirt className="w-8 h-8 text-muted-foreground/30" />
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                    <p className="text-white text-xs font-medium truncate">
                      {piece.name}
                    </p>
                  </div>
                </div>
              ))}
              {analytics.neverWornPieces.length > 6 && (
                <Link href="/create-outfit">
                  <div className="aspect-square rounded-xl border-2 border-dashed border-primary/30 flex items-center justify-center hover:bg-muted/30 transition-colors cursor-pointer">
                    <div className="text-center">
                      <span className="font-heading font-bold text-lg text-primary">
                        +{analytics.neverWornPieces.length - 6}
                      </span>
                      <p className="text-xs text-muted-foreground">more</p>
                    </div>
                  </div>
                </Link>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <Shirt className="w-10 h-10 mx-auto text-muted-foreground/30 mb-2" />
              <p className="text-sm text-muted-foreground">
                All your pieces have been worn in outfits!
              </p>
            </div>
          )}
          {analytics?.neverWornPieces && analytics.neverWornPieces.length > 0 && (
            <div className="mt-4 text-center">
              <Link href="/create-outfit">
                <Button variant="outline">
                  Create an outfit with these pieces
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
