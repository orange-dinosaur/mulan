/* TODO: define possible values for readingStatus field */

import { PUBLIC_DEFAULT_BOOK_COVER } from '$env/static/public';

export class UserBooks {
	userId: string;
	books: BookFull[];

	constructor(userId: string, obj?: { books: BookFull[] }) {
		this.userId = userId;
		this.books = [];

		if (obj != undefined) {
			if ('books' in obj) {
				this.books = (obj.books as BookFull[]).map((book) => new BookFull(book));
			}
		}
	}

	toJSON() {
		return {
			userId: this.userId,
			books: this.books.map((book) => book.toJSON())
		};
	}

	static fromJSON(json: { userId: string; books: BookFullJSON[] }) {
		return new UserBooks(json.userId, {
			books: json.books.map((book) => BookFull.fromJSON(book))
		});
	}
}

export class BookFull {
	id: string;
	bookId: string;
	userId: string;
	title: string;
	authors: string[];
	publisher: string;
	publishedDate: string;
	description: string;
	isbn10: string;
	isbn13: string;
	pageCount: number;
	categories: string[];
	language: string;
	cover: string;
	readingStatus: string;
	readingStartDate: Date;
	readingEndDate: Date;
	bookType: string;
	tags: string[];
	rating: number;
	notes: string;
	libraryId: string;

	constructor(obj?: object) {
		this.id = '';
		this.bookId = '';
		this.userId = '';
		this.title = '';
		this.authors = [];
		this.publisher = '';
		this.publishedDate = '';
		this.description = '';
		this.isbn10 = '';
		this.isbn13 = '';
		this.pageCount = 0;
		this.categories = [];
		this.language = '';
		this.cover = PUBLIC_DEFAULT_BOOK_COVER;
		this.readingStatus = '';
		this.readingStartDate = new Date(Date.UTC(0, 0, 0));
		this.readingEndDate = new Date(Date.UTC(0, 0, 0));
		this.bookType = '';
		this.tags = [];
		this.rating = 0;
		this.notes = '';
		this.libraryId = '';

		if (obj != undefined) {
			// check if properties are available in the object passed
			if ('id' in obj) {
				this.id = (obj.id as string).toString();
			}

			if ('bookId' in obj) {
				this.bookId = (obj.bookId as string).toString();
			}

			if ('userId' in obj) {
				this.userId = (obj.userId as string).toString();
			}

			if ('title' in obj) {
				this.title = (obj.title as string).toString();
			}

			if ('authors' in obj) {
				this.authors = (obj.authors as string[]).map((author) => author.toString());
			}

			if ('publisher' in obj) {
				this.publisher = (obj.publisher as string).toString();
			}

			if ('publishedDate' in obj) {
				this.publishedDate = (obj.publishedDate as string).toString();
			}

			if ('description' in obj) {
				this.description = (obj.description as string).toString();
			}

			// check if industryIdentifiers is available
			if ('industryIdentifiers' in obj) {
				const industryIdentifiers = obj.industryIdentifiers as object[];

				industryIdentifiers.forEach((industryIdentifier) => {
					if ('type' in industryIdentifier && 'identifier' in industryIdentifier) {
						if (industryIdentifier.type == 'ISBN_10') {
							this.isbn10 = industryIdentifier.identifier as string;
						} else if (industryIdentifier.type == 'ISBN_13') {
							this.isbn13 = industryIdentifier.identifier as string;
						}
					}
				});
			}

			if ('isbn10' in obj) {
				this.isbn10 = (obj.isbn10 as string).toString();
			}

			if ('isbn13' in obj) {
				this.isbn13 = (obj.isbn13 as string).toString();
			}

			if ('pageCount' in obj) {
				this.pageCount = obj.pageCount as number;
			}

			if ('categories' in obj) {
				this.categories = (obj.categories as string[]).map((category) => category.toString());
			}

			if ('language' in obj) {
				this.language = (obj.language as string).toString();
			}

			if ('cover' in obj) {
				this.cover = (obj.cover as string).toString();
			}

			if ('readingStatus' in obj) {
				this.readingStatus = (obj.readingStatus as string).toString();
			}

			if ('readingStartDate' in obj) {
				this.readingStartDate = new Date(obj.readingStartDate as string);
			}

			if ('readingEndDate' in obj) {
				this.readingEndDate = new Date(obj.readingEndDate as string);
			}

			if ('bookType' in obj) {
				this.bookType = (obj.bookType as string).toString();
			}

			if ('tags' in obj) {
				this.tags = (obj.tags as string[]).map((tag) => tag.toString());
			}

			if ('rating' in obj) {
				this.rating = obj.rating as number;
			}

			if ('notes' in obj) {
				this.notes = (obj.notes as string).toString();
			}

			if ('libraryId' in obj) {
				this.libraryId = (obj.libraryId as string).toString();
			}
		}
	}

