import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Shirt, Heart, BarChart3, Star } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <header className="flex items-center justify-between p-4 md:p-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-primary-foreground" />
          </div>
          <h1 className="font-heading font-bold text-xl text-foreground">Closet Kawaii</h1>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Button asChild data-testid="button-login">
            <a href="/api/login">Sign In</a>
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-6">
        <section className="py-16 md:py-24 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary text-secondary-foreground text-sm font-body mb-6">
            <Star className="w-4 h-4" />
            <span>Your wardrobe, but cuter</span>
          </div>
          <h2 className="font-heading font-bold text-4xl md:text-6xl text-foreground mb-6 max-w-3xl mx-auto leading-tight">
            Organize your closet with{" "}
            <span className="text-primary">kawaii vibes</span>
          </h2>
          <p className="font-body text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Track your clothing pieces, create adorable outfits, log what you wear, 
            and get smart suggestions for your next look!
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" asChild className="text-lg px-8" data-testid="button-get-started">
              <a href="/api/login">Get Started</a>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8" data-testid="button-learn-more">
              <Heart className="w-5 h-5 mr-2" />
              Learn More
            </Button>
          </div>
        </section>

        <section className="py-16">
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="border-2 transition-all duration-200 hover:shadow-lg">
              <CardContent className="p-8">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                  <Shirt className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-heading font-semibold text-xl mb-3 text-foreground">
                  Add Your Pieces
                </h3>
                <p className="font-body text-muted-foreground">
                  Upload photos of your clothes with details like category, color, 
                  and season. Build your digital wardrobe!
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 transition-all duration-200 hover:shadow-lg">
              <CardContent className="p-8">
                <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center mb-6">
                  <Sparkles className="w-7 h-7 text-secondary-foreground" />
                </div>
                <h3 className="font-heading font-semibold text-xl mb-3 text-foreground">
                  Create Outfits
                </h3>
                <p className="font-body text-muted-foreground">
                  Mix and match your pieces to create complete looks. 
                  Save your favorite combinations!
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 transition-all duration-200 hover:shadow-lg">
              <CardContent className="p-8">
                <div className="w-14 h-14 rounded-2xl bg-accent flex items-center justify-center mb-6">
                  <BarChart3 className="w-7 h-7 text-accent-foreground" />
                </div>
                <h3 className="font-heading font-semibold text-xl mb-3 text-foreground">
                  Smart Analytics
                </h3>
                <p className="font-body text-muted-foreground">
                  Track what you wear and get recommendations for outfits 
                  you haven't worn in a while!
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="py-16 text-center">
          <Card className="border-2 bg-primary/5">
            <CardContent className="p-12">
              <h3 className="font-heading font-bold text-2xl md:text-3xl text-foreground mb-4">
                Ready to organize your wardrobe?
              </h3>
              <p className="font-body text-muted-foreground mb-8 max-w-lg mx-auto">
                Join thousands of fashion lovers who use Closet Kawaii to plan 
                their outfits and discover new looks!
              </p>
              <Button size="lg" asChild className="text-lg px-8" data-testid="button-start-now">
                <a href="/api/login">Start Now</a>
              </Button>
            </CardContent>
          </Card>
        </section>
      </main>

      <footer className="py-8 text-center border-t">
        <p className="font-body text-sm text-muted-foreground">
          Made with <Heart className="w-4 h-4 inline text-primary" /> by Closet Kawaii
        </p>
      </footer>
    </div>
  );
}
