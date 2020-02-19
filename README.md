# Aggregation pipeline

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
