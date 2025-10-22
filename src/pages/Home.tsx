import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/Header";
import heroImage from "@/assets/hero-image.jpg";
import ethnicSaree from "@/assets/ethnic-saree.jpg";
import westernDress from "@/assets/western-dress.jpg";
import fusionOutfit from "@/assets/fusion-outfit.jpg";
import { ArrowRight } from "lucide-react";

const Home = () => {
  const categories = [
    {
      name: "Ethnic Wear",
      description: "Traditional elegance meets modern style",
      image: ethnicSaree,
      slug: "ethnic-wear",
    },
    {
      name: "Western Wear",
      description: "Contemporary fashion for the modern wardrobe",
      image: westernDress,
      slug: "western-wear",
    },
    {
      name: "Fusion Styles",
      description: "The perfect blend of traditional and trendy",
      image: fusionOutfit,
      slug: "fusion-styles",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Fashion Hero"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/80 to-background/40" />
        </div>
        <div className="relative z-10 container text-center space-y-6">
          <h1 className="text-5xl md:text-7xl font-bold">
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Where Tradition
            </span>
            <br />
            <span className="text-foreground">Meets Trend</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover curated collections that celebrate your unique style journey
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" asChild>
              <Link to="/products">
                Explore Collection
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/auth">Join Nyra</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 container">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Shop by Category</h2>
          <p className="text-muted-foreground text-lg">
            Find your perfect style in our curated collections
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((category) => (
            <Link key={category.slug} to={`/products?category=${category.slug}`}>
              <Card className="group overflow-hidden transition-all hover:shadow-elegant cursor-pointer h-full">
                <div className="aspect-[4/5] overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                </div>
                <CardContent className="p-6 text-center">
                  <h3 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-muted-foreground">{category.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Section */}
      <section className="py-20 bg-gradient-to-br from-secondary/30 to-background">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-4xl font-bold">Experience Fashion Excellence</h2>
            <p className="text-lg text-muted-foreground">
              At Nyra, we believe fashion is more than clothing—it's an expression of who you are. 
              Our carefully curated collections blend timeless tradition with contemporary trends, 
              ensuring you always look and feel your best.
            </p>
            <Button size="lg" asChild>
              <Link to="/products">Start Shopping</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;