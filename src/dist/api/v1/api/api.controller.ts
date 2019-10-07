import { startDate } from "../../../server";

export default [{
    method: 'GET',
    path: '/api/v1',
    handler: (req, h) => {
        return ({
            developed_by: 'Jakub Gencer',
            version: '1.0.0',
            created_on: '26.09.2019, 10:50 CET',
            online_since: startDate,
        });
    }
}]