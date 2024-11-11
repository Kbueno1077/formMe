import { onSchedule } from 'firebase-functions/v2/scheduler';
import * as admin from 'firebase-admin';

admin.initializeApp();

export const cleanupOldData = onSchedule('every day 00:00', async (event) => {
	const db = admin.firestore();
	const batchSize = 500;
	let deletedCount = 0;

	try {
		const cutoffDate = admin.firestore.Timestamp.fromDate(
			new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
		);

		let lastDoc = null;

		while (true) {
			let query = db
				.collection('forms')
				.where('createdAt', '<', cutoffDate)
				.orderBy('createdAt')
				.limit(batchSize);

			if (lastDoc) {
				query = query.startAfter(lastDoc);
			}

			const snapshot = await query.get();

			if (snapshot.empty) {
				break;
			}

			const batch = db.batch();
			snapshot.docs.forEach((doc) => {
				batch.delete(doc.ref);
				deletedCount++;
			});

			await batch.commit();
			lastDoc = snapshot.docs[snapshot.docs.length - 1];

			if (snapshot.size < batchSize) {
				break;
			}
		}

		console.log(`Successfully deleted ${deletedCount} old documents`);
	} catch (error) {
		console.error('Error cleaning up old data:', error);
	}
});
