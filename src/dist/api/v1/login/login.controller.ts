import * as argon2 from 'argon2';
import { User } from '../../../server';
import * as jwt from 'jsonwebtoken';

export default [
    {
        method: 'GET',
        path: '/api/v1/user/login',
        handler: () => {
            return ({
                status: 200,
                description: 'Login route'
            });
        }
    },
    {
        config: {
            cors: {
                origin: ['*'],
                additionalHeaders: ['cache-control', 'x-requested-with']
            },
        },
        method: 'POST',
        path: '/api/v1/user/login',
        handler: async (req, h) => {


            const email = req.payload.email;
            const plainPassword = req.payload.password;
            console.log(email, plainPassword);

            const user: any = await User.findOne({
                where: {
                    email: email,
                }
            })

            if (user) {


                if (await argon2.verify(user.password, plainPassword, { hashLength: 150 })) {
                    console.log('#PASSWORD VERIFY', true);

                    const JWTToken = jwt.sign({
                        _id: user.user_id
                    }, process.env.JWT_SECRET,
                        {
                            expiresIn: '30min'
                        });


                    if (req.headers.authorization) {

                        console.log('##AUTH', await jwt.verify(req.headers.authorization, process.env.JWT_SECRET));


                    } else {
                        return h.response({
                            status: 200,
                            token: JWTToken,
                            email: email
                        });
                    }

                    return ({
                        status: 200,
                    })


                } else {
                    console.log('#PASSWORD VERIFY', false);
                    return ({
                        status: 403,
                        description: 'Wrong Password!'
                    })
                }
            } else {
                console.log('#PASSWORD VERIFY', false);
                return ({
                    status: 404,
                    description: 'No user with this email: ' + email,
                })
            }
        }
    }
]