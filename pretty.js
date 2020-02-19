var pipeline = [
  {
    $match: {
      coutry: {
        $in: ["USA"]
      },
      "tomatoes.viewer.rating": {
        $gte: 3
      }
    }
  },
  {
    $addFields: {
      favArray: 
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
    $skip: 24
  }
];
