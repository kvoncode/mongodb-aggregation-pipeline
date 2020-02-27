var pipeline = [
  {
    $lookup: {
      from: "air_routes",
      localField: "airlines",
      foreignField: "airline.name",
      as: "allianceRoutes"
    }
  },
  {
    $addFields: {
      filteredArray: {
        $filter: {
          input: "$allianceRoutes",
          as: "route",
          cond: { 
            $in: ["$$route.airplane", ["747", "380"]]
          }
        }
      }
    }
  },
  {
    $addFields: {
      matchedRoutes: {
        $size: "$filteredArray"
      }
    }
  },

  {
    $project: {
      _id: 0,
      name: 1,
      matchedRoutes: 1
    }
  }
];
