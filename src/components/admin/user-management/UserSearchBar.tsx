
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface UserSearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function UserSearchBar({ searchQuery, onSearchChange }: UserSearchBarProps) {
  return (
    <div className="relative flex-1 max-w-md">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
      <Input
        placeholder="Search users by name or email..."
        className="pl-10"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </div>
  );
}
