export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      bookings: {
        Row: {
          id: string;
          created_at: string;
          name: string;
          phone: string;
          email: string | null;
          service: string;
          event_date: string;
          message: string | null;
          status: "new" | "confirmed" | "cancelled";
          user_id: string | null;
        };
        Insert: Omit<Database["public"]["Tables"]["bookings"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["bookings"]["Insert"]>;
      };
      services: {
        Row: {
          id: string;
          created_at: string;
          title: string;
          title_te: string | null;
          description: string;
          description_te: string | null;
          price: string;
          icon: string;
          image_url: string;
          display_order: number;
          active: boolean;
        };
        Insert: Omit<Database["public"]["Tables"]["services"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["services"]["Insert"]>;
      };
      gallery: {
        Row: {
          id: string;
          created_at: string;
          image_url: string;
          category: string;
          caption: string | null;
          display_order: number;
          active: boolean;
        };
        Insert: Omit<Database["public"]["Tables"]["gallery"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["gallery"]["Insert"]>;
      };
      profiles: {
        Row: {
          id: string;
          created_at: string;
          email: string;
          full_name: string | null;
          role: "admin" | "customer";
          avatar_url: string | null;
        };
        Insert: Omit<Database["public"]["Tables"]["profiles"]["Row"], "created_at">;
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
      };
      site_settings: {
        Row: {
          key: string;
          value: string;
          updated_at: string;
        };
        Insert: Database["public"]["Tables"]["site_settings"]["Row"];
        Update: Partial<Database["public"]["Tables"]["site_settings"]["Row"]>;
      };
    };
  };
};

// Convenience types
export type Booking = Database["public"]["Tables"]["bookings"]["Row"];
export type Service = Database["public"]["Tables"]["services"]["Row"];
export type GalleryItem = Database["public"]["Tables"]["gallery"]["Row"];
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type SiteSetting = Database["public"]["Tables"]["site_settings"]["Row"];