	static fromBookSearch(bookSearch: BookSearch) {
		const bookFUll = new BookFull({
			bookId: bookSearch.id,
			title: bookSearch.title,
			authors: bookSearch.authors,
			publisher: bookSearch.publisher,
			publishedDate: bookSearch.publishedDate,
			description: bookSearch.description,
			pageCount: bookSearch.pageCount,
			categories: bookSearch.categories,
			language: bookSearch.language,
			cover: bookSearch.cover
		});
		bookFUll.isbn10 = bookSearch.isbn10;
		bookFUll.isbn13 = bookSearch.isbn13;

		return bookFUll;
	}

	toJSON() {
		return {
			id: this.id,
			bookId: this.bookId,
			userId: this.userId,
			title: this.title,
			authors: this.authors,
			publisher: this.publisher,
			publishedDate: this.publishedDate,
			description: this.description,
			isbn10: this.isbn10,
			isbn13: this.isbn13,
			pageCount: this.pageCount,
			categories: this.categories,
			language: this.language,
			cover: this.cover,
			readingStatus: this.readingStatus,
			readingStartDate: this.readingStartDate,
			readingEndDate: this.readingEndDate,
			bookType: this.bookType,
			tags: this.tags,
			rating: this.rating,
			notes: this.notes,
			libraryId: this.libraryId
		};
	}

	static fromJSON(json: BookFullJSON) {
		return new BookFull({
			id: json.id,
			bookId: json.bookId,
			userId: json.userId,
			title: json.title,
			authors: json.authors,
			publisher: json.publisher,
			publishedDate: json.publishedDate,
			description: json.description,
			isbn10: json.isbn10,
			isbn13: json.isbn13,
			pageCount: json.pageCount,
			categories: json.categories,
			language: json.language,
			cover: json.cover,
			readingStatus: json.readingStatus,
			readingStartDate: json.readingStartDate,
			readingEndDate: json.readingEndDate,
			bookType: json.bookType,
			tags: json.tags,
			rating: json.rating,
			notes: json.notes,
			libraryId: json.libraryId
		});
	}
}

export type BookFullJSON = {
	id: string;
	bookId: string;
	userId: string;
	title: string;
	authors: string[];
	publisher: string;
	publishedDate: string;
	description: string;
	isbn10: string;
	isbn13: string;
	pageCount: number;
	categories: string[];
	language: string;
	cover: string;
	readingStatus: string;
	readingStartDate: Date;
	readingEndDate: Date;
	bookType: string;
	tags: string[];
	rating: number;
	notes: string;
	libraryId: string;
};

export class BookSearch {
	id: string;
	title: string;
	authors: string[];
	publisher: string;
	publishedDate: string;
	description: string;
	isbn10: string;
	isbn13: string;
	pageCount: number;
	categories: string[];
	language: string;
	cover: string;

