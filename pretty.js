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
  }
];
