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

## `$group` and accumulators

- Match movies that won an Oscar with `$match`
- Group with `$group` by null and calculate parameters

```
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

```

## `$unwind`

- Match `languages` as English (`languages` is `string/array/undefined`)
- Unwind `cast` field (`cast` is `string/array/undefined`)
- Group by same person statistics


```
var pipeline = [
  {
    $match: {
      languages: {
        $exists: true
      },
      cast: {
        $exists: true
      }
    }
  },
  {
    $match: {
      languages: {
        $in: ["English"]
      }
    }
  },
  {
    $unwind: "$cast"
  },
  {
    $limit: 3
  },
  {
    $project: {
      _id: 0,
      title: 1,
      cast: 1
    }
  }

  // {
  //   $count: "movies in English"
  // }
];

```


## `$lookup`

- Use `$lookup` to perform **Left outer join** on `air_alliances` and `air_routes` collections
- `air_alliances` have `airlines` field, which is **array of strings**
- `air_routes` have `airline.name` field. Type of **string**
- When using `$lookup` on array of strings mongodb uses equality match on any of the array elements
- In `allianceRoutes` field sort only those documents whose `aiplane`field is either `747` or `380`
- Calculate the array length and sort by it

```
var pipeline = [
  {
    $lookup: {
      from: "air_routes",
      localField: "airlines",
      foreignField: "airline.name",
      as: "allianceRoutes"
    }
  },
  {
    $addFields: {
      filteredArray: {
        $filter: {
          input: "$allianceRoutes",
          as: "route",
          cond: { 
            $in: ["$$route.airplane", ["747", "380"]]
          }
        }
      }
    }
  },
  {
    $addFields: {
      matchedRoutes: {
        $size: "$filteredArray"
      }
    }
  },

  {
    $project: {
      _id: 0,
      name: 1,
      matchedRoutes: 1
    }
  }
];


```

## `$graphLookup`
```
db.air_alliances.aggregate([{
  $match: { name: "OneWorld" }
}, {
  $graphLookup: {
    startWith: "$airlines",
    from: "air_airlines",
    connectFromField: "name",
    connectToField: "name",
    as: "airlines",
    maxDepth: 0,
    restrictSearchWithMatch: {
      country: { $in: ["Germany", "Spain", "Canada"] }
    }
  }
}, {
  $graphLookup: {
    startWith: "$airlines.base",
    from: "air_routes",
    connectFromField: "dst_airport",
    connectToField: "src_airport",
    as: "connections",
    maxDepth: 1
  }
}, {
  $project: {
    validAirlines: "$airlines.name",
    "connections.dst_airport": 1,
    "connections.airline.name": 1
  }
},
{ $unwind: "$connections" },
{
  $project: {
    isValid: { $in: ["$connections.airline.name", "$validAirlines"] },
    "connections.dst_airport": 1
  }
},
{ $match: { isValid: true } },
{ $group: { _id: "$connections.dst_airport" } }
])
```

## Multidimensional grouping

```
```