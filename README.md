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

- Match for movies released in the `USA`, with `tomatoes.viewer.rating >= 3`
- Create new field `favArray`. It's an array that contains matched names of favorite actors.

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
