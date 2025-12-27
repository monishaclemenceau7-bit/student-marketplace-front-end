import { Link } from "react-router-dom";
import { Heart, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  id: string;
  title: string;
  price: number;
  image: string;
  category: string;
  condition: "new" | "like-new" | "good" | "fair";
  location?: string;
  seller?: string;
  isFavorite?: boolean;
}

const conditionColors = {
  new: "bg-success text-success-foreground",
  "like-new": "bg-accent text-accent-foreground",
  good: "bg-primary text-primary-foreground",
  fair: "bg-warning text-warning-foreground",
};

export function ProductCard({
  id,
  title,
  price,
  image,
  category,
  condition,
  location,
  seller,
  isFavorite = false,
}: ProductCardProps) {
  return (
    <Link
      to={`/product/${id}`}
      className="group block rounded-xl bg-card border border-border/50 overflow-hidden transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1"
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-secondary">
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "absolute top-3 right-3 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm",
            isFavorite && "text-primary"
          )}
          onClick={(e) => {
            e.preventDefault();
            // Toggle favorite logic
          }}
        >
          <Heart className={cn("h-4 w-4", isFavorite && "fill-current")} />
        </Button>
        <Badge className={cn("absolute top-3 left-3", conditionColors[condition])}>
          {condition.charAt(0).toUpperCase() + condition.slice(1).replace("-", " ")}
        </Badge>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
            {title}
          </h3>
        </div>
        
        <p className="text-2xl font-bold text-primary mb-2">
          ${price.toFixed(2)}
        </p>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Badge variant="secondary" className="font-normal">
            {category}
          </Badge>
          {location && (
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {location}
            </span>
          )}
        </div>

        {seller && (
          <p className="text-xs text-muted-foreground mt-2">
            Sold by <span className="font-medium text-foreground">{seller}</span>
          </p>
        )}
      </div>
    </Link>
  );
}