	constructor(obj?: {
		id?: string;
		volumeInfo?: {
			title?: string;
			authors?: string[];
			publisher?: string;
			publishedDate?: string;
			description?: string;
			industryIdentifiers?: object[];
			pageCount?: number;
			categories?: string[];
			language?: string;
			imageLinks?: object;
		};
	}) {
		this.id = '';
		this.title = '';
		this.authors = [];
		this.publisher = '';
		this.publishedDate = '';
		this.description = '';
		this.isbn10 = '';
		this.isbn13 = '';
		this.pageCount = 0;
		this.categories = [];
		this.language = '';
		this.cover = PUBLIC_DEFAULT_BOOK_COVER;

		if (obj != undefined) {
			// check if properties are available in the object passed
			if ('id' in obj) {
				this.id = (obj.id as string).toString();
			}

			if ('volumeInfo' in obj) {
				const volumeInfo = obj.volumeInfo as object;

				if ('title' in volumeInfo) {
					this.title = (volumeInfo.title as string).toString();
				}

				if ('authors' in volumeInfo) {
					this.authors = (volumeInfo.authors as string[]).map((author) => author.toString());
				}

				if ('publisher' in volumeInfo) {
					this.publisher = (volumeInfo.publisher as string).toString();
				}

				if ('publishedDate' in volumeInfo) {
					this.publishedDate = (volumeInfo.publishedDate as string).toString();
				}

				if ('description' in volumeInfo) {
					this.description = (volumeInfo.description as string).toString();
				}

				// check if industryIdentifiers is available
				if ('industryIdentifiers' in volumeInfo) {
					const industryIdentifiers = volumeInfo.industryIdentifiers as object[];

					industryIdentifiers.forEach((industryIdentifier) => {
						if ('type' in industryIdentifier && 'identifier' in industryIdentifier) {
							if (industryIdentifier.type == 'ISBN_10') {
								this.isbn10 = industryIdentifier.identifier as string;
							} else if (industryIdentifier.type == 'ISBN_13') {
								this.isbn13 = industryIdentifier.identifier as string;
							}
						}
					});
				}

				if ('pageCount' in volumeInfo) {
					this.pageCount = volumeInfo.pageCount as number;
				}

				if ('categories' in volumeInfo) {
					this.categories = (volumeInfo.categories as string[]).map((category) =>
						category.toString()
					);
				}

				if ('language' in volumeInfo) {
					this.language = (volumeInfo.language as string).toString();
				}

				if ('imageLinks' in volumeInfo) {
					const imageLinks = volumeInfo.imageLinks as object;

					if ('thumbnail' in imageLinks) {
						this.cover = (imageLinks.thumbnail as string).toString();
					} else if ('smallThumbnail' in imageLinks) {
						this.cover = (imageLinks.smallThumbnail as string).toString();
					}
				}
			}
		}
	}

	toJSON() {
		return {
			id: this.id,
			title: this.title,
			authors: this.authors,
			publisher: this.publisher,
			publishedDate: this.publishedDate,
			description: this.description,
			isbn10: this.isbn10,
			isbn13: this.isbn13,
			pageCount: this.pageCount,
			categories: this.categories,
			language: this.language,
			cover: this.cover
		};
	}

	static fromJSON(json: BookSearchJSON) {
		return new BookSearch({
			id: json.id,
			volumeInfo: {
				title: json.title,
				authors: json.authors,
				publisher: json.publisher,
				publishedDate: json.publishedDate,
				description: json.description,
				industryIdentifiers: [
					{ type: 'ISBN_10', identifier: json.isbn10 },
					{ type: 'ISBN_13', identifier: json.isbn13 }
				],
				pageCount: json.pageCount,
				categories: json.categories,
				language: json.language,
				imageLinks: { thumbnail: json.cover }
			}
		});
	}
}

export type BookSearchJSON = {
	id: string;
	title: string;
	authors: string[];
	publisher: string;
	publishedDate: string;
	description: string;
	isbn10: string;
	isbn13: string;
	pageCount: number;
	categories: string[];
	language: string;
	cover: string;
};

export class BookToSave {
	bookId: string;
	userId: string;
	readingStatus: string;
	/* readingStartDate: Date;
	readingEndDate: Date; */
	bookType: string;
	tags: string[];
	rating: number;
	notes: string;
	libraryId: string;

