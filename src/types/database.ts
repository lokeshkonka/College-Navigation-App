export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          avatar_url: string | null;
          role: 'student' | 'staff' | 'admin' | 'super_admin';
          accessibility_prefs: Json;
          created_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          avatar_url?: string | null;
          role?: 'student' | 'staff' | 'admin' | 'super_admin';
          accessibility_prefs?: Json;
          created_at?: string;
        };
        Update: {
          full_name?: string | null;
          avatar_url?: string | null;
          role?: 'student' | 'staff' | 'admin' | 'super_admin';
          accessibility_prefs?: Json;
        };
      };
      buildings: {
        Row: {
          id: string;
          name: string;
          code: string;
          description: string | null;
          latitude: number;
          longitude: number;
          tags: string[];
          is_active: boolean;
          hours_json: Json | null;
        };
        Insert: {
          id?: string;
          name: string;
          code: string;
          description?: string | null;
          latitude: number;
          longitude: number;
          tags?: string[];
          is_active?: boolean;
          hours_json?: Json | null;
        };
        Update: Partial<Database['public']['Tables']['buildings']['Insert']>;
      };
      recent_destinations: {
        Row: {
          id: number;
          user_id: string;
          building_id: string;
          visited_at: string;
        };
        Insert: {
          id?: number;
          user_id: string;
          building_id: string;
          visited_at?: string;
        };
        Update: {
          visited_at?: string;
        };
      };
      feedback: {
        Row: {
          id: string;
          user_id: string;
          category: 'general' | 'report_error' | 'suggestion';
          sentiment: number;
          message: string;
          route_id: string | null;
          building_id: string | null;
          status: 'open' | 'triaged' | 'resolved' | 'rejected';
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          category: 'general' | 'report_error' | 'suggestion';
          sentiment: number;
          message: string;
          route_id?: string | null;
          building_id?: string | null;
          status?: 'open' | 'triaged' | 'resolved' | 'rejected';
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['feedback']['Insert']>;
      };
      routes: {
        Row: {
          id: string;
          origin_building_id: string;
          destination_building_id: string;
          distance_m: number;
          duration_min: number;
          path_geojson: Json | null;
          is_accessible: boolean;
        };
        Insert: {
          id?: string;
          origin_building_id: string;
          destination_building_id: string;
          distance_m: number;
          duration_min: number;
          path_geojson?: Json | null;
          is_accessible?: boolean;
        };
        Update: Partial<Database['public']['Tables']['routes']['Insert']>;
      };
      occupancy_live: {
        Row: {
          building_id: string;
          occupancy_percent: number;
          updated_at: string;
        };
        Insert: {
          building_id: string;
          occupancy_percent: number;
          updated_at?: string;
        };
        Update: {
          occupancy_percent?: number;
          updated_at?: string;
        };
      };
      occupancy_history: {
        Row: {
          id: number;
          building_id: string;
          occupancy_percent: number;
          captured_at: string;
        };
        Insert: {
          id?: number;
          building_id: string;
          occupancy_percent: number;
          captured_at?: string;
        };
        Update: {
          occupancy_percent?: number;
          captured_at?: string;
        };
      };
      feedback_actions: {
        Row: {
          id: number;
          feedback_id: string;
          admin_id: string;
          action: string;
          note: string | null;
          created_at: string;
        };
        Insert: {
          id?: number;
          feedback_id: string;
          admin_id: string;
          action: string;
          note?: string | null;
          created_at?: string;
        };
        Update: {
          action?: string;
          note?: string | null;
        };
      };
    };
    Views: {
      v_building_details: {
        Row: {
          id: string;
          name: string;
          code: string;
          description: string | null;
          latitude: number;
          longitude: number;
          tags: string[];
          is_active: boolean;
          hours_json: Json | null;
          occupancy_percent: number;
        };
      };
      v_recent_destinations: {
        Row: {
          id: number;
          user_id: string;
          building_id: string;
          building_name: string;
          visited_at: string;
        };
      };
    };
  };
};
