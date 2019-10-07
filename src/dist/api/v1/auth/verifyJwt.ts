import * as jwt from 'jsonwebtoken';

export const verifyToken = async (token: string) => {
    try {
        await jwt.verify(token, '8A943BEC2E258F61F1BE444B4D45D', (err, dec) => {
            if (err) {
                return false;
            } else {
                return true;
            }
        });
    } catch (error) {
        console.log(error);
    }

}