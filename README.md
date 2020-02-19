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
- Create `favArray` as map of `cast` array. Return null if array element not in `favorites` array, else return element itself
- Pull null values from `favArray` 
- Add field `num_favs` which is the size of array `favArray`
- Sort for `num_favs, tomatoes.viewer.rating, and title` in descending order 


```

```
