const httpStatus = require('http-status');
const {TicketChecker} = require('../../models');
const ApiError = require('../../utils/ApiError');

const createTicketChecker = data => TicketChecker.create(data);

const getTicketCheckers = (filters, options) => TicketChecker.paginate(filters, options);

const getTicketCheckerById = async id => {
  return TicketChecker.findById(id).then(doc => {
    if (!doc) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Ticket Checker not found');
    }
    return doc;
  });
};

module.exports = {getTicketCheckers, getTicketCheckerById, createTicketChecker};
