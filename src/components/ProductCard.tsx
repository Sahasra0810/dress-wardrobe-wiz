import { Card, CardContent, CardFooter } from "./ui/card";
import { Button } from "./ui/button";
import { Heart, ShoppingBag } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  category?: string;
}

const ProductCard = ({ id, name, price, image, category }: ProductCardProps) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
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

  const addToCart = useMutation({
    mutationFn: async () => {
      if (!user) {
        navigate("/auth");
        throw new Error("Please sign in to add items to cart");
      }

      const { error } = await supabase.from("cart").upsert({
        user_id: user.id,
        product_id: id,
        quantity: 1,
      }, {
        onConflict: "user_id,product_id"
      });

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Added to cart");
      queryClient.invalidateQueries({ queryKey: ["cart-count"] });
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  const addToWishlist = useMutation({
    mutationFn: async () => {
      if (!user) {
        navigate("/auth");
        throw new Error("Please sign in to add items to wishlist");
      }

      const { error } = await supabase.from("wishlist").insert({
        user_id: user.id,
        product_id: id,
      });

      if (error) {
        if (error.code === "23505") {
          throw new Error("Already in wishlist");
        }
        throw error;
      }
    },
    onSuccess: () => {
      toast.success("Added to wishlist");
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  return (
    <Card className="group overflow-hidden transition-all hover:shadow-card">
      <div className="aspect-square overflow-hidden bg-secondary/20">
        <img
          src={image}
          alt={name}
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
        />
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-1 line-clamp-1">{name}</h3>
        {category && (
          <p className="text-xs text-muted-foreground mb-2">{category}</p>
        )}
        <p className="text-xl font-bold text-primary">₹{price.toFixed(2)}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex gap-2">
        <Button
          className="flex-1"
          onClick={() => addToCart.mutate()}
          disabled={addToCart.isPending}
        >
          <ShoppingBag className="h-4 w-4 mr-2" />
          Add to Cart
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => addToWishlist.mutate()}
          disabled={addToWishlist.isPending}
        >
          <Heart className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;