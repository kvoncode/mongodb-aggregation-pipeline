# Aggregation pipeline

Apply pipeline with

```
db.movies.aggregate(pipeline).itcount()
```

## `$match` and `$project`

```
var pipeline = [
  {
    $match: {
      "imdb.rating": {
        $gte: 7
      },
      genres: {
        $nin: ["Crime", "Horror"]
      },
      rated: {
        $in: ["PG", "G"]
      },
      languages: {
        $all: ["English", "Japanese"]
      }
    }
  },
  {
    $project: {
      _id: 0,
      title: 1,
      rated: 1
    }
  }
];

```

## Filter one word titles

```
var pipeline = [
  {
    $project: {
      _id: 0,
      wordCount: { $size: { $split: ["$title", " "] } }
    }
  },
  {
    $match: {
      wordCount: 1
    }
  }
];

```

## Cursor-like stages

- Match for movies released in the `USA`, with `tomatoes.viewer.rating >= 3`, and existing `cast` field (or query trigger error)
- Create new field `favArray`. It's filtered `cast` array. Filtered based on `favorites` array of names of favorite actors
- Add field `num_favs` which is the size of array `favArray`
- Sort for `num_favs, tomatoes.viewer.rating, and title` in descending order

```var pipeline = [
  {
    $match: {
      countries: {
        $in: ["USA"]
      },
      "tomatoes.viewer.rating": {
        $gte: 3
      },
      cast: {
        $exists: true
      }
    }
  },

  {
    $addFields: {
      favArray: {
        $filter: {
          input: "$cast",
          as: "cast",
          cond: {
            $in: ["$$cast", favorites]
          }
        }
      }
    }
  },

  {
    $addFields: {
      num_favs: {
        $size: "$favArray"
      }
    }
  },
  {
    $sort: {
      num_favs: -1,
      "tomatoes.viewer.rating": -1,
      title: -1
    }
  },
  {
    $project: {
      _id: 0,
      num_favs: 1,
      title: 1,
      favArray: 1,
      cast: 1
    }
  },
  {
      $skip: 24
  }
];

```

## Feature scaling

```
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


```
