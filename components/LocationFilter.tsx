"use client";

import { useEffect, useState } from "react";
import Container from "./Container";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import useLocation from "@/hooks/useLocation";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import queryString from "query-string";
import { ICity, IState } from "country-state-city";
import { Button } from "./ui/button";
import { usePathname } from "next/navigation";


const LocationFilter = () => {
  
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [states, setStates] = useState<IState[]>([]);
  const [cities, setCities] = useState<ICity[]>([]);

  const { getAllCountries, getCountryStates, getStateCities } = useLocation();
  const countries = getAllCountries();
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  useEffect(() => {
    const countryStates = getCountryStates(country);
    if (countryStates) {
      setStates(countryStates);
      setState("");
      setCity("");
    }
  }, [country]);

  useEffect(() => {
    const stateCities = getStateCities(country, state);
    if (stateCities) {
      setCities(stateCities);
      setCity("");
    }
  }, [country, state]);

  useEffect(() => {
    if (country === "" && state === "" && city === "") return router.push("/");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let currentQuery: any = {};

    if (searchParams) {
      currentQuery = queryString.parse(searchParams.toString());
    }

    if (country) {
      currentQuery = {
        ...currentQuery,
        country,
      };
    }

    if (state) {
      currentQuery = {
        ...currentQuery,
        state,
      };
    }

    if (city) {
      currentQuery = {
        ...currentQuery,
        city,
      };
    }

    if (state === "" && currentQuery.state) delete currentQuery.state;
    if (city === "" && currentQuery.city) delete currentQuery.city;

    const url = queryString.stringifyUrl(
      {
        url: "/",
        query: currentQuery,
      },
      {
        skipNull: true,
        skipEmptyString: true,
      }
    );

    router.push(url);
  }, [country, state, city]);

  const handleClearFilters = () => {
    router.push("/");
    setCountry("");
    setState("");
    setCity("");
  };

  if (pathname !== "/") return null;  

  const pathname = usePathname();
  if (pathname !== "/") return null; 
  
  return (
    <Container>
      <div className="flex gap-2 md:gap-4 items-center justify-center text-sm">
        <div>
          <Select onValueChange={(value) => setCountry(value)} value={country}>
            <SelectTrigger className="bg-background">
              <SelectValue placeholder="Country" />
            </SelectTrigger>
            <SelectContent>
              {countries.map((country) => {
                return (
                  <SelectItem key={country.isoCode} value={country.isoCode}>
                    {country.name}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Select onValueChange={(value) => setState(value)} value={state}>
            <SelectTrigger className="bg-background">
              <SelectValue placeholder="State" />
            </SelectTrigger>
            <SelectContent>
              {states.length > 0 &&
                states.map((state) => {
                  return (
                    <SelectItem key={state.isoCode} value={state.isoCode}>
                      {state.name}
                    </SelectItem>
                  );
                })}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Select onValueChange={(value) => setCity(value)} value={city}>
            <SelectTrigger className="bg-background">
              <SelectValue placeholder="City" />
            </SelectTrigger>
            <SelectContent>
              {cities.length > 0 &&
                cities.map((city) => {
                  return (
                    <SelectItem
                      disabled={cities.length < 1}
                      key={city.name}
                      value={city.name}
                    >
                      {city.name}
                    </SelectItem>
                  );
                })}
            </SelectContent>
          </Select>
        </div>
        <Button variant={"outline"} onClick={() => handleClearFilters()}>
          Clear Filters
        </Button>
      </div>
    </Container>
  );
};

export default LocationFilter;
