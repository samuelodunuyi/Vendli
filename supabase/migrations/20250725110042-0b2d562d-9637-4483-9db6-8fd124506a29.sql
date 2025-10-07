-- Create categories table for organizing products
CREATE TABLE public.categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  parent_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  store_id UUID REFERENCES public.stores(id) ON DELETE CASCADE,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(name, store_id)
);

-- Create enhanced products table for restaurant items
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  sku TEXT,
  barcode TEXT,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  store_id UUID REFERENCES public.stores(id) ON DELETE CASCADE,
  
  -- Pricing
  base_price DECIMAL(10,2) NOT NULL DEFAULT 0,
  cost_price DECIMAL(10,2) DEFAULT 0,
  
  -- Inventory
  current_stock INTEGER DEFAULT 0,
  min_stock_level INTEGER DEFAULT 0,
  max_stock_level INTEGER DEFAULT NULL,
  unit_of_measure TEXT DEFAULT 'piece',
  
  -- Restaurant specific
  is_recipe BOOLEAN DEFAULT false,
  prep_time_minutes INTEGER DEFAULT 0,
  cooking_time_minutes INTEGER DEFAULT 0,
  allergens TEXT[], -- Array of allergen types
  spice_level INTEGER DEFAULT 0, -- 0-5 scale
  is_vegetarian BOOLEAN DEFAULT false,
  is_vegan BOOLEAN DEFAULT false,
  is_gluten_free BOOLEAN DEFAULT false,
  
  -- Status and metadata
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'discontinued')),
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  UNIQUE(sku, store_id),
  UNIQUE(barcode, store_id)
);

-- Create ingredients table
CREATE TABLE public.ingredients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  store_id UUID REFERENCES public.stores(id) ON DELETE CASCADE,
  
  -- Inventory details
  current_stock DECIMAL(10,3) DEFAULT 0,
  min_stock_level DECIMAL(10,3) DEFAULT 0,
  unit_of_measure TEXT NOT NULL DEFAULT 'kg',
  cost_per_unit DECIMAL(10,4) DEFAULT 0,
  
  -- Nutritional info per unit
  calories_per_unit DECIMAL(8,2) DEFAULT 0,
  protein_per_unit DECIMAL(8,2) DEFAULT 0,
  carbs_per_unit DECIMAL(8,2) DEFAULT 0,
  fat_per_unit DECIMAL(8,2) DEFAULT 0,
  
  -- Allergen and dietary info
  allergens TEXT[],
  is_vegetarian BOOLEAN DEFAULT true,
  is_vegan BOOLEAN DEFAULT true,
  is_gluten_free BOOLEAN DEFAULT true,
  
  -- Supplier info
  supplier_name TEXT,
  supplier_code TEXT,
  
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'discontinued')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  UNIQUE(name, store_id)
);

-- Create recipes table
CREATE TABLE public.recipes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  store_id UUID REFERENCES public.stores(id) ON DELETE CASCADE,
  
  name TEXT NOT NULL,
  description TEXT,
  instructions TEXT NOT NULL,
  
  -- Recipe details
  prep_time_minutes INTEGER DEFAULT 0,
  cooking_time_minutes INTEGER DEFAULT 0,
  servings INTEGER DEFAULT 1,
  difficulty_level INTEGER DEFAULT 1 CHECK (difficulty_level BETWEEN 1 AND 5),
  
  -- Costing
  estimated_cost DECIMAL(10,2) DEFAULT 0,
  
  -- Chef/creator info
  created_by UUID REFERENCES public.profiles(id),
  
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'testing')),
  version INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create recipe ingredients junction table
CREATE TABLE public.recipe_ingredients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  recipe_id UUID REFERENCES public.recipes(id) ON DELETE CASCADE,
  ingredient_id UUID REFERENCES public.ingredients(id) ON DELETE CASCADE,
  
  quantity DECIMAL(10,3) NOT NULL,
  unit_of_measure TEXT NOT NULL,
  is_optional BOOLEAN DEFAULT false,
  preparation_notes TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  UNIQUE(recipe_id, ingredient_id)
);

