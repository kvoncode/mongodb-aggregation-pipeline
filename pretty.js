var pipeline = [
  {
    $match: {
      languages: {
        $exists: true
      },
      released: {
        $exists: true
      },
      "imdb.rating": {
        $exists: true
      },
      "imdb.votes": {
        $exists: true
      }
    }
  },

  {
    $count: "existing number"
  }
];
