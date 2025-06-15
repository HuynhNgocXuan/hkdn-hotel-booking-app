"use client";

import { Loader2, Search } from "lucide-react";
import { Input } from "./ui/input";
import { ChangeEventHandler, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import queryString from "query-string";
import { useDebounceValue } from "@/hooks/useDebounceValue";

const SearchInput = () => {
  const searchParams = useSearchParams();
  const title = searchParams.get("title");
  const [isLoading, setIsLoading] = useState(false);
  const [value, setValue] = useState(title || "");
  const router = useRouter();
  const debounceValue = useDebounceValue(value, 300);

  useEffect(() => {
    if (debounceValue === title) return;

    setIsLoading(true);

    const query = { title: debounceValue };

    const url = queryString.stringifyUrl(
      {
        url: window.location.pathname, 
        query,
      },
      {
        skipNull: true,
        skipEmptyString: true,
      }
    );

    router.push(url);

    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 500); 

    return () => clearTimeout(timeout);
  }, [debounceValue, router]);

  const onChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setValue(e.target.value);
  };

  return (
    <div className="relative sm:block hidden">
      {isLoading ? (
        <Loader2 className="absolute h-4 w-4 top-1/2 left-2 transform -translate-y-1/2 animate-spin text-muted-foreground" />
      ) : (
        <Search className="absolute h-4 w-4 top-1/2 left-2 transform -translate-y-1/2 text-muted-foreground" />
      )}
      <Input
        value={value}
        onChange={onChange}
        placeholder="Search"
        className="w-100 pl-10 bg-primary/10"
      />
    </div>
  );
};

export default SearchInput;
