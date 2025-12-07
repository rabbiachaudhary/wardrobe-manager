import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Shirt,
  Sparkles,
  CalendarHeart,
  Plus,
  ArrowRight,
  Star,
  TrendingUp,
} from "lucide-react";
import type { ClothingPiece, Outfit, WearLog } from "@shared/schema";

export default function Dashboard() {
  const { data: pieces, isLoading: piecesLoading } = useQuery<ClothingPiece[]>({
    queryKey: ["/api/pieces"],
  });

  const { data: outfits, isLoading: outfitsLoading } = useQuery<Outfit[]>({
    queryKey: ["/api/outfits"],
  });

  const { data: recentWears, isLoading: wearsLoading } = useQuery<WearLog[]>({
    queryKey: ["/api/wear-log/recent"],
  });

  const isLoading = piecesLoading || outfitsLoading || wearsLoading;

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="font-heading font-bold text-3xl text-foreground mb-2">
          Welcome back!
        </h1>
        <p className="font-body text-muted-foreground">
          Here's what's happening in your closet today
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="border-2">
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="font-heading text-sm font-medium text-muted-foreground">
              Clothing Pieces
            </CardTitle>
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Shirt className="w-5 h-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-9 w-16" />
            ) : (
              <p className="font-heading font-bold text-3xl text-foreground" data-testid="text-pieces-count">
                {pieces?.length || 0}
              </p>
            )}
            <p className="text-xs text-muted-foreground font-body mt-1">
              items in your wardrobe
            </p>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="font-heading text-sm font-medium text-muted-foreground">
              Outfits Created
            </CardTitle>
            <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-secondary-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-9 w-16" />
            ) : (
              <p className="font-heading font-bold text-3xl text-foreground" data-testid="text-outfits-count">
                {outfits?.length || 0}
              </p>
            )}
            <p className="text-xs text-muted-foreground font-body mt-1">
              cute combinations
            </p>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="font-heading text-sm font-medium text-muted-foreground">
              Times Worn
            </CardTitle>
            <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
              <CalendarHeart className="w-5 h-5 text-accent-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-9 w-16" />
            ) : (
              <p className="font-heading font-bold text-3xl text-foreground" data-testid="text-wears-count">
                {recentWears?.length || 0}
              </p>
            )}
            <p className="text-xs text-muted-foreground font-body mt-1">
              logged this month
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card className="border-2">
          <CardHeader className="flex flex-row items-center justify-between gap-2">
            <CardTitle className="font-heading text-lg">Quick Actions</CardTitle>
            <Star className="w-5 h-5 text-primary" />
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/add-piece">
              <Button variant="outline" className="w-full justify-between" data-testid="button-quick-add-piece">
                <span className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Add a new piece
                </span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/create-outfit">
              <Button variant="outline" className="w-full justify-between" data-testid="button-quick-create-outfit">
                <span className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Create an outfit
                </span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/wear-today">
              <Button variant="outline" className="w-full justify-between" data-testid="button-quick-wear-today">
                <span className="flex items-center gap-2">
                  <CalendarHeart className="w-4 h-4" />
                  Log today's outfit
                </span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardHeader className="flex flex-row items-center justify-between gap-2">
            <CardTitle className="font-heading text-lg">Recent Activity</CardTitle>
            <TrendingUp className="w-5 h-5 text-primary" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Skeleton className="w-10 h-10 rounded-xl" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-32 mb-1" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                ))}
              </div>
            ) : recentWears && recentWears.length > 0 ? (
              <div className="space-y-3">
                {recentWears.slice(0, 3).map((wear) => (
                  <div key={wear.id} className="flex items-center gap-3 p-2 rounded-xl bg-muted/50">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <CalendarHeart className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-body text-sm font-medium text-foreground">
                        Outfit logged
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {wear.location ? `at ${wear.location}` : "No location"} -{" "}
                        {new Date(wear.wornDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <CalendarHeart className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
                <p className="font-body text-muted-foreground">No recent activity</p>
                <p className="text-sm text-muted-foreground">Start logging what you wear!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="border-2">
        <CardHeader>
          <CardTitle className="font-heading text-lg">Get Started</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
              <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center mb-3">
                <span className="font-heading font-bold text-primary">1</span>
              </div>
              <h4 className="font-heading font-medium text-foreground mb-1">Add your pieces</h4>
              <p className="text-sm text-muted-foreground font-body">
                Upload photos of your clothes to build your digital wardrobe
              </p>
            </div>
            <div className="p-4 rounded-xl bg-secondary/50 border border-secondary">
              <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center mb-3">
                <span className="font-heading font-bold text-secondary-foreground">2</span>
              </div>
              <h4 className="font-heading font-medium text-foreground mb-1">Create outfits</h4>
              <p className="text-sm text-muted-foreground font-body">
                Mix and match pieces to create your favorite looks
              </p>
            </div>
            <div className="p-4 rounded-xl bg-accent/50 border border-accent">
              <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center mb-3">
                <span className="font-heading font-bold text-accent-foreground">3</span>
              </div>
              <h4 className="font-heading font-medium text-foreground mb-1">Track & discover</h4>
              <p className="text-sm text-muted-foreground font-body">
                Log what you wear and get smart recommendations
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
