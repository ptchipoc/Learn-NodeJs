class ApiFeatures
{
    constructor(query, queryStr){
        this.query = query;
        this.queryStr = queryStr;
    }

    filter(){
        const queryObj = {};
        for (let key in this.queryStr)
        {
            if (key.includes('[') && key.includes(']'))
            {
                const queryParsed = key.match(/(.+)\[(\w+)\]$/);
                if (queryParsed)
                {
                    const field = queryParsed[1];
                    const value = this.queryStr[key];
                    const operator = queryParsed[2];
                    const mongodbOperator = `$${operator}`;
                    if (!queryObj[field])
                    {
                        queryObj[field] = {};
                        queryObj[field][mongodbOperator] = isNaN(value) ? value : Number(value);
                    }
                    continue ;
                }
                queryObj[key] = isNaN(this.queryStr[key]) ? this.queryStr[key] : Number(this.queryStr[key])
            }
        }
        this.query = this.query.find(queryObj);
        return this;
    }

    sort(){
        if (this.queryStr.sort)
        {
            const sortBy = this.queryStr.sort.split(',').join(' ');
            this.query = this.query.sort(sortBy);
        }
        else
        {
            this.query = this.query.sort('-createdAt');
        }
        return this
    }

    limitFields() {
        if (this.queryStr.fields)
        {
            const fields = this.queryStr.fields.split(',').join(' ');
            this.query = this.query.select(fields);
        }
        else
        {
            this.query = this.query.select('-__v')
        }
        return this
    }

    paginate() {
        const page = this.queryStr.page || 1;
        const limit = this.queryStr.limit || 10;
        const skip = (page - 1) * limit;

        this.query = this.query.skip(skip).limit(limit);
        // if (req.query.page)
        // {
        //     const moviesCount = await Movie.countDocuments();
        //     if (skip >= moviesCount)
        //         throw new Error('This page is not found');
        // }
        return this
    }
}

module.exports = ApiFeatures