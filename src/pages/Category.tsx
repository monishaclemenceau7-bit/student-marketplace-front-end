import { useParams, Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { ProductCard } from '@/components/ProductCard';
import { getProductsByCategory, categories } from '@/data/products';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft,
  BookOpen,
  Laptop,
  Sofa,
  Shirt,
  Music,
  Dumbbell,
  LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const categoryIcons: Record<string, LucideIcon> = {
  books: BookOpen,
  electronics: Laptop,
  furniture: Sofa,
  clothing: Shirt,
  music: Music,
  sports: Dumbbell,
};

const categoryDescriptions: Record<string, string> = {
  books: 'Textbooks, novels, study guides, and academic materials from fellow students.',
  electronics: 'Laptops, phones, tablets, headphones, and other tech gadgets.',
  furniture: 'Desks, chairs, shelves, and dorm essentials for your space.',
  clothing: 'Clothes, shoes, and accessories in great condition.',
  music: 'Instruments, audio equipment, and music accessories.',
  sports: 'Sports equipment, gym gear, and outdoor accessories.',
};

const Category = () => {
  const { slug } = useParams();
  const categoryProducts = getProductsByCategory(slug || '');
  const category = categories.find((c) => c.slug === slug);
  const Icon = categoryIcons[slug || ''] || BookOpen;

  if (!category) {
    return (
      <Layout>
        <div className="container py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Category Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The category you're looking for doesn't exist.
          </p>
          <Link to="/products">
            <Button>Browse All Products</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link to="/" className="hover:text-primary">
            Home
          </Link>
          <span>/</span>
          <Link to="/products" className="hover:text-primary">
            Products
          </Link>
          <span>/</span>
          <span className="text-foreground">{category.name}</span>
        </div>

        {/* Category Header */}
        <div className="flex items-start gap-6 mb-8">
          <div className="h-16 w-16 rounded-xl gradient-primary flex items-center justify-center shrink-0">
            <Icon className="h-8 w-8 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">{category.name}</h1>
            <p className="text-muted-foreground max-w-2xl">
              {categoryDescriptions[slug || ''] ||
                `Browse all ${category.name.toLowerCase()} available on campus.`}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              {categoryProducts.length} item{categoryProducts.length !== 1 && 's'} available
            </p>
          </div>
        </div>

        {/* Category Navigation */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-6">
          {categories.map((cat) => {
            const CatIcon = categoryIcons[cat.slug] || BookOpen;
            return (
              <Link key={cat.slug} to={`/category/${cat.slug}`}>
                <Button
                  variant={cat.slug === slug ? 'default' : 'outline'}
                  size="sm"
                  className="gap-2 shrink-0"
                >
                  <CatIcon className="h-4 w-4" />
                  {cat.name}
                </Button>
              </Link>
            );
          })}
        </div>

        {/* Products Grid */}
        {categoryProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categoryProducts.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                title={product.title}
                price={product.price}
                image={product.image}
                category={product.category}
                condition={product.condition}
                location={product.location}
                seller={product.seller?.name || 'Unknown Seller'}
                isFavorite={product.isFavorite}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Icon className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No items in {category.name}</h3>
            <p className="text-muted-foreground mb-6">
              Be the first to list an item in this category!
            </p>
            <div className="flex gap-4 justify-center">
              <Link to="/sell">
                <Button>List an Item</Button>
              </Link>
              <Link to="/products">
                <Button variant="outline">Browse All Products</Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Category;
