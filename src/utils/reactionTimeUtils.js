// reactionTimeUtils.js
export const calculateAverageReactionTime = (times) => {
    if (times.length === 0) {
      return 0;
    }
  
    const totalReactionTime = times.reduce((sum, entry) => sum + entry.time, 0);
    const averageTime = totalReactionTime / times.length;
  
    return averageTime;
  };
  