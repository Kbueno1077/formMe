import nodemailer from 'nodemailer';

import { PRIVATE_EMAIL, PRIVATE_EMAIL_PASSWORD } from '$env/static/private';

export async function POST({ request }: { request: Request }) {
	const { to, formUrl } = await request.json();

	// Create a transporter object using SMTP transport
	const transporter = nodemailer.createTransport({
		host: 'smtp.gmail.com', // Replace with your SMTP server
		port: 587,
		secure: false,
		auth: {
			user: PRIVATE_EMAIL, // Replace with your email
			pass: PRIVATE_EMAIL_PASSWORD // Replace with your email password
		}
	});

	// Set up email data
	const mailOptions = {
		from: '"Form Me" <formmebuddy@gmail.com>', // Replace with your name and email
		to: to,
		subject: 'FormMe form has been submitted',
		text: `Hello! One of your forms has been submitted. you can view it at ${formUrl}`
	};

	try {
		// Send mail
		const info = await transporter.sendMail(mailOptions);
		return new Response(JSON.stringify({ message: 'Email sent', info }), {
			status: 200,
			headers: {
				'Content-Type': 'application/json'
			}
		});
	} catch (error) {
		return new Response(
			JSON.stringify({ error: 'Failed to send email', details: (error as Error).message }),
			{
				status: 500,
				headers: {
					'Content-Type': 'application/json'
				}
			}
		);
	}
}
