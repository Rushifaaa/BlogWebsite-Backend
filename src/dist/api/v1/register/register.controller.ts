import * as argon2 from 'argon2';
import { writeFileSync } from 'fs';
import * as jwt from 'jsonwebtoken';
import { Op } from 'sequelize';
import { generateSecret } from 'speakeasy';
import { User } from '../../../server';


export default [
    {
        method: 'GET',
        path: '/api/v1/user/register',
        handler: () => {
            return ({
                status: 200,
                description: 'Register route'
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
        path: '/api/v1/user/register',
        handler: async (req, h) => {
            const payload: any = req.payload;

            console.log("register body", payload);

            const username = payload.username;
            const email = payload.email;
            const plainPassword = payload.password;

            let user: any = await User.findOne({
                where: {
                    [Op.or]: [
                        {
                            email: email
                        },
                        {
                            username: username
                        }
                    ]
                }
            });

            if (user) {
                if (user.username === username) {
                    return {
                        status: 409,
                        description: username + ' is not available!',
                        error: 'username'
                    };
                } else {
                    return {
                        status: 409,
                        description: email + ' is not available!',
                        error: 'email'
                    };
                }
            } else {
                console.log("ohnörgolarnb");

                try {
                    console.log("###Register Start");

                    const hash = await argon2.hash(plainPassword, { hashLength: 150 });
                    const userSecret = await generateSecret({ length: 200, name: 'Login/Register Website' });

                    user = await User.create({
                        username: username,
                        password: hash,
                        email: email,
                        userSecret: userSecret.base32,
                        qrCodeUrl: userSecret.otpauth_url,
                    })

                    console.log("###After User Create");

                    const JWTToken = jwt.sign({
                        _id: user.user_id
                    }, process.env.JWT_SECRET,
                        {
                            expiresIn: '30min'
                        });

                    return ({
                        status: 200,
                        description: 'Successfully created´ a new User.',
                        token: await JWTToken,
                    })

                } catch (err) {
                    console.log(err);

                }
                console.log("lul");
            }

        }
    }
]