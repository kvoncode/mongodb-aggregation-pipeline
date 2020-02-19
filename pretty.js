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
