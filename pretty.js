var pipeline = [
  {
    $match: {
      countries: {
        $in: ["USA"]
      },
      "tomatoes.viewer.rating": {
        $gte: 3
      }
    }
  },
  {
    $addFields: {
      favArray: [
        "Sandra Bullock",
        "Tom Hanks",
        "Julia Roberts",
        "Kevin Spacey",
        "George Clooney"
      ]
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
  }
];
