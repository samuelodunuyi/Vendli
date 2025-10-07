
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { User, Store, ProfileData, UserRoleData } from "./types";

export function useUserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { hasRole } = useAuth();

  useEffect(() => {
    if (hasRole('super_admin')) {
      fetchUsers();
      fetchStores();
    }
  }, [hasRole]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      console.log('Fetching users...');
      
      // Get all profiles with email now stored in the profiles table
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        throw profilesError;
      }

      console.log('Profiles fetched:', profiles);

      // Get user roles with store information
      const { data: userRolesData, error: rolesError } = await supabase
        .from('user_roles')
        .select(`
          user_id,
          role,
          store_id,
          stores(name)
        `);

      if (rolesError) {
        console.error('Error fetching user roles:', rolesError);
        throw rolesError;
      }

      console.log('User roles fetched:', userRolesData);

      // Safely type and process the data
      const safeProfiles: ProfileData[] = profiles || [];
      const safeUserRoles: UserRoleData[] = userRolesData || [];

      // Combine all data
      const combinedUsers: User[] = safeProfiles.map(profile => {
        const userRoleData = safeUserRoles.filter(role => role.user_id === profile.id);
        
        const roles = userRoleData.map(roleData => ({
          role: roleData.role,
          store_id: roleData.store_id,
          store_name: roleData.stores?.name || null
        }));

        return {
          id: profile.id,
          email: profile.email || 'No email',
          first_name: profile.first_name,
          last_name: profile.last_name,
          phone: profile.phone,
          avatar_url: profile.avatar_url,
          created_at: profile.created_at || '',
          status: 'active', // All users in profiles are considered active
          roles: roles
        };
      });

      console.log('Combined users:', combinedUsers);
      setUsers(combinedUsers);
    } catch (error: any) {
      console.error('Error in fetchUsers:', error);
      toast({
        title: "Error",
        description: "Failed to fetch users",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchStores = async () => {
    try {
      const { data, error } = await supabase
        .from('stores')
        .select('id, name')
        .eq('status', 'active')
        .order('name');

      if (error) throw error;
      setStores(data || []);
    } catch (error) {
      console.error('Error fetching stores:', error);
    }
  };

  return {
    users,
    stores,
    loading,
    fetchUsers,
    fetchStores,
    hasRole
  };
}
