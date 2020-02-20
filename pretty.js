var pipeline = [
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
