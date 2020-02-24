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
