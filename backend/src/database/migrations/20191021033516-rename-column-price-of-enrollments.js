module.exports = {
  up: queryInterface => {
    return queryInterface.renameColumn('enrollments', 'price', 'total_price');
  },

  down: queryInterface => {
    return queryInterface.dropTable('enrollments');
  },
};
