import { useEffect, useMemo, useState } from "react";

export const fetchPages = () => {
  const [data, setData] = useState(null);

  const characters = useMemo(() => {
    return data?.pages.reduce((prev, page) => {
      return {
        info: page.info,
        results: [...prev.results, ...page.results],
      };
    });
  }, [data]);

  useEffect(() => {
    if (!data) {
      fetchImages();
    }
  }, [data]);

  return {
    data,
  };
};
