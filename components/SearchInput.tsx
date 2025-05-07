"use client"

import { Search } from "lucide-react";
import { Input } from "./ui/input";

const SearchInput = () => {
    return (
      <div className="relative sm:block hidden">
        <Search className="absolute h-4 w-4 top-1/2 left-2 transform -translate-y-1/2 cursor-pointer" />
        <Input placeholder="Search" className="w-100 pl-10 bg-primary/10" />
      </div>
    );
}
 
export default SearchInput;