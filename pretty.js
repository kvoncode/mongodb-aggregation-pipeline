var pipeline = [
  {
    $match: {
      "imdb.rating": {
        $exists: true
      },
      metacritic: {
        $exists: true
      },
      "imdb.rating": {
        $ne: ""
      },
      metacritic: {
        $ne: null
      }
    }
  },
  {
    $facet: {
      imdbTop10: [
        {
          $sort: {
            "imdb.rating": -1
          }
        },
        { $limit: 10 },
        {
          $project: {
            title: 1,
            "imdb.rating": 1,
            metacritic: 1,
            _id: 0
          }
        }
      ],
      metacriticTop10: [
        {
          $sort: {
            metacritic: -1
          }
        },
        { $limit: 10 },
        {
          $project: {
            _id: 0,
            title: 1,
            "imdb.rating": 1,

            metacritic: 1
          }
        }
      ]
    }
  },
  {
    $project: {
      common: {
        $setIntersection: ["$imdbTop10", "$metacriticTop10"]
      }
    }
  }
];