	constructor(obj?: {
		bookId: string;
		userId?: string;
		readingStatus?: string;
		readingStartDate?: string;
		readingEndDate?: string;
		bookType?: string;
		tags?: string[];
		rating?: number;
		notes?: string;
		libraryId?: string;
	}) {
		this.bookId = '';
		this.userId = '';
		this.readingStatus = '';
		/* this.readingStartDate = new Date(Date.UTC(0, 0, 0));
		this.readingEndDate = new Date(Date.UTC(0, 0, 0)); */
		this.bookType = '';
		this.tags = [];
		this.rating = 0;
		this.notes = '';
		this.libraryId = '';

		if (obj != undefined) {
			if ('bookId' in obj) {
				this.bookId = (obj.bookId as string).toString();
			}

			if ('userId' in obj) {
				this.userId = (obj.userId as string).toString();
			}

			if ('readingStatus' in obj) {
				this.readingStatus = (obj.readingStatus as string).toString();
			}

			/* if ('readingStartDate' in obj) {
				this.readingStartDate = new Date(obj.readingStartDate as string);
			}

			if ('readingEndDate' in obj) {
				this.readingEndDate = new Date(obj.readingEndDate as string);
			} */

			if ('bookType' in obj) {
				this.bookType = (obj.bookType as string).toString();
			}

			if ('tags' in obj) {
				this.tags = (obj.tags as string[]).map((tag) => tag.toString());
			}

			if ('rating' in obj) {
				this.rating = obj.rating as number;
			}

			if ('notes' in obj) {
				this.notes = (obj.notes as string).toString();
			}

			if ('libraryId' in obj) {
				this.libraryId = (obj.libraryId as string).toString();
			}
		}
	}

	toJSON() {
		return {
			bookId: this.bookId,
			userId: this.userId,
			readingStatus: this.readingStatus,
			/* readingStartDate: this.readingStartDate,
			readingEndDate: this.readingEndDate, */
			bookType: this.bookType,
			tags: this.tags,
			rating: this.rating,
			notes: this.notes,
			libraryId: this.libraryId
		};
	}
}

export class BookToUpdate {
	readingStatus?: string;
	readingStartDate?: Date;
	readingEndDate?: Date;
	bookType?: string;
	tags?: string[];
	rating?: number;
	notes?: string;
	libraryId?: string;

	constructor(obj?: {
		readingStatus: string | undefined;
		readingStartDate: string | undefined;
		readingEndDate: string | undefined;
		bookType: string | undefined;
		tags: string[] | undefined;
		rating: number | undefined;
		notes: string | undefined;
		libraryId: string | undefined;
	}) {
		if (obj != undefined) {
			if ('readingStatus' in obj && obj.readingStatus != undefined) {
				this.readingStatus = (obj.readingStatus as string).toString();
			}

			if ('readingStartDate' in obj && obj.readingStartDate != undefined) {
				this.readingStartDate = new Date(obj.readingStartDate as string);
			}

			if ('readingEndDate' in obj && obj.readingEndDate != undefined) {
				this.readingEndDate = new Date(obj.readingEndDate as string);
			}

			if ('bookType' in obj && obj.bookType != undefined) {
				this.bookType = (obj.bookType as string).toString();
			}

			if ('tags' in obj && obj.tags != undefined) {
				this.tags = (obj.tags as string[]).map((tag) => tag.toString());
			}

			if ('rating' in obj && obj.rating != undefined) {
				this.rating = obj.rating as number;
			}

			if ('notes' in obj && obj.notes != undefined) {
				this.notes = (obj.notes as string).toString();
			}

			if ('libraryId' in obj && obj.libraryId != undefined) {
				this.libraryId = (obj.libraryId as string).toString();
			}
		}
	}

	toJSON() {
		const result: { [key: string]: unknown } = {};

		for (const key in this) {
			if (Object.prototype.hasOwnProperty.call(this, key) && this[key] != null) {
				// Exclude undefined or null
				result[key] = this[key];
			}
		}

		return result;
	}
}
