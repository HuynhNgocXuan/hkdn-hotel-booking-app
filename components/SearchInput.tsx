"use client";

import { Loader2, Search } from "lucide-react";
import { Input } from "./ui/input";
import {
  ChangeEventHandler,
  useEffect,
  useState,
  KeyboardEventHandler,
} from "react";
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

  const isHomePage =
    typeof window !== "undefined" && window.location.pathname === "/";

  const pushToSearch = (searchText: string) => {
    setIsLoading(true);

    const query = { title: searchText };

    const url = queryString.stringifyUrl(
      {
        url: "/",
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
  };

  useEffect(() => {
    // Chỉ chạy debounce nếu đang ở trang "/"
    if (!isHomePage) return;
    if (debounceValue === title) return;

    pushToSearch(debounceValue); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounceValue]);

  const onChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setValue(e.target.value);
  };

  const onKeyDown: KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      pushToSearch(value); // Bỏ qua debounce, tìm kiếm ngay
    }
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
        onKeyDown={onKeyDown}
        placeholder="Search"
        className="w-100 pl-10 bg-primary/10"
      />
    </div>
  );
};

export default SearchInput;
