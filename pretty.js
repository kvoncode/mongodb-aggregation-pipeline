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
      scaled_votes: {
        $add: [
          1,
          {
            $multiply: [
              9,
              {
                $divide: [
                  { $subtract: ["$imdb.votes", 5] },
                  { $subtract: [1521105, 5] }
                ]
              }
            ]
          }
        ]
      }
    }
  },
  {
    $addFields: {
      normalized_rating: {
        $avg: ["$scaled_votes", "$imdb.rating"]
      }
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
      scaled_votes: 1,
      "imdb.rating": 1,
      normalized_rating: 1
    }
  }
];
