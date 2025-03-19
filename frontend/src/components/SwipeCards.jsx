import React, { useState } from 'react';
import Card from './Card';
import { motion, useAnimation } from 'framer-motion';

const SwipeCards = ({ feed, onSwipeLeft, onSwipeRight, onLoadMore }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const controls = useAnimation();
  
  // Track starting position of drag
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  const handleDragStart = (event, info) => {
    setDragStart({ x: info.point.x, y: info.point.y });
  };
  
  const handleDragEnd = async (event, info) => {
    const xDistance = info.point.x - dragStart.x;
    const swipeThreshold = 100;
    
    if (xDistance > swipeThreshold) {
      // Right swipe
      await controls.start({
        x: window.innerWidth,
        transition: { duration: 0.3 }
      });
      
      // Run right swipe function and pass current card data
      onSwipeRight(feed[currentIndex]);
      
      // Move to next card
      goToNextCard();
      
    } else if (xDistance < -swipeThreshold) {
      // Left swipe
      await controls.start({
        x: -window.innerWidth,
        transition: { duration: 0.3 }
      });
      
      // Run left swipe function and pass current card data
      onSwipeLeft(feed[currentIndex]);
      
      // Move to next card
      goToNextCard();
      
    } else {
      // Not swiped far enough, return to center
      controls.start({
        x: 0,
        transition: { type: 'spring', stiffness: 500, damping: 30 }
      });
    }
  };
  
  const goToNextCard = () => {
    // If there are more cards, go to next card
    if (currentIndex < feed.length - 1) {
      setCurrentIndex(currentIndex + 1);
      controls.set({ x: 0 }); // Reset position
    } else {
     
      setCurrentIndex(currentIndex + 1);
    }
  };
  
  if (feed.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  return (
    <div className="relative w-full h-full">
      {currentIndex < feed.length ? (
        <motion.div
          className="absolute w-full h-full flex items-center justify-center"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          animate={controls}
        >
          <Card data={feed[currentIndex]} />
        </motion.div>
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <button 
            onClick={onLoadMore}
            className="btn btn-primary"
          >
            Show More
          </button>
        </div>
      )}
    </div>
  );
};

export default SwipeCards;