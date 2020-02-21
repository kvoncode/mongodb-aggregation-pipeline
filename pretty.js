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
    $addFields: {
      normalized_rating: 10
    }
  },
  {
    $sort: {
      normalized_rating: 1
    }
  },
  {
    // $count: "existing number"
    $limit: 3
  },

  {
    $project: {
      _id: 0,
      title: 1,
      "imdb.votes": 1,
      normalized_rating: 1
    }
  }
];
