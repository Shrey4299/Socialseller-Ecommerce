module.exports = {
  getPagination: async (pagination = {}) => {
    const { page = 0, pageSize = 25 } = pagination;
    const offset = page * pageSize;
    const limit = pageSize;
    return { offset, limit, pageSize, page };
  },

  getMeta: async (pagination, count) => {
    try {
      const { page, pageSize } = pagination;
      return {
        pagination: {
          page: parseInt(page) + 1,
          pageSize: parseInt(pageSize || count),
          pageCount: Math.ceil(count / (pageSize || count)),
          total: count,
        },
      };
    } catch (error) {
      console.log(error);
    }
  },
};
