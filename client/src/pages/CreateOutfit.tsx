import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import {
  Sparkles,
  Check,
  Shirt,
  Plus,
  X,
  ImagePlus,
  Heart,
} from "lucide-react";
import type { ClothingPiece } from "@shared/schema";
import { CATEGORIES } from "@shared/schema";

export default function CreateOutfit() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [outfitName, setOutfitName] = useState("");
  const [selectedPieces, setSelectedPieces] = useState<string[]>([]);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const { data: pieces, isLoading } = useQuery<ClothingPiece[]>({
    queryKey: ["/api/pieces"],
  });

  const createOutfitMutation = useMutation({
    mutationFn: async () => {
      const formData = new FormData();
      formData.append("name", outfitName);
      formData.append("pieceIds", JSON.stringify(selectedPieces));
      if (coverImage) {
        formData.append("coverImage", coverImage);
      }

      const response = await fetch("/api/outfits", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`${response.status}: ${text}`);
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/outfits"] });
      toast({
        title: "Outfit created!",
        description: "Your new outfit has been saved.",
      });
      setLocation("/outfits");
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
        description: "Failed to create outfit. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverImage(file);
      const reader = new FileReader();
      reader.onload = () => {
        setCoverPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeCover = () => {
    setCoverImage(null);
    setCoverPreview(null);
  };

  const togglePiece = (pieceId: string) => {
    setSelectedPieces((prev) =>
      prev.includes(pieceId)
        ? prev.filter((id) => id !== pieceId)
        : [...prev, pieceId]
    );
  };

  const selectedPiecesData = pieces?.filter((p) =>
    selectedPieces.includes(p.id)
  );

  const filteredPieces =
    activeCategory === "all"
      ? pieces
      : pieces?.filter((p) => p.category === activeCategory);

  const canSubmit = outfitName.trim() !== "" && selectedPieces.length > 0;

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="font-heading font-bold text-3xl text-foreground mb-2">
          Create Outfit
        </h1>
        <p className="font-body text-muted-foreground">
          Mix and match your pieces to create a cute look
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="font-heading text-lg">
                Select Pieces
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge
                  variant={activeCategory === "all" ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setActiveCategory("all")}
                  data-testid="filter-all"
                >
                  All
                </Badge>
                {CATEGORIES.map((cat) => (
                  <Badge
                    key={cat}
                    variant={activeCategory === cat ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => setActiveCategory(cat)}
                    data-testid={`filter-${cat.toLowerCase()}`}
                  >
                    {cat}
                  </Badge>
                ))}
              </div>

              {isLoading ? (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <Skeleton key={i} className="aspect-square rounded-xl" />
                  ))}
                </div>
              ) : filteredPieces && filteredPieces.length > 0 ? (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 max-h-[400px] overflow-y-auto p-1">
                  {filteredPieces.map((piece) => {
                    const isSelected = selectedPieces.includes(piece.id);
                    return (
                      <button
                        key={piece.id}
                        onClick={() => togglePiece(piece.id)}
                        className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                          isSelected
                            ? "border-primary ring-2 ring-primary/30"
                            : "border-transparent hover:border-primary/30"
                        }`}
                        data-testid={`piece-select-${piece.id}`}
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
                        {isSelected && (
                          <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                              <Check className="w-5 h-5 text-primary-foreground" />
                            </div>
                          </div>
                        )}
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                          <p className="text-white text-xs font-medium truncate">
                            {piece.name}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Shirt className="w-12 h-12 mx-auto text-muted-foreground/30 mb-3" />
                  <p className="text-muted-foreground">No pieces found</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="font-heading text-lg flex items-center gap-2">
                <Heart className="w-5 h-5 text-primary" />
                Your Outfit
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="font-heading mb-2 block">Outfit Name</Label>
                <Input
                  placeholder="e.g., Cozy Sunday Look"
                  value={outfitName}
                  onChange={(e) => setOutfitName(e.target.value)}
                  className="rounded-xl"
                  data-testid="input-outfit-name"
                />
              </div>

              <div>
                <Label className="font-heading mb-2 block">
                  Cover Image (optional)
                </Label>
                {coverPreview ? (
                  <div className="relative aspect-video rounded-xl overflow-hidden border-2 border-dashed border-primary/30">
                    <img
                      src={coverPreview}
                      alt="Cover"
                      className="w-full h-full object-cover"
                    />
                    <Button
                      type="button"
                      size="icon"
                      variant="destructive"
                      className="absolute top-2 right-2"
                      onClick={removeCover}
                      data-testid="button-remove-cover"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center aspect-video rounded-xl border-2 border-dashed border-primary/30 bg-muted/30 cursor-pointer transition-colors hover:bg-muted/50">
                    <ImagePlus className="w-8 h-8 text-muted-foreground mb-2" />
                    <span className="text-sm text-muted-foreground">
                      Add cover photo
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleCoverChange}
                      className="hidden"
                      data-testid="input-cover"
                    />
                  </label>
                )}
              </div>

              <div>
                <Label className="font-heading mb-2 block">
                  Selected Pieces ({selectedPieces.length})
                </Label>
                {selectedPiecesData && selectedPiecesData.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {selectedPiecesData.map((piece) => (
                      <div
                        key={piece.id}
                        className="relative w-16 h-16 rounded-lg overflow-hidden border"
                      >
                        {piece.imagePath ? (
                          <img
                            src={piece.imagePath}
                            alt={piece.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-muted/30 flex items-center justify-center">
                            <Shirt className="w-6 h-6 text-muted-foreground/30" />
                          </div>
                        )}
                        <button
                          onClick={() => togglePiece(piece.id)}
                          className="absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center"
                          data-testid={`remove-piece-${piece.id}`}
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Select pieces from the left to build your outfit
                  </p>
                )}
              </div>

              <Button
                onClick={() => createOutfitMutation.mutate()}
                disabled={!canSubmit || createOutfitMutation.isPending}
                className="w-full"
                data-testid="button-create-outfit"
              >
                {createOutfitMutation.isPending ? (
                  <>
                    <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Create Outfit
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