-- Create nutritional info table
CREATE TABLE public.nutritional_info (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  
  -- Per serving nutritional values
  serving_size TEXT,
  calories DECIMAL(8,2) DEFAULT 0,
  protein DECIMAL(8,2) DEFAULT 0,
  carbohydrates DECIMAL(8,2) DEFAULT 0,
  total_fat DECIMAL(8,2) DEFAULT 0,
  saturated_fat DECIMAL(8,2) DEFAULT 0,
  trans_fat DECIMAL(8,2) DEFAULT 0,
  cholesterol DECIMAL(8,2) DEFAULT 0,
  sodium DECIMAL(8,2) DEFAULT 0,
  dietary_fiber DECIMAL(8,2) DEFAULT 0,
  sugars DECIMAL(8,2) DEFAULT 0,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  UNIQUE(product_id)
);

-- Create product variants table for sizes/customizations
CREATE TABLE public.product_variants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  
  variant_name TEXT NOT NULL, -- e.g., "Small", "Medium", "Large", "Extra Cheese"
  variant_type TEXT NOT NULL, -- e.g., "size", "customization", "addon"
  price_modifier DECIMAL(10,2) DEFAULT 0, -- Additional cost for this variant
  
  is_default BOOLEAN DEFAULT false,
  is_available BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  UNIQUE(product_id, variant_name)
);

-- Create indexes for better performance
CREATE INDEX idx_categories_store_id ON public.categories(store_id);
CREATE INDEX idx_categories_parent_id ON public.categories(parent_id);
CREATE INDEX idx_products_store_id ON public.products(store_id);
CREATE INDEX idx_products_category_id ON public.products(category_id);
CREATE INDEX idx_products_barcode ON public.products(barcode);
CREATE INDEX idx_products_sku ON public.products(sku);
CREATE INDEX idx_ingredients_store_id ON public.ingredients(store_id);
CREATE INDEX idx_recipes_product_id ON public.recipes(product_id);
CREATE INDEX idx_recipes_store_id ON public.recipes(store_id);
CREATE INDEX idx_recipe_ingredients_recipe_id ON public.recipe_ingredients(recipe_id);
CREATE INDEX idx_recipe_ingredients_ingredient_id ON public.recipe_ingredients(ingredient_id);
CREATE INDEX idx_nutritional_info_product_id ON public.nutritional_info(product_id);
CREATE INDEX idx_product_variants_product_id ON public.product_variants(product_id);

-- Enable Row Level Security
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recipe_ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nutritional_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;

-- RLS Policies for categories
CREATE POLICY "Users can view categories in their accessible stores" 
ON public.categories FOR SELECT 
USING (
  store_id IN (
    SELECT s.id FROM public.stores s 
    LEFT JOIN public.user_roles ur ON ur.user_id = auth.uid() 
    WHERE ur.store_id = s.id OR ur.store_id IS NULL OR has_role(auth.uid(), 'super_admin'::app_role)
  )
);

CREATE POLICY "Store managers can manage categories in their stores" 
ON public.categories FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.stores s 
    WHERE s.id = store_id AND (
      s.manager_id = auth.uid() OR 
      has_role(auth.uid(), 'super_admin'::app_role)
    )
  )
);

-- RLS Policies for products
CREATE POLICY "Users can view products in their accessible stores" 
ON public.products FOR SELECT 
USING (
  store_id IN (
    SELECT s.id FROM public.stores s 
    LEFT JOIN public.user_roles ur ON ur.user_id = auth.uid() 
    WHERE ur.store_id = s.id OR ur.store_id IS NULL OR has_role(auth.uid(), 'super_admin'::app_role)
  )
);

CREATE POLICY "Store managers can manage products in their stores" 
ON public.products FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.stores s 
    WHERE s.id = store_id AND (
      s.manager_id = auth.uid() OR 
      has_role(auth.uid(), 'super_admin'::app_role)
    )
  )
);

-- RLS Policies for ingredients
CREATE POLICY "Users can view ingredients in their accessible stores" 
ON public.ingredients FOR SELECT 
USING (
  store_id IN (
    SELECT s.id FROM public.stores s 
    LEFT JOIN public.user_roles ur ON ur.user_id = auth.uid() 
    WHERE ur.store_id = s.id OR ur.store_id IS NULL OR has_role(auth.uid(), 'super_admin'::app_role)
  )
);

