import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Plus, Search, Shirt, Filter, X } from "lucide-react";
import type { ClothingPiece } from "@shared/schema";
import { CATEGORIES, COLORS, SEASONS } from "@shared/schema";

export default function PieceGallery() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [colorFilter, setColorFilter] = useState<string>("all");
  const [seasonFilter, setSeasonFilter] = useState<string>("all");

  const { data: pieces, isLoading } = useQuery<ClothingPiece[]>({
    queryKey: ["/api/pieces"],
  });

  const filteredPieces = pieces?.filter((piece) => {
    const matchesSearch =
      searchQuery === "" ||
      piece.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || piece.category === categoryFilter;
    const matchesColor = colorFilter === "all" || piece.color === colorFilter;
    const matchesSeason = seasonFilter === "all" || piece.season === seasonFilter;
    return matchesSearch && matchesCategory && matchesColor && matchesSeason;
  });

  const hasActiveFilters =
    categoryFilter !== "all" ||
    colorFilter !== "all" ||
    seasonFilter !== "all" ||
    searchQuery !== "";

  const clearFilters = () => {
    setSearchQuery("");
    setCategoryFilter("all");
    setColorFilter("all");
    setSeasonFilter("all");
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-heading font-bold text-3xl text-foreground mb-2">
            My Pieces
          </h1>
          <p className="font-body text-muted-foreground">
            {pieces?.length || 0} items in your wardrobe
          </p>
        </div>
        <Link href="/add-piece">
          <Button data-testid="button-add-piece">
            <Plus className="w-4 h-4 mr-2" />
            Add Piece
          </Button>
        </Link>
      </div>

      <Card className="border-2 mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search pieces..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 rounded-xl"
                data-testid="input-search"
              />
            </div>
            <div className="flex flex-wrap gap-3">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[140px] rounded-xl" data-testid="filter-category">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={colorFilter} onValueChange={setColorFilter}>
                <SelectTrigger className="w-[120px] rounded-xl" data-testid="filter-color">
                  <SelectValue placeholder="Color" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Colors</SelectItem>
                  {COLORS.map((color) => (
                    <SelectItem key={color} value={color}>
                      {color}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={seasonFilter} onValueChange={setSeasonFilter}>
                <SelectTrigger className="w-[120px] rounded-xl" data-testid="filter-season">
                  <SelectValue placeholder="Season" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Seasons</SelectItem>
                  {SEASONS.map((season) => (
                    <SelectItem key={season} value={season}>
                      {season}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-muted-foreground"
                  data-testid="button-clear-filters"
                >
                  <X className="w-4 h-4 mr-1" />
                  Clear
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <Card key={i} className="border-2">
              <CardContent className="p-0">
                <Skeleton className="aspect-square rounded-t-lg" />
                <div className="p-4 space-y-2">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredPieces && filteredPieces.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredPieces.map((piece) => (
            <Card
              key={piece.id}
              className="border-2 overflow-hidden transition-all duration-200 hover:shadow-lg group"
              data-testid={`card-piece-${piece.id}`}
            >
              <CardContent className="p-0">
                <div className="aspect-square bg-muted/30 relative overflow-hidden">
                  {piece.imagePath ? (
                    <img
                      src={piece.imagePath}
                      alt={piece.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Shirt className="w-12 h-12 text-muted-foreground/30" />
                    </div>
                  )}
                  <Badge
                    variant="secondary"
                    className="absolute top-2 right-2 text-xs"
                  >
                    {piece.season}
                  </Badge>
                </div>
                <div className="p-4">
                  <h3 className="font-heading font-semibold text-foreground truncate mb-1">
                    {piece.name}
                  </h3>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="outline" className="text-xs">
                      {piece.category}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {piece.color}
                    </Badge>
                  </div>
                  {piece.tags && piece.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {piece.tags.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="text-xs text-muted-foreground"
                        >
                          #{tag}
                        </span>
                      ))}
                      {piece.tags.length > 2 && (
                        <span className="text-xs text-muted-foreground">
                          +{piece.tags.length - 2}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-2">
          <CardContent className="py-16 text-center">
            <Shirt className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
            <h3 className="font-heading font-semibold text-xl text-foreground mb-2">
              {hasActiveFilters ? "No pieces found" : "Your wardrobe is empty"}
            </h3>
            <p className="font-body text-muted-foreground mb-6">
              {hasActiveFilters
                ? "Try adjusting your filters"
                : "Start by adding your first clothing piece!"}
            </p>
            {hasActiveFilters ? (
              <Button variant="outline" onClick={clearFilters}>
                Clear Filters
              </Button>
            ) : (
              <Link href="/add-piece">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Piece
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
