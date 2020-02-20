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
      num_favs: {
        $size: "$countries"
      }
    }
  },
  {
    $sort: {
      num_favs: -1,
      "tomatoes.viewer.rating": -1,
      title: -1
    }
  }
];
