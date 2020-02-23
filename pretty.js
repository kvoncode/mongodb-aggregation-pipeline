var pipeline = [
  {
    $limit: 3
  },
  {
    $group: {
      _id: null,
      ratingDeviation: {
        $stdDevSamp: "$imdb.rating"
      },
      maxRating: {
        $max: "$imdb.rating"
      },
      minRating: {
        $min: "$imdb.rating"
      },
      averageRating: {
        $avg: "$imdb.rating"
      }
    }
  }
];
