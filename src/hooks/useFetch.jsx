import { useEffect } from "react";
import { useState } from "react";
import { supabase } from "../utils/supabase";
import { useSearchParams } from "react-router";

export const useFetch = (forceUpdate) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  useEffect(() => {
    const instructors = searchParams.getAll("instructor");
    const search = searchParams.get("search");
    const categories = searchParams.getAll("categories");
    const rating = searchParams.get("rating");
    const price = searchParams.getAll("price");
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        let query = supabase.from("courses").select("*").eq("published", true);
        if (instructors.length > 0) {
          query = query.in("instructor_name", instructors);
        }
        if (categories.length > 0) {
          query = query.in("category_name", categories);
        }
        if (price.length > 0) {
          query = query.gte("price", price[0] || 0);
          query = query.lte("price", price[1] || 100);
        }
        if (rating) {
          query = query.in("rating", rating);
        }
        if (search) {
          query = query.ilike("title", `%${search}%`);
        }
        const { data, error } = await query;
        if (error) setError(error);
        setData(data || []);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching courses:", err);
      }

      setLoading(false);
    };
    fetchData();
  }, [forceUpdate, searchParams]);
  return { data, loading, error };
};
