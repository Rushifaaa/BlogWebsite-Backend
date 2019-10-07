import * as argon2 from 'argon2';
import { User } from '../../../server';
import { toDataURL } from 'qrcode';
import * as speakeasy from 'speakeasy';
import * as jwt from 'jsonwebtoken';

export default [
    {
        config: {
            cors: {
                origin: ['*'],
                additionalHeaders: ['cache-control', 'x-requested-with']
            },
        },
        method: 'GET',
        path: '/api/v1/user/auth',
        handler: () => {
            return ({
                status: 200,
                description: 'Auth route'
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
        path: '/api/v1/user/auth',
        handler: async (req, h) => {
            const password = req.payload.password;
            const email = req.payload.email;


            try {
                const user: any = await User.findOne({ where: { email } });

                if (user) {
                    if (await argon2.verify(user.password, password, { hashLength: 150 })) {

                        try {
                            const qrURL = await toDataURL(user.qrCodeUrl);

                            return ({
                                status: 200,
                                qr_url: qrURL,
                            });

                        } catch (error) {
                            console.log(error);
                        }

                    } else {
                        return ({
                            status: 401,
                            description: 'Wrong password',
                        })
                    }
                } else {
                    return ({
                        status: 401,
                        description: 'Wrong email',
                    })
                }
            } catch (error) {
                console.log(error);

            }

        }
    },
    {
        config: {
            cors: {
                origin: ['*'],
                additionalHeaders: ['cache-control', 'x-requested-with']
            },
        },
        method: 'GET',
        path: '/api/v1/user/login/auth',
        handler: () => {
            return ({
                status: 200,
                description: 'Auth route'
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
        path: '/api/v1/user/token/auth',
        handler: async (req, h) => {
            const email = req.payload.email;
            if (req.headers.authorization !== undefined) {
                console.log('##test', req.headers.authorization);

                if (jwt.verify(req.headers.authorization, process.env.JWT_SECRET)) {

                    try {
                        const user: any = await User.findOne({ where: { email } });

                        if (user) {
                            try {

                                if (speakeasy.totp.verify({
                                    secret: user.userSecret,
                                    encoding: 'base32',
                                    token: req.payload.code,
                                })) {
                                    console.log(true);
                                    return h.response({
                                        status: 200,
                                        description: 'Token is vailid.'
                                    });

                                } else {
                                    console.log(false);
                                    return ({
                                        status: 403,
                                        description: 'Token is invailid.'
                                    });
                                }

                            } catch (error) {
                                console.log(error);
                                return ({

                                });
                            }
                        } else {
                            return ({
                                status: 401,
                                description: 'Wrong email',
                            })
                        }
                    } catch (error) {
                        console.log(error);
                        return ({

                        });
                    }

                } else {
                    return ({
                        status: 401,
                        description: 'Token is invailid'
                    })
                }
            } else {
                return ({
                    status: 403,
                    description: 'Token not found'
                })
            }
        }
    }
]