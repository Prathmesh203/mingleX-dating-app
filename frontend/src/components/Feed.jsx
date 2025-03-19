import React, { useState, useEffect } from "react";
import fetchUserFeed from "../services/feedServices";
import SwipeCards from "./SwipeCards";
import sendRequest from "../services/connectionServices";
function Feed() {
  const [feed, setFeed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchData = async (pageNum = 1) => {
    setLoading(true);
    try {
      const response = await fetchUserFeed(pageNum);
      
      if (pageNum === 1) {
        // First page, replace current feed
        setFeed(response.data);
      } else {
        // Subsequent pages, append to feed
        setFeed((prev) => [...prev, ...response.data]);
      }

      // Check if we have more pages
      setHasMore(response.data.length > 0);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSwipeLeft = async (cardData) => {
    console.log("Swiped Left on:", cardData);

    try {
      const response = await sendRequest("ignored", cardData._id);
      console.log(response);
            
    } catch (error) {
      console.log(error);
    }
  };

  const handleSwipeRight = async (cardData) => {
    try {
    const response = await sendRequest("interested", cardData._id);
    console.log(response);
    
    
    } catch (error) {
      console.log(error);
    }
  };

  const handleLoadMore = () => {
    if (hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchData(nextPage);
    } else {
      // Reset to first page if no more results
      setPage(1);
      fetchData(1);
    }
  };

  return (
    <div className="w-full h-screen flex items-center justify-center">
      {loading && feed.length === 0 ? (
     <div className="flex w-52 flex-col gap-4">
     <div className="skeleton h-32 w-full"></div>
     <div className="skeleton h-4 w-28"></div>
     <div className="skeleton h-4 w-full"></div>
     <div className="skeleton h-4 w-full"></div>
   </div>
      ) : (
        <SwipeCards
          feed={feed}
          onSwipeLeft={handleSwipeLeft}
          onSwipeRight={handleSwipeRight}
          onLoadMore={handleLoadMore}
        />
      )}
    </div>
  );
}

export default Feed;
