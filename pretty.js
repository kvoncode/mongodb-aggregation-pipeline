var pipeline = [
  {
    $match: {
      awards: {
        $regex: "^Won [0-9]+ Oscar(s)?"
      }
    }
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
  // {
  //   $count: "won Oscar"
  // }
  // {
  //   $limit: 3
  // },
  // {
  //   $project: {
  //     _id: 0,
  //     title: 1,
  //     awards: 1
  //   }
  // }
];