CREATE POLICY "Store managers can manage ingredients in their stores" 
ON public.ingredients FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.stores s 
    WHERE s.id = store_id AND (
      s.manager_id = auth.uid() OR 
      has_role(auth.uid(), 'super_admin'::app_role)
    )
  )
);

-- RLS Policies for recipes
CREATE POLICY "Users can view recipes in their accessible stores" 
ON public.recipes FOR SELECT 
USING (
  store_id IN (
    SELECT s.id FROM public.stores s 
    LEFT JOIN public.user_roles ur ON ur.user_id = auth.uid() 
    WHERE ur.store_id = s.id OR ur.store_id IS NULL OR has_role(auth.uid(), 'super_admin'::app_role)
  )
);

CREATE POLICY "Store managers can manage recipes in their stores" 
ON public.recipes FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.stores s 
    WHERE s.id = store_id AND (
      s.manager_id = auth.uid() OR 
      has_role(auth.uid(), 'super_admin'::app_role)
    )
  )
);

-- RLS Policies for recipe_ingredients (inherit from recipe permissions)
CREATE POLICY "Users can view recipe ingredients based on recipe access" 
ON public.recipe_ingredients FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.recipes r 
    JOIN public.stores s ON r.store_id = s.id 
    LEFT JOIN public.user_roles ur ON ur.user_id = auth.uid() 
    WHERE r.id = recipe_id AND (
      ur.store_id = s.id OR ur.store_id IS NULL OR has_role(auth.uid(), 'super_admin'::app_role)
    )
  )
);

CREATE POLICY "Store managers can manage recipe ingredients in their stores" 
ON public.recipe_ingredients FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.recipes r 
    JOIN public.stores s ON r.store_id = s.id 
    WHERE r.id = recipe_id AND (
      s.manager_id = auth.uid() OR 
      has_role(auth.uid(), 'super_admin'::app_role)
    )
  )
);

-- RLS Policies for nutritional_info (inherit from product permissions)
CREATE POLICY "Users can view nutritional info based on product access" 
ON public.nutritional_info FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.products p 
    JOIN public.stores s ON p.store_id = s.id 
    LEFT JOIN public.user_roles ur ON ur.user_id = auth.uid() 
    WHERE p.id = product_id AND (
      ur.store_id = s.id OR ur.store_id IS NULL OR has_role(auth.uid(), 'super_admin'::app_role)
    )
  )
);

CREATE POLICY "Store managers can manage nutritional info in their stores" 
ON public.nutritional_info FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.products p 
    JOIN public.stores s ON p.store_id = s.id 
    WHERE p.id = product_id AND (
      s.manager_id = auth.uid() OR 
      has_role(auth.uid(), 'super_admin'::app_role)
    )
  )
);

-- RLS Policies for product_variants (inherit from product permissions)
CREATE POLICY "Users can view product variants based on product access" 
ON public.product_variants FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.products p 
    JOIN public.stores s ON p.store_id = s.id 
    LEFT JOIN public.user_roles ur ON ur.user_id = auth.uid() 
    WHERE p.id = product_id AND (
      ur.store_id = s.id OR ur.store_id IS NULL OR has_role(auth.uid(), 'super_admin'::app_role)
    )
  )
);

CREATE POLICY "Store managers can manage product variants in their stores" 
ON public.product_variants FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.products p 
    JOIN public.stores s ON p.store_id = s.id 
    WHERE p.id = product_id AND (
      s.manager_id = auth.uid() OR 
      has_role(auth.uid(), 'super_admin'::app_role)
    )
  )
);

-- Create triggers for updating timestamps
CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON public.categories
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_ingredients_updated_at
  BEFORE UPDATE ON public.ingredients
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_recipes_updated_at
  BEFORE UPDATE ON public.recipes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_nutritional_info_updated_at
  BEFORE UPDATE ON public.nutritional_info
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_product_variants_updated_at
  BEFORE UPDATE ON public.product_variants
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();