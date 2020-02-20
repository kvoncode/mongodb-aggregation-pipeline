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
      favArray: {
        $cond: { if: false, then: "Sandra Bullock", else: null }
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
