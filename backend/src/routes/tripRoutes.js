import {
  find_all_trips,
  create_trip,
  find_trip,
  update_trip,
  delete_trip
} from '../controllers/tripController.js';

export const tripRoutes = (app) => {
  /**
   * @section trips
   * @type get post
   * @url /v1/trips
   * @param {string}
   */
  app.route('/v1/trips').get(find_all_trips).post(create_trip);

  /**
   * @section trips
   * @type get put
   * @url /v1/trips/:tripId
   */
  app.route('/v1/trips/:tripId').get(find_trip).put(update_trip).delete(delete_trip);

  /**
   * @section trips
   * @type get
   * @url /v1/trips/:managerId
   */
  app.route('/v1/myTrips').get(find_my_trips);
};
