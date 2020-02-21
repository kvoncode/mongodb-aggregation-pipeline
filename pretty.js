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
    $match: {
      languages: {
        $in: ["English"]
      },
      "imdb.rating": {
        $gte: 1
      },
      "imdb.votes": {
        $gte: 1
      },
      released: {
        $gte: new Date("1990-1-1")
      }
    }
  },

  {
    $count: "existing number"
  }
];
