class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  search() {
    if (this.queryString.keyword) {
      const keyword = this.queryString.keyword.trim();
      this.query = this.query.find({
        $or: [
          { name: { $regex: keyword, $options: "i" } },
          { description: { $regex: keyword, $options: "i" } },
        ],
      });
    }
    return this;
  }

  filter() {
    const queryObj = { ...this.queryString };
    console.log(this.queryString);
    const excludedFields = ["sort", "page", "limit", "field", "keyword"];

    excludedFields.forEach((el) => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    console.log(queryStr);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    console.log(JSON.parse(queryStr));

    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      console.log(sortBy);
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort(`-createdAt`);
    }
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(` `);
      console.log(fields);
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select("-__v");
    }

    return this;
  }


  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 20;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);

    this.totalCountQuery = this.query.model.countDocuments();  
    this.totalPages = 0;
    return this;
  }
  async getTotalPages() {
    if (this.totalCountQuery) {
      const totalCount = await this.totalCountQuery;
      const limit = this.queryString.limit * 1 || 20;
      this.totalPages = Math.ceil(totalCount / limit);
    }
    return this.totalPages;
  }
}

module.exports = APIFeatures;
