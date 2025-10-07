export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      audit_logs: {
        Row: {
          action: string
          created_at: string | null
          details: Json | null
          id: string
          ip_address: unknown | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          details?: Json | null
          id?: string
          ip_address?: unknown | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          details?: Json | null
          id?: string
          ip_address?: unknown | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      categories: {
        Row: {
          created_at: string
          description: string | null
          display_order: number | null
          id: string
          is_active: boolean | null
          name: string
          parent_id: string | null
          store_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          name: string
          parent_id?: string | null
          store_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          name?: string
          parent_id?: string | null
          store_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "categories_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      ingredients: {
        Row: {
          allergens: string[] | null
          calories_per_unit: number | null
          carbs_per_unit: number | null
          cost_per_unit: number | null
          created_at: string
          current_stock: number | null
          description: string | null
          fat_per_unit: number | null
          id: string
          is_gluten_free: boolean | null
          is_vegan: boolean | null
          is_vegetarian: boolean | null
          min_stock_level: number | null
          name: string
          protein_per_unit: number | null
          status: string | null
          store_id: string | null
          supplier_code: string | null
          supplier_name: string | null
          unit_of_measure: string
          updated_at: string
        }
        Insert: {
          allergens?: string[] | null
          calories_per_unit?: number | null
          carbs_per_unit?: number | null
          cost_per_unit?: number | null
          created_at?: string
          current_stock?: number | null
          description?: string | null
          fat_per_unit?: number | null
          id?: string
          is_gluten_free?: boolean | null
          is_vegan?: boolean | null
          is_vegetarian?: boolean | null
          min_stock_level?: number | null
          name: string
          protein_per_unit?: number | null
          status?: string | null
          store_id?: string | null
          supplier_code?: string | null
          supplier_name?: string | null
          unit_of_measure?: string
          updated_at?: string
        }
        Update: {
          allergens?: string[] | null
          calories_per_unit?: number | null
          carbs_per_unit?: number | null
          cost_per_unit?: number | null
          created_at?: string
          current_stock?: number | null
          description?: string | null
          fat_per_unit?: number | null
          id?: string
          is_gluten_free?: boolean | null
          is_vegan?: boolean | null
          is_vegetarian?: boolean | null
          min_stock_level?: number | null
          name?: string
          protein_per_unit?: number | null
          status?: string | null
          store_id?: string | null
          supplier_code?: string | null
          supplier_name?: string | null
          unit_of_measure?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ingredients_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      nutritional_info: {
        Row: {
          calories: number | null
          carbohydrates: number | null
          cholesterol: number | null
          created_at: string
          dietary_fiber: number | null
          id: string
          product_id: string | null
          protein: number | null
          saturated_fat: number | null
          serving_size: string | null
          sodium: number | null
          sugars: number | null
          total_fat: number | null
          trans_fat: number | null
          updated_at: string
        }
        Insert: {
          calories?: number | null
          carbohydrates?: number | null
          cholesterol?: number | null
          created_at?: string
          dietary_fiber?: number | null
          id?: string
          product_id?: string | null
          protein?: number | null
          saturated_fat?: number | null
          serving_size?: string | null
          sodium?: number | null
          sugars?: number | null
          total_fat?: number | null
          trans_fat?: number | null
          updated_at?: string
        }
        Update: {
          calories?: number | null
          carbohydrates?: number | null
          cholesterol?: number | null
          created_at?: string
          dietary_fiber?: number | null
          id?: string
          product_id?: string | null
          protein?: number | null
          saturated_fat?: number | null
          serving_size?: string | null
          sodium?: number | null
          sugars?: number | null
          total_fat?: number | null
          trans_fat?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "nutritional_info_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: true
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      permissions: {
        Row: {
          created_at: string | null
          id: string
          module: Database["public"]["Enums"]["module_type"]
          permission: Database["public"]["Enums"]["permission_type"]
          role: Database["public"]["Enums"]["app_role"]
        }
        Insert: {
          created_at?: string | null
          id?: string
          module: Database["public"]["Enums"]["module_type"]
          permission: Database["public"]["Enums"]["permission_type"]
          role: Database["public"]["Enums"]["app_role"]
        }
        Update: {
          created_at?: string | null
          id?: string
          module?: Database["public"]["Enums"]["module_type"]
          permission?: Database["public"]["Enums"]["permission_type"]
          role?: Database["public"]["Enums"]["app_role"]
        }
        Relationships: []
      }
      product_variants: {
        Row: {
          created_at: string
          display_order: number | null
          id: string
          is_available: boolean | null
          is_default: boolean | null
          price_modifier: number | null
          product_id: string | null
          updated_at: string
          variant_name: string
          variant_type: string
        }
        Insert: {
          created_at?: string
          display_order?: number | null
          id?: string
          is_available?: boolean | null
          is_default?: boolean | null
          price_modifier?: number | null
          product_id?: string | null
          updated_at?: string
          variant_name: string
          variant_type: string
        }
        Update: {
          created_at?: string
          display_order?: number | null
          id?: string
          is_available?: boolean | null
          is_default?: boolean | null
          price_modifier?: number | null
          product_id?: string | null
          updated_at?: string
          variant_name?: string
          variant_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_variants_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          allergens: string[] | null
          barcode: string | null
          base_price: number
          category_id: string | null
          cooking_time_minutes: number | null
          cost_price: number | null
          created_at: string
          current_stock: number | null
          description: string | null
          id: string
          image_url: string | null
          is_gluten_free: boolean | null
          is_recipe: boolean | null
          is_vegan: boolean | null
          is_vegetarian: boolean | null
          max_stock_level: number | null
          min_stock_level: number | null
          name: string
          prep_time_minutes: number | null
          sku: string | null
          spice_level: number | null
          status: string | null
          store_id: string | null
          unit_of_measure: string | null
          updated_at: string
        }
        Insert: {
          allergens?: string[] | null
          barcode?: string | null
          base_price?: number
          category_id?: string | null
          cooking_time_minutes?: number | null
          cost_price?: number | null
          created_at?: string
          current_stock?: number | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_gluten_free?: boolean | null
          is_recipe?: boolean | null
          is_vegan?: boolean | null
          is_vegetarian?: boolean | null
          max_stock_level?: number | null
          min_stock_level?: number | null
          name: string
          prep_time_minutes?: number | null
          sku?: string | null
          spice_level?: number | null
          status?: string | null
          store_id?: string | null
          unit_of_measure?: string | null
          updated_at?: string
        }
        Update: {
          allergens?: string[] | null
          barcode?: string | null
          base_price?: number
          category_id?: string | null
          cooking_time_minutes?: number | null
          cost_price?: number | null
          created_at?: string
          current_stock?: number | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_gluten_free?: boolean | null
          is_recipe?: boolean | null
          is_vegan?: boolean | null
          is_vegetarian?: boolean | null
          max_stock_level?: number | null
          min_stock_level?: number | null
          name?: string
          prep_time_minutes?: number | null
          sku?: string | null
          spice_level?: number | null
          status?: string | null
          store_id?: string | null
          unit_of_measure?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      recipe_ingredients: {
        Row: {
          created_at: string
          id: string
          ingredient_id: string | null
          is_optional: boolean | null
          preparation_notes: string | null
          quantity: number
          recipe_id: string | null
          unit_of_measure: string
        }
        Insert: {
          created_at?: string
          id?: string
          ingredient_id?: string | null
          is_optional?: boolean | null
          preparation_notes?: string | null
          quantity: number
          recipe_id?: string | null
          unit_of_measure: string
        }
        Update: {
          created_at?: string
          id?: string
          ingredient_id?: string | null
          is_optional?: boolean | null
          preparation_notes?: string | null
          quantity?: number
          recipe_id?: string | null
          unit_of_measure?: string
        }
        Relationships: [
          {
            foreignKeyName: "recipe_ingredients_ingredient_id_fkey"
            columns: ["ingredient_id"]
            isOneToOne: false
            referencedRelation: "ingredients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recipe_ingredients_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes"
            referencedColumns: ["id"]
          },
        ]
      }
      recipes: {
        Row: {
          cooking_time_minutes: number | null
          created_at: string
          created_by: string | null
          description: string | null
          difficulty_level: number | null
          estimated_cost: number | null
          id: string
          instructions: string
          name: string
          prep_time_minutes: number | null
          product_id: string | null
          servings: number | null
          status: string | null
          store_id: string | null
          updated_at: string
          version: number | null
        }
        Insert: {
          cooking_time_minutes?: number | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          difficulty_level?: number | null
          estimated_cost?: number | null
          id?: string
          instructions: string
          name: string
          prep_time_minutes?: number | null
          product_id?: string | null
          servings?: number | null
          status?: string | null
          store_id?: string | null
          updated_at?: string
          version?: number | null
        }
        Update: {
          cooking_time_minutes?: number | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          difficulty_level?: number | null
          estimated_cost?: number | null
          id?: string
          instructions?: string
          name?: string
          prep_time_minutes?: number | null
          product_id?: string | null
          servings?: number | null
          status?: string | null
          store_id?: string | null
          updated_at?: string
          version?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "recipes_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recipes_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recipes_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      stores: {
        Row: {
          created_at: string | null
          email: string | null
          id: string
          location: string | null
          manager_id: string | null
          name: string
          phone: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id?: string
          location?: string | null
          manager_id?: string | null
          name: string
          phone?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: string
          location?: string | null
          manager_id?: string | null
          name?: string
          phone?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "stores_manager_id_fkey"
            columns: ["manager_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          assigned_by: string | null
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          store_id: string | null
          user_id: string
        }
        Insert: {
          assigned_by?: string | null
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          store_id?: string | null
          user_id: string
        }
        Update: {
          assigned_by?: string | null
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          store_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_roles: {
        Args: { _user_id: string }
        Returns: {
          role: Database["public"]["Enums"]["app_role"]
          store_id: string
          store_name: string
        }[]
      }
      has_permission: {
        Args: {
          _user_id: string
          _module: Database["public"]["Enums"]["module_type"]
          _permission: Database["public"]["Enums"]["permission_type"]
        }
        Returns: boolean
      }
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
          _store_id?: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role:
        | "customer"
        | "store_sales_associate"
        | "store_cashier"
        | "store_inventory_clerk"
        | "store_manager"
        | "sales_manager"
        | "super_admin"
      module_type:
        | "dashboard"
        | "products"
        | "orders"
        | "inventory"
        | "customers"
        | "stores"
        | "users"
        | "sales_analytics"
        | "pos"
        | "settings"
      permission_type: "read" | "write" | "approve" | "delete" | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: [
        "customer",
        "store_sales_associate",
        "store_cashier",
        "store_inventory_clerk",
        "store_manager",
        "sales_manager",
        "super_admin",
      ],
      module_type: [
        "dashboard",
        "products",
        "orders",
        "inventory",
        "customers",
        "stores",
        "users",
        "sales_analytics",
        "pos",
        "settings",
      ],
      permission_type: ["read", "write", "approve", "delete", "admin"],
    },
  },
} as const
