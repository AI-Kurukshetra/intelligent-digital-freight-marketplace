export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Enums: {
      user_role: "shipper" | "carrier";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Tables: {
      users: {
        Row: {
          created_at: string;
          email: string;
          id: string;
          role: Database["public"]["Enums"]["user_role"];
        };
        Insert: {
          created_at?: string;
          email: string;
          id: string;
          role: Database["public"]["Enums"]["user_role"];
        };
        Update: {
          created_at?: string;
          email?: string;
          id?: string;
          role?: Database["public"]["Enums"]["user_role"];
        };
        Relationships: [];
      };
      loads: {
        Row: {
          cargo_type: string;
          created_at: string;
          delivery_location: string;
          id: string;
          pickup_date: string;
          pickup_location: string;
          price_estimate: number;
          shipper_id: string;
          status: "open" | "awarded";
          title: string;
          weight: number;
        };
        Insert: {
          cargo_type: string;
          created_at?: string;
          delivery_location: string;
          id?: string;
          pickup_date: string;
          pickup_location: string;
          price_estimate: number;
          shipper_id: string;
          status?: "open" | "awarded";
          title: string;
          weight: number;
        };
        Update: {
          cargo_type?: string;
          created_at?: string;
          delivery_location?: string;
          id?: string;
          pickup_date?: string;
          pickup_location?: string;
          price_estimate?: number;
          shipper_id?: string;
          status?: "open" | "awarded";
          title?: string;
          weight?: number;
        };
        Relationships: [];
      };
      bids: {
        Row: {
          bid_price: number;
          carrier_id: string;
          created_at: string;
          id: string;
          load_id: string;
          message: string | null;
        };
        Insert: {
          bid_price: number;
          carrier_id: string;
          created_at?: string;
          id?: string;
          load_id: string;
          message?: string | null;
        };
        Update: {
          bid_price?: number;
          carrier_id?: string;
          created_at?: string;
          id?: string;
          load_id?: string;
          message?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
  };
};

export type UserRole = Database["public"]["Enums"]["user_role"];
export type UserRow = Database["public"]["Tables"]["users"]["Row"];
export type LoadRow = Database["public"]["Tables"]["loads"]["Row"];
export type BidRow = Database["public"]["Tables"]["bids"]["Row"];

export type BidWithCarrier = BidRow & {
  carrierEmail?: string;
};
