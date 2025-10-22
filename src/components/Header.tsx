import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { ShoppingBag, Heart, User, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useEffect, useState } from "react";

const Header = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const { data: cartCount } = useQuery({
    queryKey: ["cart-count", user?.id],
    queryFn: async () => {
      if (!user) return 0;
      const { data, error } = await supabase
        .from("cart")
        .select("*", { count: "exact" })
        .eq("user_id", user.id);
      if (error) throw error;
      return data?.length || 0;
    },
    enabled: !!user,
  });

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out successfully");
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            NYRA
          </h1>
        </Link>

        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/products" className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">
            All Products
          </Link>
          <Link to="/products?category=ethnic-wear" className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">
            Ethnic Wear
          </Link>
          <Link to="/products?category=western-wear" className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">
            Western Wear
          </Link>
          <Link to="/products?category=fusion-styles" className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">
            Fusion
          </Link>
        </nav>

        <div className="flex items-center space-x-2">
          {user ? (
            <>
              <Button variant="ghost" size="icon" onClick={() => navigate("/wishlist")}>
                <Heart className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => navigate("/cart")} className="relative">
                <ShoppingBag className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Button>
              <Button variant="ghost" size="icon" onClick={handleSignOut}>
                <LogOut className="h-5 w-5" />
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" onClick={() => navigate("/auth")}>
                <User className="h-4 w-4 mr-2" />
                Sign In
              </Button>
              <Button size="sm" onClick={() => navigate("/auth")}>
                Join Now
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;