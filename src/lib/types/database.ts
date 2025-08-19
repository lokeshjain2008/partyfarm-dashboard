export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      availability: {
        Row: {
          blocked_reason: string | null
          created_at: string | null
          date: string
          id: string
          is_available: boolean
          pricing: number | null
          property_id: string
          updated_at: string | null
        }
        Insert: {
          blocked_reason?: string | null
          created_at?: string | null
          date: string
          id?: string
          is_available?: boolean
          pricing?: number | null
          property_id: string
          updated_at?: string | null
        }
        Update: {
          blocked_reason?: string | null
          created_at?: string | null
          date?: string
          id?: string
          is_available?: boolean
          pricing?: number | null
          property_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "availability_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      bookings: {
        Row: {
          booking_dates: Json
          created_at: string | null
          created_by: string
          customer_details: Json
          id: string
          payment_info: Json
          pricing: Json
          property_id: string
          selected_amenities: Json
          status: Database["public"]["Enums"]["booking_status"]
          updated_at: string | null
        }
        Insert: {
          booking_dates: Json
          created_at?: string | null
          created_by: string
          customer_details: Json
          id?: string
          payment_info?: Json
          pricing: Json
          property_id: string
          selected_amenities?: Json
          status?: Database["public"]["Enums"]["booking_status"]
          updated_at?: string | null
        }
        Update: {
          booking_dates?: Json
          created_at?: string | null
          created_by?: string
          customer_details?: Json
          id?: string
          payment_info?: Json
          pricing?: Json
          property_id?: string
          selected_amenities?: Json
          status?: Database["public"]["Enums"]["booking_status"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          contact_details: Json | null
          created_at: string | null
          id: string
          name: string
          type: Database["public"]["Enums"]["organization_type"]
          updated_at: string | null
        }
        Insert: {
          contact_details?: Json | null
          created_at?: string | null
          id?: string
          name: string
          type: Database["public"]["Enums"]["organization_type"]
          updated_at?: string | null
        }
        Update: {
          contact_details?: Json | null
          created_at?: string | null
          id?: string
          name?: string
          type?: Database["public"]["Enums"]["organization_type"]
          updated_at?: string | null
        }
        Relationships: []
      }
      payment_transactions: {
        Row: {
          amount: number
          booking_id: string
          created_at: string | null
          gateway_response: Json | null
          id: string
          notes: string | null
          payment_date: string | null
          payment_method: Database["public"]["Enums"]["payment_method"]
          payment_type: Database["public"]["Enums"]["payment_type"]
          recorded_by: string
          transaction_reference: string | null
          transaction_status: Database["public"]["Enums"]["transaction_status"]
          updated_at: string | null
        }
        Insert: {
          amount: number
          booking_id: string
          created_at?: string | null
          gateway_response?: Json | null
          id?: string
          notes?: string | null
          payment_date?: string | null
          payment_method: Database["public"]["Enums"]["payment_method"]
          payment_type: Database["public"]["Enums"]["payment_type"]
          recorded_by: string
          transaction_reference?: string | null
          transaction_status?: Database["public"]["Enums"]["transaction_status"]
          updated_at?: string | null
        }
        Update: {
          amount?: number
          booking_id?: string
          created_at?: string | null
          gateway_response?: Json | null
          id?: string
          notes?: string | null
          payment_date?: string | null
          payment_method?: Database["public"]["Enums"]["payment_method"]
          payment_type?: Database["public"]["Enums"]["payment_type"]
          recorded_by?: string
          transaction_reference?: string | null
          transaction_status?: Database["public"]["Enums"]["transaction_status"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payment_transactions_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_transactions_recorded_by_fkey"
            columns: ["recorded_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      properties: {
        Row: {
          amenities: Json
          capacity: number
          category: Database["public"]["Enums"]["property_category"]
          created_at: string | null
          description: string | null
          id: string
          images: string[] | null
          location: Json
          name: string
          owner_id: string
          pricing_config: Json
          status: Database["public"]["Enums"]["property_status"]
          updated_at: string | null
        }
        Insert: {
          amenities?: Json
          capacity: number
          category: Database["public"]["Enums"]["property_category"]
          created_at?: string | null
          description?: string | null
          id?: string
          images?: string[] | null
          location: Json
          name: string
          owner_id: string
          pricing_config: Json
          status?: Database["public"]["Enums"]["property_status"]
          updated_at?: string | null
        }
        Update: {
          amenities?: Json
          capacity?: number
          category?: Database["public"]["Enums"]["property_category"]
          created_at?: string | null
          description?: string | null
          id?: string
          images?: string[] | null
          location?: Json
          name?: string
          owner_id?: string
          pricing_config?: Json
          status?: Database["public"]["Enums"]["property_status"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "properties_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string | null
          email: string
          full_name: string
          id: string
          organization_id: string | null
          property_access: string[] | null
          role: Database["public"]["Enums"]["user_role"] | null
          status: Database["public"]["Enums"]["user_status"]
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          full_name: string
          id?: string
          organization_id?: string | null
          property_access?: string[] | null
          role?: Database["public"]["Enums"]["user_role"] | null
          status?: Database["public"]["Enums"]["user_status"]
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          full_name?: string
          id?: string
          organization_id?: string | null
          property_access?: string[] | null
          role?: Database["public"]["Enums"]["user_role"] | null
          status?: Database["public"]["Enums"]["user_status"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "users_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      amenity_category:
        | "accommodation"
        | "recreation"
        | "catering"
        | "entertainment"
        | "transport"
      amenity_pricing_type: "per_person" | "per_booking" | "per_hour"
      amenity_type: "free" | "paid"
      booking_status: "pending" | "confirmed" | "completed" | "cancelled"
      day_type: "weekday" | "weekend" | "festival"
      duration_type: "daily" | "hourly"
      organization_type: "inhouse" | "farmhouse"
      payment_method:
        | "cash"
        | "upi"
        | "bank_transfer"
        | "card"
        | "cheque"
        | "online_gateway"
        | "other"
      payment_status: "pending" | "partial" | "completed"
      payment_type: "advance" | "partial" | "final" | "refund"
      pricing_type: "tiered" | "flat"
      property_category: "farmhouse" | "banquet_hall"
      property_status: "active" | "inactive" | "maintenance"
      transaction_status: "pending" | "completed" | "failed" | "cancelled"
      user_role:
        | "super_admin"
        | "inhouse_admin"
        | "inhouse_manager"
        | "inhouse_viewer"
        | "farmhouse_owner"
        | "farmhouse_admin"
        | "farmhouse_staff"
      user_status: "pending" | "active" | "inactive"
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      amenity_category: [
        "accommodation",
        "recreation",
        "catering",
        "entertainment",
        "transport",
      ],
      amenity_pricing_type: ["per_person", "per_booking", "per_hour"],
      amenity_type: ["free", "paid"],
      booking_status: ["pending", "confirmed", "completed", "cancelled"],
      day_type: ["weekday", "weekend", "festival"],
      duration_type: ["daily", "hourly"],
      organization_type: ["inhouse", "farmhouse"],
      payment_method: [
        "cash",
        "upi",
        "bank_transfer",
        "card",
        "cheque",
        "online_gateway",
        "other",
      ],
      payment_status: ["pending", "partial", "completed"],
      payment_type: ["advance", "partial", "final", "refund"],
      pricing_type: ["tiered", "flat"],
      property_category: ["farmhouse", "banquet_hall"],
      property_status: ["active", "inactive", "maintenance"],
      transaction_status: ["pending", "completed", "failed", "cancelled"],
      user_role: [
        "super_admin",
        "inhouse_admin",
        "inhouse_manager",
        "inhouse_viewer",
        "farmhouse_owner",
        "farmhouse_admin",
        "farmhouse_staff",
      ],
      user_status: ["pending", "active", "inactive"],
    },
  },
} as const
