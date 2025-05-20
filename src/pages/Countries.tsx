import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/supabase";
import { Card } from "@/components/ui/card";

interface Country {
  id: number;
  name: string;
  code?: string;
  flag?: string;
}

const fetchCountries = async () => {
  const { data, error } = await supabase.from("countries").select("*");
  if (error) throw error;
  return data as Country[];
};

const Countries = () => {
  const { data, error, isLoading } = useQuery({
    queryKey: ["countries"],
    queryFn: fetchCountries,
  });

  if (isLoading)
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary" />
      </div>
    );
  if (error)
    return <div className="text-red-500 p-4">Error loading countries.</div>;

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Countries</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {data && data.length > 0 ? (
          data.map((country) => (
            <Card
              key={country.id}
              className="flex flex-col items-center p-6 bg-card dark:bg-card rounded-xl shadow-sm"
            >
              <span className="text-xl font-semibold mb-2">{country.name}</span>
              {country.flag && (
                <img
                  src={country.flag}
                  alt={country.name}
                  className="w-12 h-8 object-contain mb-2 rounded"
                />
              )}
              {country.code && (
                <span className="text-sm text-muted-foreground">
                  Code: {country.code}
                </span>
              )}
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center text-muted-foreground">
            No countries found.
          </div>
        )}
      </div>
    </div>
  );
};

export default Countries;
